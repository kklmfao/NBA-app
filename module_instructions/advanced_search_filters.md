## Module Instructions: J. Advanced Search Filters

**Module:** Advanced Search Filters (Feature J from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`
*   **Backend:** Node.js, Express.js
*   **NBA Data API:** NBA Official API (stats.nba.com)
*   **(Optional) Database (Supabase):**  Database might be used if NBA API filtering is limited and you need to implement more complex filtering logic on your server-side data.

**Goal:** Enhance the player search functionality (Module E) with advanced filters beyond just player name.

**Detailed Steps:**

1.  **Frontend (Next.js) - Player Search Page (`/players` or `/search`):**
    *   **Filter UI Elements (Shadcn UI):** Add UI elements to the player search page to allow users to apply filters. Consider using:
        *   **Dropdowns/Select Components:** For filters like "Team," "Position," "College," "Draft Year." Populate dropdown options dynamically (e.g., fetch team names from NBA API or a static list).
        *   **Range Sliders or Number Inputs:** For filtering by stats ranges (e.g., "Points Per Game," "Rebounds Per Game"). Use range sliders or number input fields to allow users to specify min/max values for stats.
        *   **Checkboxes:** For multi-select filters (if applicable).
    *   **Filter Logic (Frontend):**
        *   **Collect Filter Values:** When users interact with filter UI elements, capture the selected filter values in your React component's state.
        *   **Update API Request:** Modify the API request to your backend endpoint (`/api/players/search`) to include the selected filter parameters as query parameters in the URL.
            *   Example: If user filters by team "Lakers" (teamId=LAL) and position "Point Guard" (position=PG), the API request URL would become: `/api/players/search?query={playerName}&teamId=LAL&position=PG`.
        *   **Clear Filters Button:** Add a "Clear Filters" button to reset all filters to their default states.
        *   **Apply Filters Button (Optional):** For more complex filters, you might use an "Apply Filters" button to trigger the API request only when the user explicitly clicks "Apply" after setting all desired filters. For simpler filters, you can update the search results automatically as filter values change.

2.  **Backend (Express.js) - `/api/players/search` Endpoint (Modification):**
    *   **Parameter Handling:** Modify the `/api/players/search` endpoint in your Express.js backend to accept and process the new filter parameters from the frontend request (e.g., `teamId`, `position`, `minPPG`, `maxRPG`, etc.).
    *   **NBA Data API Integration (Filtering):**
        *   **Explore NBA API Filtering Capabilities:** **Crucially, investigate if the NBA Official API (`stats.nba.com`) supports filtering players based on the criteria you want to implement (team, position, stats ranges, draft year, etc.).**
        *   **API Query Parameter Mapping:** If the NBA API provides filtering capabilities, map your filter parameters from the frontend to the appropriate query parameters in the NBA API requests.
            *   Example: If you get `teamId` from the frontend, check if the NBA API's player search endpoint accepts a parameter like `TeamID` or `team_id` to filter by team.
        *   **Modify NBA API Requests:** Update your backend logic to construct NBA API requests that include the filter parameters based on user selections.
        *   **Limited NBA API Filtering or No Direct Filtering:**
            *   **If the NBA API does not directly support the desired filtering capabilities or has limited filtering options, you might need to consider these approaches (more complex):**
                *   **Fetch Larger Dataset and Filter on Backend:** Fetch a larger dataset of players from the NBA API (potentially all players or a larger subset) and store it in your Supabase database (e.g., a `players` table). Then, implement the filtering logic in your backend by querying your Supabase database based on the filter parameters. This gives you more control over filtering but requires data synchronization and more database setup.
                *   **Client-Side Filtering (Less Efficient for Large Datasets):** Fetch a larger dataset of players from the NBA API (or your cache) and perform the filtering logic directly in the frontend (JavaScript). This is less efficient for very large datasets and might impact frontend performance.
            *   **For initial implementation, prioritize leveraging the NBA API's filtering capabilities as much as possible.** If direct NBA API filtering is too limited, start with a simpler set of filters that the API *does* support, or consider implementing basic filtering on a pre-fetched dataset in your backend (if feasible) before resorting to complex database-based filtering.
    *   **Return Filtered Results:** After applying filters (either via NBA API or your own filtering logic), return the filtered player search results to the frontend.

3.  **Database (Supabase) - Optional (Conditional):**
    *   **`players` Table (Optional - for advanced backend filtering):** If you choose to implement more complex filtering logic by storing player data in your Supabase database, you would need to create a `players` table in Supabase to store player information fetched from the NBA API. This table would be used for server-side filtering if the NBA API's filtering is insufficient.

**Filter Ideas (from `brainstorm.md`):**

*   Team
*   Position
*   Jersey Number
*   Stats ranges (e.g., "Players averaging more than 20 PPG")
*   Draft Year
*   College

**NBA Data API Exploration (`stats.nba.com` - Filtering):**

*   **Inspect Network Requests (with Filters):**  Use your browser's developer tools and inspect network requests on `stats.nba.com` when you use filters on their player search or roster pages (if they have filter options).
*   **Identify Filtering Parameters:** Analyze the request URLs and parameters to see if the NBA API uses query parameters for filtering (e.g., `TeamID=...`, `Position=...`, `DraftYear=...`).
*   **API Documentation (Unofficial - Filtering):** Search for any unofficial documentation or community resources that describe filtering options in the `stats.nba.com` API.

**Requirements & Considerations (from `brainstorm.md`):**

*   Enhance player search with filters beyond player name.
*   Examples of filters: Team, Position, Jersey Number, Stats ranges, Draft Year, College (implement a subset of these initially, based on NBA API capabilities).
*   Allow users to combine multiple filters.
*   Prioritize leveraging the NBA API's filtering capabilities directly. Database-based filtering is a more complex option to consider if NBA API filtering is limited.

**Example Code Snippets:**

**Frontend (Next.js) - `pages/players/index.js` (Modified Player Search Page with Filter UI Example):**

```javascript
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        teamId: teamFilter, // Example filter parameters
        position: positionFilter,
      });
      const response = await axios.get(`/api/players/search?${params.toString()}`);
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
      </div>

      {/* Example Filter Dropdowns */}
      <div>
        <label htmlFor="teamFilter">Team:</label>
        <select id="teamFilter" value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
          <option value="">All Teams</option>
          <option value="LAL">Los Angeles Lakers</option> {/* Example team IDs - replace with dynamic team list */}
          <option value="GSW">Golden State Warriors</option>
          {/* ... more team options ... */}
        </select>
      </div>
      <div>
        <label htmlFor="positionFilter">Position:</label>
        <select id="positionFilter" value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
          <option value="">All Positions</option>
          <option value="G">Guard</option>
          <option value="F">Forward</option>
          <option value="C">Center</option>
        </select>
      </div>

      <button onClick={handleSearch} disabled={loading}>
        Search
      </button>

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

