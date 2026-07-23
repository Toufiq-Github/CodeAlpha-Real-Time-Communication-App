
'use client';

import { Navbar } from '@/components/navbar';
import { PostCard } from '@/components/post-card';
import { CreatePost } from '@/components/create-post';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function Home() {
  const db = useFirestore();
  const { user, loading: userLoading } = useUser();

  const postsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: posts, loading: postsLoading } = useCollection<Post>(postsQuery);

  const isLoading = userLoading || postsLoading;

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {user && <CreatePost />}
            
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl border bg-card p-4 space-y-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No posts yet. Be the first to share something!
                </div>
              )}
            </div>
          </div>

          <aside className="hidden md:block space-y-6">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="font-bold mb-4">Recommended for you</h2>
              <p className="text-sm text-muted-foreground">Coming soon: personalized user suggestions.</p>
            </div>
            <div className="text-xs text-muted-foreground px-4">
              © 2024 Connect Social. Built with Next.js & Firebase.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
