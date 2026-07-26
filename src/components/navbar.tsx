'use client';

import Link from 'next/link';
import { Home, LogOut, Search, Bell, Sparkles } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth).then(() => router.push('/login'));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-muted/50 bg-background/70 backdrop-blur-2xl">
      <div className="container mx-auto flex h-18 md:h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-primary rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-primary/20">
             <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground uppercase group-hover:text-primary transition-colors">
            OmniMeet
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary" asChild title="Home">
            <Link href="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary" asChild title="Search">
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {user && (
            <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-primary/5 hover:text-primary hidden md:inline-flex" title="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-background animate-pulse"></span>
            </Button>
          )}

          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-muted">
              <Button variant="ghost" size="sm" className="rounded-full pl-1 pr-4 gap-3 bg-accent/30 hover:bg-primary/10 transition-colors h-10" asChild>
                <Link href="/dashboard">
                   <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary">{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline font-black text-[10px] uppercase tracking-[0.2em] text-primary">Workspace</span>
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 h-10 w-10" 
                onClick={handleSignOut}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button className="rounded-full font-black px-10 h-11 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px]" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}