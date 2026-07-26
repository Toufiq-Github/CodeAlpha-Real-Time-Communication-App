
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Globe, Shield, Zap, Sparkles, Layout } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function LandingPage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleQuickMeeting = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        name: `Sync-${Math.random().toString(36).substring(7)}`,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        isActive: true,
      });
      router.push(`/room/${docRef.id}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <header className="container mx-auto py-6 px-6 flex justify-between items-center relative z-10">
        <Logo />
        <div className="flex gap-4">
          {user ? (
            <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full text-white/70 hover:text-white" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="rounded-full px-8 shadow-xl shadow-primary/20" asChild>
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 lg:py-32 relative">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            New: Multi-user Collaborative Whiteboard
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none text-white">
            Better Meetings. <br />
            <span className="text-primary italic">Faster Results.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade video conferencing, real-time shared whiteboards, and instant synchronization. No complex setup, just seamless collaboration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={handleQuickMeeting}
              className="h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30"
              disabled={isCreating}
            >
              {isCreating ? 'Preparing Room...' : 'Start Instant Meeting'}
              <Video className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 px-10 rounded-2xl text-lg font-bold border-white/10 bg-white/5 backdrop-blur-md"
              asChild
            >
              <Link href="/dashboard">View Recent History</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Shield, title: "End-to-End Secure", desc: "Signaling and room data are fully encrypted through Firebase security protocols." },
            { icon: Zap, title: "Zero Latency", desc: "Built on modern WebRTC architecture for near-instant media transmission." },
            { icon: Layout, title: "Hybrid Workflow", desc: "Integrated whiteboard and chat tools to bridge the gap between talk and action." }
          ].map((feature, i) => (
            <Card key={i} className="glass-panel rounded-[2rem] hover:border-primary/30 transition-all group">
              <CardContent className="p-10 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <feature.icon className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
