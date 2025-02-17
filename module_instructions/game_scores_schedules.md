## Module Instructions: I. Game Scores & Schedules

**Module:** Game Scores & Schedules (Feature I from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`
*   **Backend:** Node.js, Express.js, In-memory Caching
*   **NBA Data API:** NBA Official API (stats.nba.com)

**Goal:** Implement functionality to display live or recent game scores and upcoming game schedules.

**Detailed Steps:**

1.  **Frontend (Next.js) - `/games` Page or Dashboard Integration:**
    *   **Create `/games` Page (or Integrate into Dashboard):** You can create a dedicated `/games` page or integrate game scores and schedules into the user dashboard (Module C) as a section or tab.
    *   **Game Display Components (Shadcn UI):**
        *   **Game Card/List Item:** Create a React component to display information for a single game (team logos, team names, scores, game time, status). Use Shadcn UI components (cards, lists, grids) for styling.
        *   **Schedule Display:** For upcoming games, consider using a calendar component (Shadcn UI might have a basic date picker that can be adapted, or you can use a separate calendar library like `react-datepicker` or `react-big-calendar` if you need more advanced calendar features). Alternatively, a simple list or grid view of upcoming games by date might be sufficient initially.
    *   **Sections:** Divide the `/games` page (or dashboard section) into:
        *   **"Live Scores" (or "Current Games"):** Display games that are currently in progress or have recently finished (final scores).
        *   **"Upcoming Games" (or "Schedule"):** Display the schedule of upcoming games.
    *   **Data Fetching (Frontend):**
        *   **Live Scores Data:** Fetch live game scores from your backend API endpoint (`/api/games/live`) using `axios`. Update this data periodically (e.g., every 5-15 seconds) to display near real-time scores. Use `setInterval` in React for periodic updates.
        *   **Schedule Data:** Fetch upcoming game schedules from your backend API endpoint (`/api/games/schedule`) using `axios`. You might want to fetch schedules for the current day or a range of dates. Allow users to navigate to different dates (using a date picker or navigation buttons).
        *   **Loading States and Error Handling:** Implement loading indicators while fetching game data and error handling for API request failures.
    *   **Filtering and Sorting (Optional but Enhances UX):**
        *   Allow users to filter games by date, team, or conference. Implement UI elements (dropdowns, date pickers) for filtering.
        *   Allow users to sort games (e.g., by time, by team).

2.  **Backend (Express.js) API Endpoints:**
    *   **`GET /api/games/live`:**
        *   **Caching:** Implement caching for live game scores. Live scores change frequently, so use a shorter cache duration compared to player stats (e.g., cache for 1-5 minutes).
        *   **NBA Data API Integration:**
            *   Explore the NBA Official API (`stats.nba.com`) to find endpoints for retrieving live game scores. Look for endpoints that provide real-time updates or frequently refreshed game data.
            *   **Data Processing:** Process and format the data from the NBA API response. Extract relevant game information: team names, scores, game time, game status (live, final, upcoming).
            *   **Caching (Store in Cache):** Cache the processed live game scores for a short duration.
            *   **Return Data:** Send the processed live game scores back to the frontend as JSON.
        *   **Error Handling:** Handle errors during API calls to the NBA API.
    *   **`GET /api/games/schedule`:**
        *   **Caching:** Implement caching for game schedules. Schedules are less dynamic than live scores, so you can use a longer cache duration (e.g., cache for a few hours or a day, depending on how often the NBA schedule is updated).
        *   **Date Parameter (Optional but Useful):**  Allow an optional `date` parameter in the API endpoint (e.g., `/api/games/schedule?date=2024-03-16`) to fetch the schedule for a specific date. If no date is provided, return the schedule for the current day or a default date range.
        *   **NBA Data API Integration:**
            *   Explore the NBA Official API (`stats.nba.com`) to find endpoints for retrieving game schedules. Look for endpoints that allow you to retrieve schedules for specific dates or date ranges.
            *   **Data Processing:** Process and format the data from the NBA API response. Extract relevant schedule information: team names, game time, game date, game status (upcoming, final).
            *   **Caching (Store in Cache):** Cache the processed game schedule data.
            *   **Return Data:** Send the processed game schedule data back to the frontend as JSON.
        *   **Error Handling:** Handle errors during API calls to the NBA API.

3.  **In-Memory Caching (Backend):**
    *   Use in-memory caching (as implemented in Module E) for both live scores and game schedules.
    *   **Different Cache Durations:** Use shorter cache durations for live scores (e.g., 1-5 minutes) and longer cache durations for game schedules (e.g., a few hours or a day).

**NBA Data API Exploration (`stats.nba.com`):**

*   **Inspect Network Requests:** Inspect network requests on `stats.nba.com` when you view game scores or schedules on the official website.
*   **Identify Live Scores Endpoints:** Look for API calls that are continuously updated on the scores page.
*   **Identify Schedule Endpoints:** Look for API calls made when you view the schedule calendar or daily schedule lists.
*   **Explore Date Parameters:** Check if the schedule API endpoints accept date parameters to retrieve schedules for specific dates.

**Requirements & Considerations (from `brainstorm.md`):**

*   Display live or recent game scores.
*   Show upcoming game schedules.
*   Optional: Allow users to filter games by date, team, or conference.
*   Optional: Link to game details or box scores (if available from the NBA API - can be added later).
*   Use the NBA Official API (`stats.nba.com`) for data fetching.
*   Implement caching, especially for live scores, in the backend.

**Example Code Snippets:**

**Frontend (Next.js) - `pages/games/index.js` (Example Game Scores and Schedule Page):**

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function GameScoreCard({ game }) {
  return (
    <div>
      <h3>{game.homeTeamName} vs {game.awayTeamName}</h3>
      <p>Score: {game.homeTeamScore} - {game.awayTeamScore}</p>
      <p>Status: {game.gameStatus}</p> {/* e.g., LIVE, FINAL, UPCOMING */}
      {/* ... (More game details) ... */}
    </div>
  );
}

export default function GamesPage() {
  const [liveScores, setLiveScores] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loadingLiveScores, setLoadingLiveScores] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const liveScoresResponse = await axios.get('/api/games/live');
        setLiveScores(liveScoresResponse.data);
        setLoadingLiveScores(false);

        const scheduleResponse = await axios.get('/api/games/schedule');
        setSchedule(scheduleResponse.data);
        setLoadingSchedule(false);

      } catch (err) {
        setError(err.message || 'Failed to fetch game data.');
        setLoadingLiveScores(false);
        setLoadingSchedule(false);
      }
    };

    fetchGameData();
    const intervalId = setInterval(fetchGameData, 60000); // Update live scores every minute

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>NBA Game Scores & Schedules</h1>

      <h2>Live Scores</h2>
      {loadingLiveScores ? <p>Loading live scores...</p> : (
        liveScores.length > 0 ? (
          liveScores.map(game => <GameScoreCard key={game.gameId} game={game} />)
        ) : (
          <p>No live games currently.</p>
        )
      )}

      <h2>Upcoming Games</h2>
      {loadingSchedule ? <p>Loading schedule...</p> : (
        schedule.length > 0 ? (
          <ul>
            {schedule.map(game => (
              <li key={game.gameId}>
                {game.gameDate} - {game.homeTeamName} vs {game.awayTeamName} ({game.gameTime})
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming games scheduled.</p>
        )
      )}
    </div>
  );
}
```

**Backend (Express.js) - `/api/games/live.js` (Example API Endpoint for Live Scores - simplified):**

```javascript
// backend/pages/api/games/live.js (or similar API route)
// Example - Placeholder - Replace with actual NBA API integration and caching

export default async function handler(req, res) {
  try {
    // ... (Check cache for live scores - if implemented) ...

    // ... (Fetch live game scores from NBA Official API) ...
    // ... (Example - Placeholder - Replace with actual NBA API call) ...
    const nbaApiLiveScoresResponse = { // Placeholder NBA API response
      games: [
        { gameId: '123', homeTeamName: 'Los Angeles Lakers', awayTeamName: 'Boston Celtics', homeTeamScore: 65, awayTeamScore: 60, gameStatus: 'LIVE - Q3' },
        { gameId: '456', homeTeamName: 'Golden State Warriors', awayTeamName: 'Phoenix Suns', homeTeamScore: 102, awayTeamScore: 98, gameStatus: 'FINAL' },
        // ... more live/recent games ...
      ]
    };

    const liveGames = nbaApiLiveScoresResponse.games; // Assume games are in 'games' array

    // ... (Cache live scores - if implemented) ...

    res.status(200).json(liveGames);

  } catch (error) {
    console.error('Error processing live scores request:', error);
    res.status(500).json({ error: 'Failed to fetch live game scores' });
  }
}
```

**Backend (Express.js) - `/api/games/schedule.js` (Example API Endpoint for Game Schedule - simplified):**

```javascript
// backend/pages/api/games/schedule.js (or similar API route)
// Example - Placeholder - Replace with actual NBA API integration and caching

export default async function handler(req, res) {
  try {
    // ... (Check cache for game schedule - if implemented) ...

    // ... (Fetch game schedule from NBA Official API) ...
    // ... (Example - Placeholder - Replace with actual NBA API call) ...
    const nbaApiScheduleResponse = { // Placeholder NBA API response
      scheduledGames: [
        { gameId: '789', gameDate: '2024-03-16', gameTime: '7:30 PM PST', homeTeamName: 'Miami Heat', awayTeamName: 'Denver Nuggets' },
        { gameId: '901', gameDate: '2024-03-17', gameTime: '8:00 PM EST', homeTeamName: 'Milwaukee Bucks', awayTeamName: 'Philadelphia 76ers' },
        // ... more upcoming games ...
      ]
    };

    const gameSchedule = nbaApiScheduleResponse.scheduledGames; // Assume schedule in 'scheduledGames' array

    // ... (Cache game schedule - if implemented) ...

    res.status(200).json(gameSchedule);

  } catch (error) {
    console.error('Error processing game schedule request:', error);
    res.status(500).json({ error: 'Failed to fetch game schedule' });
  }
}
```

**Testing:**

*   Test live score display:
    *   Verify that live scores are displayed and updated periodically.
    *   Check accuracy of scores against official NBA sources.
    *   Test loading state and error handling for live score fetching.
*   Test game schedule display:
    *   Verify that upcoming game schedules are displayed correctly.
    *   Test navigating to different dates in the schedule (if date filtering/navigation is implemented).
    *   Test loading state and error handling for schedule fetching.
*   Test caching: Verify that caching is working for both live scores and schedules, with appropriate cache durations.
*   (If filtering is implemented) Test filtering games by date, team, or conference.

By completing these steps, you will have implemented the Game Scores & Schedules module for your NBA Player Data Web Application.