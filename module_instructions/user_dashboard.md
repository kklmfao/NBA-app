## Module Instructions: C. User Dashboard

**Module:** User Dashboard (Feature C from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`
*   **Backend:** Node.js, Express.js
*   **Database:** Supabase (PostgreSQL)
*   **NBA Data API:** NBA Official API (stats.nba.com)

**Goal:** Create a personalized user dashboard that displays relevant NBA player information and provides quick access to app features.

**Detailed Steps:**

1.  **Frontend (Next.js) - `/dashboard` Page:**
    *   **Create `/dashboard` Page:** Create a new page component in your `pages` directory (e.g., `pages/dashboard.js` or `pages/dashboard/index.js`).
    *   **Route Protection:** Ensure this page is protected and only accessible to logged-in users (using authentication logic from Module A). Redirect unauthenticated users to the login page.
    *   **Dashboard Layout (Shadcn UI):** Structure the dashboard using Shadcn UI components. Consider using a grid layout or flexbox to arrange different sections.
    *   **Dashboard Sections (Components):** Create separate React components for each section of the dashboard.  Based on the brainstorm, consider these sections:
        *   **"My Favorite Players" Section:**  Component to display favorite players.
        *   **"Trending Players" Section:** Component to display trending players.
        *   **"Recent Searches" Section:** Component to display recent player searches.
        *   **"Quick Stats Glance" Section:** Component to display key NBA stats or upcoming games (can be implemented later).
    *   **Data Fetching (Frontend):** For each dashboard section component:
        *   Determine the data required for the section (e.g., favorite player data, trending player data, recent searches).
        *   If data needs to be fetched from the backend, use `axios` to make API requests to your Express.js backend endpoints.
        *   Implement loading states and error handling for data fetching.
    *   **Display Data (Shadcn UI):** Use Shadcn UI components (cards, lists, tables, carousels) to display the fetched data in each section. Style the components to create a visually appealing and informative dashboard.

2.  **Backend (Express.js) API Endpoints:**
    *   **`GET /api/dashboard` (or separate endpoints for each section):** Create API endpoints in your Express.js backend to provide data for the dashboard sections. You can either have a single `/api/dashboard` endpoint that returns data for all sections, or create separate endpoints for each section (e.g., `/api/dashboard/favorites`, `/api/dashboard/trending`, `/api/dashboard/recent-searches`). Separate endpoints are generally more modular and easier to manage.
    *   **Endpoint Logic for each section:**
        *   **"My Favorite Players" Endpoint (`/api/dashboard/favorites`):**
            *   **Authentication:** Ensure only authenticated users can access this endpoint.
            *   **Data Retrieval:**
                *   Fetch the user's favorite player IDs from the `favorite_players` table in Supabase (using the user ID from the authenticated session).
                *   For each favorite player ID, fetch detailed player data from the NBA Official API (using the same logic as in the Player Search module - Module E). Consider caching this data to reduce API calls.
                *   Return an array of favorite player objects to the frontend.
        *   **"Trending Players" Endpoint (`/api/dashboard/trending`):**
            *   **Data Source:** Determine the data source for "trending players". This could be:
                *   **NBA API (if available):** Check if the NBA Official API provides any endpoints for trending players or popular players.
                *   **Internal Logic (e.g., based on search frequency):**  If the NBA API doesn't have trending player data, you could potentially implement your own "trending" logic based on:
                    *   Tracking player search frequency in your application.
                    *   Using external news APIs or social media APIs (more complex, can be considered for later enhancements).
                *   **Fallback/Default:** If no trending data is easily available initially, you can display a default set of popular players or recently active players as a placeholder.
            *   **Data Fetching (based on chosen data source):** Fetch trending player data from the chosen source.
            *   **Data Processing & Return:** Process the data and return an array of trending player objects to the frontend.
        *   **"Recent Searches" Endpoint (`/api/dashboard/recent-searches`):**
            *   **Data Storage:** Decide where to store recent search history.
                *   **Database (Supabase):** Create a table (e.g., `user_search_history`) to store user search queries (user ID, search query, timestamp). This is more persistent.
                *   **Session Storage/Cookies (Frontend):** Store recent searches in the browser's session storage or cookies. This is simpler but less persistent and limited to the browser session. For initial implementation, session storage or cookies might be sufficient. Database storage is recommended for more robust history tracking and persistence across sessions.
            *   **Data Retrieval:**
                *   If using database storage: Query the `user_search_history` table in Supabase to retrieve recent searches for the current user.
                *   If using session storage/cookies: Retrieve recent searches from session storage/cookies.
            *   **Data Processing & Return:**  Return an array of recent search queries (player names) to the frontend. Limit the number of recent searches displayed (e.g., top 5 or 10).

3.  **Database (Supabase) - Potential Tables:**
    *   **`favorite_players` Table:** (Already created in Module G - Favorite Players/Teams). Used for "My Favorite Players" section.
    *   **`user_search_history` Table:** (Optional, for "Recent Searches" - if you choose database storage for search history). Create a table with columns: `id` (UUID, primary key), `user_id` (UUID, foreign key referencing `auth.users.id`), `search_query` (Text), `timestamp` (Timestamp).

**Requirements & Considerations (from `brainstorm.md`):**

*   Create a `/dashboard` page accessible after login.
*   Implement "My Favorite Players," "Trending Players," and "Recent Searches" sections initially. "Quick Stats Glance" and Data Visualizations can be added later.
*   Personalize the dashboard content for each user.
*   Use Shadcn UI components for layout and styling.

**Content Ideas for Dashboard Sections (from `brainstorm.md`):**

*   **"My Favorite Players":** Highlights or recent stats for favorite players.
*   **"Trending Players":** Players trending in NBA world (news, social media, or API data if available).
*   **"Recent Searches":** History of user's recent player searches.
*   **"Quick Stats Glance":** (Optional for now) Summary of key NBA stats or upcoming games.
*   **Data Visualizations:** (Optional, for later) Simple charts or graphs related to player performance or trends.

**Example Code Snippets:**

**Frontend (Next.js) - `pages/dashboard/index.js` (Dashboard Page Structure and Data Fetching Example):**

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../../_app';
import axios from 'axios';

function FavoritePlayersSection() {
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoritePlayers = async () => {
      try {
        const response = await axios.get('/api/dashboard/favorites'); // Backend API endpoint
        setFavoritePlayers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch favorite players.');
        setLoading(false);
      }
    };

    fetchFavoritePlayers();
  }, []);

  if (loading) return <p>Loading favorite players...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>My Favorite Players</h3>
      {favoritePlayers.length > 0 ? (
        <ul>
          {favoritePlayers.map((player) => (
            <li key={player.playerId}>{player.playerName}</li> // Replace with actual player display
          ))}
        </ul>
      ) : (
        <p>You haven't added any favorite players yet.</p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  // ... (Authentication check - ensure user is logged in) ...

  return (
    <div>
      <h1>User Dashboard</h1>
      <FavoritePlayersSection />
      {/* Add other dashboard sections here: Trending Players, Recent Searches, etc. */}
    </div>
  );
}
```

**Backend (Express.js) - `/api/dashboard/favorites.js` (Example API Endpoint for Favorite Players):**

```javascript
// backend/pages/api/dashboard/favorites.js (or similar API route)
// Example - needs Supabase and NBA API integration details

import { supabaseAdmin } from '../../utils/supabase-admin'; // Assuming you have Supabase Admin setup

export default async function handler(req, res) {
  // ... (Authentication check - ensure user is authenticated on backend) ...

  try {
    const { data: favoritePlayersData, error: favoritesError } = await supabaseAdmin
      .from('favorite_players')
      .select('player_id')
      .eq('user_id', req.user.id); // Assuming you have user info in req.user after auth middleware

    if (favoritesError) {
      console.error('Error fetching favorite players:', favoritesError);
      return res.status(500).json({ error: 'Failed to fetch favorite players from DB' });
    }

    const favoritePlayerIds = favoritePlayersData.map(item => item.player_id);
    if (favoritePlayerIds.length === 0) {
      return res.status(200).json([]); // No favorite players
    }

    // ... (Fetch detailed player data from NBA API for each favoritePlayerId) ...
    // ... (Example - Placeholder - Replace with actual NBA API calls and data processing) ...
    const detailedFavoritePlayers = favoritePlayerIds.map(playerId => ({
      playerId: playerId,
      playerName: `Player ${playerId} (Placeholder Data)`, // Replace with actual player name from NBA API
      // ... (Other player details from NBA API) ...
    }));

    res.status(200).json(detailedFavoritePlayers);

  } catch (error) {
    console.error('Error processing favorite players request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
```

**Testing:**

*   Test that the dashboard page is only accessible to logged-in users.
*   Test each dashboard section individually:
    *   Verify that "My Favorite Players" section correctly displays the user's favorite players.
    *   Verify that "Trending Players" section displays relevant trending players (based on your chosen data source).
    *   Verify that "Recent Searches" section displays the user's recent search history (if implemented).
    *   Test data loading states and error handling for each section.
*   Test the overall layout and responsiveness of the dashboard across different screen sizes.

By completing these steps, you will have implemented the User Dashboard module for your NBA Player Data Web Application.