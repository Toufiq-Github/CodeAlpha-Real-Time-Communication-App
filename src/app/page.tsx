
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Plus, ArrowRight, Shield, Share2, Palette } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function LandingPage() {
  const [roomName, setRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();

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
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center border-b border-white/5">
        <Logo className="text-white" />
        <div className="flex gap-4">
          {user ? (
            <Button variant="ghost" className="rounded-full" asChild>
              <Link href={`/profile/${user.id}`}>Profile</Link>
            </Button>
          ) : (
            <Button className="rounded-full px-8" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              <Shield className="h-3 w-3" />
              E2E Encrypted Signaling
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight">
              Real-time <br />
              <span className="text-primary italic">Collaboration</span> <br />
              Perfected.
            </h1>
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
              Video calls, screen sharing, and interactive whiteboards. All in one secure, seamless platform built for the modern team.
            </p>

            <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Start a New Meeting</CardTitle>
                <CardDescription className="text-slate-400 text-sm">Create a secure room and invite your team instantly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input 
                    placeholder="Enter meeting name..." 
                    className="bg-white/5 border-white/10 rounded-xl h-12"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                  <Button 
                    className="rounded-xl h-12 px-6 font-black uppercase tracking-widest text-xs"
                    onClick={handleCreateRoom}
                    disabled={!user || isCreating || !roomName.trim()}
                  >
                    {isCreating ? 'Setting up...' : 'Create'}
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                {!user && (
                   <p className="text-xs text-primary/60 font-medium">Please login to create a room.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Video, title: "HD Video", desc: "Crystal clear multi-user streaming" },
              { icon: Share2, title: "Screen Share", desc: "Present your work in real-time" },
              { icon: Palette, title: "Whiteboard", desc: "Sketch ideas collaboratively" },
              { icon: Shield, title: "Secure", desc: "Private WebRTC signaling" },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 hover:bg-white/10 transition-colors">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
