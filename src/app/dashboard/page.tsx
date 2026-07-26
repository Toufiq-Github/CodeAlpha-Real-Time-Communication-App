'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, where, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Calendar, UserPlus, Clock, Shield, Share2, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Room } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScheduleMeetingModal } from '@/components/dashboard/schedule-meeting-modal';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [roomName, setRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const { user, loading: userLoading } = useUser();
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

  const { data: rooms, loading: roomsLoading } = useCollection<Room>(historyQuery);

  const recentRooms = useMemo(() => {
    if (!rooms) return [];
    return [...rooms].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 10);
  }, [rooms]);

  const handleCreateRoom = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Sync in Progress',
        description: 'Please wait while your profile is being synchronized.',
      });
      return;
    }

    if (!roomName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Title Required',
        description: 'Please provide a title for your workspace session.',
      });
      return;
    }

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
      console.error("Initialization Failed:", error);
      toast({
        variant: 'destructive',
        title: 'Initialization Failed',
        description: 'Could not deploy workspace session. Please check your connection.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 md:pb-0 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Team<span className="text-primary not-italic">Sync</span></h1>
          <p className="text-slate-400 mt-2 text-lg font-medium tracking-tight">
            Execute your objectives, <span className="text-white">{user?.name || 'Member'}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl border-white/5 bg-white/5 gap-2 h-12 px-6 font-bold hover:bg-white/10 transition-all"
              onClick={() => setIsScheduleModalOpen(true)}
              disabled={!user}
            >
                <Calendar className="h-4 w-4 text-primary" />
                Schedule
            </Button>
            <Button className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] primary-gradient blue-glow transition-all hover:scale-105">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Team
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-panel border-none rounded-[2rem] overflow-hidden">
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-xl font-black uppercase tracking-tight text-white">Initialize Session</CardTitle>
            <CardDescription className="text-base font-medium text-slate-400">Deploy a secure professional workspace session.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Session Objective" 
                className="h-14 rounded-xl bg-white/5 border-white/10 text-sm font-medium px-6 focus-visible:ring-primary/50 text-white placeholder:text-slate-600 transition-all"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
              />
              <Button 
                onClick={handleCreateRoom}
                disabled={isCreating || !roomName.trim() || !user}
                className="h-14 rounded-xl px-10 font-black uppercase tracking-widest text-xs primary-gradient blue-glow transition-all hover:scale-105 active:scale-95"
              >
                {isCreating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Launch Room
                    <Video className="ml-3 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-none rounded-[2rem] relative overflow-hidden group bg-primary/5">
          <CardContent className="p-10 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center blue-glow">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Security Protocol</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Enterprise signaling layer with peer discovery and encrypted data channels.</p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">Service: Online</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-panel border-none rounded-[2rem]">
          <CardHeader className="p-10 flex flex-row items-center justify-between border-b border-white/5 mb-6">
            <CardTitle className="text-xl font-black uppercase tracking-tight text-white">Recent Sessions</CardTitle>
            <Clock className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent className="p-10 pt-0 space-y-4">
              {roomsLoading ? (
                <div className="flex items-center gap-3 p-4 opacity-50">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <p className="font-medium text-sm">Syncing archives...</p>
                </div>
              ) : recentRooms && recentRooms.length > 0 ? (
                recentRooms.map(room => (
                  <div 
                    key={room.id} 
                    className="flex flex-col p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                          {room.scheduledAt ? <Calendar className="h-5 w-5 text-primary" /> : <Video className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-base text-white group-hover:text-primary transition-all">{room.name}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 opacity-60">
                            {room.scheduledAt 
                              ? `Scheduled • ${format(new Date(room.scheduledAt), 'MMM d, h:mm a')}`
                              : format(new Date(room.createdAt), 'MMM d • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-700 italic">Audit Only</div>
                    </div>
                    {room.summary && (
                      <div className="mt-4 pl-4 border-l-2 border-primary/30 flex gap-3 items-start">
                        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 line-clamp-2 italic font-medium leading-relaxed">
                          {room.summary}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                  <p className="text-slate-600 font-black uppercase tracking-widest text-xs">No records available</p>
                </div>
              )}
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="glass-panel border-none rounded-[2rem] p-10 space-y-6 bg-gradient-to-br from-primary/10 to-transparent transition-all hover:ring-2 ring-primary/20">
                <Share2 className="h-10 w-10 text-primary blue-glow" />
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Team Unification</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Broadcast secure workspace invites to your entire organization for instant real-time collaboration.</p>
                <Button variant="outline" className="w-full rounded-xl border-white/10 h-14 font-black uppercase tracking-widest text-[10px] bg-white/5 hover:bg-white/10 transition-all" onClick={() => router.push('/dashboard/settings')}>Workspace Config</Button>
            </Card>
        </div>
      </div>

      <ScheduleMeetingModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
      />
    </div>
  );
}