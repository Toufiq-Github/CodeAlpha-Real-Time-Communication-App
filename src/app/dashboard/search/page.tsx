'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search as SearchIcon, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tighter text-white uppercase">Organization Directory</h1>
        <p className="text-[#B3B3B3] text-lg font-medium tracking-tight">Identify and coordinate with members of your strategic team.</p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#808080]" />
        <Input 
          placeholder="Search members by name or identity..." 
          className="pl-16 h-14 rounded-xl bg-[#171717] border-[#404040] text-lg font-medium focus:border-white text-white transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border-[#404040] bg-[#171717] overflow-hidden">
        <CardHeader className="p-8 border-b border-[#404040]">
          <CardTitle className="text-xl font-semibold uppercase text-white">Active Personnel</CardTitle>
          <CardDescription className="text-[#B3B3B3] font-medium">All authenticated members within the organization unit.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl bg-white/5" />
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(u => (
                <Card key={u.id} className="rounded-2xl border border-[#404040] bg-black/20 hover:bg-black/40 transition-all group overflow-hidden">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 ring-1 ring-[#404040] transition-transform group-hover:scale-105">
                        <AvatarImage src={u.avatarUrl} />
                        <AvatarFallback className="text-lg font-bold bg-white/5 text-white">
                          {u.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold uppercase tracking-tight text-white truncate">{u.name}</h2>
                        <p className="text-[10px] text-[#808080] font-bold uppercase tracking-widest truncate mt-0.5">{u.email}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[#404040] flex gap-2">
                       <Button variant="outline" className="flex-1 rounded-xl h-10 border-[#404040] text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black">
                          View Profile
                       </Button>
                       <Button className="rounded-xl h-10 w-10 bg-white text-black hover:bg-white/90 shrink-0">
                          <UserPlus className="h-4 w-4" />
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20 border border-dashed border-[#404040] rounded-2xl">
                <p className="text-[#808080] font-bold uppercase tracking-widest text-xs">No team members matched your search criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
