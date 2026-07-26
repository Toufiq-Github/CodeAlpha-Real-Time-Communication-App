'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Clock, Calendar, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Room } from '@/lib/types';

export default function SessionHistoryPage() {
  const { user } = useUser();
  const db = useFirestore();

  const historyQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'rooms'), 
      where('createdBy', '==', user.id),
      limit(50)
    );
  }, [db, user]);

  const { data: rooms, loading } = useCollection<Room>(historyQuery);

  const sortedRooms = useMemo(() => {
    if (!rooms) return [];
    return [...rooms].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [rooms]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Session <span className="text-primary">History</span></h1>
        <p className="text-muted-foreground text-lg font-medium tracking-tight">Audit and review your previous workspace collaborations.</p>
      </div>

      <Card className="glass-panel border-none rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5">
          <CardTitle className="text-xl font-black uppercase">Meeting Archives</CardTitle>
          <CardDescription className="text-base font-medium">A complete record of your launched sessions and objective outcomes.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 w-full rounded-2xl bg-white/[0.03] animate-pulse" />
              ))
            ) : sortedRooms.length > 0 ? (
              sortedRooms.map(room => (
                <div 
                  key={room.id} 
                  className="flex flex-col p-6 rounded-2xl bg-white/[0.03] group border border-transparent hover:border-white/5 gap-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white">{room.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(room.createdAt), 'MMMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                            <Clock className="h-3 w-3" />
                            {format(new Date(room.createdAt), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {room.summary && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
                      <Sparkles className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
                        {room.summary}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                <Video className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium text-lg">Your meeting archives are currently empty.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
