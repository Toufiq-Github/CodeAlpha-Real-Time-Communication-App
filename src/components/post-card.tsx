
'use client';

import { Post } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal, Repeat2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likeCount);
  const db = useFirestore();

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);
    
    const postRef = doc(db, 'posts', post.id);
    updateDoc(postRef, {
      likeCount: increment(newLiked ? 1 : -1)
    });
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-card group">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href={`/profile/${post.authorUsername}`}>
          <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback className="bg-primary/5 text-primary font-black">{post.authorName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <Link href={`/profile/${post.authorUsername}`} className="font-black text-sm hover:underline tracking-tight uppercase">
              {post.authorName}
            </Link>
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest">
               • {formatDistanceToNow(new Date(post.createdAt))} AGO
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">@{post.authorUsername}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="px-6 py-2 text-[17px] font-medium leading-relaxed text-foreground/90">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border bg-muted/30">
             <img src={post.imageUrl} alt="Post image" className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 py-3 flex items-center justify-between border-t border-muted/30 mt-2">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full gap-1.5 transition-colors ${liked ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-muted-foreground hover:text-red-500'}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-bold text-xs">{likes}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="rounded-full gap-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5">
            <MessageCircle className="h-5 w-5" />
            <span className="font-bold text-xs">{post.commentCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="rounded-full gap-1.5 text-muted-foreground hover:text-green-500 hover:bg-green-50">
            <Repeat2 className="h-5 w-5" />
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5">
          <Share2 className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
