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
  const patientRef = useMemo(() => patientId ? doc(db, 'users', patientId) : null, [db, patientId]);
  const { data: patient, loading } = useDoc(patientRef) as { data: UserProfile | null, loading: boolean };

  if (loading) {
    return (
      <Card className="border-[#404040] bg-[#171717]">
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
    <Card className="border-[#404040] bg-[#171717]">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12 ring-1 ring-[#404040]">
            <AvatarImage src={`https://avatar.vercel.sh/${patient.email}.png`} alt={patient.name} />
            <AvatarFallback className="bg-white/5 text-white">{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <CardTitle className="text-white text-lg font-semibold uppercase tracking-tight">{patient.name}</CardTitle>
            <CardDescription className="text-[#B3B3B3] text-sm font-medium">{patient.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
         <div>
            <label htmlFor={`image-upload-${patient.id}`} className="block text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-2">Upload Retinal Image</label>
            <div className="flex gap-2">
                <Input id={`image-upload-${patient.id}`} type="file" className="bg-black/20 border-[#404040] text-sm" />
                <Button variant="outline" className="h-10 border-[#404040] hover:bg-white/5 uppercase text-[10px] font-bold tracking-widest px-4">Upload</Button>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DoctorPatientsPage() {
  const { user } = useUser();
  const db = useFirestore();

  const appointmentsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'appointments'), where('doctorUserId', '==', user.id));
  }, [db, user]);

  const { data: appointments, loading } = useCollection<Appointment>(appointmentsQuery);

  const [searchQuery, setSearchQuery] = useState('');

  const patientIds = useMemo(() => {
    if (!appointments) return [];
    const ids = appointments.map(a => a.patientUserId);
    return [...new Set(ids)];
  }, [appointments]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tighter text-white uppercase">Patient Records</h1>
        <p className="text-[#B3B3B3] text-lg font-medium tracking-tight">Manage patient information and upload retinal/fundus images.</p>
      </div>

      <div className="max-w-md">
        <Input 
          placeholder="Search patients by name..." 
          className="h-12 bg-[#171717] border-[#404040] focus:border-white transition-all text-sm"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
           Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl bg-[#171717] border border-[#404040]" />)
        ) : patientIds.length > 0 ? (
          patientIds.map(patientId => (
            <PatientCard key={patientId} patientId={patientId} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-[#404040] rounded-2xl bg-[#171717]/50">
            <p className="text-[#808080] font-bold uppercase tracking-widest text-xs">No patients found in your records.</p>
          </div>
        )}
      </div>
    </div>
  );
}
