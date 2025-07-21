-----

# Next.js Application with Supabase

This project demonstrates a Next.js application integrated with Supabase for user authentication (email/password, Google, GitHub), form validation, and basic data management (product listing with image uploads).

## Features

  * *User Authentication*: Register, Login, and Logout functionality.
  * *Social Login*: Google and GitHub authentication.
  * *Protected Routes*: Dashboard and Profile pages accessible only to logged-in users.
  * *Form Validation*: Client-side validation using yup and react-hook-form.
  * *Product Management*: Display, add, edit, and delete products (sample list).
  * *Image Uploads*: Uploading and displaying product images.
  * *Notifications*: Toast messages for user feedback.

## Prerequisites

Before you begin, ensure you have the following installed:

  * Node.js 
  * npm or Yarn
  * VS Code (or your preferred code editor)

## Getting Started

Follow these steps to set up and run the project.

### Project Setup

1.  *Create a Project Folder*: Create a folder and open it with VS Code.
2.  *Initialize Next.js Project*: Open your terminal in the created folder and run npx create-next-app@latest. During the setup, select the following options: Project name (my-supabase-nextjs-app or your preferred name), TypeScript (Yes), ESLint (Yes), Tailwind CSS (Yes), src/ directory (No), App Router (Yes), Turbopack (No), Import alias (No).
3.  *Install Dependencies*: Install the required packages: bootstrap, react-hot-toast, sweetalert2, yup, react-hook-form, @hookform/resolvers, and @supabase/supabase-js. Verify installation in package.json.

### Supabase Configuration

1.  *Register and Create a Supabase Project*: Go to Supabase and register for an account. Create a new project. Once the project is created, navigate to "Project Settings" -\> "API" to find your Project URL and Anon Key. Keep these handy.
2.  *Email Authentication Settings*: In your Supabase project, go to "Authentication" -\> "Settings". Under "Email Sign up", disable "Confirm new signups" and "Secure password" if you want to simplify initial testing, then save changes.

### Environment Variables

1.  **Create .env.local File**: In the root of your project, create a file named .env.local. Add your Supabase credentials to this file: NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY. Replace YOUR_SUPABASE_PROJECT_URL and YOUR_SUPABASE_ANON_KEY with the values obtained from your Supabase project.

## Core Functionality Implementation

### Folder Structure

Create the following essential folders within your project: lib, components, and context. The app directory (already exists) will contain your pages, with auth and dashboard sub-folders inside. The auth folder will be for authentication routes (login, register, profile and dashboard )for authenticated content. Create page.tsx files inside app/auth/login, app/auth/register, app/auth/profile, and app/auth/dashboard.

### Supabase Client

1.  **Create lib/supabaseClient.ts**: This file will initialize and export the Supabase client object. It imports createClient and uses the environment variables for connection. This client will be used for all interactions with Supabase.

### Authentication

1.  *Authentication Routes*:

      * Login Page (app/auth/login/page.tsx): Implement the login form. After successful login, store the tokenValue (session token) in sessionStorage. The application should redirect to the dashboard upon successful login.
      * Register Page (app/auth/register/page.tsx): Implement the registration form with validation.
      * Profile Page (app/auth/profile/page.tsx): Display and allow updates to user details.
      * Dashboard Page (app/auth/ashboard/page.tsx): This is a protected route. If a user is not logged in, they should be redirected to /auth/login.

2.  *Social Authentication (Google & GitHub)*:

      * Enable in Supabase*: In your Supabase project, go to "Authentication" -\> "Providers" and enable Google and GitHub. You will need to set up OAuth credentials in Google Developer Console and GitHub Developer Settings.
      * Implement in Code*: Add onClick functions to buttons to trigger the social sign-in events using the Supabase client.

3.  *Session Management*:

      * Store the session tokenValue in sessionStorage upon login. This value can be retrieved later to make authenticated requests.
      * Use useEffect in AppUtils.tsx (see Context below) to read the session value and manage AuthToken and isLoggedIn states.
      * Store userId in localStorage for persistent access across sessions.

4.  *Logout Functionality*:

      * Implement an onClick handler for the logout button in Navbar.tsx.
      * This function should clear the session/local storage and redirect the user back to the login page.

