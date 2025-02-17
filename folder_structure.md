## Project Folder Structure - NBA Player Data Web App

This folder structure is designed for the NBA Player Data Web App project, aligning with the tech stack and modular features described in the provided markdown files.

```
nba-player-data-app/
├── frontend/
│   ├── public/                      # Static assets (images, fonts, etc.)
│   ├── src/
│   │   ├── app/                     # Next.js App Router (pages directory in Pages Router if using that)
│   │   │   ├── api/                 # Frontend API routes (if any, for server-side logic in Next.js)
│   │   │   ├── auth/                # Authentication related pages (login, signup, etc.)
│   │   │   ├── dashboard/           # User Dashboard page
│   │   │   ├── games/               # Game Scores & Schedules page
│   │   │   ├── players/             # Player Search and Player Detail pages
│   │   │   │   ├── [playerId]/      # Dynamic route for Player Detail page
│   │   │   ├── compare/             # Player Comparison page
│   │   │   ├── settings/            # User Settings page
│   │   │   ├── subscription-success/ # Subscription success page
│   │   │   ├── subscription-cancel/  # Subscription cancel page
│   │   │   ├── layout.tsx           # Root layout for the app
│   │   │   ├── page.tsx             # Homepage
│   │   │   └── ...                  # Other pages
│   │   ├── components/            # React components (Shadcn UI and custom)
│   │   │   ├── ui/                  # Shadcn UI components (organized as needed)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── ...              # Other Shadcn UI components
│   │   │   ├── common/              # Reusable components across modules
│   │   │   │   ├── PlayerCard.tsx
│   │   │   │   ├── ...
│   │   │   ├── auth/                # Authentication form components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── ...
│   │   │   ├── dashboard/           # Dashboard specific components
│   │   │   │   ├── FavoritePlayersSection.tsx
│   │   │   │   ├── TrendingPlayersSection.tsx
│   │   │   │   └── ...
│   │   │   ├── games/               # Game Scores & Schedules components
│   │   │   │   ├── GameScoreCard.tsx
│   │   │   │   └── ...
│   │   │   ├── players/             # Player related components
│   │   │   │   ├── PlayerSearchbar.tsx
│   │   │   │   ├── PlayerDataTable.tsx
│   │   │   │   └── ...
│   │   │   ├── compare/             # Player Comparison components
│   │   │   │   ├── PlayerComparisonTable.tsx
│   │   │   │   ├── BarChartComponent.tsx      # Example Data Visualization Component
│   │   │   │   └── ...
│   │   │   └── settings/            # User Settings components
│   │   │       ├── ProfileSettingsForm.tsx
│   │   │       ├── PreferencesSettingsForm.tsx
│   │   │       └── ...
│   │   ├── contexts/              # React Contexts (if using Context API for state management)
│   │   │   ├── AuthContext.tsx
│   │   │   └── ...
│   │   ├── styles/               # Global styles and component styles
│   │   │   ├── globals.css
│   │   │   └── ...
│   │   ├── utils/                # Utility functions (API calls, helpers, etc.)
│   │   │   ├── api.ts             # Functions for making API calls to backend
│   │   │   ├── helpers.ts         # General utility functions
│   │   │   └── supabaseClient.ts  # Supabase client initialization
│   │   ├── types/                 # TypeScript types and interfaces
│   │   │   ├── player.ts
│   │   │   ├── game.ts
│   │   │   ├── subscription.ts
│   │   │   └── ...
│   │   ├── _app.tsx               # Next.js custom App component
│   │   └── index.tsx              # (If using Pages Router, for homepage in 'pages' dir)
│   ├── .env.local                 # Frontend environment variables
│   ├── next.config.js             # Next.js configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── backend/
│   ├── pages/                     # Backend API routes (Express.js) - using Next.js API routes structure for backend
│   │   ├── api/
│   │   │   ├── auth/              # Authentication related backend routes (if needed)
│   │   │   ├── dashboard/         # Dashboard data API endpoints
│   │   │   │   ├── favorites.js
│   │   │   │   ├── trending.js
│   │   │   │   ├── recent-searches.js
│   │   │   │   └── ...
│   │   │   ├── games/             # Game Scores & Schedules API endpoints
│   │   │   │   ├── live.js
│   │   │   │   ├── schedule.js
│   │   │   │   └── ...
│   │   │   ├── players/           # Player related API endpoints
│   │   │   │   ├── search.js
│   │   │   │   ├── [playerId].js
│   │   │   │   ├── compare.js
│   │   │   │   └── ...
│   │   │   ├── settings.js        # User Settings API endpoints
│   │   │   ├── stripe/            # Stripe related API endpoints
│   │   │   │   ├── create-checkout-session.js
│   │   │   │   ├── stripe-webhook.js
│   │   │   │   ├── customer-portal-url.js # Stripe Customer Portal URL endpoint
│   │   │   │   └── ...
│   │   │   ├── teams.js           # Teams data API endpoint (for preferred team dropdown)
│   │   │   └── ...
│   │   └── index.js               # (Optional: Backend index route if needed)
│   ├── controllers/             # Backend controllers (logic for routes)
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── gamesController.js
│   │   ├── playersController.js
│   │   ├── settingsController.js
│   │   ├── stripeController.js
│   │   └── ...
│   ├── middleware/              # Express.js middleware (authentication, etc.)
│   │   ├── authMiddleware.js
│   │   └── ...
│   ├── utils/                   # Backend utility functions (caching, API calls, DB helpers)
│   │   ├── cache.js             # In-memory caching implementation
│   │   ├── nbaApi.js            # Functions for interacting with NBA API
│   │   ├── supabaseAdmin.js     # Supabase Admin SDK initialization
│   │   └── ...
│   ├── config/                  # Configuration files (if needed)
│   │   └── ...
│   ├── .env.local                 # Backend environment variables
│   ├── package.json
│   └── server.js                # Main Express.js server file (or index.js)
├── .gitignore                   # Git ignore file
├── README.md
└── brainstorm.md               # Brainstorming document
└── general_instructions.md      # General instructions document
└── setup_instructions.md        # Setup instructions document
└── module_instructions/         # Folder for module specific instructions
    ├── advanced_search_filters.md
    ├── authentication.md
    ├── data_visualization.md
    ├── favorite_players_teams.md
    ├── game_scores_schedules.md
    ├── payment.md
    ├── player_comparison.md
    ├── player_search.md
    ├── user_dashboard.md
    └── user_settings.md
```

