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
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[12px]">Synchronizing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
        <div>
          <h1 className="text-[32px] font-extrabold tracking-tight text-foreground">{getGreeting()}, {user?.name?.split(' ')[0] || 'Team'} 👋</h1>
          <p className="text-secondary-text text-[18px] font-medium tracking-tight mt-2">
            Ready to collaborate with your team today?
          </p>
        </div>
        <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsScheduleModalOpen(true)}
              disabled={!user}
            >
                <Calendar className="h-[22px] w-[22px] text-primary" />
                Schedule
            </Button>
            <Button className="font-semibold uppercase tracking-widest text-[12px]">
                <UserPlus className="h-[22px] w-[22px] mr-2" />
                Invite Team
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[28px] font-bold">Initialize Session</CardTitle>
            <CardDescription className="text-lg">Deploy a secure professional workspace session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Session Objective" 
                className="flex-1"
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
                    Launch Room
                    <Video className="ml-3 h-[22px] w-[22px]" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="h-full flex flex-col justify-between py-8">
            <div className="space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-[22px] font-bold tracking-tight text-white">Security Protocol</h3>
                <p className="text-base text-secondary-text font-medium leading-relaxed mt-2">Enterprise signaling layer with peer discovery and encrypted data channels.</p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-success">Service: Online</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6">
            <CardTitle>Recent Sessions</CardTitle>
            <Clock className="h-[22px] w-[22px] text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
              {roomsLoading ? (
                <div className="flex items-center gap-3 p-4 opacity-50">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <p className="font-medium text-sm">Syncing archives...</p>
                </div>
              ) : recentRooms && recentRooms.length > 0 ? (
                recentRooms.map(room => (
                  <div 
                    key={room.id} 
                    className="flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-border hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                          {room.scheduledAt ? <Calendar className="h-6 w-6 text-primary" /> : <Video className="h-6 w-6 text-primary" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[18px] text-foreground group-hover:text-primary transition-all">{room.name}</p>
                          <p className="text-[14px] text-secondary-text font-medium mt-1">
                            {room.scheduledAt 
                              ? `Scheduled • ${format(new Date(room.scheduledAt), 'MMM d, h:mm a')}`
                              : format(new Date(room.createdAt), 'MMM d • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "status-chip",
                        room.scheduledAt ? "text-primary bg-primary/10" : "text-muted-foreground bg-white/5"
                      )}>
                        {room.scheduledAt ? "Scheduled" : "Audit Only"}
                      </span>
                    </div>
                    {room.summary && (
                      <div className="mt-2 pl-4 border-l-2 border-primary/30 flex gap-3 items-start">
                        <Sparkles className="h-[22px] w-[22px] text-primary shrink-0 mt-0.5" />
                        <p className="text-[14px] text-secondary-text italic font-medium leading-relaxed">
                          {room.summary}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-white/[0.01]">
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No records available</p>
                </div>
              )}
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="p-10 space-y-6 bg-gradient-to-br from-primary/10 to-transparent">
                <Share2 className="h-12 w-12 text-primary" />
                <h3 className="text-[22px] font-bold tracking-tight text-white">Team Unification</h3>
                <p className="text-base text-secondary-text font-medium leading-relaxed">Broadcast secure workspace invites to your entire organization for instant real-time collaboration.</p>
                <Button variant="secondary" className="w-full" onClick={() => router.push('/dashboard/settings')}>Workspace Config</Button>
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
