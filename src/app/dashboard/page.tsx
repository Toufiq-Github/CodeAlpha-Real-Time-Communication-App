
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, where, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Calendar, UserPlus, Clock, Shield, Share2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Room } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [roomName, setRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const historyQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'rooms'), 
      where('createdBy', '==', user.id),
      limit(20)
    );
  }, [db, user]);

  const { data: rooms, loading } = useCollection<Room>(historyQuery);

  const recentRooms = useMemo(() => {
    if (!rooms) return [];
    return [...rooms].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 10);
  }, [rooms]);

  const handleCreateRoom = async () => {
    if (!user || !roomName.trim()) return;
    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        name: roomName.trim(),
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        isActive: true,
      });
      router.push(`/room/${docRef.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Initialization Failed',
        description: 'Could not deploy workspace session.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Omni<span className="text-primary">Meet</span></h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium tracking-tight">Execute your objectives, {user?.name}.</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 gap-2 h-11 px-5 font-bold hover:bg-white/10">
                <Calendar className="h-4 w-4 text-primary" />
                Schedule
            </Button>
            <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2 h-11 px-6 font-bold">
                <UserPlus className="h-4 w-4" />
                Invite Team
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-panel border-none rounded-[2rem]">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black uppercase">Initialize Session</CardTitle>
            <CardDescription className="text-base font-medium">Deploy a secure professional workspace session.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Session Title" 
                className="h-14 rounded-xl bg-white/5 border-white/10 text-lg font-medium px-6 focus-visible:ring-primary/50"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <Button 
                onClick={handleCreateRoom}
                disabled={isCreating || !roomName.trim()}
                className="h-14 rounded-xl px-8 font-black text-base shadow-xl transition-all active:scale-95"
              >
                {isCreating ? 'Deploying...' : 'Launch Room'}
                <Video className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-none rounded-[2rem] bg-primary/5 relative overflow-hidden group">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Security Protocol</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">Enterprise signaling layer with peer discovery and encrypted data channels.</p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Service: Online</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-panel border-none rounded-[2rem]">
          <CardHeader className="p-8 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black uppercase">Recent Sessions</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-4">
              {loading ? (
                <p className="text-muted-foreground animate-pulse font-medium">Syncing archives...</p>
              ) : recentRooms && recentRooms.length > 0 ? (
                recentRooms.map(room => (
                  <div 
                    key={room.id} 
                    className="flex flex-col p-5 rounded-2xl bg-white/[0.03] border border-transparent"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Video className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-base">{room.name}</p>
                          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">
                            {format(new Date(room.createdAt), 'MMM d • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">Reminder</div>
                    </div>
                    {room.summary && (
                      <div className="mt-2 pl-4 border-l-2 border-primary/20 flex gap-2 items-start">
                        <Sparkles className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic font-medium">
                          {room.summary}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[1.5rem] bg-white/[0.01]">
                  <p className="text-muted-foreground font-medium">No recent session records found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="glass-panel border-none rounded-[2rem] p-8 space-y-4 bg-gradient-to-br from-primary/10 to-transparent">
                <Share2 className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-black uppercase tracking-tight">Team Unification</h3>
                <p className="text-sm text-muted-foreground font-medium">Broadcast secure workspace invites to your entire organization for instant real-time collaboration.</p>
                <Button variant="outline" className="w-full rounded-xl border-white/10 h-12 font-bold bg-white/5 hover:bg-white/10 uppercase text-[10px] tracking-widest" onClick={() => router.push('/dashboard/settings')}>Workspace Config</Button>
            </Card>
        </div>
      </div>
    </div>
  );
}
