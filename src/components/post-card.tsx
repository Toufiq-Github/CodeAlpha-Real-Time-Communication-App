
'use client';

import { Post } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href={`/profile/${post.authorName}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <Link href={`/profile/${post.authorName}`} className="font-semibold hover:underline">
              {post.authorName}
            </Link>
            <span className="text-xs text-muted-foreground">
               • {formatDistanceToNow(new Date(post.createdAt))} ago
            </span>
          </div>
          <p className="text-xs text-muted-foreground">@{post.authorName}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="px-4 py-2 text-sm leading-relaxed">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <div className="mt-3 overflow-hidden rounded-lg border bg-muted">
             <img src={post.imageUrl} alt="Post image" className="w-full h-auto object-cover max-h-[400px]" />
          </div>
        )}
      </CardContent>

      <CardFooter className="px-2 py-2 flex items-center gap-1">
        <Button variant="ghost" size="sm" className="flex gap-1.5 text-muted-foreground hover:text-red-500">
          <Heart className="h-4 w-4" />
          <span>{post.likeCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex gap-1.5 text-muted-foreground hover:text-primary">
          <MessageCircle className="h-4 w-4" />
          <span>{post.commentCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
