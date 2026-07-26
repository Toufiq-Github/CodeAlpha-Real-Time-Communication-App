
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { VideoRoom } from '@/components/video/video-room';
import { Skeleton } from '@/components/ui/skeleton';
import { Room } from '@/lib/types';

export default function RoomPage() {
  const { roomId } = useParams() as { roomId: string };
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const roomRef = doc(db, 'rooms', roomId);
  const { data: room, loading: roomLoading } = useDoc<Room>(roomRef);

  if (userLoading || roomLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton className="h-12 w-48 bg-white/5" />
          <Skeleton className="h-[60vh] w-full bg-white/5 rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Room Expired</h1>
        <p className="text-slate-400 mb-8">This meeting link is no longer valid or has been closed.</p>
        <Button onClick={() => router.push('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      <VideoRoom roomId={roomId} user={user} roomName={room.name} />
    </div>
  );
}
