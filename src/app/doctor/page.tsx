import { mockDoctorAppointments } from "@/lib/placeholder-data";
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

export default function DoctorDashboardPage() {
    
  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Accepted') return 'bg-status-success text-white hover:bg-status-success/80';
    if (status === 'Pending') return 'bg-status-warning text-white hover:bg-status-warning/80';
    if (status === 'Rejected') return 'bg-status-error text-white hover:bg-status-error/80';
    return 'default';
  };

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
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDoctorAppointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">{apt.patientName}</TableCell>
                  <TableCell>{format(new Date(apt.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{apt.time}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", getStatusBadgeVariant(apt.status))}>
                      {apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {apt.status === "Pending" ? (
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-status-success text-status-success hover:bg-status-success/10 hover:text-status-success">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 border-status-error text-status-error hover:bg-status-error/10 hover:text-status-error">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Processed</span>
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
