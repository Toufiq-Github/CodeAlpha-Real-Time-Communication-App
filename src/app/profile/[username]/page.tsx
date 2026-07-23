
'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Post, UserProfile } from '@/lib/types';
import { PostCard } from '@/components/post-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, MapPin, Link as LinkIcon, Edit3 } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const db = useFirestore();
  const { user: currentUser } = useUser();
  const router = useRouter();

  // Fetch target user profile
  const userQuery = useMemo(() => {
    if (!db || !username) return null;
    return query(collection(db, 'users'), where('username', '==', username), limit(1));
  }, [db, username]);

  const { data: users, loading: userLoading } = useCollection<UserProfile>(userQuery);
  const profileUser = users?.[0];

  // Fetch target user's posts
  const postsQuery = useMemo(() => {
    if (!db || !profileUser) return null;
    return query(
      collection(db, 'posts'),
      where('authorId', '==', profileUser.id),
      orderBy('createdAt', 'desc')
    );
  }, [db, profileUser]);

  const { data: posts, loading: postsLoading } = useCollection<Post>(postsQuery);

  const isOwnProfile = currentUser?.username === username;

  if (userLoading) return (
    <div className="min-h-screen bg-secondary/10">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="flex gap-4 items-end -mt-16 px-6">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
          </div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );

  if (!profileUser && !userLoading) return (
    <div className="min-h-screen bg-secondary/10 flex flex-col items-center justify-center p-4">
      <Navbar />
      <h1 className="text-4xl font-black uppercase mb-2">User Not Found</h1>
      <p className="text-muted-foreground mb-6">The account you're looking for doesn't exist.</p>
      <Button onClick={() => router.push('/')}>Go Home</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/10">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden mb-6">
            <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary transition-all"></div>
            <CardContent className="relative px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 gap-4">
                <div className="space-y-4">
                  <Avatar className="h-32 w-32 rounded-full border-4 border-background shadow-xl ring-2 ring-primary/5">
                    <AvatarImage src={profileUser?.avatarUrl} />
                    <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">
                      {profileUser?.displayName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">{profileUser?.displayName}</h1>
                    <p className="text-muted-foreground font-medium">@{profileUser?.username}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-2">
                  {isOwnProfile ? (
                    <Button variant="outline" className="rounded-full font-bold gap-2 hover:bg-primary hover:text-primary-foreground">
                      <Edit3 className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button className="rounded-full font-bold px-8">Follow</Button>
                      <Button variant="outline" className="rounded-full font-bold">Message</Button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-lg leading-relaxed text-foreground/80 max-w-2xl">
                  {profileUser?.bio || "No bio yet. This user is keeping it mysterious."}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Joined {profileUser?.createdAt ? format(new Date(profileUser.createdAt), 'MMMM yyyy') : 'Recently'}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Global Citizen</span>
                </div>

                <div className="flex gap-6 pt-2">
                  <button className="flex gap-1.5 hover:underline decoration-2">
                    <span className="font-black text-foreground">{profileUser?.followerCount || 0}</span>
                    <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-0.5">Followers</span>
                  </button>
                  <button className="flex gap-1.5 hover:underline decoration-2">
                    <span className="font-black text-foreground">{profileUser?.followingCount || 0}</span>
                    <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-0.5">Following</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Posts Feed */}
          <div className="max-w-2xl mx-auto space-y-4">
             <div className="flex items-center gap-2 mb-4 px-2">
                <div className="h-1 flex-1 bg-border rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">User Content</span>
                <div className="h-1 flex-1 bg-border rounded-full"></div>
             </div>
             
             {postsLoading ? (
               Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)
             ) : posts && posts.length > 0 ? (
               posts.map(post => <PostCard key={post.id} post={post} />)
             ) : (
               <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                 <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No posts yet</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
