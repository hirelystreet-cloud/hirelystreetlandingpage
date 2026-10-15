# HirelyStreet

HirelyStreet's marketing landing page, built with React, TypeScript, and Vite. The Express API in `server/` handles waitlist registrations and investor inquiries.

## Getting started

Install dependencies:

```bash
npm install
```

Run the frontend and API in separate terminals:

```bash
npm run dev
```

```bash
npm run server
```

Build the frontend for production:

```bash
npm run build
```

## Server configuration

The server can store submissions locally in `data/`. These JSON files are excluded from Git because they may contain personal information.

For cloud persistence and investor inquiry email, configure the variables documented in `.env.example` in the server's environment.
