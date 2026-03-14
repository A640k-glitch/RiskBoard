# RiskBoard Setup Instructions

## 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one.
3. Enable **Authentication** and add the **Google** sign-in provider.
4. Enable **Firestore Database** and start in production mode.
5. Deploy the security rules from `firestore.rules` to your Firestore database.
6. Register a Web App in your Firebase project settings to get your configuration.
7. Copy `.env.local.example` to `.env.local` and fill in your Firebase configuration values.

## 2. Install Dependencies
Run the following command to install all required dependencies:
```bash
npm install decimal.js recharts firebase clsx tailwind-merge lucide-react react-router-dom
```

## 3. Run Locally
Start the development server:
```bash
npm run dev
```

## 4. Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init hosting`
   - Select your project.
   - Set the public directory to `dist`.
   - Configure as a single-page app (rewrite all urls to `/index.html`).
4. Build the project: `npm run build`
5. Deploy: `firebase deploy --only hosting`
