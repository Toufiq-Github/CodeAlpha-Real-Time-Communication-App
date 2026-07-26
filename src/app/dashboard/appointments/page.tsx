'use client';

import { useMemo } from "react";
import { useCollection, useDoc, useFirestore, useUser } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Appointment } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

export const dynamic = 'force-dynamic';

function DoctorName({ doctorId }: { doctorId: string }) {
  const db = useFirestore();
  const doctorRef = useMemo(() => {
    if (!db || !doctorId || typeof doctorId !== 'string' || doctorId.trim() === '') return null;
    return doc(db, 'users', doctorId);
  }, [db, doctorId]);
  
  const { data: doctor, loading } = useDoc(doctorRef);

  if (loading) return <Skeleton className="h-4 w-24" />;
  return <span className="font-semibold text-white uppercase tracking-tight">{doctor?.name || 'Unknown Doctor'}</span>;
}

export default function PatientAppointmentsPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  
  const appointmentsQuery = useMemo(() => {
    if (!db || !user?.id) return null;
    return query(collection(db, 'appointments'), where('patientUserId', '==', user.id));
  }, [db, user?.id]);

  const { data: appointments, loading: appointmentsLoading } = useCollection<Appointment>(appointmentsQuery);

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Accepted') return 'bg-white text-black hover:bg-white/90 border-transparent';
    if (status === 'Pending') return 'bg-transparent text-[#B3B3B3] border-[#404040]';
    if (status === 'Rejected') return 'bg-transparent text-destructive border-destructive/30';
    return 'default';
  };

  const isLoading = userLoading || appointmentsLoading;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tighter text-white uppercase">My Appointments</h1>
        <p className="text-[#B3B3B3] text-lg font-medium tracking-tight">View and manage your upcoming and past consultations.</p>
      </div>

      <Card className="border-[#404040] bg-[#171717] overflow-hidden">
        <CardHeader className="border-b border-[#404040] p-8">
          <CardTitle className="text-xl font-semibold uppercase text-white flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#D5D5D5]" />
            Session History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-[#404040] hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-14 px-8">Specialist</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-14">Date & Time</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-14">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-14 text-right px-8">Consultation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 opacity-50">Syncing workspace...</TableCell>
                </TableRow>
              ) : appointments && appointments.length > 0 ? (
                appointments.map((apt) => (
                  <TableRow key={apt.id} className="border-[#404040] hover:bg-white/[0.02] transition-all">
                    <TableCell className="px-8 h-20">
                      <DoctorName doctorId={apt.doctorUserId} />
                    </TableCell>
                    <TableCell className="text-[#B3B3B3] font-medium">{format(new Date(apt.date), 'MMMM d, yyyy, h:mm a')}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1", getStatusBadgeVariant(apt.status))}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      {apt.meetLink ? (
                        <a href={apt.meetLink} target="_blank" rel="noopener noreferrer" className="text-white hover:underline text-[10px] font-bold uppercase tracking-widest">
                          Join Meeting
                        </a>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#808080]">TBD</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-24 text-[#808080] font-medium">Your appointment history is currently empty.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}