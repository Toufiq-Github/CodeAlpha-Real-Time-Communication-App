'use client';
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCollection, useDoc, useFirestore, useUser } from "@/firebase";
import { collection, doc, query, where } from "firebase/firestore";
import { Appointment, UserProfile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

function PatientCard({ patientId }: { patientId: string }) {
  const db = useFirestore();
  const { data: patient, loading } = useDoc(doc(db, 'users', patientId)) as { data: UserProfile | null, loading: boolean };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardHeader>
        <CardContent>
           <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!patient) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
            <AvatarImage src={`https://avatar.vercel.sh/${patient.email}.png`} alt={patient.name} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <CardTitle>{patient.name}</CardTitle>
            <CardDescription>{patient.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
         <div>
            <label htmlFor={`image-upload-${patient.id}`} className="block text-sm font-medium text-foreground mb-1">Upload Retinal Image</label>
            <div className="flex gap-2">
                <Input id={`image-upload-${patient.id}`} type="file" />
                <Button>Upload</Button>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DoctorPatientsPage() {
  const { user } = useUser();
  const db = useFirestore();

  const appointmentsQuery = user ? query(collection(db, 'appointments'), where('doctorUserId', '==', user.id)) : null;
  const { data: appointments, loading } = useCollection<Appointment>(appointmentsQuery);

  const [searchQuery, setSearchQuery] = useState('');

  const patientIds = useMemo(() => {
    if (!appointments) return [];
    const ids = appointments.map(a => a.patientUserId);
    return [...new Set(ids)];
  }, [appointments]);

  // In a real app, you'd filter the patient list on the server or client side
  // For this demo, the list is small so we won't implement search filtering.

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Patient Records</h1>
        <p className="text-muted-foreground">
          Manage patient information and upload retinal/fundus images.
        </p>
      </div>

      <div className="mb-4">
        <Input 
          placeholder="Search patients..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
           Array.from({ length: 3 }).map((_, i) => <PatientCard key={i} patientId="" />)
        ) : patientIds.length > 0 ? (
          patientIds.map(patientId => (
            <PatientCard key={patientId} patientId={patientId} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No patients found.</p>
        )}
      </div>
    </div>
  );
}
