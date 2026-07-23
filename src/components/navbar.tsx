
'use client';

import Link from 'next/link';
import { Home, User, LogOut, Search, Bell } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary uppercase">
          ConnectHub
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {user && (
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-background"></span>
            </Button>
          )}

          {user ? (
            <>
              <Button variant="ghost" size="sm" className="rounded-full pl-1 pr-3 gap-2" asChild>
                <Link href={`/profile/${user.username}`}>
                   <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline font-bold text-[10px] uppercase tracking-widest">Profile</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button className="rounded-full font-bold px-6" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
