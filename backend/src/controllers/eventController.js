import { pool } from "../db/client.js";

function toFrontend(row, attendees) {
  const iso = new Date(row.dateTime).toISOString();
  return {
    id: row.id,
    sport: row.sport,
    location: row.location,
    date: iso.slice(0, 10),
    time: iso.slice(11, 16),
    skillLevel: row.skillLevel,
    ageGroup: row.ageGroup,
    createdBy: row.createdByEmail,
    attendees: attendees?.map((a) => a.email) || [],
  };
}

export async function listEvents(_req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT e.*, u.email AS "createdByEmail"
      FROM events e
      JOIN users u ON u.id = e."createdById"
      ORDER BY e."createdAt" DESC
    `);

    const ids = rows.map((r) => r.id);
    let map = new Map();
    if (ids.length) {
      const { rows: att } = await pool.query(
        `SELECT ea."eventId", u.email
         FROM event_attendees ea
         JOIN users u ON u.id = ea."userId"
         WHERE ea."eventId" = ANY($1)`,
        [ids]
      );
      map = att.reduce((m, r) => {
        if (!m.has(r.eventId)) m.set(r.eventId, []);
        m.get(r.eventId).push({ email: r.email });
        return m;
      }, new Map());
    }
    res.json(rows.map((r) => toFrontend(r, map.get(r.id))));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to list events" });
  }
}

export async function getEvent(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Bad id" });
  try {
    const { rows } = await pool.query(
      `
      SELECT e.*, u.email AS "createdByEmail"
      FROM events e
      JOIN users u ON u.id = e."createdById"
      WHERE e.id=$1
    `,
      [id]
    );
    const row = rows[0];
    if (!row) return res.status(404).json({ error: "Not found" });

    const { rows: att } = await pool.query(
      `
      SELECT u.email
      FROM event_attendees ea
      JOIN users u ON u.id = ea."userId"
      WHERE ea."eventId"=$1
    `,
      [id]
    );

    res.json(toFrontend(row, att));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get event" });
  }
}

export async function createEvent(req, res) {
  const { sport, location, date, time, skillLevel, ageGroup } = req.body || {};
  if (!sport || !location || !date || !time || !skillLevel || !ageGroup) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const dateTime = new Date(`${date}T${time}:00`);
    const { rows } = await pool.query(
      `INSERT INTO events (sport, location, "dateTime", "skillLevel", "ageGroup", "createdById")
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [sport, location, dateTime, Number(skillLevel), ageGroup, req.user.id]
    );
    const eventId = rows[0].id;

    const { rows: ev } = await pool.query(
      `
      SELECT e.*, u.email AS "createdByEmail"
      FROM events e
      JOIN users u ON u.id = e."createdById"
      WHERE e.id=$1
    `,
      [eventId]
    );

    res.status(201).json(toFrontend(ev[0], []));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create" });
  }
}

export async function updateEvent(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Bad id" });

  try {
    const { rows: existingRows } = await pool.query(
      "SELECT * FROM events WHERE id=$1",
      [id]
    );
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (existing.createdById !== req.user.id)
      return res.status(403).json({ error: "Not owner" });

    const fields = [];
    const params = [];
    const { sport, location, date, time, skillLevel, ageGroup } =
      req.body || {};
    if (sport) {
      fields.push(`sport=$${fields.length + 1}`);
      params.push(sport);
    }
    if (location) {
      fields.push(`location=$${fields.length + 1}`);
      params.push(location);
    }
    if (skillLevel) {
      fields.push(`"skillLevel"=$${fields.length + 1}`);
      params.push(Number(skillLevel));
    }
    if (ageGroup) {
      fields.push(`"ageGroup"=$${fields.length + 1}`);
      params.push(ageGroup);
    }
    if (date && time) {
      fields.push(`"dateTime"=$${fields.length + 1}`);
      params.push(new Date(`${date}T${time}:00`));
    }

    if (fields.length) {
      params.push(id);
      await pool.query(
        `UPDATE events SET ${fields.join(", ")} WHERE id=$${params.length}`,
        params
      );
    }

    const { rows: ev } = await pool.query(
      `
      SELECT e.*, u.email AS "createdByEmail"
      FROM events e
      JOIN users u ON u.id = e."createdById"
      WHERE e.id=$1
    `,
      [id]
    );
    const { rows: att } = await pool.query(
      `
      SELECT u.email
      FROM event_attendees ea
      JOIN users u ON u.id = ea."userId"
      WHERE ea."eventId"=$1
    `,
      [id]
    );

    res.json(toFrontend(ev[0], att));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update" });
  }
}

export async function deleteEvent(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Bad id" });
  try {
    const { rows: existingRows } = await pool.query(
      "SELECT * FROM events WHERE id=$1",
      [id]
    );
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (existing.createdById !== req.user.id)
      return res.status(403).json({ error: "Not owner" });

    await pool.query('DELETE FROM event_attendees WHERE "eventId"=$1', [id]);
    await pool.query('DELETE FROM ratings WHERE "eventId"=$1', [id]);
    await pool.query("DELETE FROM events WHERE id=$1", [id]);

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete" });
  }
}

export async function joinEvent(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Bad id" });
  try {
    await pool.query(
      `INSERT INTO event_attendees ("eventId","userId")
       VALUES ($1,$2)
       ON CONFLICT ("eventId","userId") DO NOTHING`,
      [id, req.user.id]
    );

    const { rows: ev } = await pool.query(
      `
      SELECT e.*, u.email AS "createdByEmail"
      FROM events e JOIN users u ON u.id = e."createdById"
      WHERE e.id=$1
    `,
      [id]
    );
    const { rows: att } = await pool.query(
      `
      SELECT u.email
      FROM event_attendees ea
      JOIN users u ON u.id = ea."userId"
      WHERE ea."eventId"=$1
    `,
      [id]
    );

    res.json(toFrontend(ev[0], att));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to join" });
  }
}

export async function leaveEvent(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Bad id" });
  try {
    await pool.query(
      'DELETE FROM event_attendees WHERE "eventId"=$1 AND "userId"=$2',
      [id, req.user.id]
    );

    const { rows: ev } = await pool.query(
      `
      SELECT e.*, u.email AS "createdByEmail"
      FROM events e JOIN users u ON u.id = e."createdById"
      WHERE e.id=$1
    `,
      [id]
    );
    if (!ev.length) return res.status(404).json({ error: "Not found" });

    const { rows: att } = await pool.query(
      `
      SELECT u.email
      FROM event_attendees ea
      JOIN users u ON u.id = ea."userId"
      WHERE ea."eventId"=$1
    `,
      [id]
    );

    res.json(toFrontend(ev[0], att));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to leave" });
  }
}
