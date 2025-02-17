## Module Instructions: E. NBA Player Search Page with Player Data

**Module:** NBA Player Search Page with Player Data (Feature E from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`
*   **Backend:** Node.js, Express.js, In-memory Caching
*   **NBA Data API:** NBA Official API (stats.nba.com)

**Goal:** Implement a search page where users can search for NBA players by name and view detailed player information.

**Detailed Steps:**

1.  **Frontend (Next.js) - `/players` or `/search` Page:**
    *   **Create `/players` (or `/search`) Page:** Create a new page component in your `pages` directory (e.g., `pages/players.js` or `pages/search/index.js`).
    *   **Search Bar (Shadcn UI):** Implement a search input field using Shadcn UI components.
    *   **Search Logic (Frontend):**
        *   **Controlled Input:** Make the search input a controlled component in React to track the input value.
        *   **Debouncing (Optional but Recommended):** Implement debouncing to limit API calls when the user is typing.  Wait for a short delay after the user stops typing before making an API request. This can improve performance and reduce unnecessary API calls.
        *   **API Call on Search Input Change:** When the search input value changes (after debouncing if implemented), make an API request to your backend endpoint (`/api/players/search?query={playerName}`) using `axios`.
        *   **Display Search Results:**
            *   Display a list of player search results below the search bar. Use Shadcn UI components (lists, cards) to present the results.
            *   For each search result, display basic player information (name, team, position, maybe a small image if available).
            *   Make each player result clickable to navigate to a detailed player page (see next step).
        *   **Loading State:** Display a loading indicator while waiting for the API response.
        *   **Error Handling:** Handle API request errors and display appropriate error messages to the user.
    *   **Player Detail Page (Dynamic Route - `pages/players/[playerId].js` or `pages/players/[playerId]/index.js`):**
        *   **Create Dynamic Route:** Set up a dynamic route in Next.js to handle player detail pages based on player IDs.
        *   **Fetch Player Data on Page Load:** In the player detail page component, use `getServerSideProps` or `getStaticProps` with `getStaticPaths` (depending on whether you want to pre-render all player pages or fetch data on request) to fetch detailed player data from your backend API endpoint (`/api/players/{playerId}`) when the page is loaded.
        *   **Display Player Data (Shadcn UI):** Use Shadcn UI components (cards, tables, lists, layouts) to display the fetched player data on the detail page.  Organize the data into sections (Basic Info, Statistics, Recent Games, etc.).
        *   **Data to Display (from `brainstorm.md` - Ideas):**
            *   Basic Player Info: Name, Team, Position, Jersey Number, Height, Weight, DOB, Nationality, Draft Info.
            *   Statistics (Current Season or Career): PPG, RPG, APG, SPG, BPG, FG%, 3P%, FT%.
            *   Recent Game Stats (if available).
            *   Player Bio/Summary (optional).
            *   Player Image (optional).
        *   **"Favorite Player" Button:** Add a "favorite" button/icon on the player detail page (and potentially on player search results). Implement the "favorite player" functionality as described in Module G (Favorite Players/Teams).

2.  **Backend (Express.js) API Endpoints:**
    *   **`GET /api/players/search?query={playerName}`:**
        *   **Caching:** Implement in-memory caching to cache player search results (based on search query). Check the cache before making API calls to the NBA API.
        *   **NBA Data API Integration:**
            *   Make requests to the NBA Official API (`stats.nba.com`) to search for players based on the `query` parameter. You'll need to explore the NBA API to find the appropriate endpoints for player search.  Likely endpoints involve searching by player name or partial name.
            *   **Data Processing:** Process and format the data from the NBA API response. Extract relevant player information (name, team, position, player ID) for search results.
            *   **Caching (Store in Cache):** Cache the processed player search results for a certain duration (e.g., 1 hour).
            *   **Return Data:** Send the processed player search results back to the frontend as JSON.
        *   **Error Handling:** Handle errors during API calls to the NBA API and return appropriate error responses to the frontend.
    *   **`GET /api/players/{playerId}`:**
        *   **Caching:** Implement in-memory caching to cache detailed player data (based on player ID).
        *   **NBA Data API Integration:**
            *   Make requests to the NBA Official API (`stats.nba.com`) to fetch detailed player data for the given `playerId`. Explore the NBA API for endpoints to retrieve player profiles, stats, and other information.
            *   **Data Processing:** Process and format the data from the NBA API response. Extract all the relevant player data points you want to display on the player detail page (basic info, stats, etc.).
            *   **Caching (Store in Cache):** Cache the processed detailed player data for a certain duration (e.g., 1 hour).
            *   **Return Data:** Send the processed detailed player data back to the frontend as JSON.
        *   **Error Handling:** Handle errors during API calls to the NBA API and return appropriate error responses to the frontend.

3.  **In-Memory Caching (Backend):**
    *   Implement a simple in-memory cache in your Express.js backend. You can use a JavaScript object (Map) to store cached data.
    *   **Cache Keys:** Use the API endpoint URL and query parameters (e.g., `/api/players/search?query=lebron` or `/api/players/2544`) as cache keys.
    *   **Cache Invalidation/Expiration:** Set a reasonable expiration time for cached data (e.g., 1 hour) to ensure data freshness. You can use `setTimeout` to remove entries from the cache after the expiration time.

**NBA Data API Exploration (`stats.nba.com`):**

*   **Inspect Network Requests:** Use your browser's developer tools (Network tab) to inspect the API requests made by the `stats.nba.com` website when you search for players or view player profiles. This is crucial for understanding the API endpoints and parameters used by the official site.
*   **Identify Player Search Endpoints:** Look for API requests that are triggered when you type in the player search bar on `stats.nba.com`. Analyze the request URL and parameters to understand how to search for players via the API.
*   **Identify Player Profile Endpoints:** Look for API requests that are made when you view a specific player's profile on `stats.nba.com`. Analyze the request URL and parameters to understand how to retrieve detailed player data by player ID.
*   **API Documentation (Unofficial):** Search online for any unofficial documentation or community resources related to the `stats.nba.com` API. While it's not officially documented, there might be community-driven documentation or examples available that can be helpful.

**Requirements & Considerations (from `brainstorm.md`):**

*   Create an NBA Player Search page ( `/players` or `/search`).
*   Implement a search bar for player name search.
*   Optional: Autocomplete/suggestions (can be added later if time permits).
*   Display detailed player data on the page (basic info, stats, etc. - see list in steps).
*   Use the NBA Official API (`stats.nba.com`) for data fetching.
*   Implement in-memory caching in the backend to improve performance and reduce API calls.

**Example Code Snippets:**

**Frontend (Next.js) - `pages/players/index.js` (Player Search Page Example):**

```javascript
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/players/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch search results.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>NBA Player Search</h1>
      <div>
        <input
          type="text"
          placeholder="Search for player..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>
      {loading && <p>Loading search results...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {searchResults.map((player) => (
          <li key={player.playerId}>
            <Link href={`/players/${player.playerId}`}>
              {player.playerName} ({player.teamName}, {player.position})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Backend (Express.js) - `/api/players/search.js` (Example API Endpoint for Player Search - simplified):**

```javascript
// backend/pages/api/players/search.js (or similar API route)
// Example - Placeholder - Replace with actual NBA API integration and caching

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required.' });
  }

  try {
    // ... (Check in-memory cache first - if implemented) ...

    // ... (Make request to NBA Official API to search for players by name) ...
    // ... (Example - Placeholder - Replace with actual NBA API call) ...
    const nbaApiResponse = { // Placeholder NBA API response structure
      players: [
        { playerId: 2544, playerName: 'LeBron James', teamName: 'Los Angeles Lakers', position: 'Forward' },
        { playerId: 201939, playerName: 'Stephen Curry', teamName: 'Golden State Warriors', position: 'Guard' },
        // ... more players based on search query ...
      ]
    };

    const searchResults = nbaApiResponse.players; // Assume NBA API returns players in 'players' array

    // ... (Cache the search results - if implemented) ...

    res.status(200).json(searchResults);

  } catch (error) {
    console.error('Error processing player search request:', error);
    res.status(500).json({ error: 'Failed to fetch player search results' });
  }
}
```

**Testing:**

*   Test player search functionality:
    *   Search for players by name (full name, partial name).
    *   Verify that search results are displayed correctly.
    *   Test loading state and error handling during search.
*   Test player detail page:
    *   Navigate to player detail pages from search results.
    *   Verify that detailed player data is displayed correctly on the detail page.
    *   Test data loading and error handling on the detail page.
*   Test caching:
    *   Verify that caching is working by making the same search or player detail request multiple times and observing reduced API calls to the NBA API (you can check this in your backend logs or network requests).
    *   Check that cached data is being invalidated/expired after the set duration and fresh data is fetched.

By completing these steps, you will have implemented the NBA Player Search Page with Player Data module for your application.
