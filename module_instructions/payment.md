## Module Instructions: B. Payment (Stripe Integration)

**Module:** Payment (Feature B from `brainstorm.md`)

**Tech Stack:**

*   **Frontend:** Next.js, Shadcn UI, `axios`
*   **Backend:** Node.js, Express.js
*   **Payment Gateway:** Stripe
*   **Database:** Supabase (PostgreSQL)

**Goal:** Implement subscription plans and secure payment processing using Stripe.

**Detailed Steps:**

1.  **Stripe Setup:**
    *   Create a Stripe account (if you don't have one already) and log in to your Stripe dashboard.
    *   **Define Subscription Plans:** In your Stripe dashboard, create your subscription plans (e.g., Free, Premium, Pro). Define the features and pricing for each plan.  Note down the **Price IDs** for each plan, you will need these in your application.
    *   **API Keys:** Obtain your Stripe API keys (publishable key and secret key). Store these securely as environment variables.  The publishable key will be used in the frontend, and the secret key in the backend.
    *   **Webhook Endpoint:** In your Stripe dashboard, configure a webhook endpoint. This endpoint will be an API route in your Express.js backend that Stripe will call to send payment events.  Note down the webhook signing secret.

2.  **Database (Supabase) Setup:**
    *   **`subscriptions` Table:** Create a table in your Supabase database named `subscriptions` to store user subscription information.  The table should have at least the following columns:
        *   `id` (UUID, primary key, auto-generated)
        *   `user_id` (UUID, foreign key referencing `auth.users.id`)
        *   `stripe_customer_id` (Text, to store Stripe Customer ID)
        *   `stripe_subscription_id` (Text, to store Stripe Subscription ID)
        *   `plan_type` (Text, e.g., 'free', 'premium', 'pro', corresponding to your subscription plans)
        *   `status` (Text, e.g., 'active', 'trialing', 'canceled', 'incomplete', 'past_due')
        *   `created_at` (Timestamp)
        *   `updated_at` (Timestamp)
    *   **Foreign Key Relationship:**  Establish a foreign key relationship between `subscriptions.user_id` and `auth.users.id` to link subscriptions to users.

3.  **Backend (Express.js) Implementation:**
    *   **Install Stripe Node.js Library:** `npm install stripe` or `yarn add stripe`
    *   **Initialize Stripe:** In your backend, initialize the Stripe library using your Stripe secret key.
    *   **Create Checkout Session Endpoint:** Create an API endpoint (e.g., `/api/create-checkout-session`) that will be called from the frontend when a user wants to subscribe to a plan.
        *   This endpoint should:
            *   Receive the `priceId` (from the frontend, indicating the selected subscription plan) and `userId`.
            *   Use the Stripe Node.js library to create a Checkout Session using `stripe.checkout.sessions.create()`.
            *   Important parameters for `stripe.checkout.sessions.create()`:
                *   `line_items`: Array containing the selected price (using the `priceId`).
                *   `mode`: 'subscription'
                *   `success_url`: URL to redirect the user to after successful payment. This should be a page in your frontend application (e.g., `/subscription-success?session_id={CHECKOUT_SESSION_ID}`).
                *   `cancel_url`: URL to redirect the user to if they cancel the checkout process. This should be a page in your frontend application (e.g., `/subscription-cancel`).
                *   `customer`: (Optional initially, can be added later for existing customers) You might want to create a Stripe Customer object when a user signs up and store the `customerId` in your `users` table. For now, Stripe can create a new customer during checkout.
            *   Return the `url` from the created Checkout Session in the API response.
    *   **Implement Webhook Endpoint:** Create an API endpoint (e.g., `/api/stripe-webhook`) to handle Stripe webhook events.
        *   **Webhook Security:** Verify the webhook signature using the Stripe webhook signing secret to ensure that requests are genuinely from Stripe and not malicious actors.
        *   **Handle `checkout.session.completed` Event:**
            *   When Stripe sends a `checkout.session.completed` event:
                *   Extract the `customer_id` and `subscription_id` from the event data.
                *   Retrieve the associated user ID (you'll need a way to link the Stripe customer to your user, perhaps by storing the Stripe `customer_id` in your `auth.users` table or using metadata in the Checkout Session).
                *   Update the `subscriptions` table in your Supabase database:
                    *   Create a new row in the `subscriptions` table with the `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `plan_type` (based on the Price ID from the event or session), and set the `status` to 'active' or 'trialing' (depending on the plan setup).
        *   **Handle `customer.subscription.updated` Event:**
            *   When Stripe sends a `customer.subscription.updated` event (e.g., plan changed, status updated):
                *   Extract relevant information from the event (subscription ID, new status, new plan details if plan changed).
                *   Update the corresponding row in your `subscriptions` table with the new status and plan type.
        *   **Handle `customer.subscription.deleted` Event:**
            *   When Stripe sends a `customer.subscription.deleted` event (subscription canceled):
                *   Extract the `subscription_id` from the event.
                *   Update the `status` in the corresponding row in your `subscriptions` table to 'canceled'.
        *   **Error Handling in Webhook:** Implement error handling within the webhook endpoint. If any database updates fail, log the error and potentially retry the update or implement a mechanism to handle failed webhook events.  Return a 200 status code to Stripe even if there are internal errors to acknowledge receipt of the event, and handle errors asynchronously.

4.  **Frontend (Next.js) Implementation:**
    *   **Display Subscription Plans:** Create UI to display your subscription plans (using Shadcn UI components). Show plan names, features, and pricing.
    *   **"Subscribe" Buttons:** Add "Subscribe" buttons for each plan.
    *   **Checkout Redirection:** When a user clicks a "Subscribe" button:
        *   Make an API request to your backend endpoint `/api/create-checkout-session`, sending the `priceId` of the selected plan and the `userId`.
        *   In the API response, you will receive the Checkout Session URL.
        *   Redirect the user to the Checkout Session URL provided by Stripe.
    *   **Handle Success/Cancel Redirects:**
        *   Create pages for `subscription-success` and `subscription-cancel`.
        *   **`subscription-success` page:**  Display a success message. You can optionally retrieve the Checkout Session ID from the query parameters (`?session_id=...`) and use the Stripe client-side library to retrieve session details if needed for confirmation or further actions.
        *   **`subscription-cancel` page:** Display a cancellation message or redirect back to the subscription plan selection page.
    *   **User Subscription Status Display:**  On the user dashboard and settings page, display the user's current subscription plan and status. Fetch this information from your backend API (which in turn retrieves it from the `subscriptions` table in Supabase).
    *   **Conditional Feature Access:** Implement logic in your frontend (and backend) to conditionally enable/disable features based on the user's subscription plan.

**Requirements & Considerations (from `brainstorm.md`):**

*   Integrate Stripe for payment processing.
*   Implement subscription plans (Free, Premium, Pro - define features for each).
*   Use Stripe Checkout for a simpler payment flow initially.
*   **Crucially implement Stripe Webhooks for handling payment events.**
*   Manage subscription status in the Supabase `subscriptions` table.
*   Implement subscription management (view plan, upgrade/downgrade, cancel - initially focus on basic subscription and cancellation, upgrade/downgrade can be added later or link to Stripe Customer Portal).

**Example Code Snippets:**

**Backend (Express.js) - `/api/create-checkout-session.js` (Create Checkout Session Endpoint):**

```javascript
// backend/pages/api/create-checkout-session.js (or similar API route)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { priceId } = req.body; // Assuming priceId is sent from frontend

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`, // Replace with your app URL
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-cancel`, // Replace with your app URL,
      });
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
```

**Backend (Express.js) - `/api/stripe-webhook.js` (Simplified Webhook Handler - basic structure):**

```javascript
// backend/pages/api/stripe-webhook.js (or similar API route for webhook)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Retrieve webhook secret from env

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let event;

    try {
      const signature = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        // ... (Logic to retrieve userId, update subscriptions table in Supabase) ...
        console.log('Checkout session completed for customer:', customerId, 'subscription:', subscriptionId);
        break;
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object;
        const subscriptionStatus = subscriptionUpdated.status;
        const stripeSubscriptionIdUpdated = subscriptionUpdated.id;
        // ... (Logic to update subscription status in Supabase based on subscriptionUpdated.status) ...
        console.log('Subscription updated:', stripeSubscriptionIdUpdated, 'status:', subscriptionStatus);
        break;
      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object;
        const stripeSubscriptionIdDeleted = subscriptionDeleted.id;
        // ... (Logic to update subscription status to canceled in Supabase) ...
        console.log('Subscription deleted:', stripeSubscriptionIdDeleted);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body for webhook verification
  },
};
```

**Testing:**

*   **Stripe Test Mode:** Use Stripe's test mode for development and testing. Use test card numbers and webhook signing secret from your Stripe test dashboard.
*   **Test Subscription Flow:** Test the entire subscription flow from plan selection to successful payment and webhook processing.
*   **Verify Database Updates:**  Ensure that the `subscriptions` table is correctly updated in Supabase when subscriptions are created, updated, and canceled (via webhook events).
*   **Test Webhook Handling:**  Test your webhook endpoint thoroughly by simulating different Stripe webhook events (using Stripe CLI or test events in the Stripe dashboard).
*   **Conditional Feature Access Testing:** Verify that premium features are only accessible to users with appropriate subscriptions.

By completing these steps, you will have integrated Stripe payment processing and subscription management into your NBA Player Data Web Application.