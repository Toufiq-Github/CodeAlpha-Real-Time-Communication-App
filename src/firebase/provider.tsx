'use client';
import { createContext, useContext } from 'react';
import { type FirebaseApp } from 'firebase/app';
import { type Auth } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';
import { app, auth, db } from './client'; // Import the initialized singletons

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

// The services are already initialized in client.ts,
// so we can just pass them to the provider value.
const firebaseServices = { app, auth, db };

export const FirebaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <FirebaseContext.Provider value={firebaseServices}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hooks to access the Firebase services
export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().db;
