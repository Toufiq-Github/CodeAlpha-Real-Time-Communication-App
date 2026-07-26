
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { setHours, setMinutes, formatISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleMeetingModal({ isOpen, onClose }: ScheduleMeetingModalProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('12:00');
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = async () => {
    if (!user || !title.trim() || !date || !time) {
      toast({
        variant: 'destructive',
        title: 'Missing Details',
        description: 'Please provide a title, date, and time for the session.',
      });
      return;
    }

    setIsScheduling(true);
    
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledDate = setMinutes(setHours(date, hours), minutes);

      const roomData = {
        name: title.trim(),
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        scheduledAt: formatISO(scheduledDate),
        isActive: true,
      };

      await addDoc(collection(db, 'rooms'), roomData);
      
      toast({
        title: 'Session Scheduled',
        description: `"${title}" has been successfully planned for ${scheduledDate.toLocaleString()}.`,
      });
      onClose();
      setTitle('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Scheduling Failed',
        description: 'Could not schedule the workspace session. Please try again.',
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] glass-panel border-white/10 p-0 overflow-hidden bg-slate-950">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Schedule Session
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-medium pt-2">
            Plan your next professional objectives with your team.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Session Title</Label>
            <Input 
              id="title"
              placeholder="Enter objective title..."
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-3">
             <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Select Date</Label>
             <div className="flex justify-center bg-white/[0.02] rounded-2xl border border-white/5 p-2">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="text-white"
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                />
             </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="time" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1 flex items-center gap-2">
              <Clock className="h-3 w-3" /> Start Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
            />
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 flex gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isScheduling} className="rounded-xl h-12 font-bold hover:bg-white/5">Cancel</Button>
          <Button onClick={handleSchedule} disabled={isScheduling} className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 flex-1">
            {isScheduling ? 'Scheduling...' : 'Plan Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
