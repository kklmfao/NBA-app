## Module Instructions: A. User Authentication

**Module:** User Authentication (Feature A from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `supabase-js`
*   **Backend:** Node.js, Express.js (minimal initially)
*   **Database:** Supabase (PostgreSQL, Auth)

**Goal:** Implement user registration, login, logout, and password reset functionality using Supabase Auth.

**Detailed Steps:**

1.  **Supabase Setup:**
    *   Ensure Supabase project is set up and the PostgreSQL database is initialized.
    *   Enable and configure the Authentication service in your Supabase project dashboard. Choose Email/Password as the primary signup method initially. Social logins can be added later if desired.
    *   Obtain your Supabase project URL and API keys. Store these securely as environment variables in your Next.js frontend and Express.js backend.

2.  **Frontend (Next.js) Implementation:**
    *   **Install `supabase-js`:**  `npm install @supabase/supabase-js` or `yarn add @supabase/supabase-js`
    *   **Initialize Supabase Client:** Create a Supabase client instance in your Next.js application (e.g., in `_app.js` or a dedicated utility file) using your Supabase project URL and API key.
    *   **Create Authentication Forms (Shadcn UI):**
        *   **Signup Form:** Create a form using Shadcn UI components for user registration (email and password input fields, submit button).
        *   **Login Form:** Create a form using Shadcn UI components for user login (email and password input fields, submit button).
        *   **Logout Button/Link:** Create a button or link to trigger user logout.
        *   **Password Reset Form (Optional for initial implementation, can be added later):** Create a form for password reset requests (email input field, submit button).
    *   **Implement Authentication Logic:**
        *   **Signup:** On signup form submission, use the `supabase.auth.signUp()` method from `supabase-js` to register a new user. Handle success and error responses. Display appropriate messages to the user.
        *   **Login:** On login form submission, use the `supabase.auth.signInWithPassword()` method from `supabase-js` to log in an existing user. Handle success and error responses. Redirect the user to the dashboard page upon successful login.
        *   **Logout:** On logout button click, use the `supabase.auth.signOut()` method from `supabase-js` to log the user out. Redirect the user to the homepage or login page.
        *   **Session Management:** Supabase Auth handles session management automatically. Use `supabase.auth.getSession()` or `supabase.auth.onAuthStateChange()` to check user session status and conditionally render UI elements based on authentication state (e.g., display dashboard only for logged-in users).
        *   **Password Reset (If implementing):** Use `supabase.auth.resetPasswordForEmail()` to initiate the password reset process. Follow Supabase documentation for handling password reset confirmation and updates.
    *   **Route Protection (Middleware/Guards):** Implement route protection to ensure that certain pages (e.g., dashboard, settings) are only accessible to logged-in users. You can use Next.js middleware or React Context and conditional rendering for this.

3.  **Backend (Express.js) - Minimal Initial Setup:**
    *   For basic email/password authentication, minimal backend code is needed initially as Supabase Auth handles most of the logic client-side.
    *   You might need a backend API endpoint later if you want to implement more complex user roles, permissions, or custom logic related to authentication, or if you want to use the Supabase Admin SDK for server-side operations related to users.  For now, focus on client-side authentication with `supabase-js`.

4.  **Database (Supabase):**
    *   Supabase Auth automatically manages the `auth.users` table and related tables. You don't need to manually create these tables.
    *   You can view and manage users in the Supabase project dashboard under the "Authentication" section.

**Requirements & Considerations (from `brainstorm.md`):**

*   Use Supabase Auth for user authentication.
*   Implement user registration (email/password).
*   Implement user login and logout.
*   Session management should be handled by Supabase Auth.
*   Password reset functionality is desirable but can be added in a later iteration if time is limited initially.
*   Use Shadcn UI components for authentication forms to maintain a consistent UI style.

**Testing:**

*   Test user registration, login, and logout functionality thoroughly.
*   Verify that session management is working correctly (user stays logged in after login, session is cleared after logout).
*   Test error handling for invalid login credentials or signup attempts.
  
**Example Code Snippets:**

**Frontend (Next.js) - `_app.js` (Supabase Client Initialization):**

```javascript
// _app.js or a dedicated utility file

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Frontend (Next.js) - `pages/auth/signup.js` (Signup Form Example):**

```javascript
import { useState } from 'react';
import { supabase } from '../../_app'; // Import your Supabase client

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`Signup failed: ${error.message}`);
    } else {
      setMessage('Signup successful! Check your email to confirm your account.');
      setEmail('');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Signup</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
}
```

**Frontend (Next.js) - `pages/auth/login.js` (Login Form Example - similar structure to Signup):**

```javascript
// pages/auth/login.js (Login Form - similar structure to Signup)
import { useState } from 'react';
import { supabase } from '../../_app';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Login failed: ${error.message}`);
    } else {
      router.push('/dashboard'); // Redirect to dashboard on successful login
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Login</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```  

By completing these steps, you will have implemented the User Authentication module for your NBA Player Data Web Application.