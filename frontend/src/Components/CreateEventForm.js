import React, { useState } from "react";

function CreateEventForm({ onCreate }) {
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [skillLevel, setSkillLevel] = useState("1");
  const [ageGroup, setAgeGroup] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { sport, location, date, time, skillLevel, ageGroup };
    onCreate(newEvent);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Event</h2>

      <input
        type="text"
        placeholder="Sport (e.g. Football)"
        value={sport}
        onChange={(e) => setSport(e.target.value)}
        required
      />
      <br />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <br />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <br />

      <select
        value={skillLevel}
        onChange={(e) => setSkillLevel(e.target.value)}
      >
        <option value="1">1 - Casual</option>
        <option value="2">2 - Intermediate</option>
        <option value="3">3 - Competitive</option>
      </select>
      <br />

      <input
        type="text"
        placeholder="Age Group (e.g. 20-30)"
        value={ageGroup}
        onChange={(e) => setAgeGroup(e.target.value)}
        required
      />
      <br />

      <button type="submit">Submit Event</button>
    </form>
  );
}

export default CreateEventForm;
