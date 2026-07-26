'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { UserProfile, Participant } from '@/lib/types';
import { useFirestore, useCollection } from '@/firebase';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, 
  MessageSquare, Users, Settings, LogOut, Palette,
  Link as LinkIcon, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Whiteboard } from './whiteboard';
import { ChatPanel } from './chat-panel';
import { useToast } from '@/hooks/use-toast';

interface VideoRoomProps {
  roomId: string;
  user: UserProfile;
  roomName: string;
}

export function VideoRoom({ roomId, user, roomName }: VideoRoomProps) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'users' | 'whiteboard' | null>(null);
  const { toast } = useToast();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const db = useFirestore();

  const participantsQuery = useMemo(() => {
    if (!db || !roomId) return null;
    return collection(db, 'rooms', roomId, 'participants');
  }, [db, roomId]);

  const { data: participants } = useCollection<Participant>(participantsQuery);

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
        console.error("Error accessing media devices:", err);
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
  }, [roomId, user?.id, user?.name, db]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        const participantRef = doc(db, 'rooms', roomId, 'participants', user.id);
        setDoc(participantRef, { isMicOn: audioTrack.enabled }, { merge: true });
      }
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
        const participantRef = doc(db, 'rooms', roomId, 'participants', user.id);
        setDoc(participantRef, { isCameraOn: videoTrack.enabled }, { merge: true });
      }
    }
  };

  const handleCopyInvite = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Invite Link Copied!",
      description: "Share this URL with others to let them join this meeting.",
    });
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden relative">
      <div className="flex-1 flex flex-col relative transition-all duration-300">
        <div className="p-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-md absolute top-0 left-0 right-0 z-20 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Share2 className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-bold text-sm tracking-tight text-white">{roomName}</h2>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Session
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyInvite}
              className="rounded-full bg-white/5 border-white/10 hover:bg-primary/20 hover:text-primary transition-all text-xs font-black uppercase tracking-widest gap-2 hidden md:flex"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Copy Invite Link
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20" onClick={() => window.location.href = '/dashboard'}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 pt-20 pb-28">
          <div className={cn(
            "grid gap-6 w-full h-full max-w-6xl transition-all duration-500",
            (participants && participants.length > 1) ? "md:grid-cols-2" : "grid-cols-1"
          )}>
            <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl aspect-video group flex items-center justify-center">
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={cn("w-full h-full object-cover transition-opacity duration-300", !isCamOn ? "opacity-0" : "opacity-100")}
              />
              {!isCamOn && (
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
                  <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-5xl font-black text-primary border border-primary/20 shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Camera Disabled</span>
                </div>
              )}
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-white shadow-xl">
                You (Host)
              </div>
            </div>

            {participants?.filter(p => p.userId !== user.id).map(p => (
              <div key={p.id} className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl aspect-video flex items-center justify-center">
                 <div className="flex flex-col items-center gap-6">
                   <div className="h-32 w-32 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-5xl font-black text-slate-700">
                      {p.displayName.charAt(0)}
                    </div>
                    <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">{p.displayName}</span>
                </div>
                <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-slate-300">
                  {p.displayName}
                </div>
              </div>
            ))}

            {(!participants || participants.length === 1) && (
               <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900/30 border border-white/5 border-dashed flex items-center justify-center aspect-video hidden md:flex">
                  <div className="flex flex-col items-center gap-6 text-center">
                    <Users className="h-12 w-12 text-slate-800" />
                    <span className="text-slate-700 font-black uppercase tracking-widest text-[10px]">Invite team members to begin</span>
                    <Button 
                      variant="link" 
                      onClick={handleCopyInvite} 
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80"
                    >
                      Copy Link
                    </Button>
                  </div>
               </div>
            )}
          </div>
        </div>

        {activeTab === 'whiteboard' && (
          <div className="absolute inset-x-8 inset-y-24 md:inset-x-12 md:inset-y-28 z-30 transition-all">
            <Whiteboard roomId={roomId} userId={user.id} onClose={() => setActiveTab(null)} />
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-5 rounded-[2.5rem] bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] z-40">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-2xl transition-all shadow-lg",
                isMicOn ? "bg-primary text-white scale-110" : "bg-destructive/20 text-destructive hover:bg-destructive/30"
              )}
              onClick={toggleMic}
            >
              {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-2xl transition-all shadow-lg",
                isCamOn ? "bg-primary text-white scale-110" : "bg-destructive/20 text-destructive hover:bg-destructive/30"
              )}
              onClick={toggleCam}
            >
              {isCamOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>
          </div>
          
          <div className="w-px h-10 bg-white/10 mx-2" />
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-primary/20 hover:text-primary text-slate-400"
              title="Screen Share"
            >
              <ScreenShare className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-2xl transition-all bg-white/5",
                activeTab === 'whiteboard' ? "text-primary ring-2 ring-primary/20 bg-primary/10" : "text-slate-400 hover:bg-white/10"
              )}
              onClick={() => setActiveTab(activeTab === 'whiteboard' ? null : 'whiteboard')}
              title="Whiteboard"
            >
              <Palette className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-2xl transition-all bg-white/5 relative",
                activeTab === 'chat' ? "text-primary ring-2 ring-primary/20 bg-primary/10" : "text-slate-400 hover:bg-white/10"
              )}
              onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
              title="Chat"
            >
              <MessageSquare className="h-6 w-6" />
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
