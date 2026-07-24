'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, increment, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImagePlus, Sparkles, Wand2, Plus, X } from 'lucide-react';
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
import { cn } from '@/lib/utils';

export function CreatePost() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAssisting, setIsAssisting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const MAX_CHARS = 280;

  const handleAISuggest = async () => {
    if (!content.trim()) return;
    setIsAssisting(true);
    const result = await getPostAssistance({ draft: content });
    setIsAssisting(false);
    
    if (result.error) {
      toast({ variant: 'destructive', title: 'AI Assistant Offline', description: result.error });
    } else if (result.data) {
      setAiSuggestions(result.data);
      toast({
        title: "Magic Applied!",
        description: "Review AI suggestions in the sparkle menu.",
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
      toast({ title: "Post published successfully!" });
    } catch (e) {
      toast({ variant: "destructive", title: "Failed to post. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const charProgress = (content.length / MAX_CHARS) * 100;
  const isOverLimit = content.length > MAX_CHARS;

  return (
    <Card id="post-creator" className="rounded-[2.5rem] border-none shadow-2xl bg-card overflow-hidden group mb-8 border border-primary/5">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex gap-4 md:gap-6">
          <Avatar className="h-14 w-14 border-4 border-primary/10 shadow-lg">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="bg-primary/5 text-primary font-black text-lg">
              {user.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder={`What's on your mind, ${user.displayName?.split(' ')[0]}?`}
              className="min-h-[140px] border-none focus-visible:ring-0 bg-transparent text-xl md:text-2xl font-medium resize-none p-0 placeholder:text-muted-foreground/30 leading-relaxed tracking-tight"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {content.length > 0 && (
               <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-1.5 flex-1 rounded-full bg-secondary/50 transition-all overflow-hidden",
                    isOverLimit && "bg-destructive/10"
                  )}>
                    <div 
                      className={cn(
                        "h-full transition-all duration-300", 
                        isOverLimit ? "bg-destructive" : (charProgress > 90 ? "bg-amber-500" : "bg-primary")
                      )} 
                      style={{ width: `${Math.min(charProgress, 100)}%` }}
                    />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black tracking-widest uppercase transition-colors", 
                    isOverLimit ? "text-destructive" : "text-muted-foreground/50"
                  )}>
                    {content.length} / {MAX_CHARS}
                  </span>
               </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-muted/50">
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground/50 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all h-12 w-12"
              title="Add Media"
            >
              <ImagePlus className="h-6 w-6" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-2xl transition-all h-12 w-12 shadow-inner",
                    aiSuggestions ? "text-primary bg-primary/10 ring-2 ring-primary/20 animate-pulse" : "text-primary/40 hover:bg-primary/5 hover:text-primary"
                  )}
                  onClick={() => !aiSuggestions && handleAISuggest()}
                  disabled={isAssisting || !content.trim()}
                  title="AI Polish"
                >
                  {isAssisting ? <Sparkles className="h-6 w-6 animate-spin" /> : <Wand2 className="h-6 w-6" />}
                </Button>
              </DropdownMenuTrigger>
              {aiSuggestions && (
                <DropdownMenuContent align="start" className="w-[340px] rounded-3xl p-3 shadow-2xl border-primary/10 bg-card/95 backdrop-blur-md">
                  <div className="flex items-center justify-between px-3 py-2">
                    <DropdownMenuLabel className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary p-0">
                      <Sparkles className="h-3 w-3" />
                      AI Refinements
                    </DropdownMenuLabel>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setAiSuggestions(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <DropdownMenuSeparator className="bg-primary/5" />
                  {aiSuggestions.suggestions.map((s: string, i: number) => (
                    <DropdownMenuItem key={i} onClick={() => setContent(s)} className="py-4 px-3 cursor-pointer rounded-2xl focus:bg-primary/5 group/ai mb-1">
                      <div className="text-xs leading-relaxed line-clamp-3 group-hover/ai:text-primary transition-colors italic">"{s}"</div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-primary/5" />
                  <div className="p-3 space-y-3">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">Trending Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.hashtags.map((h: string) => (
                        <button 
                          key={h} 
                          className="text-[10px] font-black text-primary bg-primary/5 px-3 py-2 rounded-xl border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105" 
                          onClick={() => setContent(prev => prev.includes(h) ? prev : prev + " " + h)}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>

          <Button 
            disabled={!content.trim() || isSubmitting || isOverLimit} 
            onClick={handleSubmit}
            className="rounded-full px-10 h-14 bg-primary font-black shadow-[0_10px_30px_-10px_rgba(var(--primary),0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-30 uppercase tracking-[0.2em] text-xs"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Syncing</span>
              </div>
            ) : (
               <>
                  <Plus className="mr-2 h-5 w-5" />
                  Publish
               </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
