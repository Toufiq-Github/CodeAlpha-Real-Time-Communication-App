'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { UserProfile, Participant, Room } from '@/lib/types';
import { useFirestore, useCollection } from '@/firebase';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, 
  MessageSquare, Share2, Clock, LogOut, Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatPanel } from './chat-panel';
import { useToast } from '@/hooks/use-toast';
import { differenceInSeconds } from 'date-fns';

interface VideoRoomProps {
  roomId: string;
  user: UserProfile;
  room: Room;
}

export function VideoRoom({ roomId, user, room }: VideoRoomProps) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | null>(null);
  const [timeLeft, setTimeLeft] = useState(3600);
  const { toast } = useToast();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const db = useFirestore();

  const participantsRef = useMemo(() => {
    if (!db || !roomId) return null;
    return collection(db, 'rooms', roomId, 'participants');
  }, [db, roomId]);

  const { data: participants } = useCollection<Participant>(participantsRef);

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(room.createdAt);
      const now = new Date();
      const elapsed = differenceInSeconds(now, start);
      const remaining = 3600 - elapsed;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [room.createdAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!db || !roomId || !user) return;

    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        
        stream.getAudioTracks().forEach(t => t.enabled = false);
        stream.getVideoTracks().forEach(t => t.enabled = false);
      } catch (err) {
        toast({ variant: 'destructive', title: 'Media Denied', description: 'Please allow camera access.' });
      }
    }
    startMedia();

    const participantRef = doc(db, 'rooms', roomId, 'participants', user.id);
    setDoc(participantRef, {
      userId: user.id,
      displayName: user.name,
      joinedAt: new Date().toISOString(),
      isCameraOn: false,
      isMicOn: false
    });

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      deleteDoc(participantRef).catch(() => {});
    };
  }, [roomId, user?.id, user?.name, db, toast]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        setDoc(doc(db, 'rooms', roomId, 'participants', user.id), { isMicOn: audioTrack.enabled }, { merge: true });
      }
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
        setDoc(doc(db, 'rooms', roomId, 'participants', user.id), { isCameraOn: videoTrack.enabled }, { merge: true });
      }
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Invite Link Copied" });
  };

  const handleLeave = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden relative selection:bg-white/10">
      <div className="flex-1 flex flex-col relative">
        <header className="px-6 py-4 flex justify-between items-center bg-[#0B0B0B]/75 backdrop-blur-xl absolute top-0 left-0 right-0 z-50 border-b border-[#303030]">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg white-glow shrink-0">
              <Share2 className="h-6 w-6 text-black" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm tracking-tight truncate text-white uppercase">{room.name}</h2>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#77DD77] animate-pulse shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#77DD77]">Live • {participants?.length || 1} Participants</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#303030] bg-[#1A1A1A] shrink-0 transition-all",
              timeLeft < 300 ? "text-[#EF4444] animate-pulse" : "text-[#FFFFFF]"
            )}>
              <Clock className="h-4 w-4" />
              <span className="text-xs font-black font-code tracking-widest">{formatTime(timeLeft)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyInvite}
                  className="rounded-xl border-[#303030] hover:bg-white/5 text-xs font-bold gap-2 hidden sm:flex text-white"
              >
                <LinkIcon className="h-4 w-4" />
                Invite
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="rounded-xl h-10 px-4 gap-2 font-black uppercase tracking-widest text-[10px] shadow-lg"
                onClick={handleLeave}
              >
                <LogOut className="h-4 w-4" />
                <span>Leave</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 pt-24 pb-32 overflow-y-auto">
          <div className="meeting-grid w-full max-w-7xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-[#171717] aspect-video flex items-center justify-center group border border-[#2D2D2D] shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={cn("w-full h-full object-cover transition-opacity duration-500", !isCamOn ? "opacity-0" : "opacity-100")}
              />
              {!isCamOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                  <div className="h-32 w-32 rounded-full bg-white/5 flex items-center justify-center text-4xl font-black text-white border border-[#303030]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-[#9A9A9A] font-black uppercase tracking-widest text-xs">Video Paused</span>
                </div>
              )}
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-[#0B0B0B]/80 text-[10px] font-black uppercase tracking-widest text-white border border-[#303030]">
                You (Host)
              </div>
            </div>

            {participants?.filter(p => p.userId !== user.id).map(p => (
              <div key={p.userId} className="relative rounded-3xl overflow-hidden bg-[#171717]/50 aspect-video flex items-center justify-center border border-[#2D2D2D] transition-all hover:bg-[#1F1F1F]">
                 <div className="flex flex-col items-center gap-6">
                    <div className="h-32 w-32 rounded-full bg-white/5 border border-[#303030] flex items-center justify-center text-4xl font-black text-[#BDBDBD]">
                      {p.displayName.charAt(0)}
                    </div>
                    <span className="text-[#9A9A9A] font-black uppercase tracking-widest text-xs">{p.displayName}</span>
                </div>
                <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-[#0B0B0B]/80 text-[10px] font-black uppercase tracking-widest text-white border border-[#303030]">
                  {p.displayName}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-5 rounded-[2.5rem] bg-[#0B0B0B]/90 border border-[#303030] backdrop-blur-xl z-50 transition-all duration-300">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-2xl transition-all shadow-lg shrink-0",
                isMicOn ? "bg-white text-black scale-110 white-glow" : "bg-[#1A1A1A] text-[#BDBDBD] hover:bg-[#262626] border border-[#303030]"
              )}
              onClick={toggleMic}
            >
              {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-2xl transition-all shadow-lg shrink-0",
                isCamOn ? "bg-white text-black scale-110 white-glow" : "bg-[#1A1A1A] text-[#BDBDBD] hover:bg-[#262626] border border-[#303030]"
              )}
              onClick={toggleCam}
            >
              {isCamOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>
          </div>
          
          <div className="w-px h-10 bg-[#303030] mx-2" />
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 text-[#BDBDBD] shrink-0 transition-all"
              title="Screen Share"
            >
              <ScreenShare className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-2xl transition-all bg-white/5 relative shrink-0",
                activeTab === 'chat' ? "text-white bg-[#262626] ring-1 ring-[#404040]" : "text-[#BDBDBD] hover:bg-white/10"
              )}
              onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
            >
              <MessageSquare className="h-6 w-6" />
              <div className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-white border-2 border-[#0B0B0B]" />
            </Button>
          </div>
        </div>
      </div>

      {activeTab === 'chat' && (
        <ChatPanel roomId={roomId} user={user} onClose={() => setActiveTab(null)} />
      )}
    </div>
  );
}
