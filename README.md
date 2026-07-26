# TeamSync | Enterprise Collaboration Platform

TeamSync is a high-performance collaboration environment designed for distributed teams. It unifies video conferencing, real-time messaging, and session management within a minimalist, high-contrast monochrome interface.

## Core Features

- **Professional Monochrome UI**: Strictly grayscale aesthetic (Black #050505, Cards #171717, Primary #E8E8E8).
- **High-Fidelity Media**: Secure, low-latency video and audio communication.
- **Enterprise Security**: Role-based access control and secure peer discovery powered by Firebase.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI**: Genkit (Google Gemini)

---

## Deployment Guide (Perfect Setup)

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
In the Vercel dashboard, you **must** add these variables for the app to function. Copy them from your local project settings:

| Key | Description |
| :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your-project-id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase App ID |
| `GEMINI_API_KEY` | Your Google AI Studio API Key |

### 4. Deploy
Click **Deploy**. Vercel will handle the build automatically.

*© 2024 TeamSync Infrastructure. Professional tools for distributed excellence.*