**Explanation of Key Folders and Files:**

*   **`frontend/`**: Contains the Next.js frontend application.
    *   **`public/`**: Static assets like images, fonts, etc.
    *   **`src/app/`**:  Next.js App Router structure for pages and layouts (or `src/pages/` if using Pages Router). Organized by feature/module.
    *   **`src/components/`**: React components, further organized into `ui` (Shadcn UI), `common`, and feature-specific subfolders.
    *   **`src/contexts/`**: React Contexts for state management (if using Context API).
    *   **`src/styles/`**: Global and component-specific CSS styles.
    *   **`src/utils/`**: Utility functions, including API call helpers and Supabase client initialization.
    *   **`src/types/`**: TypeScript type definitions for data models.
    *   `.env.local`: Environment variables for the frontend.
    *   `next.config.js`, `package.json`, `tsconfig.json`: Next.js configuration and project files.
*   **`backend/`**: Contains the Node.js/Express.js backend application.
    *   **`pages/api/`**: (Using Next.js API Routes structure for backend) API route handlers for Express.js. Organized by feature/module.
    *   **`controllers/`**:  Logic for handling API requests, separated from route definitions.
    *   **`middleware/`**: Express.js middleware functions (e.g., authentication).
    *   **`utils/`**: Utility functions for the backend, including caching, NBA API interaction, and Supabase Admin SDK initialization.
    *   **`config/`**: Configuration files if needed.
    *   `.env.local`: Environment variables for the backend.
    *   `package.json`, `server.js` (or `index.js`): Backend project files.
*   **`module_instructions/`**:  Folder to keep your module-specific markdown instructions organized.
*   **`.gitignore`**: Specifies intentionally untracked files that Git should ignore.
*   **`README.md`**: Project README file with project description, setup instructions, etc.
*   **`brainstorm.md`, `general_instructions.md`, `setup_instructions.md`**: Your provided markdown documents for project planning and instructions.

**Key Considerations:**

*   **Modularity:** The structure is organized by feature modules (auth, dashboard, players, games, etc.), making it easier to manage and scale the application as you develop each module.
*   **Tech Stack Alignment:**  The structure clearly separates frontend (Next.js) and backend (Express.js) components.
*   **Shadcn UI Components:** The `frontend/src/components/ui/` folder is designated for Shadcn UI components to maintain organization.
*   **API Routes:** Both frontend and backend API routes are clearly separated and structured.
*   **Utility and Helper Functions:**  `utils/` folders in both frontend and backend promote code reusability and organization for utility functions.
*   **Typescript:**  `types/` folder in frontend suggests using TypeScript for better type management.

This folder structure provides a solid foundation for your NBA Player Data Web App project. You can adapt and further refine it as your project evolves. Remember to install dependencies in both `frontend` and `backend` directories and set up your environment variables as described in `setup_instructions.md`.