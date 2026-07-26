
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Plus, Search, Calendar, Zap, MessageSquare, Palette } from 'lucide-react';
import { format } from 'date-fns';
import { Room } from '@/lib/types';

export default function CollaborationDashboard() {
  const [roomName, setRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const recentRoomsQuery = user 
    ? query(collection(db, 'rooms'), where('createdBy', '==', user.id), orderBy('createdAt', 'desc'), limit(5)) 
    : null;
  const { data: recentRooms, loading } = useCollection<Room>(recentRoomsQuery);

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
      console.error("Error creating room:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Collaboration Hub</h1>
          <p className="text-muted-foreground font-medium">Welcome back, {user?.name}. Ready for your next session?</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          <Zap className="h-3 w-3" />
          System Active
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Launch */}
        <Card className="md:col-span-2 rounded-[2rem] border-none shadow-2xl bg-card overflow-hidden border border-primary/5">
          <CardHeader>
            <CardTitle className="text-xl font-black uppercase tracking-tight">Launch New Meeting</CardTitle>
            <CardDescription>Start an instant collaborative session with video, chat, and whiteboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input 
                placeholder="Meeting Title (e.g., Weekly Sync)" 
                className="h-12 rounded-xl bg-secondary/50 border-none text-lg"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <Button 
                onClick={handleCreateRoom}
                disabled={isCreating || !roomName.trim()}
                className="h-12 rounded-xl px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
              >
                {isCreating ? 'Deploying...' : 'Start Session'}
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats / Quick Info */}
        <Card className="rounded-[2rem] border-none shadow-2xl bg-primary text-primary-foreground overflow-hidden">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <p className="text-4xl font-black italic tracking-tighter">100%</p>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Encrypted Signaling</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Meetings */}
        <Card className="rounded-[2rem] border-none shadow-xl bg-card border border-muted">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Recent Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Synchronizing records...</p>
              ) : recentRooms && recentRooms.length > 0 ? (
                recentRooms.map(room => (
                  <div 
                    key={room.id} 
                    className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer border border-transparent hover:border-primary/20 group"
                    onClick={() => router.push(`/room/${room.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-tight">{room.name}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                          {format(new Date(room.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest text-primary">Join</Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No recent sessions found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 space-y-3">
             <Palette className="h-6 w-6 text-indigo-500" />
             <h3 className="font-black text-sm uppercase">Whiteboard</h3>
             <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Sync ideas in real-time with your team across a persistent shared canvas.</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 space-y-3">
             <Zap className="h-6 w-6 text-emerald-500" />
             <h3 className="font-black text-sm uppercase">Low Latency</h3>
             <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Ultra-low latency signaling powered by modern WebRTC architecture.</p>
          </div>
          <div className="col-span-2 p-6 rounded-[2rem] bg-secondary border border-muted flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Find team members...</span>
            </div>
            <Button variant="outline" className="rounded-full h-8 px-4 text-[10px] font-black uppercase tracking-widest" onClick={() => router.push('/search')}>Search</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
