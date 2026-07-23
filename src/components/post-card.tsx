
'use client';

import { Post, Comment } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { doc, updateDoc, increment, deleteDoc, collection, addDoc, query, orderBy, limit, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
      toast({ title: "Post removed from the feed." });
    } catch (e) {
      toast({ variant: "destructive", title: "Action failed" });
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
    <Card className="overflow-hidden border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 rounded-[32px] bg-card group mb-6">
      <CardHeader className="flex flex-row items-center gap-3 p-5">
        <Link href={`/profile/${post.authorUsername}`}>
          <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/40 transition-all duration-300">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-black">{post.authorName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${post.authorUsername}`} className="font-black text-sm hover:text-primary transition-colors tracking-tight uppercase">
              {post.authorName}
            </Link>
            <span className="text-[10px] text-muted-foreground font-black tracking-widest opacity-50">
               • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }).toUpperCase()}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-bold tracking-tight">@{post.authorUsername}</p>
        </div>
        
        {user?.id === post.authorId && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-full"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="px-7 py-2">
        <p className="text-[17px] font-medium leading-[1.6] text-foreground/90 whitespace-pre-wrap selection:bg-primary/20">
          {post.content}
        </p>
        {post.imageUrl && (
          <div className="mt-5 overflow-hidden rounded-[24px] border border-muted bg-muted/20 aspect-video">
             <img src={post.imageUrl} alt="Post preview" className="w-full h-full object-cover" />
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 py-4 flex flex-col mt-4 border-t border-muted/50">
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "rounded-full gap-2 transition-all px-4",
                liked ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-5 w-5", liked && "fill-current scale-110")} />
              <span className="font-black text-xs">{post.likeCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 px-4"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-black text-xs">{post.commentCount}</span>
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground/50 hover:text-primary hover:bg-primary/5 h-10 w-10">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {showComments && (
          <div className="w-full mt-6 space-y-6 pt-4 border-t border-dashed border-muted">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3 group/comment">
                  <Link href={`/profile/${comment.authorUsername}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.authorAvatar} />
                      <AvatarFallback className="text-[10px] bg-primary/5 text-primary">{comment.authorName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-tight">@{comment.authorUsername}</span>
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                        {formatDistanceToNow(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <div className="bg-secondary/40 rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {user && (
              <form onSubmit={handleAddComment} className="flex gap-3 pt-4 relative group/form">
                <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="text-xs">{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                  <Input 
                    placeholder="Write a standard response..." 
                    className="rounded-full h-11 pr-12 text-sm bg-accent/5 border-none focus-visible:ring-2 focus-visible:ring-primary/20 shadow-inner" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!commentText.trim()}
                    className="absolute right-1 top-1 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 transition-transform active:scale-90 disabled:opacity-30"
                  >
                    <Send className="h-4 w-4 text-primary-foreground" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
