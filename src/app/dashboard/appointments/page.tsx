'use client';

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

function DoctorName({ doctorId }: { doctorId: string }) {
  const db = useFirestore();
  const { data: doctor, loading } = useDoc(doc(db, 'users', doctorId));

  if (loading) return <Skeleton className="h-4 w-24" />;
  return <>{doctor?.name || 'Unknown Doctor'}</>;
}

export default function PatientAppointmentsPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  
  const appointmentsQuery = user ? query(collection(db, 'appointments'), where('patientUserId', '==', user.id)) : null;
  const { data: appointments, loading: appointmentsLoading } = useCollection<Appointment>(appointmentsQuery);

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Accepted') return 'bg-status-success text-white hover:bg-status-success/80';
    if (status === 'Pending') return 'bg-status-warning text-white hover:bg-status-warning/80';
    if (status === 'Rejected') return 'bg-status-error text-white hover:bg-status-error/80';
    return 'default';
  };

  const isLoading = userLoading || appointmentsLoading;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">My Appointments</h1>
        <p className="text-muted-foreground">
          View and manage your upcoming and past appointments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Consultation Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading appointments...</TableCell>
                </TableRow>
              ) : appointments && appointments.length > 0 ? (
                appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">
                      <DoctorName doctorId={apt.doctorUserId} />
                    </TableCell>
                    <TableCell>{format(new Date(apt.date), 'MMMM d, yyyy, h:mm a')}</TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", getStatusBadgeVariant(apt.status))}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {apt.meetLink ? (
                        <a href={apt.meetLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Join Meeting
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No appointments found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
