# TeamSync | Enterprise Collaboration Platform

TeamSync is a high-performance collaboration environment designed for distributed teams. It unifies video conferencing, real-time messaging, and AI-augmented productivity tools within a minimalist, high-contrast monochrome interface.

## Core Features

- **High-Fidelity Media**: Secure, low-latency video and audio communication.
- **Synchronized Workspace**: Real-time collaborative signaling and messaging.
- **AI-Powered Productivity**: Integrated Genkit flows for session refinement and summarization.
- **Audit & History**: Persistent session archives and objective tracking.
- **Enterprise Security**: Role-based access control powered by Firebase.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Backend**: Firebase (Firestore, Authentication)
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **Styling**: Tailwind CSS & ShadCN UI (Monochrome Theme)

---

## Deployment to Vercel

To deploy this project to Vercel, follow these steps:

### 1. Push to GitHub
Ensure you have initialized git and pushed your code to a GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit: Professional Monochrome Release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Import to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.

### 3. Configure Environment Variables
In the Vercel project settings, add the following **Environment Variables**:

| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Google AI Studio API Key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

### 4. Deploy
Click **Deploy**. Vercel will build the project and provide a live URL.

---

## Local Development

1. **Install Dependencies**: `npm install`
2. **Environment Setup**: Create a `.env` file with your `GEMINI_API_KEY`.
3. **Run**: `npm run dev`

*© 2024 TeamSync Infrastructure. Professional tools for distributed excellence.*
