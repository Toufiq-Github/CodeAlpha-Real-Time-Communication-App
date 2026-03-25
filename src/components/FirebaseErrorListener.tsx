'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * This component listens for custom Firestore permission errors and displays them
 * using a toast notification during development. This provides immediate feedback
 * on security rule violations.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // In a production environment, you would log this to a service like Sentry.
      // For development, we'll show a detailed toast.
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Firestore Permission Denied',
          description: (
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
              <code className="text-white">{error.message}</code>
            </pre>
          ),
          duration: 20000,
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component doesn't render anything
}
