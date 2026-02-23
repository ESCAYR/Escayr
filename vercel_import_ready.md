# ESCAYR SaaS Platform: Vercel Deployment Readiness

## Deployment Validation Complete

The ESCAYR GitHub repository has been validated and is fully prepared for a production-ready cloud deployment using Vercel. You **do not** need to install Node.js or run any local development commands. 

### `vercel.json` Routing Validation
The configuration file `vercel.json` correctly provisions routing rules required by a modern Vite Single Page Application (SPA). All application traffic is cleanly routed to `index.html`. This ensures that refresh and direct navigation work perfectly for every key platform route:

- `/login` (Authentication Flow)
- `/dashboard` (Administrative Dashboard)
- `/inspections/new` (Inspection Form / Offline-first Checklist)
- `/equipments/[id]` (Equipment Detail Timeline & Re-inspection View)
- `/verificar/[id]` (Public Certificate Verification & Cryptographic Integrity)

---

## Simple Deployment Instructions (No Technical Experience Required)

Follow these easy steps to get the ESCAYR application running live:

### 1. Open Vercel
- Navigate to [Vercel.com](https://vercel.com/) in your browser.
- Log in or sign up using your GitHub account.

### 2. Import the GitHub Repository
- From your Vercel Dashboard, click the **"Add New..."** button and select **"Project"**.
- Grant Vercel access to your GitHub repositories (if you haven't already).
- Find the `ESCAYR` repository in the list and click **"Import"**.
- Vercel will automatically detect that this is a *Vite* project (leave all default build settings as they are).

### 3. Add Supabase Environment Variables
*Before* clicking Deploy, open the **Environment Variables** section on the setup page and add the following two keys which connect the app to your database:
- **Name:** `VITE_SUPABASE_URL` | **Value:** *(Paste your Supabase Project URL)*
- **Name:** `VITE_SUPABASE_ANON_KEY` | **Value:** *(Paste your Supabase API `anon` public key)*

*(You can find both values in your Supabase Dashboard under Project Settings > API).*

### 4. Trigger the First Deployment
- Click the **"Deploy"** button.
- Vercel will begin building the application. This typically takes less than a minute.

### 5. Access the Public Preview URL
- Once the success screen appears, click **"Continue to Dashboard"** or click on the preview window to open your live application.
- You will be provided with a secure, public URL (e.g., `https://escayr-...vercel.app`).

---

## Expected Outcome

By following these instructions, you will successfully yield a **working public preview URL**. The deployed ESCAYR platform will be fully functional—allowing seamless navigation across all core modules while actively retrieving and saving data natively through the configured Supabase connection.
