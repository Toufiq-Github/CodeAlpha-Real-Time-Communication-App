'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, where, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Calendar, Clock, Shield, Loader2 } from 'lucide-react';
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

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
      <div className="flex h-[80vh] w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-12 w-12 text-foreground animate-spin" />
          <p className="text-muted-foreground font-semibold uppercase tracking-[0.3em] text-[10px]">Synchronizing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-foreground">{getGreeting()}, {user?.name?.split(' ')[0] || 'Team'} 👋</h1>
          <p className="text-muted-foreground text-[14px] font-medium tracking-tight mt-2">
            Ready to collaborate with your team today?
          </p>
        </div>
        <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              className="gap-2 h-10 px-4"
              onClick={() => setIsScheduleModalOpen(true)}
              disabled={!user}
            >
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-[12px] font-semibold uppercase tracking-widest">Schedule</span>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[20px] font-semibold text-foreground uppercase tracking-tight">Initialize Session</CardTitle>
            <CardDescription className="text-[14px] text-card-foreground">Deploy a secure professional workspace session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Session Objective" 
                className="flex-1 text-[14px] h-[52px]"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
              />
              <Button 
                onClick={handleCreateRoom}
                disabled={isCreating || !roomName.trim() || !user}
                className="px-10 h-[52px]"
              >
                {isCreating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.2em]">Launch Room</span>
                    <Video className="ml-3 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="h-full flex flex-col justify-between py-8">
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Shield className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold tracking-tight text-foreground uppercase">Security Protocol</h3>
                <p className="text-[14px] text-card-foreground font-medium leading-relaxed mt-2">Enterprise signaling layer with peer discovery and encrypted data channels.</p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-status-online animate-pulse" />
              <span className="text-[9px] font-semibold uppercase tracking-widest text-[#77DD77]">Service: Online</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6">
            <CardTitle className="text-[18px] text-foreground uppercase tracking-tight">Recent Sessions</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-8 space-y-4">
              {roomsLoading ? (
                <div className="flex items-center gap-3 p-4 opacity-50">
                  <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                  <p className="font-medium text-[12px] text-card-foreground">Syncing archives...</p>
                </div>
              ) : recentRooms && recentRooms.length > 0 ? (
                recentRooms.map(room => (
                  <div 
                    key={room.id} 
                    className="flex flex-col p-5 rounded-2xl bg-muted/30 border border-border hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-all">
                          {room.scheduledAt ? <Calendar className="h-5 w-5 text-foreground" /> : <Video className="h-5 w-5 text-foreground" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[14px] text-foreground transition-all uppercase tracking-tight">{room.name}</p>
                          <p className="text-[11px] text-muted-foreground font-medium mt-1">
                            {room.scheduledAt 
                              ? `Scheduled • ${format(new Date(room.scheduledAt), 'MMM d, h:mm a')}`
                              : format(new Date(room.createdAt), 'MMM d • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "status-chip text-[9px]",
                        room.scheduledAt ? "status-scheduled" : "bg-background text-muted-foreground border border-border"
                      )}>
                        {room.scheduledAt ? "Scheduled" : "Audit Only"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-white/[0.01]">
                  <p className="text-muted-foreground font-semibold uppercase tracking-widest text-[9px]">No records available</p>
                </div>
              )}
          </CardContent>
        </Card>

        <Card className="p-8 space-y-6">
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Shield className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-[16px] font-semibold tracking-tight text-foreground uppercase">Team Unification</h3>
            <p className="text-[14px] text-card-foreground font-medium leading-relaxed">Broadcast secure workspace invites to your entire organization for instant real-time collaboration.</p>
            <Button variant="secondary" className="w-full h-11 text-[12px] font-semibold uppercase tracking-widest" onClick={() => router.push('/dashboard/settings')}>Workspace Config</Button>
        </Card>
      </div>

      <ScheduleMeetingModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
      />
    </div>
  );
}