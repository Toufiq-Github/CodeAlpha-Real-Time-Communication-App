
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, increment, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImagePlus, Sparkles, Wand2, Plus } from 'lucide-react';
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

  const handleAISuggest = async () => {
    if (!content.trim()) return;
    setIsAssisting(true);
    const result = await getPostAssistance({ draft: content });
    setIsAssisting(false);
    
    if (result.error) {
      toast({ variant: 'destructive', title: 'AI Offline', description: result.error });
    } else if (result.data) {
      setAiSuggestions(result.data);
      toast({
        title: "Magic Applied!",
        description: "Choose an AI version from the sparkle menu.",
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
      toast({ title: "Successfully shared!" });
    } catch (e) {
      toast({ variant: "destructive", title: "Sharing failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="rounded-[32px] border-none shadow-xl bg-card overflow-hidden group">
      <CardContent className="p-6 space-y-4">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/10">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="bg-primary/5 text-primary font-black">{user.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder={`Share something useful, ${user.displayName}...`}
              className="min-h-[120px] border-none focus-visible:ring-0 bg-transparent text-xl font-medium resize-none p-0 placeholder:text-muted-foreground/40 leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {content.length > 0 && (
               <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-1 flex-1 rounded-full bg-accent transition-all overflow-hidden",
                    content.length > 280 ? "bg-destructive/20" : "bg-primary/10"
                  )}>
                    <div 
                      className={cn("h-full transition-all", content.length > 280 ? "bg-destructive" : "bg-primary")} 
                      style={{ width: `${Math.min((content.length / 280) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={cn("text-[10px] font-black tracking-widest uppercase opacity-40", content.length > 280 && "text-destructive opacity-100")}>
                    {content.length}/280
                  </span>
               </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-muted/50">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground/50 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all">
              <ImagePlus className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-2xl transition-all",
                    aiSuggestions ? "text-primary bg-primary/10 animate-pulse" : "text-primary/50 hover:bg-primary/5 hover:text-primary"
                  )}
                  onClick={() => !aiSuggestions && handleAISuggest()}
                  disabled={isAssisting || !content.trim()}
                >
                  {isAssisting ? <Sparkles className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              {aiSuggestions && (
                <DropdownMenuContent align="start" className="w-[320px] rounded-2xl p-2 shadow-2xl border-primary/10">
                  <DropdownMenuLabel className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary px-3 py-2">
                    <Sparkles className="h-3 w-3" />
                    AI Refinements
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {aiSuggestions.suggestions.map((s: string, i: number) => (
                    <DropdownMenuItem key={i} onClick={() => setContent(s)} className="py-3 px-3 cursor-pointer rounded-xl focus:bg-primary/5 group/ai">
                      <div className="text-xs leading-relaxed line-clamp-3 group-hover/ai:text-primary transition-colors">{s}</div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="p-3">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 opacity-50">Standard Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.hashtags.map((h: string) => (
                        <button 
                          key={h} 
                          className="text-[10px] font-black text-primary bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all" 
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
            disabled={!content.trim() || isSubmitting || content.length > 280} 
            onClick={handleSubmit}
            className="rounded-full px-8 h-12 bg-primary font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 uppercase tracking-[0.2em] text-[10px]"
          >
            {isSubmitting ? 'Syncing...' : (
               <>
                  <Plus className="mr-2 h-4 w-4" />
                  Post
               </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
