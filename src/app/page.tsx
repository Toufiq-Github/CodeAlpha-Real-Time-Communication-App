
'use client';

import { Navbar } from '@/components/navbar';
import { PostCard } from '@/components/post-card';
import { CreatePost } from '@/components/create-post';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Post, UserProfile, Follow } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function RecommendedUsers() {
  const db = useFirestore();
  const { user } = useUser();
  
  const usersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'users'), limit(10));
  }, [db]);

  const { data: users, loading } = useCollection<UserProfile>(usersQuery);

  if (loading) return <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2 w-12" />
        </div>
      </div>
    ))}
  </div>;

  const filteredUsers = users?.filter(u => u.id !== user?.id).slice(0, 5) || [];

  return (
    <div className="space-y-4">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((u) => (
          <div key={u.id} className="flex items-center justify-between group">
            <Link href={`/profile/${u.username}`} className="flex items-center gap-3 flex-1">
              <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                <AvatarImage src={u.avatarUrl} />
                <AvatarFallback>{u.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-bold hover:underline">{u.displayName}</span>
                <span className="text-xs text-muted-foreground">@{u.username}</span>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p className="text-xs text-muted-foreground">No recommendations yet.</p>
      )}
    </div>
  );
}

export default function Home() {
  const db = useFirestore();
  const { user, loading: userLoading } = useUser();

  // Get users I follow
  const followsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'follows'), where('followerId', '==', user.id));
  }, [db, user]);

  const { data: follows } = useCollection<Follow>(followsQuery);

  const postsQuery = useMemo(() => {
    if (!db) return null;
    
    // In a real app with many users, we'd handle the 'in' limit (30) more robustly
    // For this mini-social, we'll fetch general posts if no follows, otherwise filter
    if (follows && follows.length > 0) {
      const followingIds = follows.map(f => f.followingId);
      followingIds.push(user?.id || ''); // Include own posts
      return query(
        collection(db, 'posts'), 
        where('authorId', 'in', followingIds.slice(0, 30)),
        orderBy('createdAt', 'desc'), 
        limit(50)
      );
    }
    
    return query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
  }, [db, follows, user?.id]);

  const { data: posts, loading: postsLoading } = useCollection<Post>(postsQuery);

  const isLoading = userLoading || postsLoading;

  return (
    <div className="min-h-screen bg-secondary/10">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {user && <CreatePost />}
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  {follows && follows.length > 0 ? 'Your News Feed' : 'Explore Global Feed'}
                </span>
                <div className="h-px flex-1 bg-border"></div>
              </div>

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
                    <Skeleton className="h-24 w-full rounded-lg" />
                  </div>
                ))
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                   <div className="max-w-xs mx-auto space-y-4">
                    <p className="text-muted-foreground font-medium italic">
                      "The journey of a thousand miles begins with a single post."
                    </p>
                    <p className="text-sm text-muted-foreground">Your feed is empty. Start following people or share your first post!</p>
                    <Link href="/search">
                      <Button variant="outline" className="rounded-full">Discover People</Button>
                    </Link>
                   </div>
                </div>
              )}
            </div>
          </div>

          <aside className="hidden lg:block space-y-6">
            <Card className="rounded-2xl border-none shadow-sm overflow-hidden sticky top-24">
              <div className="bg-primary p-6 text-primary-foreground">
                <h2 className="font-black text-xl tracking-tight uppercase">Discover</h2>
                <p className="text-xs opacity-80 mt-1">Suggested for you</p>
              </div>
              <CardContent className="p-6">
                <RecommendedUsers />
              </CardContent>
            </Card>

            <div className="px-6 space-y-4">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {['About', 'Help', 'Privacy', 'Terms', 'Developers'].map(l => (
                  <Link key={l} href="#" className="text-[10px] text-muted-foreground hover:underline uppercase tracking-widest font-bold">
                    {l}
                  </Link>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                © 2024 CONNECTHUB.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
