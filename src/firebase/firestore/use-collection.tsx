"use client";

import { useEffect, useState, useRef } from 'react';
import {
  onSnapshot,
  Query,
  DocumentData,
  collection,
  getFirestore,
  FirestoreError,
} from 'firebase/firestore';
import { useFirebaseApp } from '../provider';

interface UseCollectionOptions<T> {
  // You can add options like 'listen' to disable real-time updates if needed
}

export function useCollection<T>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const result: T[] = [];
        querySnapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useCollection error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]); // Re-run effect if query changes

  return { data, loading, error };
}
