'use client';

import { useState, useMemo } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Doctor } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { BookAppointmentModal } from "@/components/dashboard/book-appointment-modal";

export const dynamic = 'force-dynamic';

export default function FindDoctorPage() {
  const db = useFirestore();
  const doctorsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'doctors'));
  }, [db]);
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
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tighter text-white uppercase">Find a Specialist</h1>
        <p className="text-[#B3B3B3] text-lg font-medium tracking-tight mt-1">
          Search our global network for verified ophthalmology professionals.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
            <div className="flex gap-3">
                <Input 
                  placeholder="Search by name or unit..."
                  className="h-12 bg-[#171717] border-[#404040] focus:border-white transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="h-12 w-12 rounded-xl bg-white text-black hover:bg-white/90">
                    <Search className="h-5 w-5" />
                </Button>
            </div>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-[#404040] bg-[#171717]">
                <CardHeader>
                  <Skeleton className="h-6 w-40 bg-white/5" />
                  <Skeleton className="h-4 w-32 bg-white/5" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full bg-white/5" />
                </CardContent>
              </Card>
            ))
          ) : filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <Card key={doctor.id} className="border-[#404040] bg-[#171717] hover:border-white/20 transition-all">
                  <CardHeader>
                      <CardTitle className="text-white text-lg font-semibold uppercase tracking-tight">{doctor.name}</CardTitle>
                      <CardDescription className="text-[#B3B3B3] font-medium">{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button variant="outline" className="w-full h-10 border-[#404040] text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black" onClick={() => handleBookClick(doctor)}>
                        Request Consultation
                      </Button>
                  </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-[#808080] font-bold uppercase tracking-widest text-xs text-center py-10">No specialists found matching your search.</p>
          )}
        </div>
        <div className="md:col-span-2">
           <Card className="h-full min-h-[600px] flex items-center justify-center border-[#404040] bg-[#171717]">
              <CardContent className="text-center space-y-4">
                <p className="text-[#808080] font-bold uppercase tracking-widest text-[10px]">Strategic Map Visualization Coming Soon</p>
                <div className="h-1 w-24 bg-white/10 mx-auto rounded-full" />
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
