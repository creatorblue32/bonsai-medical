# Firebase Setup Guide

This guide will help you set up Firebase authentication for your Bonsai app.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Authentication

1. In your Firebase project, navigate to **Build > Authentication**
2. Click "Get started"
3. Enable the following sign-in methods:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and configure your OAuth consent screen

## Step 3: Register Your Web App

1. In your Firebase project overview, click the **Web icon (</>)** to add a web app
2. Give your app a nickname (e.g., "Bonsai Web")
3. You don't need to set up Firebase Hosting for now
4. Click "Register app"

## Step 4: Get Your Firebase Config

After registering your app, you'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 5: Create Your .env.local File

1. In your project root directory, create a file named `.env.local`
2. Copy the contents from `.env.local.example`
3. Fill in your Firebase credentials:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important**: Replace all the placeholder values with your actual Firebase config values.

## Step 6: Configure Google Sign-In (Optional but Recommended)

1. In Firebase Console, go to **Authentication > Sign-in method**
2. Click on **Google**
3. Toggle "Enable"
4. Select a support email for your project
5. Click "Save"

## Step 7: Set Up Authorized Domains

1. In Firebase Console, go to **Authentication > Settings > Authorized domains**
2. By default, `localhost` is already authorized for development
3. When you deploy, add your production domain here

## Step 8: Run Your App

1. Make sure your `.env.local` file is in the root directory
2. Restart your development server:

```bash
npm run dev
```

3. Navigate to `http://localhost:3000`
4. You should see the landing page with authentication options

## Security Notes

- **Never commit your `.env.local` file to version control**
- The `.env.local` file is already included in `.gitignore`
- All environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Firebase security rules should be configured separately in the Firebase Console

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Make sure your domain is listed in the Authorized domains list in Firebase Console

### "Firebase: Error (auth/api-key-not-valid)"
- Double-check that you copied the API key correctly
- Make sure there are no extra spaces in your `.env.local` file

### Environment variables not loading
- Restart your development server after creating/modifying `.env.local`
- Make sure the file is named exactly `.env.local` (not `.env.local.txt`)

## Next Steps

- Configure Firebase security rules for your project
- Set up additional authentication providers (GitHub, Apple, etc.)
- Add user profile management features
- Implement email verification for new accounts

## Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Console](https://console.firebase.google.com/)
