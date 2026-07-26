'use client';
import { useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Calendar } from "lucide-react";
import { format } from 'date-fns';
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, where, doc, updateDoc } from "firebase/firestore";
import { Appointment } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";

function PatientName({ patientId }: { patientId: string }) {
  const db = useFirestore();
  const patientRef = useMemo(() => patientId ? doc(db, 'users', patientId) : null, [db, patientId]);
  const { data: patient, loading } = useDoc(patientRef);

  if (loading) return <Skeleton className="h-4 w-24" />;
  return <span className="font-semibold text-white uppercase tracking-tight">{patient?.name || 'Unknown Patient'}</span>;
}

export default function DoctorDashboardPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const appointmentsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'appointments'), where('doctorUserId', '==', user.id));
  }, [db, user]);
  
  const { data: appointments, loading: appointmentsLoading } = useCollection<Appointment>(appointmentsQuery);

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Accepted') return 'bg-white text-black hover:bg-white/90 border-transparent';
    if (status === 'Pending') return 'bg-transparent text-[#B3B3B3] border-[#404040]';
    if (status === 'Rejected') return 'bg-transparent text-destructive border-destructive/30';
    return 'default';
  };
  
  const handleAppointmentUpdate = (appointmentId: string, newStatus: "Accepted" | "Rejected") => {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    
    const updateData: { status: string; meetLink?: string; } = { status: newStatus };
    if (newStatus === 'Accepted') {
      updateData.meetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`;
    }

    updateDoc(appointmentRef, updateData)
    .then(() => {
        toast({
            title: "Appointment Updated",
            description: `The appointment has been ${newStatus.toLowerCase()}.`,
        });
    })
    .catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: appointmentRef.path,
            operation: 'update',
            requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }

  const isLoading = userLoading || appointmentsLoading;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tighter text-white uppercase">Appointment Requests</h1>
        <p className="text-[#B3B3B3] text-lg font-medium tracking-tight">Review and manage incoming patient appointment requests.</p>
      </div>

      <Card className="border-[#404040] bg-[#171717] overflow-hidden">
        <CardHeader className="border-b border-[#404040] p-8">
          <CardTitle className="text-xl font-semibold uppercase text-white flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#D5D5D5]" />
            Incoming Consultations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-[#404040] hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-14 px-8">Patient</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-14">Date & Time</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-14">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-14 text-right px-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 opacity-50">Synchronizing data...</TableCell>
                </TableRow>
              ) : appointments && appointments.length > 0 ? (
                appointments.map((apt) => (
                  <TableRow key={apt.id} className="border-[#404040] hover:bg-white/[0.02] transition-all">
                    <TableCell className="px-8 h-20">
                      <PatientName patientId={apt.patientUserId} />
                    </TableCell>
                    <TableCell className="text-[#B3B3B3] font-medium">
                      {format(new Date(apt.date), 'MMM d, yyyy, h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1", getStatusBadgeVariant(apt.status))}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      {apt.status === "Pending" ? (
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="icon" className="h-9 w-9 border-[#404040] hover:bg-white hover:text-black transition-all" onClick={() => handleAppointmentUpdate(apt.id, 'Accepted')}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-9 w-9 border-[#404040] hover:bg-destructive hover:text-white transition-all" onClick={() => handleAppointmentUpdate(apt.id, 'Rejected')}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#808080]">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-24 text-[#808080] font-medium">No pending appointment requests found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
