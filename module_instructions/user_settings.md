## Module Instructions: D. User Settings

**Module:** User Settings (Feature D from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`, `supabase-js`
*   **Backend:** Node.js, Express.js
*   **Database:** Supabase (PostgreSQL, Auth)
*   **Payment:** Stripe (for subscription management links)

**Goal:** Implement a user settings page where users can manage their profile, preferences, and subscription.

**Detailed Steps:**

1.  **Database (Supabase) Setup:**
    *   **`user_profiles` Table:** Create a table named `user_profiles` in your Supabase database to store user profile information and preferences beyond the basic authentication details managed by Supabase Auth.  The table should have at least the following columns:
        *   `id` (UUID, primary key, foreign key referencing `auth.users.id` - one-to-one relationship with users table)
        *   `full_name` (Text, optional)
        *   `preferred_team_id` (Integer, optional, storing NBA team ID - you might need a separate `teams` table or just store team IDs from NBA API)
        *   `data_display_settings` (JSONB or Text, to store various display preferences as key-value pairs, e.g., preferred stats to display, theme preference, etc.)
        *   `created_at` (Timestamp)
        *   `updated_at` (Timestamp)
    *   **Foreign Key Relationship:** Establish a one-to-one foreign key relationship between `user_profiles.id` and `auth.users.id`. When a new user is created via Supabase Auth, you should also create a corresponding entry in the `user_profiles` table.

2.  **Frontend (Next.js) - `/settings` Page:**
    *   **Create `/settings` Page:** Create a new page component in your `pages` directory (e.g., `pages/settings.js` or `pages/settings/index.js`).
    *   **Route Protection:** Ensure this page is protected and only accessible to logged-in users (using authentication logic from Module A).
    *   **Settings Form (Shadcn UI):** Create a form using Shadcn UI components to display and allow users to update their settings.  Sections within the settings page could include:
        *   **Profile Information:**
            *   Display current user's email (read-only from Supabase Auth).
            *   Input field for "Full Name" (linked to `user_profiles.full_name`).
        *   **Preferences:**
            *   Dropdown or select component for "Preferred Team" (linked to `user_profiles.preferred_team_id`). You might need to fetch a list of NBA teams from the NBA API or store team data in your database for this.
            *   UI elements (checkboxes, toggles, dropdowns) for "Data Display Settings" (linked to `user_profiles.data_display_settings`). Define specific display settings users can customize (e.g., default stats to show on player cards, data visualization preferences).
        *   **Subscription Management:**
            *   Display current subscription plan and status (fetched from backend API which reads from `subscriptions` table).
            *   **"Manage Subscription" Button:**  This button can either:
                *   Link to the Stripe Customer Portal (simplest approach initially). You can generate a Customer Portal link from your backend using the Stripe Customer ID and redirect the user to it.
                *   Implement custom subscription management features within your app (more complex, can be added later). For now, linking to the Stripe Customer Portal is recommended.
        *   **Change Password:**
            *   Provide a link or button that redirects the user to the Supabase password reset flow. You can trigger password reset via email using `supabase.auth.resetPasswordForEmail()`, or link to the Supabase-hosted password reset page if available.

    *   **Data Fetching (Frontend):**
        *   **Initial Settings Data:** When the `/settings` page loads, fetch the user's current profile data from your backend API endpoint (`/api/settings`).
        *   **Team List (for "Preferred Team" dropdown):** Fetch a list of NBA teams from your backend API (which in turn can fetch from NBA API or a local data source).
    *   **Form Submission and Update Logic:**
        *   When the user submits the settings form:
            *   Collect the updated values from the form fields.
            *   Make an API request to your backend endpoint (`/api/settings`) using `PUT` or `PATCH` method, sending the updated settings data in the request body.
            *   Handle success and error responses from the backend. Display appropriate messages to the user.
            *   Potentially refresh the settings data on the page after successful update.

3.  **Backend (Express.js) API Endpoints:**
    *   **`GET /api/settings`:**
        *   **Authentication:** Ensure only authenticated users can access this endpoint.
        *   **Data Retrieval:**
            *   Fetch the user's profile data from the `user_profiles` table in Supabase using the user ID from the authenticated session.
            *   Return the user profile data in the API response.
    *   **`PUT/PATCH /api/settings`:**
        *   **Authentication:** Ensure only authenticated users can access this endpoint.
        *   **Data Validation:** Validate the incoming settings data from the frontend.
        *   **Data Update:**
            *   Update the corresponding row in the `user_profiles` table in Supabase with the new settings data.
            *   Return a success or error response to the frontend.
    *   **`GET /api/teams`:** (For "Preferred Team" dropdown)
        *   **Data Source:** Determine the source of NBA team data. You can either:
            *   Fetch team data from the NBA Official API (if available and efficient).
            *   Create a static JSON file with team data in your backend project.
            *   Store team data in a `teams` table in your Supabase database (if you need to manage team data more dynamically).
        *   **Data Retrieval:** Fetch team data from the chosen source.
        *   **Data Processing & Return:** Return a list of NBA team objects (with team ID and team name at least) to the frontend.
    *   **`GET /api/stripe-customer-portal-url` (for "Manage Subscription" button - if using Stripe Customer Portal link):**
        *   **Authentication:** Ensure only authenticated users can access this endpoint.
        *   **Stripe Customer Portal Link Generation:**
            *   Retrieve the Stripe Customer ID for the current user (you might need to store the Stripe Customer ID in your `auth.users` table or `user_profiles` table and fetch it).
            *   Use the Stripe Node.js library to create a Customer Portal Session using `stripe.billingPortal.sessions.create()`.
            *   Return the `url` from the created Customer Portal Session in the API response.

4.  **Database (Supabase) - `user_profiles` Table (Details):**
    *   **`id` (UUID, primary key, foreign key referencing `auth.users.id`):**  Important: When a new user signs up via Supabase Auth, you need to create a corresponding entry in the `user_profiles` table with the same `id` as the `auth.users.id`.  You can use Supabase database triggers or backend logic to automatically create this `user_profiles` record when a new user is created in `auth.users`.
    *   **`preferred_team_id` (Integer):**  Store the NBA team ID as an integer. You'll need to define how you are mapping NBA team names to IDs.
    *   **`data_display_settings` (JSONB or Text):** JSONB is recommended for storing structured settings data. Example JSON structure:
        ```json
        {
          "defaultStats": ["PPG", "RPG", "APG"],
          "theme": "dark",
          "showTooltips": true
        }
        ```

**Requirements & Considerations (from `brainstorm.md`):**

*   Create a `/settings` page.
*   Allow users to update profile information (name, email - email changes might be handled by Supabase Auth directly).
*   Allow users to change password (handled by Supabase Auth or backend using Supabase Admin SDK - link to Supabase password reset flow is simpler initially).
*   Implement subscription management (view plan, upgrade/downgrade, cancel - link to Stripe Customer Portal initially).
*   Implement preferences (e.g., preferred team, data display settings - store these in `user_profiles` table).
*   Use Shadcn UI forms for settings.

**Example Code Snippets:**

**Frontend (Next.js) - `pages/settings/index.js` (Settings Form Example):**

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../../_app';
import axios from 'axios';

export default function SettingsPage() {
  const [fullName, setFullName] = useState('');
  const [preferredTeam, setPreferredTeam] = useState('');
  const [teams, setTeams] = useState([]); // For dropdown options
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSettingsAndTeams = async () => {
      setLoading(true);
      try {
        const settingsResponse = await axios.get('/api/settings');
        setFullName(settingsResponse.data.fullName || '');
        setPreferredTeam(settingsResponse.data.preferredTeamId || '');

        const teamsResponse = await axios.get('/api/teams'); // Fetch team list
        setTeams(teamsResponse.data);

      } catch (error) {
        setMessage(`Error loading settings: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSettingsAndTeams();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await axios.put('/api/settings', {
        fullName,
        preferredTeamId: preferredTeam,
      });
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage(`Error saving settings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>User Settings</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSaveSettings}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="preferredTeam">Preferred Team:</label>
          <select
            id="preferredTeam"
            value={preferredTeam}
            onChange={(e) => setPreferredTeam(e.target.value)}
          >
            <option value="">Select a Team</option>
            {teams.map(team => (
              <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        {/* ... (Subscription Management Link/Button) ... */}
      </form>
    </div>
  );
}
```

**Backend (Express.js) - `/api/settings.js` (Example API Endpoint for Updating Settings):**

```javascript
// backend/pages/api/settings.js (or similar API route)
import { supabaseAdmin } from '../../utils/supabase-admin';

export default async function handler(req, res) {
  // ... (Authentication check) ...

  if (req.method === 'GET') {
    try {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return res.status(500).json({ error: 'Failed to fetch user profile' });
      }

      res.status(200).json(profileData || {}); // Return empty object if no profile yet

    } catch (error) {
      console.error('Error processing GET settings request:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }

  } else if (req.method === 'PUT' || req.method === 'PATCH') { // Example for PUT/PATCH
    const { fullName, preferredTeamId } = req.body;

    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .upsert({ // Use upsert to create if not exists, update if exists
          id: req.user.id, // Assuming user ID is available from auth middleware
          full_name: fullName,
          preferred_team_id: preferredTeamId,
        }, { onConflict: ['id'] }); // Specify conflict target for upsert

      if (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ error: 'Failed to update user profile' });
      }

      res.status(200).json({ message: 'Profile updated successfully' });

    } catch (error) {
      console.error('Error processing PUT/PATCH settings request:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

**Testing:**

*   Test that the settings page is only accessible to logged-in users.
*   Test fetching and displaying user settings data on the page.
*   Test updating user settings (full name, preferred team, data display settings). Verify that changes are saved correctly in the `user_profiles` table.
*   Test linking to the Stripe Customer Portal (if implemented).
*   Test the overall form submission and error handling in the settings page.

By completing these steps, you will have implemented the User Settings module for your NBA Player Data Web Application.