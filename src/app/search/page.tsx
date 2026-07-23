
'use client';

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const db = useFirestore();

  const usersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'users'), limit(100));
  }, [db]);

  const { data: users, loading } = useCollection<UserProfile>(usersQuery);

  const filteredUsers = useMemo(() => {
    if (!users || !searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return users.filter(u => 
      u.username.toLowerCase().includes(term) || 
      u.displayName.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  return (
    <div className="min-h-screen bg-secondary/10">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Search People</h1>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Find friends by name or username..." 
                className="pl-12 h-12 rounded-full border-none shadow-sm text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {searchTerm.trim() === '' ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Type to find creators</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(u => (
                <Card key={u.id} className="rounded-2xl border-none shadow-sm hover:ring-2 ring-primary/20 transition-all">
                  <CardContent className="p-4 flex items-center justify-between">
                    <Link href={`/profile/${u.username}`} className="flex items-center gap-4 flex-1">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={u.avatarUrl} />
                        <AvatarFallback className="text-lg font-black">{u.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-black uppercase tracking-tight">{u.displayName}</h2>
                        <p className="text-sm text-muted-foreground font-medium">@{u.username}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{u.bio || "Active member"}</p>
                      </div>
                    </Link>
                    <Link href={`/profile/${u.username}`}>
                      <Button variant="outline" className="rounded-full font-bold">View Profile</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              !loading && (
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No users found for "{searchTerm}"</p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
