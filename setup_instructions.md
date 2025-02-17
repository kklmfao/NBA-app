## Setup Instructions for NBA Player Data Web App Development

This guide will walk you through setting up your development environment for the NBA Player Data Web Application project. Please follow these steps to ensure you have all the necessary tools and configurations in place.

**1. Prerequisites:**

Before you begin, ensure you have the following software installed on your machine:

*   **Node.js and npm (or yarn):**  You'll need Node.js and npm (Node Package Manager) or yarn to run both the frontend and backend. Download and install the latest LTS version of Node.js from [https://nodejs.org/](https://nodejs.org/). npm usually comes bundled with Node.js. Alternatively, you can install yarn from [https://yarnpkg.com/](https://yarnpkg.com/).
*   **Git:** Git is required for version control and cloning the project repository. Install Git from [https://git-scm.com/](https://git-scm.com/).

**2. Project Setup:**

1.  **Clone the Repository:**
    *   Open your terminal or command prompt.
    *   Navigate to the directory where you want to store your project.
    *   Clone the project repository using Git:
        ```bash
        git clone <your-repository-url>
        cd <your-project-directory>
        ```
        Replace `<your-repository-url>` with the actual URL of your project repository.
        Replace `<your-project-directory>` with the directory name of your project.

2.  **Install Dependencies:**
    *   Navigate to both the `frontend` and `backend` directories within your project in the terminal.
    *   For both directories, run the following command to install the required npm packages:
        ```bash
        npm install
        ```
        or if you are using yarn:
        ```bash
        yarn install
        ```

**3. Environment Variables Setup:**

You need to configure environment variables for both the frontend (Next.js) and backend (Express.js) applications. Create `.env.local` files in both `frontend` and `backend` directories and add the following variables based on your setup:

*   **Frontend (`frontend/.env.local`):**
    ```env
    NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
    NEXT_PUBLIC_APP_URL=http://localhost:3000 # Or your frontend development URL
    ```
    Replace `<your_supabase_project_url>` and `<your_supabase_anon_key>` with your Supabase project credentials (see Supabase Setup section below).
    `NEXT_PUBLIC_APP_URL` should be set to the URL where your frontend application will be running during development (usually `http://localhost:3000` for Next.js dev server).

*   **Backend (`backend/.env.local`):**
    ```env
    SUPABASE_URL=<your_supabase_project_url>
    SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key> # For Supabase Admin SDK if used
    STRIPE_SECRET_KEY=<your_stripe_secret_key>
    STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_signing_secret>
    PORT=3001 # Optional: Backend port, defaults to 3001 if not set
    ```
    Replace `<your_supabase_project_url>`, `<your_supabase_service_role_key>`, `<your_stripe_secret_key>`, and `<your_stripe_webhook_signing_secret>` with your respective credentials (see Supabase and Stripe Setup sections below).
    `PORT` is optional, if you want your backend to run on a different port than the default 3001.

    **Important:** **Never commit `.env.local` files to version control.** These files contain sensitive API keys and secrets. They are usually added to `.gitignore`.

**4. Supabase Setup:**

1.  **Create a Supabase Project:**
    *   Go to [https://supabase.com/](https://supabase.com/) and sign up or log in.
    *   Create a new Supabase project. Choose a project name, database password, and region.
    *   Once your project is created, navigate to your project dashboard.

2.  **Get Supabase Credentials:**
    *   In your Supabase project dashboard, go to **Settings** -> **API**.
    *   Find your **Project URL** and **anon public key**. These are needed for your frontend and backend `.env.local` files. Copy these values and paste them into your `.env.local` files as `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (in `frontend/.env.local`) and `SUPABASE_URL` (in `backend/.env.local`).
    *   For backend operations requiring admin privileges (like using Supabase Admin SDK), you'll need the **service_role secret key**. Find this in the same **Settings** -> **API** section. Copy this value and paste it as `SUPABASE_SERVICE_ROLE_KEY` in your `backend/.env.local` file.

3.  **Enable Authentication:**
    *   In your Supabase project dashboard, go to **Authentication** -> **Providers**.
    *   Ensure the **Email/Password** provider is enabled. You can enable other providers (like Google, GitHub) later if needed.

4.  **Database Tables Setup:**
    *   In your Supabase project dashboard, go to **Database** -> **Table Editor**.
    *   Create the following tables with the specified columns and relationships. You can use the Supabase UI or SQL editor.

        *   **`subscriptions` Table:**
            | Column Name          | Data Type | Primary Key | Foreign Key | Notes                                  |
            | :------------------- | :-------- | :---------- | :---------- | :------------------------------------- |
            | `id`                 | UUID      | Yes         |             | Auto-generated UUID, Primary Key       |
            | `user_id`            | UUID      | No          | `auth.users`| Foreign Key to `auth.users.id`         |
            | `stripe_customer_id` | Text      | No          |             | Stripe Customer ID                       |
            | `stripe_subscription_id`| Text      | No          |             | Stripe Subscription ID                 |
            | `plan_type`          | Text      | No          |             | Subscription plan type (e.g., premium) |
            | `status`             | Text      | No          |             | Subscription status (e.g., active)      |
            | `created_at`         | Timestamp | No          |             |                                        |
            | `updated_at`         | Timestamp | No          |             |                                        |

        *   **`user_profiles` Table:**
            | Column Name             | Data Type | Primary Key | Foreign Key | Notes                                              |
            | :---------------------- | :-------- | :---------- | :---------- | :------------------------------------------------- |
            | `id`                    | UUID      | Yes         | `auth.users`| Foreign Key to `auth.users.id`, One-to-one relation |
            | `full_name`             | Text      | No          |             | User's full name                                   |
            | `preferred_team_id`     | Integer   | No          |             | NBA Team ID                                        |
            | `data_display_settings` | JSONB     | No          |             | JSON for user preferences                            |
            | `created_at`            | Timestamp | No          |             |                                                    |
            | `updated_at`            | Timestamp | No          |             |                                                    |

        *   **`favorite_players` Table:**
            | Column Name | Data Type | Primary Key | Foreign Key | Notes                               |
            | :---------- | :-------- | :---------- | :---------- | :---------------------------------- |
            | `id`        | UUID      | Yes         |             | Auto-generated UUID, Primary Key    |
            | `user_id`   | UUID      | No          | `auth.users`| Foreign Key to `auth.users.id`      |
            | `player_id` | Integer   | No          |             | NBA Player ID                         |
            | `created_at`| Timestamp | No          |             |                                     |
            *   Consider adding a **Unique Constraint** on `user_id` and `player_id` to prevent duplicate favorites.

        *   **`favorite_teams` Table (Optional):**
            | Column Name | Data Type | Primary Key | Foreign Key | Notes                               |
            | :---------- | :-------- | :---------- | :---------- | :---------------------------------- |
            | `id`        | UUID      | Yes         |             | Auto-generated UUID, Primary Key    |
            | `user_id`   | UUID      | No          | `auth.users`| Foreign Key to `auth.users.id`      |
            | `team_id`   | Integer   | No          |             | NBA Team ID                           |
            | `created_at`| Timestamp | No          |             |                                     |
            *   Consider adding a **Unique Constraint** on `user_id` and `team_id` to prevent duplicate favorites.

        *   **`user_search_history` Table (Optional):**
            | Column Name    | Data Type | Primary Key | Foreign Key | Notes                               |
            | :------------- | :-------- | :---------- | :---------- | :---------------------------------- |
            | `id`           | UUID      | Yes         |             | Auto-generated UUID, Primary Key    |
            | `user_id`      | UUID      | No          | `auth.users`| Foreign Key to `auth.users.id`      |
            | `search_query` | Text      | No          |             | Player search query                  |
            | `timestamp`    | Timestamp | No          |             |                                     |

**5. Stripe Setup:**

1.  **Create a Stripe Account:**
    *   Go to [https://stripe.com/](https://stripe.com/) and sign up for a Stripe account or log in if you already have one.
    *   Activate your account and switch to **Test Mode** for development. You'll use **Live Mode** when you're ready to deploy to production.

2.  **Define Subscription Plans:**
    *   In your Stripe dashboard, go to **Products** -> **Products**.
    *   Create your subscription plans (e.g., Free, Premium, Pro) by clicking **+ Add product**.
    *   For each plan, define the name, pricing, billing frequency (e.g., monthly, yearly), and features.
    *   **Note down the Price IDs** for each plan. You'll need these Price IDs in your backend code to create Checkout Sessions.

3.  **Get Stripe API Keys:**
    *   In your Stripe dashboard, go to **Developers** -> **API keys**.
    *   Find your **Secret key** and **Publishable key** (for Test Mode initially).
    *   Copy the **Secret key** and paste it as `STRIPE_SECRET_KEY` in your `backend/.env.local` file.

4.  **Configure Webhook Endpoint:**
    *   In your Stripe dashboard, go to **Developers** -> **Webhooks**.
    *   Click **+ Add endpoint**.
    *   **Endpoint URL:** Enter the URL for your backend webhook endpoint. For local development, you can use a tool like `ngrok` to expose your local backend to the internet temporarily.  For example: `https://<your-ngrok-url>/api/stripe-webhook`.  Remember to replace `<your-ngrok-url>` with your actual ngrok URL.  In production, this will be your actual backend API endpoint URL.
    *   **Events to send:** Select the following events to be sent to your webhook endpoint:
        *   `checkout.session.completed`
        *   `customer.subscription.updated`
        *   `customer.subscription.deleted`
    *   Click **Add endpoint**.
    *   After creating the endpoint, click on it to reveal the **Signing secret**. Copy this **Signing secret** and paste it as `STRIPE_WEBHOOK_SECRET` in your `backend/.env.local` file.

**6. NBA API Setup (stats.nba.com):**

*   **No API Key Required (Unofficial API):** The `stats.nba.com` API is generally accessible without API keys. However, it's an unofficial API, so be mindful of usage and potential changes.
*   **Explore API:** Use your browser's developer tools (Network tab) while browsing `stats.nba.com` to understand the API endpoints and data structures. Refer to the Module Instructions for specific API endpoint explorations.
*   **Rate Limits:** Be aware of potential rate limits on the `stats.nba.com` API. Implement caching aggressively in your backend to minimize API calls and avoid hitting rate limits.

**7. Backend Setup & Run:**

1.  **Navigate to Backend Directory:** Open your terminal and navigate to the `backend` directory.
2.  **Start the Backend Server:** Run the following command to start the backend server:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```
    This will start the Express.js backend server, usually on `http://localhost:3001` (or the port specified in your `.env.local` file).

**8. Frontend Setup & Run:**

1.  **Navigate to Frontend Directory:** Open a **new** terminal window (keep the backend running in the other window) and navigate to the `frontend` directory.
2.  **Start the Frontend Development Server:** Run the following command to start the Next.js development server:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```
    This will start the Next.js frontend application, usually accessible at `http://localhost:3000`.

**9. Access the Application:**

*   Open your web browser and go to `http://localhost:3000`. You should see your NBA Player Data Web Application running.

**10. Stripe Webhook Testing (Local):**

*   **Use Stripe CLI (Recommended):** The easiest way to test webhooks locally is using the Stripe CLI (Command Line Interface). If you haven't installed it, follow the instructions here: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli).
*   **Forward Events to Localhost:** Use the Stripe CLI to forward webhook events to your local backend webhook endpoint:
    ```bash
    stripe listen --forward-to localhost:3001/api/stripe-webhook
    ```
    Replace `localhost:3001/api/stripe-webhook` with your actual backend webhook endpoint URL if you changed the port or API route.
    *   The Stripe CLI will provide you with a webhook signing secret. **Make sure this signing secret matches the `STRIPE_WEBHOOK_SECRET` in your `backend/.env.local` file.**
*   **Trigger Events in Stripe Dashboard:** In your Stripe Test Dashboard, you can trigger webhook events manually (e.g., by creating a test subscription, completing a checkout session in test mode). The Stripe CLI will forward these events to your local backend webhook endpoint, allowing you to test your webhook handling logic.

**Congratulations!** You have now successfully set up your development environment for the NBA Player Data Web Application. You can start developing the features and functionalities as outlined in the module instructions. Remember to refer to the individual module instruction markdown files for detailed steps on implementing each feature.
