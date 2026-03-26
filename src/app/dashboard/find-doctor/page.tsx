'use client';

import { useState } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Doctor } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { BookAppointmentModal } from "@/components/dashboard/book-appointment-modal";

export default function FindDoctorPage() {
  const db = useFirestore();
  const doctorsQuery = query(collection(db, 'doctors'));
  const { data: doctors, loading } = useCollection<Doctor>(doctorsQuery);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredDoctors = doctors?.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Find a Specialist</h1>
        <p className="text-muted-foreground">
          Search for doctors and book an appointment.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
            <div className="flex gap-2">
                <Input 
                  placeholder="Search by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button><Search className="h-4 w-4" /></Button>
            </div>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <Card key={doctor.id}>
                  <CardHeader>
                      <CardTitle>{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button variant="outline" className="w-full" onClick={() => handleBookClick(doctor)}>
                        Book Appointment
                      </Button>
                  </CardContent>
              </Card>
            ))
          ) : (
            <p>No doctors found.</p>
          )}
        </div>
        <div className="md:col-span-2">
           <Card className="h-full min-h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <p className="text-muted-foreground">Map interface coming soon.</p>
              </CardContent>
           </Card>
        </div>
      </div>
      
      {selectedDoctor && (
        <BookAppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          doctor={selectedDoctor}
        />
      )}
    </div>
  );
}
