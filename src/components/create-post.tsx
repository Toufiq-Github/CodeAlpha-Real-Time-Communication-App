
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, doc, increment, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImagePlus, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPostAssistance } from '@/app/actions/ai-actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CreatePost() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAssisting, setIsAssisting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const handleAISuggest = async () => {
    if (!content.trim()) return;
    setIsAssisting(true);
    const result = await getPostAssistance({ draft: content });
    setIsAssisting(false);
    
    if (result.error) {
      toast({ variant: 'destructive', title: 'AI Error', description: result.error });
    } else if (result.data) {
      setAiSuggestions(result.data);
      toast({
        title: "AI Suggestions Ready!",
        description: "Check the 'Magic' menu for better versions.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;

    setIsSubmitting(true);
    const postData = {
      authorId: user.id,
      authorName: user.displayName,
      authorUsername: user.username,
      authorAvatar: user.avatarUrl || '',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
    };

    try {
      const batch = writeBatch(db);
      const newPostRef = doc(collection(db, 'posts'));
      batch.set(newPostRef, postData);
      batch.update(doc(db, 'users', user.id), { postCount: increment(1) });
      await batch.commit();
      
      setContent('');
      setAiSuggestions(null);
      toast({ title: "Post shared!" });
    } catch (e) {
      toast({ variant: "destructive", title: "Post failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="shadow-sm border-primary/10 overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder={`What's on your mind, ${user.displayName}?`}
            className="min-h-[100px] border-none focus-visible:ring-0 bg-transparent text-lg resize-none p-0 placeholder:text-muted-foreground/50"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-primary/5 hover:text-primary">
              <ImagePlus className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary rounded-full hover:bg-primary/10"
                  onClick={() => !aiSuggestions && handleAISuggest()}
                  disabled={isAssisting || !content.trim()}
                >
                  {isAssisting ? <Sparkles className="h-5 w-5 animate-pulse" /> : <Wand2 className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              {aiSuggestions && (
                <DropdownMenuContent align="start" className="w-80">
                  <DropdownMenuLabel>AI Post Assistant</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {aiSuggestions.suggestions.map((s: string, i: number) => (
                    <DropdownMenuItem key={i} onClick={() => setContent(s)} className="py-2 cursor-pointer">
                      <div className="text-xs line-clamp-3">{s}</div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Hashtags</div>
                    <div className="flex flex-wrap gap-1">
                      {aiSuggestions.hashtags.map((h: string) => (
                        <span key={h} className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded cursor-pointer" onClick={() => setContent(prev => prev + " " + h)}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>

          <Button 
            disabled={!content.trim() || isSubmitting} 
            onClick={handleSubmit}
            className="rounded-full px-6 bg-primary font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
