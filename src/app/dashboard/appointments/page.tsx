import { mockPatientAppointments } from "@/lib/placeholder-data";
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

export default function PatientAppointmentsPage() {

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Accepted') return 'bg-status-success text-white hover:bg-status-success/80';
    if (status === 'Pending') return 'bg-status-warning text-white hover:bg-status-warning/80';
    if (status === 'Rejected') return 'bg-status-error text-white hover:bg-status-error/80';
    return 'default';
  };

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
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Consultation Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPatientAppointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">{apt.doctorName}</TableCell>
                  <TableCell>{format(new Date(apt.date), 'MMMM d, yyyy')}</TableCell>
                  <TableCell>{apt.time}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
