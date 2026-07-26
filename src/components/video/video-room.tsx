
'use client';

import { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, WhiteboardPath } from '@/lib/types';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit, addDoc, doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, 
  MessageSquare, Users, Settings, LogOut, Palette,
  Send, X, LayoutGrid, Maximize
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Whiteboard } from './whiteboard';
import { ChatPanel } from './chat-panel';

interface VideoRoomProps {
  roomId: string;
  user: UserProfile;
  roomName: string;
}

export function VideoRoom({ roomId, user, roomName }: VideoRoomProps) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'users' | 'whiteboard' | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const db = useFirestore();

  // Lifecycle for local media
  useEffect(() => {
    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        
        // Default off
        stream.getAudioTracks().forEach(t => t.enabled = false);
        stream.getVideoTracks().forEach(t => t.enabled = false);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }
    startMedia();

    // Register participant
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
      deleteDoc(participantRef);
    };
  }, [roomId, user.id, user.name, db]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      {/* Main Video Grid */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Header */}
        <div className="p-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-md absolute top-0 left-0 right-0 z-20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Video className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-bold text-sm tracking-tight">{roomName}</h2>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20" onClick={() => window.location.href = '/'}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 p-20 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
          <div className={cn(
            "grid gap-4 w-full h-full max-w-6xl",
            activeTab ? "grid-cols-1" : "grid-cols-2"
          )}>
            {/* Local User */}
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl aspect-video group">
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={cn("w-full h-full object-cover", !isCamOn && "hidden")}
              />
              {!isCamOn && (
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-black text-primary border border-primary/20">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold">
                You (Host)
              </div>
            </div>

            {/* Dummy Remote User for Demo */}
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl aspect-video hidden md:flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                 <div className="h-24 w-24 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-4xl font-black text-slate-700">
                    A
                  </div>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Waiting for participants...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Whiteboard Overlay */}
        {activeTab === 'whiteboard' && (
          <div className="absolute inset-x-20 inset-y-24 z-30">
            <Whiteboard roomId={roomId} userId={user.id} onClose={() => setActiveTab(null)} />
          </div>
        )}

        {/* Controls Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 rounded-[2rem] bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl z-40">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-12 w-12 rounded-2xl transition-all",
              isMicOn ? "bg-primary text-white" : "bg-destructive/10 text-destructive"
            )}
            onClick={toggleMic}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-12 w-12 rounded-2xl transition-all",
              isCamOn ? "bg-primary text-white" : "bg-destructive/10 text-destructive"
            )}
            onClick={toggleCam}
          >
            {isCamOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-primary/20 hover:text-primary"
            title="Screen Share"
          >
            <ScreenShare className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-12 w-12 rounded-2xl transition-all",
              activeTab === 'whiteboard' ? "bg-primary text-white" : "bg-white/5 hover:bg-primary/20"
            )}
            onClick={() => setActiveTab(activeTab === 'whiteboard' ? null : 'whiteboard')}
            title="Whiteboard"
          >
            <Palette className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-12 w-12 rounded-2xl transition-all",
              activeTab === 'chat' ? "bg-primary text-white" : "bg-white/5 hover:bg-primary/20"
            )}
            onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
            title="Chat"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Right Sidebar (Chat/Users) */}
      {activeTab === 'chat' && (
        <ChatPanel roomId={roomId} user={user} onClose={() => setActiveTab(null)} />
      )}
    </div>
  );
}
