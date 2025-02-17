# NBA Player Data Web App

A web application for viewing and analyzing NBA player statistics, with features including player search, comparisons, and premium subscriptions.

## Tech Stack

- **Frontend:** Next.js, Shadcn UI, axios
- **Backend:** Node.js, Express.js, In-memory Caching
- **Database:** Supabase (PostgreSQL, Auth, Storage)
- **Payment:** Stripe
- **NBA Data API:** NBA Official API (stats.nba.com)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` in both frontend and backend directories
   - Fill in the required environment variables

4. Start the development servers:
   ```bash
   # Start backend server (http://localhost:3001)
   cd backend
   npm run dev

   # Start frontend development server (http://localhost:3000)
   cd frontend
   npm run dev
   ```

## Features

- User authentication
- Player search and statistics
- Player comparisons
- Game scores and schedules
- Premium subscription features
- Favorite players/teams tracking
- Advanced search filters
- Data visualization

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.