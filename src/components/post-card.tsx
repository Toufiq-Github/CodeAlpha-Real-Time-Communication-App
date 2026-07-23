
'use client';

import { Post, Comment } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal, Repeat2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { doc, updateDoc, increment, deleteDoc, collection, addDoc, query, orderBy, limit, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const commentsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'posts', post.id, 'comments'), 
      orderBy('createdAt', 'asc'),
      limit(50)
    );
  }, [db, post.id]);

  const { data: comments } = useCollection<Comment>(commentsQuery);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    
    const postRef = doc(db, 'posts', post.id);
    updateDoc(postRef, {
      likeCount: increment(newLiked ? 1 : -1)
    });
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.authorId) return;
    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'posts', post.id));
      batch.update(doc(db, 'users', user.id), { postCount: increment(-1) });
      await batch.commit();
      toast({ title: "Post deleted" });
    } catch (e) {
      toast({ variant: "destructive", title: "Failed to delete post" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    const commentData = {
      postId: post.id,
      authorId: user.id,
      authorName: user.displayName,
      authorUsername: user.username,
      authorAvatar: user.avatarUrl || '',
      content: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'posts', post.id, 'comments'), commentData);
      await updateDoc(doc(db, 'posts', post.id), {
        commentCount: increment(1)
      });
      setCommentText('');
    } catch (e) {
      toast({ variant: "destructive", title: "Comment failed" });
    }
  };

  if (isDeleting) return null;

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
        
        {user?.id === post.authorId && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="px-6 py-2 text-[17px] font-medium leading-relaxed text-foreground/90">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border bg-muted/30">
             <img src={post.imageUrl} alt="Post image" className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 py-3 flex flex-col border-t border-muted/30 mt-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-full gap-1.5 transition-colors ${liked ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-muted-foreground hover:text-red-500'}`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
              <span className="font-bold text-xs">{post.likeCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full gap-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-bold text-xs">{post.commentCount}</span>
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {showComments && (
          <div className="w-full mt-4 space-y-4">
            <div className="space-y-3">
              {comments?.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={comment.authorAvatar} />
                    <AvatarFallback className="text-[10px]">{comment.authorName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-secondary/30 rounded-2xl px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold">@{comment.authorUsername}</span>
                      <span className="text-[8px] text-muted-foreground font-bold uppercase">
                        {formatDistanceToNow(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <p className="text-xs leading-normal">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {user && (
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <Input 
                  placeholder="Write a comment..." 
                  className="rounded-full h-9 text-xs bg-muted/50 border-none focus-visible:ring-1" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" size="sm" className="rounded-full h-9 px-4 font-bold uppercase tracking-tighter text-[10px]">
                  Post
                </Button>
              </form>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
