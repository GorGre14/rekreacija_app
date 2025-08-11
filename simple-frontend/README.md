# Recreation Finder - Simple Frontend
*Deployed version*

A clean, simple Next.js TypeScript frontend for the Recreation Finder app.

## Features

- 🏀 **Event Listing** - Browse all recreational events
- 👤 **User Authentication** - Register and login
- ➕ **Create Events** - Post new recreational activities  
- 🤝 **Join/Leave Events** - Participate in activities
- 📱 **Responsive Design** - Works on mobile and desktop

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_BASE=https://your-backend-url.com
```

## Project Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page (event listing)
├── globals.css        # Global styles
├── login/page.tsx     # Login page
├── register/page.tsx  # Registration page
└── create/page.tsx    # Create event page

lib/
└── api.ts            # API client and types
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy

### Netlify
1. Build: `npm run build`
2. Publish: `out/` directory
3. Set environment variables

## API Integration

The app connects to your backend API with these endpoints:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /events` - Get all events
- `POST /events` - Create new event
- `POST /events/:id/join` - Join event
- `POST /events/:id/leave` - Leave event

## Features

### Authentication
- JWT token storage in localStorage
- Automatic login state persistence
- Protected routes

### Event Management
- Real-time event listing
- Join/leave functionality
- Event creation with validation

### UI/UX
- Modern glassmorphism design
- Mobile-responsive layout
- Loading states and error handling