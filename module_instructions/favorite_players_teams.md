## Module Instructions: G. Favorite Players/Teams

**Module:** Favorite Players/Teams (Feature G from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`
*   **Backend:** Node.js, Express.js
*   **Database:** Supabase (PostgreSQL, Auth)

**Goal:** Implement functionality for users to favorite individual players and potentially teams.

**Detailed Steps:**

1.  **Database (Supabase) Setup:**
    *   **`favorite_players` Table:** Create a table named `favorite_players` in your Supabase database to store user's favorite players.
        *   Columns:
            *   `id` (UUID, primary key, auto-generated)
            *   `user_id` (UUID, foreign key referencing `auth.users.id`)
            *   `player_id` (Integer, storing NBA player ID)
            *   `created_at` (Timestamp)
    *   **`favorite_teams` Table:** (Optional for initial implementation - can be added later) Create a table named `favorite_teams` to store user's favorite teams.
        *   Columns:
            *   `id` (UUID, primary key, auto-generated)
            *   `user_id` (UUID, foreign key referencing `auth.users.id`)
            *   `team_id` (Integer, storing NBA team ID)
            *   `created_at` (Timestamp)
    *   **Unique Constraint (Optional but Recommended):** For both `favorite_players` and `favorite_teams` tables, consider adding a unique constraint on the combination of `user_id` and `player_id` (or `team_id`) to prevent duplicate favorites for the same user.
    *   **Foreign Key Relationships:** Establish foreign key relationships between `favorite_players.user_id` and `auth.users.id`, and `favorite_teams.user_id` and `auth.users.id`.

2.  **Frontend (Next.js) Implementation:**
    *   **"Favorite" Icons/Buttons:**
        *   **Player Cards/Detail Pages:** Add "favorite" icons (e.g., star icons from Shadcn UI or `react-icons`) next to player names in player search results, on player detail pages, and in the "My Favorite Players" dashboard section.
        *   **Team Pages (if implementing favorite teams):** Add "favorite" icons on team pages.
        *   **Icon State:** Use two different icons or states for the "favorite" icon: one for "not favorited" (e.g., outline star) and one for "favorited" (e.g., filled star).
    *   **"Favorite" Button Click Logic:**
        *   **Handle Click Event:** Attach a click event handler to the "favorite" icon/button.
        *   **Determine Action (Add/Remove):**  When clicked, check the current "favorited" state of the player/team for the user.
            *   If not favorited, the action is to "add to favorites".
            *   If already favorited, the action is to "remove from favorites".
        *   **API Calls (Frontend):**
            *   **Add to Favorites (POST request):** Make a POST request to your backend API endpoint (`/api/users/favorites/players` for players, `/api/users/favorites/teams` for teams), sending the `player_id` or `team_id` in the request body or as a query parameter.
            *   **Remove from Favorites (DELETE request):** Make a DELETE request to the corresponding backend API endpoint, sending the `player_id` or `team_id` in the request body or as a query parameter.
            *   **Error Handling:** Handle API request errors and display appropriate messages.
        *   **Update UI:** After successful API calls, update the UI to reflect the new "favorited" state of the icon (change icon state from outline to filled or vice-versa).
    *   **"My Favorite Players" Section (Dashboard - Module C):**
        *   In the "My Favorite Players" dashboard section (Module C), fetch the user's favorite players from your backend API endpoint (`/api/users/favorites/players`).
        *   Display the list of favorite players. Include "favorite" icons next to each player in the list, reflecting their favorited status.
    *   **Initial "Favorited" State Loading:** When loading player cards or player detail pages, you might need to fetch the user's list of favorite player IDs to determine the initial "favorited" state of the icon for each player. You can fetch this list once when the user logs in or on relevant page loads and store it in frontend state (e.g., React Context) for efficient access.

3.  **Backend (Express.js) API Endpoints:**
    *   **`GET /api/users/favorites/players`:**
        *   **Authentication:** Ensure only authenticated users can access this endpoint.
        *   **Data Retrieval:**
            *   Fetch all `player_id`s from the `favorite_players` table for the current user (using the `user_id` from the authenticated session).
            *   Return an array of `player_id`s to the frontend.
        *   **Error Handling:** Handle database errors.
    *   **`POST /api/users/favorites/players`:**
        *   **Authentication:** Ensure only authenticated users can access this endpoint.
        *   **Input Validation:** Validate that the request body or parameters contain a valid `player_id`.
        *   **Database Interaction:**
            *   Insert a new row into the `favorite_players` table with the `user_id` and `player_id`.
            *   Return a success response to the frontend.
        *   **Error Handling:** Handle database errors (e.g., unique constraint violation if trying to add a duplicate favorite).
    *   **`DELETE /api/users/favorites/players`:**
        *   **Authentication:** Ensure only authenticated users can access this endpoint.
        *   **Input Validation:** Validate that the request body or parameters contain a valid `player_id`.
        *   **Database Interaction:**
            *   Delete the row from the `favorite_players` table where `user_id` matches the current user and `player_id` matches the provided `player_id`.
            *   Return a success response to the frontend.
        *   **Error Handling:** Handle database errors.
    *   **(Optional - if implementing favorite teams) `GET /api/users/favorites/teams`, `POST /api/users/favorites/teams`, `DELETE /api/users/favorites/teams`:** Implement similar API endpoints for managing favorite teams, interacting with the `favorite_teams` table.

**Requirements & Considerations (from `brainstorm.md`):**

*   Implement "favorite" functionality for individual players and/or teams (start with players, teams can be added later).
*   Provide clear "favorite" buttons/icons on player and team display pages.
*   Store user's favorite players/teams persistently in the database (Supabase).
*   Display a list of "My Favorite Players" and "My Favorite Teams" on the user dashboard.
*   Future enhancement: Potentially trigger notifications or special content related to favorite players/teams.

**Example Code Snippets:**

**Frontend (Next.js) - `components/PlayerCard.js` (Example "Favorite Player" Button in a Player Card Component):**

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';
import { StarIcon, StarFilledIcon } from '@radix-ui/react-icons'; // Example icon library

export default function PlayerCard({ player }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      // ... (Fetch user's favorite player IDs - Example: from Context or props) ...
      const favoritePlayerIds = /* ... get favorite player IDs ... */;
      setIsFavorite(favoritePlayerIds.includes(player.playerId));
    };
    checkFavoriteStatus();
  }, [player.playerId]);

  const handleFavoriteClick = async () => {
    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await axios.delete(`/api/users/favorites/players?playerId=${player.playerId}`);
        setIsFavorite(false);
      } else {
        await axios.post('/api/users/favorites/players', { playerId: player.playerId });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // ... (Handle error - e.g., display error message) ...
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div>
      <h3>{player.playerName}</h3>
      {/* ... (Player details) ... */}
      <button onClick={handleFavoriteClick} disabled={loadingFavorite}>
        {isFavorite ? <StarFilledIcon /> : <StarIcon />} {/* Example Icons */}
        {loadingFavorite ? 'Saving...' : (isFavorite ? 'Remove Favorite' : 'Add Favorite')}
      </button>
    </div>
  );
}
```

**Backend (Express.js) - `/api/users/favorites/players.js` (Example API Endpoint for Adding/Removing Favorite Players):**

```javascript
// backend/pages/api/users/favorites/players.js (or similar API route)
import { supabaseAdmin } from '../../utils/supabase-admin';

export default async function handler(req, res) {
  // ... (Authentication check) ...

  if (req.method === 'GET') { // Get favorite players
    try {
      const { data, error } = await supabaseAdmin
        .from('favorite_players')
        .select('player_id')
        .eq('user_id', req.user.id);

      if (error) {
        console.error('Error fetching favorite players:', error);
        return res.status(500).json({ error: 'Failed to fetch favorite players' });
      }
      const favoritePlayerIds = data.map(item => item.player_id);
      res.status(200).json(favoritePlayerIds);

    } catch (error) {
      console.error('Error processing GET favorites request:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }

  } else if (req.method === 'POST') { // Add favorite player
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({ error: 'Player ID is required to add to favorites.' });
    }

    try {
      const { error } = await supabaseAdmin
        .from('favorite_players')
        .insert({ user_id: req.user.id, player_id: playerId });

      if (error) {
        console.error('Error adding favorite player:', error);
        return res.status(500).json({ error: 'Failed to add player to favorites' });
      }
      res.status(200).json({ message: 'Player added to favorites' });

    } catch (error) {
      console.error('Error processing POST favorites request:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }

  } else if (req.method === 'DELETE') { // Remove favorite player
    const { playerId } = req.query; // Player ID in query parameter for DELETE

    if (!playerId) {
      return res.status(400).json({ error: 'Player ID is required to remove from favorites.' });
    }

    try {
      const { error } = await supabaseAdmin
        .from('favorite_players')
        .delete()
        .eq('user_id', req.user.id)
        .eq('player_id', playerId);

      if (error) {
        console.error('Error removing favorite player:', error);
        return res.status(500).json({ error: 'Failed to remove player from favorites' });
      }
      res.status(200).json({ message: 'Player removed from favorites' });

    } catch (error) {
      console.error('Error processing DELETE favorites request:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

**Testing:**

*   Test adding and removing players as favorites:
    *   Click "favorite" icons on player cards and detail pages.
    *   Verify that the icon state updates correctly (filled/outline).
    *   Verify that data is correctly saved and deleted in the `favorite_players` table in Supabase.
*   Test displaying "My Favorite Players" on the dashboard:
    *   Verify that the "My Favorite Players" section on the dashboard displays the user's favorited players.
    *   Verify that the "favorite" icons in the dashboard section reflect the correct favorited state.
*   Test API endpoint security: Ensure that only authenticated users can manage their favorites via the API endpoints.
*   Test error handling for API requests and database operations.

By completing these steps, you will have implemented the Favorite Players/Teams module for your NBA Player Data Web Application.