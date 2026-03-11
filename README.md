# Event Ticketing Platform - Frontend

A modern event ticketing platform built with React 19 and TypeScript, enabling event organizers to create and manage events while providing attendees with a seamless ticket purchasing experience.

## Features

### Public Features

- **Browse Events**: View published events with search and pagination
- **Event Details**: Detailed event pages with venue information, dates, and available ticket types
- **Ticket Purchase**: Secure ticket purchasing with OIDC authentication
- **Responsive Design**: Mobile-friendly dark theme UI

### Organizer Dashboard

- **Event Management**: Create, edit, and publish events with detailed configurations
- **Ticket Type Management**: Define multiple ticket types with pricing and availability
- **Ticket Validation**: QR code scanner for validating tickets at events
- **Sales Control**: Configure sales start/end dates and times
- **Status Management**: Draft and publish workflow for events

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with SWC for fast refresh
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Authentication**: OIDC/OAuth2 (Keycloak)
- **State Management**: React Context (Auth) + Component State
- **Date Handling**: date-fns
- **QR Code**: @yudiel/react-qr-scanner
- **HTTP Client**: Fetch API

## Prerequisites

- Node.js 18+
- npm or yarn
- Spring Boot backend running on `http://localhost:8080`
- Keycloak server running on `http://localhost:9090`

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
# Start development server (with Infisical for env vars)
infisical run -- npm run dev

# Or start without Infisical
npm run dev
```

The application will be available at `http://localhost:5173`

### Mock API (Optional)

For frontend development without the backend:

```bash
npm run mocks
```

This starts json-server on port 3000. Update `vite.config.ts` to proxy to port 3000 instead of 8080.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Backend API

The frontend proxies API requests to the Spring Boot backend. Configuration is in [vite.config.ts](vite.config.ts):

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

### Authentication

OIDC configuration in [src/main.tsx](src/main.tsx):

```typescript
const oidcConfig = {
  authority: 'http://localhost:9090/realms/event-ticket-platform',
  client_id: 'event-ticket-platform-app',
  redirect_uri: 'http://localhost:5173/callback',
  // ...
};
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components
│   ├── ui/         # shadcn/ui components
│   ├── nav-bar.tsx
│   ├── protected-route.tsx
│   ├── error-boundary.tsx
│   └── ...
├── domain/          # TypeScript interfaces and types
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and API client
│   ├── api.ts      # API requests
│   └── utils.ts    # Helper utilities
├── pages/           # Route components
│   ├── attendee-landing-page.tsx
│   ├── organizers-landing-page.tsx
│   ├── published-events-page.tsx
│   ├── purchase-ticket-page.tsx
│   ├── dashboard-*.tsx  # Dashboard pages
│   └── ...
└── main.tsx         # Application entry point
```

## Key Pages

- `/` - Attendee landing page
- `/organizers` - Organizer landing page
- `/events/:id` - Event details and ticket types
- `/events/:eventId/purchase/:ticketTypeId` - Purchase ticket (protected)
- `/dashboard` - Organizer dashboard (protected)
- `/dashboard/events` - List all events (protected)
- `/dashboard/events/create` - Create new event (protected)
- `/dashboard/events/update/:id` - Edit event (protected)
- `/dashboard/tickets` - View all tickets (protected)
- `/dashboard/validate-qr` - QR code validation (protected)

## API Integration

The frontend communicates with the Spring Boot backend via REST API:

- `GET /api/v1/published-events` - List published events
- `GET /api/v1/events` - List all events (organizer)
- `POST /api/v1/events` - Create event
- `PUT /api/v1/events/:id` - Update event
- `GET /api/v1/tickets` - List tickets
- And more...

All protected endpoints require an OAuth2 access token in the `Authorization` header.

## Styling

This project uses Tailwind CSS 4 with a custom dark theme. UI components are from shadcn/ui and customized in the `components/ui/` directory.

## Code Quality

```bash
# Linting
npm run lint

# Code formatting
npm run format
```

## License

See [LICENSE](LICENSE) file for details.
