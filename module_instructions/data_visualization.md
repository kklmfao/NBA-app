## Module Instructions: H. Data Visualization

**Module:** Data Visualization (Feature H from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`, Chart.js or Recharts (or Nivo)

**Goal:** Enhance the presentation of player and team statistics with visual charts and graphs.

**Detailed Steps:**

1.  **Choose a Charting Library (Frontend):**
    *   Select a React charting library. Good options include:
        *   **Chart.js:** Popular, versatile, and well-documented.
        *   **Recharts:** React-specific, composable, good for data-driven charts.
        *   **Nivo:** Rich set of data visualization components, server-side rendering support.
    *   Install the chosen charting library: `npm install chart.js react-chartjs-2` or `npm install recharts` or `npm install @nivo/core @nivo/bar @nivo/line` (depending on library and chart types you plan to use).

2.  **Implement Data Visualizations in Player Detail Page (Module E):**
    *   **Identify Stats for Visualization:** Decide which player statistics are suitable for visualization. Examples from `brainstorm.md`:
        *   Points Per Game trend over time (line chart).
        *   Shooting percentages (pie chart).
        *   Bar charts comparing stats of multiple players (in Player Comparison - Module F).
    *   **Chart Components:** Create React components for each type of chart you want to display (e.g., `LineChartComponent.js`, `PieChartComponent.js`, `BarChartComponent.js`).
    *   **Data Preparation (Frontend):**
        *   In the player detail page (`pages/players/[playerId].js`), when you fetch player data from the backend API (`/api/players/{playerId}`), process and transform the data into the format required by your chosen charting library.
        *   Example: For a line chart of PPG trend, you might need to extract historical game data (if available from the NBA API) and format it as an array of data points with dates and PPG values.
        *   Pass the prepared data to your chart components as props.
    *   **Integrate Chart Components into Player Detail Page:**
        *   In the player detail page layout, add your chart components to display visualizations.
        *   Position charts appropriately within the page (e.g., below statistic tables, in separate tabs, or in a dedicated "Visualizations" section).
    *   **Chart Types (Examples):**
        *   **Line Chart (PPG Trend):** If the NBA API provides historical game-by-game stats, use a line chart to show a player's PPG trend over a season or career. X-axis: Date/Game number, Y-axis: PPG.
        *   **Pie Chart (Shooting Percentages):** Use pie charts to visualize FG%, 3P%, and FT%. Each pie chart would represent one percentage, with segments showing the made shots vs. missed shots (or percentage vs. remaining percentage).
        *   **Bar Chart (Stat Comparisons):** For Player Comparison (Module F), use bar charts to visually compare stats of multiple players side-by-side. Each bar chart would represent one statistic, with bars for each player showing their value for that stat.

3.  **Implement Data Visualizations in Player Comparison (Module F):**
    *   **Bar Charts for Comparison:** In the Player Comparison feature (Module F), use bar charts to visualize the stat comparisons. For each statistic being compared, create a bar chart where each bar represents a player and its height represents the player's value for that statistic.
    *   **Integrate Chart Components into Comparison Display:** Add your bar chart components to the player comparison display area, alongside or instead of the table view.
    *   **Toggle Between Table and Chart View (Optional):** Provide UI controls (e.g., tabs, buttons, toggles) to allow users to switch between viewing the data in a tabular format and in chart visualizations.

4.  **Backend (Express.js) - Data for Visualizations:**
    *   In most cases, the backend's primary role remains to fetch and provide the raw data from the NBA API.
    *   **Data Aggregation/Pre-processing (Optional):** For more complex visualizations or if the raw data from the NBA API is not directly suitable for charting, you might consider doing some data aggregation or pre-processing in your backend API endpoints. For example:
        *   If you want to show PPG trend over a season, your backend might fetch game-by-game stats and then calculate rolling averages or aggregate data points for easier charting.
        *   However, for initial implementation, try to minimize backend data processing and handle most data transformation in the frontend to keep the backend simpler.

**Requirements & Considerations (from `brainstorm.md`):**

*   Enhance player and team statistics with visual charts and graphs.
*   Examples: Line charts for trends, bar charts for comparisons, pie charts for percentages, heatmaps for shot charts (shot charts are more advanced, can be considered later).
*   Allow users to toggle between table view and chart view (optional initially, can be added later).
*   Choose a React charting library (Chart.js, Recharts, Nivo).

**Example Code Snippets:**

**Frontend (Next.js) - `components/BarChartComponent.js` (Example Bar Chart using Chart.js):**

```javascript
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChartComponent({ chartData, chartTitle }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
  };

  const data = {
    labels: chartData.labels, // e.g., player names
    datasets: chartData.datasets, // Array of datasets, each for a stat
  };

  return <Bar options={options} data={data} />;
}
```

**Frontend (Next.js) - Example Usage in Player Comparison Page (`pages/compare/index.js` - assuming `comparisonData` is fetched):**

```javascript
// ... (Import BarChartComponent) ...
import BarChartComponent from '../components/BarChartComponent';

export default function ComparePage() {
  // ... (useState, handleCompare, comparisonData fetch as in previous example) ...

  return (
    <div>
      {/* ... (Player selection UI) ... */}
      {/* ... (Table display - as in previous example) ... */}

      {comparisonData.length > 0 && (
        <div>
          <h2>Chart Visualization</h2>
          {comparisonData.map((stat, index) => {
            const chartDataset = {
              label: stat.statName,
              data: stat.playerValues,
              backgroundColor: 'rgba(54, 162, 235, 0.8)', // Example color
            };
            const chartLabels = playerIds; // Assuming playerIds is available
            const chartDataForStat = {
              labels: chartLabels,
              datasets: [chartDataset],
            };

            return (
              <div key={index} style={{ width: '400px', margin: '20px' }}> {/* Adjust width as needed */}
                <BarChartComponent chartData={chartDataForStat} chartTitle={stat.statName} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

**Testing:**

*   Test data visualization display in player detail pages and player comparison:
    *   Verify that charts are rendered correctly and are visually appealing.
    *   Verify that charts are displaying data accurately, matching the tabular data.
    *   Test different chart types (line, pie, bar charts).
    *   Test chart responsiveness and behavior on different screen sizes.
*   Test data preparation and transformation in the frontend to ensure data is correctly formatted for the charting library.
*   (If implementing toggle view) Test switching between table view and chart view and ensure both views display data correctly.

By completing these steps, you will have implemented the Data Visualization module to enhance the user experience of your NBA Player Data Web Application.