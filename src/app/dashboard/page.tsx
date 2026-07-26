'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Plus, Calendar, Settings, UserPlus, Clock, Link as LinkIcon, Shield, Share2 } from 'lucide-react';
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
      orderBy('createdAt', 'desc'), 
      limit(10)
    );
  }, [db, user]);

  const { data: recentRooms, loading } = useCollection<Room>(historyQuery);

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
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyRoomLink = (roomId: string) => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Ready to share with your organization.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase">Workspace Hub</h1>
          <p className="text-muted-foreground mt-3 text-lg font-medium">Active sessions for {user?.name}. Execute your team's objectives.</p>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-2xl border-white/5 bg-white/5 gap-3 h-12 px-6 font-bold hover:bg-white/10">
                <Calendar className="h-4 w-4 text-primary" />
                Schedule
            </Button>
            <Button className="rounded-2xl shadow-xl shadow-primary/20 gap-3 h-12 px-6 font-bold">
                <UserPlus className="h-4 w-4" />
                Add Members
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 glass-panel border-none rounded-[3rem] p-4">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black uppercase">Initialize Room</CardTitle>
            <CardDescription className="text-lg">Deploy a secure workspace with WebRTC signaling and canvas synchronization.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Room Title (e.g., Q3 Strategy)" 
                className="h-16 rounded-[1.5rem] bg-white/5 border-white/5 text-xl font-medium px-8 focus-visible:ring-primary/50"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <Button 
                onClick={handleCreateRoom}
                disabled={isCreating || !roomName.trim()}
                className="h-16 rounded-[1.5rem] px-10 font-black text-lg shadow-2xl transition-all active:scale-95"
              >
                {isCreating ? 'Deploying...' : 'Launch Room'}
                <Video className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-none rounded-[3rem] bg-primary/5 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all" />
          <CardContent className="p-10 flex flex-col justify-between h-full relative z-10">
            <div className="space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)]">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight uppercase">Encryption</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Enterprise-grade signaling layer with secure peer-to-peer discovery.</p>
              </div>
            </div>
            <div className="pt-8 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Signal Strength: Optimal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 glass-panel border-none rounded-[3rem]">
          <CardHeader className="p-8 flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Recent Sessions</CardTitle>
            <Clock className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-4">
              {loading ? (
                <p className="text-muted-foreground animate-pulse font-medium">Syncing database...</p>
              ) : recentRooms && recentRooms.length > 0 ? (
                recentRooms.map(room => (
                  <div 
                    key={room.id} 
                    className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] hover:bg-white/[0.06] transition-all group border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                        <Video className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <p className="font-black text-xl tracking-tight">{room.name}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">
                          {format(new Date(room.createdAt), 'MMMM d • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-12 w-12 text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-all"
                        onClick={() => copyRoomLink(room.id)}
                        title="Copy Invite Link"
                      >
                        <LinkIcon className="h-5 w-5" />
                      </Button>
                      <Button 
                        className="rounded-2xl px-8 h-12 font-black shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                        onClick={() => router.push(`/room/${room.id}`)}
                      >
                        Re-Join
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                  <p className="text-muted-foreground font-medium text-lg">No session history found.</p>
                  <Button variant="link" onClick={() => setRoomName('General Workspace')} className="mt-4 text-primary font-bold uppercase text-xs tracking-widest">Deploy First Room</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="glass-panel border-none rounded-[3rem] p-10 space-y-6 bg-gradient-to-br from-primary/10 to-transparent">
                <Share2 className="h-10 w-10 text-primary" />
                <h3 className="text-2xl font-black tracking-tight uppercase">Unify Teams</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Broadcast secure workspace invites to your entire organization for instant real-time collaboration.</p>
                <Button variant="outline" className="w-full rounded-2xl border-white/10 h-14 font-bold bg-white/5 hover:bg-white/10 uppercase text-xs tracking-widest">Team Settings</Button>
            </Card>
            
            <Card className="glass-panel border-none rounded-[3rem] p-10 bg-slate-100/5">
                <Settings className="h-8 w-8 text-muted-foreground mb-6" />
                <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-slate-500">Status</h3>
                <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground font-black uppercase tracking-widest">Network Latency</span>
                        <span className="text-emerald-500 font-black px-3 py-1 bg-emerald-500/10 rounded-lg">4ms</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground font-black uppercase tracking-widest">Signaling Layer</span>
                        <span className="text-primary font-black px-3 py-1 bg-primary/10 rounded-lg">Active</span>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}