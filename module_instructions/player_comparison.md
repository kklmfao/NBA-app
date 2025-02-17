## Module Instructions: F. Player Comparison

**Module:** Player Comparison (Feature F from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`, (Chart.js or Recharts - for optional visualizations)
*   **Backend:** Node.js, Express.js
*   **NBA Data API:** NBA Official API (stats.nba.com)

**Goal:** Implement a feature to allow users to compare two or more NBA players side-by-side.

**Detailed Steps:**

1.  **Frontend (Next.js) - `/compare` Page or Modal/Section:**
    *   **Create `/compare` Page (or Modal/Section):** You can either create a dedicated `/compare` page or implement the comparison feature as a section on another page (e.g., within the player search page or dashboard) or as a modal that opens when a "Compare" button is clicked. A dedicated `/compare` page is often clearer for a primary feature.
    *   **Player Selection UI:**
        *   **Multi-Select Dropdown or Checkboxes:** Implement a UI component to allow users to select two or more players for comparison. You can use:
            *   A multi-select dropdown (Shadcn UI's `Select` component can be customized for multi-select).
            *   Checkboxes next to player names in search results or a list of favorite players.
            *   A combination - e.g., an "Add to Compare" button on player cards in search results, accumulating selected players in a comparison tray.
        *   **Search Integration:** Ideally, integrate player selection with the player search functionality from Module E. Users should be able to search for players and easily add them to the comparison list.
        *   **Player List Display:** Display the currently selected players for comparison. Allow users to remove players from the comparison list.
    *   **Comparison Display Area:**
        *   **Table Format (Shadcn UI):** Use a Shadcn UI `Table` component to display the player comparison.
        *   **Rows:** Each row in the table should represent a statistic (e.g., PPG, RPG, APG).
        *   **Columns:** The first column should be the statistic name. Subsequent columns should be for each selected player, displaying their value for that statistic. Include player names as column headers.
    *   **Statistic Selection (Optional but Enhances UX):**
        *   Allow users to choose which statistics to compare. This could be a dropdown or checkboxes to select stats. If not implemented initially, provide a default set of relevant stats for comparison (PPG, RPG, APG, SPG, BPG, FG%, 3P%, FT%).
    *   **Data Visualization (Optional, for later):**
        *   Integrate a charting library (Chart.js or Recharts) to create visual comparisons (e.g., bar charts for each stat, comparing players side-by-side).
        *   Provide UI to switch between table view and chart view.
    *   **Data Fetching (Frontend):**
        *   When users initiate a comparison (e.g., click a "Compare" button or navigate to the `/compare` page with selected players), make an API request to your backend endpoint (`/api/players/compare?playerIds={playerId1},{playerId2},{playerId3}...`) using `axios`, sending the IDs of the selected players in the query parameters.
        *   Display a loading state while waiting for the API response.
        *   Handle API request errors and display error messages.

2.  **Backend (Express.js) API Endpoint:**
    *   **`GET /api/players/compare?playerIds={playerId1},{playerId2},{playerId3}...`:**
        *   **Authentication (Optional):** Decide if player comparison should be available to all users or only logged-in users. If only for logged-in users, implement authentication.
        *   **Input Validation:** Validate that the `playerIds` parameter is provided and contains valid player IDs.
        *   **NBA Data API Integration:**
            *   For each `playerId` in the input array:
                *   Fetch player data from the NBA Official API using the same logic as in Module E (`/api/players/{playerId}`). You might need to make multiple API calls, one for each player ID.
                *   Extract the relevant statistics for comparison from the API response for each player (PPG, RPG, APG, etc., based on your default set or user-selected stats).
            *   **Data Structuring for Comparison:** Structure the data in a format suitable for comparison display in the frontend.  A possible structure is an array of statistic objects, where each object contains:
                *   `statName`: The name of the statistic (e.g., "Points Per Game").
                *   `playerValues`: An array of values for each player, in the same order as the player IDs in the request.  For example: `[player1_PPG, player2_PPG, player3_PPG]`.
            *   **Caching (Optional):** Caching player data from the individual player API calls (from `/api/players/{playerId}`) will be beneficial here, as you are likely to fetch the same player data multiple times during comparisons.
            *   **Return Data:** Send the structured comparison data back to the frontend as JSON.
        *   **Error Handling:** Handle errors during API calls to the NBA API and return error responses to the frontend.

**Data Structure Example for Comparison Data (Backend to Frontend):**

```json
[
  {
    "statName": "Points Per Game",
    "playerValues": [28.5, 25.3, 30.1] // Values for playerIds in request order
  },
  {
    "statName": "Rebounds Per Game",
    "playerValues": [7.2, 10.5, 6.8]
  },
  {
    "statName": "Assists Per Game",
    "playerValues": [6.8, 5.9, 8.2]
  },
  // ... more stats
]
```

**Requirements & Considerations (from `brainstorm.md`):**

*   Implement player comparison functionality.
*   Allow users to select two or more players for comparison.
*   Display a side-by-side comparison of key statistics in a table format.
*   Optional: Allow users to choose which stats to compare.
*   Optional: Present comparison visually using charts or graphs (can be added later).
*   Integrate with player search functionality (Module E) for player selection.

**Example Code Snippets:**

**Frontend (Next.js) - `pages/compare/index.js` (Player Comparison Page Example - basic table):**

```javascript
import { useState } from 'react';
import axios from 'axios';

export default function ComparePage() {
  const [playerIdsInput, setPlayerIdsInput] = useState('');
  const [playerIds, setPlayerIds] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    setLoading(true);
    setError(null);
    setComparisonData([]);

    const idsArray = playerIdsInput.split(',').map(id => id.trim()).filter(id => id); // Split and clean IDs
    setPlayerIds(idsArray); // Store IDs for display

    if (idsArray.length < 2) {
      setError('Please enter at least two Player IDs separated by commas.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/players/compare?playerIds=${idsArray.join(',')}`);
      setComparisonData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch comparison data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Player Comparison</h1>
      <div>
        <label htmlFor="playerIds">Enter Player IDs (comma-separated):</label>
        <input
          type="text"
          id="playerIds"
          value={playerIdsInput}
          onChange={(e) => setPlayerIdsInput(e.target.value)}
          placeholder="e.g., 2544, 201939"
        />
        <button onClick={handleCompare} disabled={loading}>
          Compare
        </button>
      </div>
      {error && <p>Error: {error}</p>}
      {loading && <p>Loading comparison data...</p>}

      {comparisonData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Statistic</th>
              {playerIds.map(id => <th key={id}>Player {id}</th>)} {/* Player IDs as column headers */}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((stat, index) => (
              <tr key={index}>
                <td>{stat.statName}</td>
                {stat.playerValues.map((value, playerIndex) => (
                  <td key={playerIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

**Backend (Express.js) - `/api/players/compare.js` (Example API Endpoint for Player Comparison - simplified):**

```javascript
// backend/pages/api/players/compare.js (or similar API route)
// Example - Placeholder - Replace with actual NBA API integration

export default async function handler(req, res) {
  const { playerIds } = req.query;

  if (!playerIds) {
    return res.status(400).json({ error: 'playerIds parameter is required.' });
  }

  const idsArray = playerIds.split(',');
  if (idsArray.length < 2) {
    return res.status(400).json({ error: 'At least two player IDs are required for comparison.' });
  }

  try {
    const comparisonStats = [ // Example stats to compare
      'Points Per Game', 'Rebounds Per Game', 'Assists Per Game'
    ];
    const comparisonData = [];

    for (const statName of comparisonStats) {
      const statValues = [];
      for (const playerId of idsArray) {
        // ... (Fetch player data from NBA API for each playerId) ...
        // ... (Example - Placeholder - Replace with actual NBA API call to get player stats) ...
        const playerStatsFromApi = { // Placeholder - Simulate NBA API response
          playerId: playerId,
          'Points Per Game': Math.random() * 30, // Example random stat values
          'Rebounds Per Game': Math.random() * 12,
          'Assists Per Game': Math.random() * 10,
        };

        statValues.push(playerStatsFromApi[statName]); // Get stat value for current player
      }
      comparisonData.push({ statName: statName, playerValues: statValues });
    }

    res.status(200).json(comparisonData);

  } catch (error) {
    console.error('Error processing player comparison request:', error);
    res.status(500).json({ error: 'Failed to fetch player comparison data' });
  }
}
```

**Testing:**

*   Test player selection UI and ensure users can select multiple players for comparison.
*   Test the comparison display table:
    *   Verify that player names and statistics are displayed correctly in the table.
    *   Test with different numbers of players (2, 3, or more).
    *   Test with different sets of statistics (if statistic selection is implemented).
*   Test data fetching:
    *   Verify that the backend API endpoint correctly fetches data for multiple players from the NBA API.
    *   Test loading state and error handling during data fetching.
*   (If implementing charts) Test data visualizations and ensure charts are displaying comparison data accurately.

By completing these steps, you will have implemented the Player Comparison module for your NBA Player Data Web Application.