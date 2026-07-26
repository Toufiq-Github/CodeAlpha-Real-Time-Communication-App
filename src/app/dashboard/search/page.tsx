'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search as SearchIcon, UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const db = useFirestore();

  const usersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'users'), limit(50));
  }, [db]);

  const { data: users, loading } = useCollection<UserProfile>(usersQuery);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Team Search</h1>
        <p className="text-muted-foreground mt-2 text-lg font-medium">Identify and connect with members of your organization.</p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/40" />
        <Input 
          placeholder="Search by name or corporate email..." 
          className="pl-16 h-16 rounded-2xl glass-panel border-none text-xl font-medium focus-visible:ring-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="glass-panel border-none rounded-[2rem]">
        <CardHeader className="p-8">
          <CardTitle className="text-xl font-black uppercase">Organization Directory</CardTitle>
          <CardDescription>Active members in your unified workspace.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-3xl bg-white/5" />
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(u => (
                <Card key={u.id} className="rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group overflow-hidden">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-4 border-primary/10 shadow-xl transition-transform group-hover:scale-105">
                        <AvatarImage src={u.avatarUrl} />
                        <AvatarFallback className="text-xl font-black bg-primary/10 text-primary">
                          {u.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-black uppercase tracking-tight text-lg truncate">{u.name}</h2>
                        <p className="text-xs text-muted-foreground font-bold truncate opacity-60">{u.email}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 flex gap-2">
                       <Button variant="outline" className="flex-1 rounded-xl h-11 border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
                          View Profile
                       </Button>
                       <Button className="rounded-xl h-11 shadow-lg shadow-primary/20">
                          <UserPlus className="h-4 w-4" />
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-50">No team members matched your search criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}