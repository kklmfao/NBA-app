## General Instructions for AI Agent - NBA Player Data Web App Development

**Project Overview:**

This project is to develop an NBA Player Data Web Application using the tech stack and features outlined in `brainstorm.md`.  The application will allow users to search for NBA players, view their stats, compare players, manage favorite players/teams, view game scores and schedules, and access premium features through a subscription model.

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`
*   **Backend:** Node.js, Express.js, In-memory Caching
*   **Database:** Supabase (PostgreSQL, Auth, Storage)
*   **Payment:** Stripe
*   **NBA Data API:** NBA Official API (stats.nba.com)

**AI Agent Behavior and Coding Practices:**

1.  **Understand the Brainstorming Document (`brainstorm.md`):**  Thoroughly read and understand the `brainstorm.md` file. It contains the detailed system design, features, and tech stack for this application. Refer to it frequently throughout development.

2.  **Modular Development:** Develop the application in modules, as outlined in the separate module instruction markdown files. Focus on completing one module before moving to the next, unless dependencies require otherwise.

3.  **Code Clarity and Readability:**
    *   Write clean, well-commented code.
    *   Use meaningful variable and function names.
    *   Follow consistent code formatting (e.g., using Prettier for JavaScript/TypeScript).
    *   Break down complex functions into smaller, more manageable units.

4.  **Error Handling:** Implement robust error handling in both frontend and backend.
    *   Handle API request failures gracefully.
    *   Catch database errors and provide informative error messages.
    *   Handle payment processing errors appropriately.

5.  **Security Best Practices:**
    *   Follow security best practices for web application development.
    *   Use HTTPS for all communication.
    *   Sanitize user inputs to prevent injection vulnerabilities.
    *   Securely store and manage API keys and sensitive information (e.g., using environment variables and not committing them to version control).
    *   Be mindful of CORS issues when interacting with external APIs.

6.  **Performance Optimization:**
    *   Implement caching where appropriate (as outlined in `brainstorm.md`) to reduce API calls and improve response times.
    *   Optimize database queries for efficiency.
    *   Optimize frontend code for performance (e.g., efficient rendering in React/Next.js).

7.  **Testing:**
    *   Implement basic testing for each module as you develop it.
    *   Focus on testing API endpoints, database interactions, and core functionality.
    *   More comprehensive testing can be added later, but ensure basic functionality is working correctly throughout development.

8.  **Version Control (Git):**
    *   Use Git for version control.
    *   Commit code changes regularly with clear and descriptive commit messages.
    *   Use branches for feature development and bug fixes to keep the main branch stable.

9.  **API Interaction (NBA Official API):**
    *   Be aware that the NBA Official API (`stats.nba.com`) is unofficial and may have limitations or changes.
    *   Inspect network requests on `stats.nba.com` to understand API endpoints and parameters.
    *   Implement caching aggressively to minimize API calls and respect potential rate limits.
    *   Implement error handling for API requests and consider fallback strategies if the API becomes unreliable.

10. **Supabase Integration:**
    *   Utilize Supabase for database, authentication, and storage as outlined in `brainstorm.md`.
    *   Use the `supabase-js` client library for frontend interactions with Supabase.
    *   Use the Supabase Admin SDK in the backend if needed for advanced user management or database operations.

11. **Stripe Integration:**
    *   Use Stripe for payment processing as outlined in `brainstorm.md`.
    *   Implement Stripe Checkout for a streamlined payment flow initially.
    *   **Crucially implement Stripe Webhooks** to handle payment events and update subscription statuses in the database.

12. **Shadcn UI Components:**
    *   Utilize Shadcn UI components for building the frontend UI.
    *   Customize and extend Shadcn UI components as needed to meet the design requirements.

13. **In-Memory Caching (Backend):**
    *   Start with in-memory caching in Node.js for simplicity.
    *   If performance or rate limits become an issue, consider upgrading to Redis for a more robust caching solution.

14. **Communication:** If you encounter any ambiguities, errors, or require clarification, please ask for further instructions or details.

By following these general instructions and the specific instructions for each module, you will be able to successfully develop the NBA Player Data Web Application.