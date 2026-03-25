import { mockDoctors } from "@/lib/placeholder-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function FindDoctorPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Find a Specialist</h1>
        <p className="text-muted-foreground">
          Search for doctors and view nearby eye care hospitals.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
            <div className="flex gap-2">
                <Input placeholder="Search by name, specialty, or location..." />
                <Button><Search className="h-4 w-4" /></Button>
            </div>
          {mockDoctors.map(doctor => (
             <Card key={doctor.id}>
                <CardHeader>
                    <CardTitle>{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full">Book Appointment</Button>
                </CardContent>
             </Card>
          ))}
        </div>
        <div className="md:col-span-2">
           <Card className="h-full min-h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <p className="text-muted-foreground">Map interface coming soon.</p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
