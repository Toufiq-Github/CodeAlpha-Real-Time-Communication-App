'use client';

import { useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, FileUp, Sparkles } from 'lucide-react';
import { ChatMessage, UserProfile } from '@/lib/types';
import { format } from 'date-fns';

interface ChatPanelProps {
  roomId: string;
  user: UserProfile;
  onClose: () => void;
}

export function ChatPanel({ roomId, user, onClose }: ChatPanelProps) {
  const [text, setText] = useState('');
  const db = useFirestore();
  
  const chatQuery = query(
    collection(db, 'rooms', roomId, 'messages'), 
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const { data: messages } = useCollection<ChatMessage>(chatQuery);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, 'rooms', roomId, 'messages'), {
      senderId: user.id,
      senderName: user.name,
      text: text.trim(),
      createdAt: new Date().toISOString()
    });
    setText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-full sm:w-80 bg-slate-950/95 sm:bg-slate-900 border-l border-white/5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 backdrop-blur-xl">
      <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-black text-xs uppercase tracking-[0.2em]">In-Room Chat</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4 scrollbar-hide">
        {messages?.map(msg => (
          <div key={msg.id} className={`flex flex-col gap-1 ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
              {msg.senderName} • {format(new Date(msg.createdAt), 'h:mm a')}
            </span>
            <div className={`px-4 py-2 rounded-2xl text-xs md:text-sm max-w-[90%] sm:max-w-[85%] ${
              msg.senderId === user.id ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 mt-20 px-6">
            <MessageSquare className="h-12 w-12 mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 pb-8 sm:pb-4">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-xl bg-white/5 hover:bg-white/10 hidden xs:flex">
            <FileUp className="h-4 w-4" />
          </Button>
          <div className="relative flex-1">
             <Input 
                placeholder="Message..." 
                className="bg-white/5 border-none h-11 rounded-xl pr-10 text-sm focus-visible:ring-1 focus-visible:ring-primary/50 text-white"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!text.trim()}
                className="absolute right-1 top-1 h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 transition-all active:scale-90 disabled:opacity-30"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { MessageSquare } from 'lucide-react';