**Backend (Express.js) - `/api/players/search.js` (Modified API Endpoint to Handle Filters - simplified):**

```javascript
// backend/pages/api/players/search.js (or similar API route)
// Example - Placeholder - Replace with actual NBA API filtering integration

export default async function handler(req, res) {
  const { query, teamId, position } = req.query; // Get filter parameters from query

  if (!query) {
    return res.status(400).json({ error: 'Search query is required.' });
  }

  try {
    // ... (Check cache - considering query and filter parameters in cache key) ...

    // ... (Make request to NBA Official API with search query AND filter parameters) ...
    // ... (Example - Placeholder - Replace with actual NBA API call - assuming API supports teamId and position filters) ...
    const nbaApiFilteredSearchResponse = { // Placeholder NBA API response
      players: [
        // ... players matching query AND filters ...
        { playerId: 2544, playerName: 'LeBron James', teamName: 'Los Angeles Lakers', position: 'Forward' }, // Example matching Lakers Forward
        // ... more players based on query and filters ...
      ]
    };

    const filteredSearchResults = nbaApiFilteredSearchResponse.players;

    // ... (Cache filtered search results - consider filters in cache key) ...

    res.status(200).json(filteredSearchResults);

  } catch (error) {
    console.error('Error processing filtered player search request:', error);
    res.status(500).json({ error: 'Failed to fetch filtered player search results' });
  }
}
```

**Testing:**

*   Test each filter individually:
    *   Apply filters one by one (e.g., filter by Team, then clear and filter by Position, etc.).
    *   Verify that filtering is working correctly for each filter type.
    *   Verify that search results are correctly filtered based on the selected filter values.
*   Test combining multiple filters:
    *   Apply combinations of filters (e.g., Team and Position, Team and Stats range, etc.).
    *   Verify that filters are combined correctly and search results are refined based on all applied filters.
*   Test filter UI elements: Ensure that dropdowns, range sliders, and other filter UI elements are working correctly and are user-friendly.
*   Test error handling: Handle cases where filter values are invalid or lead to no search results.
*   Test performance: Ensure that filtering is efficient and doesn't cause significant performance issues, especially if you are implementing client-side or backend filtering on larger datasets.

By completing these steps, you will have implemented the Advanced Search Filters module to enhance the player search functionality of your NBA Player Data Web Application.