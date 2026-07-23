
'use client';

import Link from 'next/link';
import { Home, User, LogOut, Search, Bell } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

export function Navbar() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = () => {
    signOut(auth).then(() => router.push('/login'));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary">
          CONNECT
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-8">
           <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search people..."
                className="w-full rounded-full border bg-muted/50 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </form>

        <div className="flex items-center gap-1 md:gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/">
              <Home className="h-5 w-5" />
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
                  <span className="hidden lg:inline font-semibold text-sm">Profile</span>
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
