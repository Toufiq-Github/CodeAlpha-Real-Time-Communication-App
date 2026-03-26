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
import { Doctor } from '@/lib/types';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { setHours, setMinutes, formatISO } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

export function BookAppointmentModal({ isOpen, onClose, doctor }: BookAppointmentModalProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('10:00');
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async () => {
    if (!user || !date || !time) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a date and time for the appointment.',
      });
      return;
    }

    setIsBooking(true);
    
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = setMinutes(setHours(date, hours), minutes);

    const appointmentData = {
      patientUserId: user.id,
      doctorUserId: doctor.userId,
      date: formatISO(appointmentDate),
      status: 'Pending',
    };

    const appointmentsCollection = collection(db, 'appointments');
    addDoc(appointmentsCollection, appointmentData)
    .then(() => {
        toast({
            title: 'Appointment Requested',
            description: `Your request has been sent to ${doctor.name}.`,
        });
        onClose();
    })
    .catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: appointmentsCollection.path,
            operation: 'create',
            requestResourceData: appointmentData,
        });
        errorEmitter.emit('permission-error', permissionError);
    })
    .finally(() => {
        setIsBooking(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
          <DialogDescription>
            Select a date and time for your consultation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border col-span-4"
                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isBooking}>Cancel</Button>
          <Button onClick={handleBooking} disabled={isBooking}>
            {isBooking ? 'Requesting...' : 'Request Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
