# TeamSync | Professional Collaboration Platform

Unify your workspace with high-fidelity video conferencing, interactive whiteboards, and real-time team synchronization.

## Setup & Deployment

This project is built with Next.js, Tailwind CSS, and Firebase.

### Local Development

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open [http://localhost:9002](http://localhost:9002) in your browser.

### Pushing to GitHub

To push this code to your own GitHub repository without exposing sensitive API keys:

1. **Create a new repository** on [GitHub](https://github.com/new).
2. **Initialize Git** locally:
   ```bash
   git init
   ```
3. **Stage your changes**:
   ```bash
   git add .
   ```
4. **Commit your code**:
   ```bash
   git commit -m "feat: initial commit with professional monochrome theme"
   ```
5. **Rename branch**:
   ```bash
   git branch -M main
   ```
6. **Add your remote**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
7. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

*Note: Your `src/firebase/config.ts` is ignored by Git to protect your API keys.*