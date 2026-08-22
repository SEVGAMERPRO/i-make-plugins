# I Make Plugins

A modern game plugin marketplace where creators can upload, sell, and manage plugins for Minecraft, Roblox, Hytale, and more.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL
- **Deployment**: Render

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Render's managed database)

### Setup

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd server && npm install

# Start development
# Terminal 1: Frontend
cd client && npm run dev

# Terminal 2: Backend
cd server && npm run dev
```

## Deployment

Auto-deploys to Render on push to `main` branch.
