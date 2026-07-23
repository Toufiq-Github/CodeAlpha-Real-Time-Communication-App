
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImagePlus, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function CreatePost() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;

    setIsSubmitting(true);
    const postData = {
      authorId: user.id,
      authorName: user.displayName || user.username,
      authorAvatar: user.avatarUrl || '',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
    };

    const postsCollection = collection(db, 'posts');
    addDoc(postsCollection, postData)
      .then(() => {
        setContent('');
        toast({
          title: "Post shared!",
          description: "Your post is now live on the feed.",
        });
      })
      .catch(serverError => {
        const permissionError = new FirestorePermissionError({
          path: postsCollection.path,
          operation: 'create',
          requestResourceData: postData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!user) return null;

  return (
    <Card className="shadow-sm border-primary/10">
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder={`What's on your mind, ${user.displayName}?`}
            className="min-h-[100px] border-none focus-visible:ring-0 bg-transparent text-base resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
            <ImagePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Photo</span>
          </Button>
          <Button 
            disabled={!content.trim() || isSubmitting} 
            onClick={handleSubmit}
            className="rounded-full px-6"
          >
            {isSubmitting ? 'Posting...' : (
              <>
                Post
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
