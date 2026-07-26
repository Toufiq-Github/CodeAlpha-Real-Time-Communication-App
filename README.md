# TeamSync | Enterprise Collaboration Platform

TeamSync is a high-performance collaboration environment designed for distributed teams. It unifies video conferencing, real-time messaging, and session management within a strictly monochrome, professional interface inspired by Apple Pro Apps and the Vercel dashboard.

## Core Features

- **Professional Monochrome UI**: Strictly grayscale aesthetic (Background #050505, Sidebar #0D0D0D, Cards #181818).
- **High-Contrast Interaction**: Signature white-on-black navigation for active states and primary actions (#F5F5F5).
- **High-Fidelity Media**: Secure, low-latency video and audio communication.
- **Enterprise Security**: Secure peer discovery and signaling powered by Firebase.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI**: Genkit (Google Gemini)

---

## Deployment Guide (Vercel)

### 1. Push Code to GitHub
Ensure you have initialized git and pushed your code to a repository:
```bash
git init
git add .
git commit -m "feat: professional monochrome production release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Import to Vercel
- Log in to [Vercel](https://vercel.com).
- Select **Add New** > **Project** and import your repository.

### 3. Critical: Environment Variables
In the Vercel dashboard (Settings > Environment Variables), you **must** add these variables for the app to function. You can find these values in your Firebase Console (Project Settings > General > SDK setup and configuration).

| Key | Description | Requirement |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase Web API Key | Required |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com | Required |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your-project-id | Required |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com | Required |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID | Required |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase App ID | Required |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Your Analytics ID (starts with G-) | Optional |
| `GEMINI_API_KEY` | Your Google AI Studio API Key | Required |

### 4. Deploy
Once the variables are added, click **Deploy**. Vercel will handle the build automatically.

---
*© 2024 TeamSync Infrastructure. Professional tools for distributed excellence.*