### UI Components

1.  **Layout (app/layout.tsx): Remove unnecessary code and change the title of your application. Import Bootstrap for styling. Import and add Toaster from react-hot-toast for displaying notifications. Wrap your children with the AppUtils context (see Context below).

2.  **Shared Components (components folder):

      * Navbar.tsx: Create a basic navigation bar. Conditionally render navigation links (e.g., "Home", "Login" if logged out; "Dashboard", "Profile" if logged in). Import Navbar into layout.tsx.
      * Footer.tsx: Create a simple footer component.
      * Loader.tsx: Create a loader component for displaying loading states.

### Context and Hooks

1.  context/AppUtils.tsx: Create a file AppUtils.tsx in the context folder. This context will manage global states like isLoggedIn and AuthToken. Use setAuthToken and setIsLoggedIn states. Import AppUtils into layout.tsx and wrap the children with it. Implement a useEffect hook in AppUtils.tsx to handle session logic, check AuthToken and isLoggedIn states, and redirect users (e.g., if not logged in, redirect from dashboard to login). Import useRouter from next/navigation to handle programmatic navigation.

### Form Validation

1.  *Register Page Validation*: Import useForm from react-hook-form, yup and yupResolver from @hookform/resolvers/yup. Define a schema using yup for the register page fields (e.g., name, password, gender, email). Apply the schema to useForm with resolver: yupResolver(schema). Implement handleSubmit function to handle form submission and ensure all form data is updated correctly.

2.  *Dashboard Page Validation*: Define a schema for dashboard fields using yup.

### Dashboard & Data Management

1.  *Supabase Table*: In your Supabase project, go to "Table Editor" and create a table (e.g., products) to store product details. Define appropriate columns for your product data.

2.  *Display Products*: In app/dashboard/page.tsx, create a useState for products. Implement conditional rendering: display the list of products if available, otherwise show a "No products found" message. Add "Edit" and "Delete" buttons for each product item.

### Image Uploads

1.  *Supabase Storage*: In your Supabase project, go to "Storage" and create a new bucket (e.g., product-images).

2.  *Image Upload Implementation*: In app/dashboard/page.tsx, implement the image upload functionality. Use useState for previewImage. Implement conditional rendering to display the previewImage if available, otherwise display an empty state. Handle the file input and update the previewImage state when a file is selected. Implement the logic to upload the image to Supabase Storage. After successful upload, update the product details in your Supabase table with the image URL.

## Running the Application

1.  *Start the Development Server*: Run npm run dev.
2.  *Access the Application*: Open youra browser and navigate to http://localhost:3000.

## Troubleshooting

  * *Environment Variables*: Ensure your .env.local file is correctly configured and the variables are prefixed with NEXT_PUBLIC_ for client-side access.
  * *Supabase API Keys*: Double-check your Supabase project URL and Anon Key.
  * *CORS Issues*: If you encounter CORS errors, review your Supabase project settings and ensure your application's URL is allowed.
  * *Authentication Flow*: Verify that session tokens are being stored and retrieved correctly in sessionStorage or localStorage.
  * *Redirections*: Check the useRouter paths in your authentication and context files to ensure correct page navigation.
  * *Toast Messages*: If messages are not displaying, ensure Toaster is imported and added to your layout.tsx file and toast functions are called correctly.
  * *Image Uploads*: Ensure your Supabase Storage rules allow public read access for the uploaded images if you're directly linking to them, or implement signed URLs for private access. Check your tsconfig.json for any relevant paths or aliases if experiencing issues.

## Additional Features

✅ Email Confirmation and Redirection
Email Verification: After registration, users receive a confirmation email via Supabase. They must verify their email address before logging in.

Redirect on Confirmation: Upon successful email confirmation, users are redirected to the login page with a toast notification prompting them to log in.

Supabase Settings:

In Supabase, go to Authentication → Email Templates → enable and customize the confirmation email.

Under Authentication → Settings, ensure “Email Confirmations” is enabled.

✏️ Edit & Delete User Details
Users can now update their profile details (e.g., name, gender, or email) on the Profile Page (app/auth/profile/page.tsx).
Also Deleted the Product permenantely.


-----
## Deploy the Next.js Application in Vercel
