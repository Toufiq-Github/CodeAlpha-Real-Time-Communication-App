'use client';
import { useMemo } from 'react';
import { FirebaseProvider, initializeFirebase } from '.';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { app, auth, db } = useMemo(() => {
    const { app, auth, db } = initializeFirebase();
    return { app, auth, db };
  }, []);

  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      {children}
    </FirebaseProvider>
  );
}
