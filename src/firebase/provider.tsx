'use client';
import { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  db: null,
});

export const FirebaseProvider = ({
  children,
  ...value
}: {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}) => <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext).app as FirebaseApp;
export const useAuth = () => useContext(FirebaseContext).auth as Auth;
export const useFirestore = () => useContext(FirebaseContext).db as Firestore;
