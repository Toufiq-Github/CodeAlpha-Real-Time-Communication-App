
'use client';

import Link from 'next/link';
import { Home, User, LogOut, PlusSquare, Search } from 'lucide-react';
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
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          Connect
        </Link>

        <div className="hidden md:flex flex-1 max-w-sm mx-8">
           <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search users..."
                className="w-full rounded-full border bg-muted px-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
           </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/profile/${user.username}`}>
                   <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
