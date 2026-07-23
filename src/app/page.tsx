
'use client';

import { Navbar } from '@/components/navbar';
import { PostCard } from '@/components/post-card';
import { CreatePost } from '@/components/create-post';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Post, UserProfile, Follow } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Sparkles } from 'lucide-react';

function RecommendedUsers() {
  const db = useFirestore();
  const { user } = useUser();
  
  const usersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'users'), limit(10));
  }, [db]);

  const { data: users, loading } = useCollection<UserProfile>(usersQuery);

  if (loading) return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-12" />
          </div>
        </div>
      ))}
    </div>
  );

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
                <span className="text-sm font-bold hover:underline line-clamp-1">{u.displayName}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">@{u.username}</span>
              </div>
            </Link>
            <Link href={`/profile/${u.username}`}>
              <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold text-primary hover:bg-primary/10">
                View
              </Button>
            </Link>
          </div>
        ))
      ) : (
        <p className="text-xs text-muted-foreground">No recommendations yet.</p>
      )}
    </div>
  );
}

function TrendingTopics() {
  const topics = [
    { name: '#ConnectHub', posts: '12.4K' },
    { name: '#TechTrends', posts: '8.2K' },
    { name: '#DailyVlog', posts: '5.1K' },
    { name: '#CodingLife', posts: '3.9K' },
    { name: '#AIRevolution', posts: '2.8K' },
  ];

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <div key={topic.name} className="flex flex-col gap-0.5 group cursor-pointer hover:bg-accent/50 p-2 -mx-2 rounded-xl transition-colors">
          <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Trending</span>
          <span className="text-sm font-black group-hover:text-primary transition-colors">{topic.name}</span>
          <span className="text-[10px] text-muted-foreground font-medium">{topic.posts} Posts</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const db = useFirestore();
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("for-you");

  const followsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'follows'), where('followerId', '==', user.id));
  }, [db, user]);

  const { data: follows } = useCollection<Follow>(followsQuery);

  const globalPostsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const followingPostsQuery = useMemo(() => {
    if (!db || !user || !follows || follows.length === 0) return null;
    const followingIds = follows.map(f => f.followingId);
    followingIds.push(user.id);
    return query(
      collection(db, 'posts'),
      where('authorId', 'in', followingIds.slice(0, 30)),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [db, user, follows]);

  const { data: globalPosts, loading: globalLoading } = useCollection<Post>(globalPostsQuery);
  const { data: followingPosts, loading: followingLoading } = useCollection<Post>(followingPostsQuery);

  const isLoading = activeTab === "for-you" ? globalLoading : followingLoading;
  const currentPosts = activeTab === "for-you" ? globalPosts : followingPosts;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main Content */}
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            {user && <CreatePost />}
            
            <Tabs defaultValue="for-you" className="w-full" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-2 sticky top-[72px] bg-background/80 backdrop-blur-md z-40 py-2">
                <TabsList className="bg-transparent h-auto p-0 gap-6">
                  <TabsTrigger 
                    value="for-you" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none px-0 pb-2 font-black uppercase tracking-[0.2em] text-[10px]"
                  >
                    For You
                  </TabsTrigger>
                  {user && (
                    <TabsTrigger 
                      value="following" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none px-0 pb-2 font-black uppercase tracking-[0.2em] text-[10px]"
                    >
                      Following
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="rounded-2xl border-none shadow-sm p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-32 w-full rounded-2xl" />
                    </Card>
                  ))
                ) : currentPosts && currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-center py-32 bg-accent/10 rounded-[32px] border border-dashed border-primary/20">
                    <div className="max-w-xs mx-auto space-y-4">
                      <Sparkles className="h-12 w-12 mx-auto text-primary/30" />
                      <p className="text-sm text-muted-foreground font-medium italic">
                        "Your feed is waiting for its first spark."
                      </p>
                      {activeTab === "following" && (
                         <Link href="/search">
                            <Button variant="outline" className="rounded-full font-bold uppercase tracking-tighter text-xs">Discover Creators</Button>
                         </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <Card className="rounded-[32px] border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden sticky top-24">
              <div className="bg-primary/5 p-6 border-b border-primary/10">
                <div className="flex items-center gap-3 mb-1">
                   <div className="p-2 bg-primary/10 rounded-xl">
                      <TrendingUp className="h-4 w-4 text-primary" />
                   </div>
                   <h2 className="font-black text-lg tracking-tight uppercase">Trending</h2>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Real-time pulses</p>
              </div>
              
              <CardContent className="p-6 space-y-8">
                <div>
                   <TrendingTopics />
                </div>
                
                <div className="pt-6 border-t border-muted">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest">Who to Follow</h3>
                   </div>
                   <RecommendedUsers />
                </div>
              </CardContent>
            </Card>

            <div className="px-6 space-y-4 opacity-60">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {['About', 'Help', 'Privacy', 'Terms', 'Ads'].map(l => (
                  <Link key={l} href="#" className="text-[9px] text-muted-foreground hover:underline uppercase tracking-widest font-bold">
                    {l}
                  </Link>
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.3em]">
                © 2024 CONNECTHUB.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
