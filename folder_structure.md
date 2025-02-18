## Project Folder Structure - NBA Player Data Web App

This folder structure is designed for the NBA Player Data Web App project, aligning with the tech stack and modular features described in the provided markdown files.

```
nba-player-data-app/
├── backend/             # Express.js Backend
│   ├── pages/
│   │    └── api/             # API Routes (similar to Next.js API routes, but for Express)
│   │        ├── auth/       # Authentication related routes
│   │        │    ├── signup.js      # User signup (if needed, Supabase handles much of this)
│   │        │    ├── login.js       # User login (if needed, Supabase handles much of this)
│   │        │    └── ...
│   │        ├── players/    # Player related routes
│   │        │    ├── search.js     # Player search endpoint
│   │        │    ├── [playerId].js  # Dynamic route for individual player data
│   │        │    └── compare.js   # Player comparison endpoint
│   │        ├── games/      # Games (scores, schedules) endpoints
│   │        │    ├── live.js        # Live game scores
│   │        │    └── schedule.js   # Game schedules
│   │        ├── users/      # User related endpoints (favorites, etc.)
│   │        │    └── favorites/
│   │        │         ├── players.js # Favorite players management
│   │        │         └── teams.js   # Favorite teams management (optional)
│   │        ├── settings.js      # User settings endpoints (GET, PUT/PATCH)
│   │        ├── teams.js         # API endpoint for teams
│   │        ├── stripe-webhook.js  # Stripe webhook handler
│   │        └── create-checkout-session.js  #Stripe checkout session
│   │        └── stripe-customer-portal-url.js # Stripe Customer Portal
│   │        └── dashboard/  # Dashboard Data
│   │             ├── favorites.js    # Favorite players data
│   │             ├── trending.js    # Trending players data
│   │             └── recent-searches.js  # Recent searches data (if applicable)
│   ├── utils/          # Utility functions for the backend
│   │    ├── supabase-admin.js  # Supabase Admin SDK initialization (if needed)
│   │    ├── nba-api.js       # Functions to interact with the NBA API
│   │    ├── cache.js          # In-memory caching implementation
│   │    └── middleware.js      # Custom Express middleware (e.g., authentication check)
│   ├── .env.local        # Backend environment variables
│   ├── package.json
│   ├── server.js        # Express server entry point
│   └── ...
│
├── frontend/            # Next.js Frontend
│   ├── components/      # Reusable React components
│   │    ├── auth/       # Authentication related components
│   │    │     ├── LoginForm.js
│   │    │     ├── SignupForm.js
│   │    │     └── ...
│   │    ├── dashboard/  # Dashboard specific components
│   │    │     ├── FavoritePlayersSection.js
│   │    │     ├── TrendingPlayersSection.js
│   │    │     └── ...
│   │    ├── games/       # Game components (score card, schedule, etc.)
│   │    │     ├── GameScoreCard.js
│   │    │     └── ...
│   │    ├── players/      # Player related components
│   │    │     ├── PlayerCard.js     # Display player info in search results/lists
│   │    │     ├── PlayerSearch.js   # Search bar component
│   │    │     ├── BarChartComponent.js # Chart component
│   │    │     └── ...
│   │    ├── ui/       # Generic UI components (wrappers around Shadcn components)
│   │    │     ├── Button.js
│   │    │     ├── Input.js
│   │    │     └── ...
│   │    └── ...         # Other shared components
│   ├── pages/           # Next.js pages (routes)
│   │    ├── api/           # Next.js API Routes (should be minimal, mainly proxying to backend)
│   │    │    ├── players/    # Player related routes
│   │    │    │   ├── search.js
│   │    │    │   ├── [playerId].js
│   │    │    │   └── compare.js
│   │    │    ├── games/
│   │    │    │   ├── live.js
│   │    │    │   └── schedule.js
│   │    │    ├── users/
│   │    │    │   └── favorites/
│   │    │    │       └── players.js
│   │    │    │       └── teams.js
│   │    │    ├── settings.js
│   │    │    ├── stripe-webhook.js
│   │    │    └── create-checkout-session.js
│   │    ├── auth/         # Authentication related pages
│   │    │    ├── login.js
│   │    │    ├── signup.js
│   │    │    └── ...
│   │    ├── compare/      # Player comparison page
│   │    │    └── index.js
│   │    ├── dashboard.js   # User dashboard page
│   │    ├── games.js      # Game scores and schedules page
│   │    ├── players/      # Player search and detail pages
│   │    │    ├── [playerId].js  # Dynamic route for player detail page
│   │    │    └── index.js       # Player search page
│   │    ├── settings.js   # User settings page
│   │    ├── subscription-success.js  # Stripe success redirect page
│   │    ├── subscription-cancel.js   # Stripe cancel redirect page
│   │    ├── _app.js        # Custom App component (for global styles, Supabase client)
│   │    └── index.js       # Homepage
│   ├── public/          # Static assets (images, etc.)
│   ├── styles/          # Global CSS styles
│   ├── utils/           # Utility functions for the frontend
│   │    └── supabase-client.js  # Supabase client initialization
│   ├── .env.local        # Frontend environment variables
│   ├── package.json
│   └── ...
│
├── .gitignore
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