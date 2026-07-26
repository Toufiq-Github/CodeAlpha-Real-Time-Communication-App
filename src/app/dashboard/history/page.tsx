'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Clock, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Room } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function SessionHistoryPage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const historyQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'rooms'), 
      where('createdBy', '==', user.id), 
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: rooms, loading } = useCollection<Room>(historyQuery);

  const copyRoomLink = (roomId: string) => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Invite Link Copied",
      description: "Ready to share with your organization.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Session History</h1>
        <p className="text-muted-foreground mt-2 text-lg font-medium">Audit and rejoin your previous workspace collaborations.</p>
      </div>

      <Card className="glass-panel border-none rounded-[2rem]">
        <CardHeader className="p-8">
          <CardTitle className="text-xl font-black uppercase">Meeting Archives</CardTitle>
          <CardDescription>Comprehensive record of your launched sessions.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />
              ))
            ) : rooms && rooms.length > 0 ? (
              rooms.map(room => (
                <div 
                  key={room.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-all group border border-transparent hover:border-white/5 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{room.name}</p>
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
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl h-12 w-12 text-muted-foreground/40 hover:text-primary hover:bg-primary/10"
                      onClick={() => copyRoomLink(room.id)}
                      title="Copy Invite Link"
                    >
                      <LinkIcon className="h-5 w-5" />
                    </Button>
                    <Button 
                      className="rounded-xl px-8 h-12 font-black shadow-lg hover:shadow-primary/20 transition-all flex-1 sm:flex-none"
                      onClick={() => router.push(`/room/${room.id}`)}
                    >
                      Rejoin Session
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                <Video className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium text-lg">Your meeting archives are currently empty.</p>
                <Button variant="link" onClick={() => router.push('/dashboard')} className="mt-2 text-primary font-bold uppercase text-[10px] tracking-widest">Deploy your first session</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
