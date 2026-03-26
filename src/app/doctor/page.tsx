'use client';
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
import { Check, X } from "lucide-react";
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
  const { data: patient, loading } = useDoc(doc(db, 'users', patientId));

  if (loading) return <Skeleton className="h-4 w-24" />;
  return <>{patient?.name || 'Unknown Patient'}</>;
}


export default function DoctorDashboardPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const appointmentsQuery = user ? query(collection(db, 'appointments'), where('doctorUserId', '==', user.id)) : null;
  const { data: appointments, loading: appointmentsLoading } = useCollection<Appointment>(appointmentsQuery);

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Accepted') return 'bg-status-success text-white hover:bg-status-success/80';
    if (status === 'Pending') return 'bg-status-warning text-white hover:bg-status-warning/80';
    if (status === 'Rejected') return 'bg-status-error text-white hover:bg-status-error/80';
    return 'default';
  };
  
  const handleAppointmentUpdate = (appointmentId: string, newStatus: "Accepted" | "Rejected") => {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    
    const updateData: { status: string; meetLink?: string; } = { status: newStatus };
    if (newStatus === 'Accepted') {
      // Generate a dummy meeting link for this demo
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
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Appointment Requests</h1>
        <p className="text-muted-foreground">
          Review and manage incoming patient appointment requests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading appointments...</TableCell>
                </TableRow>
              ) : appointments && appointments.length > 0 ? (
                appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">
                      <PatientName patientId={apt.patientUserId} />
                    </TableCell>
                    <TableCell>{format(new Date(apt.date), 'MMM d, yyyy, h:mm a')}</TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", getStatusBadgeVariant(apt.status))}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {apt.status === "Pending" ? (
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="icon" className="h-8 w-8 border-status-success text-status-success hover:bg-status-success/10 hover:text-status-success" onClick={() => handleAppointmentUpdate(apt.id, 'Accepted')}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 border-status-error text-status-error hover:bg-status-error/10 hover:text-status-error" onClick={() => handleAppointmentUpdate(apt.id, 'Rejected')}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No appointments found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
