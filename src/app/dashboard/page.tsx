
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Plus, Calendar, Settings, UserPlus, Clock, Link as LinkIcon, Share2 } from 'lucide-react';
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
      description: "Meeting URL is ready to share.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Collaboration Hub</h1>
          <p className="text-muted-foreground mt-2">Welcome, {user?.name}. Start a session or review past activity.</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
            </Button>
            <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Team
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-panel rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-xl">Launch Instant Meeting</CardTitle>
            <CardDescription>Start a secure video room with whiteboard and persistent chat.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Input 
                placeholder="Meeting Title (e.g., Q4 Roadmap)" 
                className="h-14 rounded-2xl bg-white/5 border-white/10 text-lg"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <Button 
                onClick={handleCreateRoom}
                disabled={isCreating || !roomName.trim()}
                className="h-14 rounded-2xl px-8 font-bold"
              >
                {isCreating ? 'Deploying...' : 'Start Now'}
                <Video className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel rounded-[2rem] bg-primary/10 border-primary/20">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Secure Signaling</h3>
              <p className="text-sm text-muted-foreground">All peer-to-peer signaling is managed through private encrypted channels.</p>
            </div>
            <div className="pt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">System Status: Optimal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-panel rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Syncing data...</p>
              ) : recentRooms && recentRooms.length > 0 ? (
                recentRooms.map(room => (
                  <div 
                    key={room.id} 
                    className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{room.name}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {format(new Date(room.createdAt), 'MMMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full text-muted-foreground hover:text-primary"
                        onClick={() => copyRoomLink(room.id)}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="rounded-xl px-6"
                        onClick={() => router.push(`/room/${room.id}`)}
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-muted-foreground">No recent sessions found.</p>
                  <Button variant="link" onClick={() => setRoomName('General Session')} className="mt-2">Start your first meeting</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="glass-panel rounded-[2rem] p-8 space-y-4">
                <Share2 className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Quick Invite</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Send a global invite link to your organization to allow anyone to join your personal room.</p>
                <Button variant="outline" className="w-full rounded-xl border-white/10">Configure Settings</Button>
            </Card>
            
            <Card className="glass-panel rounded-[2rem] p-8 bg-slate-100/5">
                <Settings className="h-6 w-6 text-muted-foreground mb-4" />
                <h3 className="font-bold">Preferences</h3>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Auto-Record</span>
                        <span className="text-primary font-bold">Off</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Noise Cancellation</span>
                        <span className="text-primary font-bold">High</span>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
