'use client';

import { useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, FileUp, Sparkles, MessageSquare } from 'lucide-react';
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
    <div className="fixed inset-y-0 right-0 z-[60] w-full sm:w-80 glass-panel border-l flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-black text-[10px] uppercase tracking-[0.2em] text-white">In-Room Chat</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 transition-all" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4 scrollbar-hide">
        {messages?.map(msg => (
          <div key={msg.id} className={`flex flex-col gap-1.5 ${msg.senderId === user.id ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-1">
              {msg.senderName} • {format(new Date(msg.createdAt), 'h:mm a')}
            </span>
            <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] transition-all ${
              msg.senderId === user.id ? 'bg-primary text-white rounded-tr-none blue-glow' : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 mt-20 px-6">
            <MessageSquare className="h-12 w-12 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Workspace secure chat</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-white/5">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="h-11 w-11 shrink-0 rounded-xl bg-white/5 hover:bg-white/10 hidden xs:flex transition-all">
            <FileUp className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
             <Input 
                placeholder="Message team..." 
                className="bg-white/5 border-none h-11 rounded-xl pr-10 text-sm focus-visible:ring-1 focus-visible:ring-primary/50 text-white placeholder:text-white/20"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!text.trim()}
                className="absolute right-1 top-1 h-9 w-9 rounded-lg primary-gradient transition-all active:scale-90 disabled:opacity-30"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
          </div>
        </form>
      </div>
    </div>
  );
}