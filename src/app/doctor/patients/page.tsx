import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DoctorPatientsPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Patient Records</h1>
        <p className="text-muted-foreground">
          Manage patient information and upload retinal/fundus images.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Patient Image</CardTitle>
          <CardDescription>
            Select a patient and upload their retinal/fundus image for record-keeping.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <label htmlFor="patient-select" className="block text-sm font-medium text-foreground mb-1">Select Patient</label>
                {/* In a real app, this would be a search or select component */}
                <Input id="patient-select" placeholder="Search for a patient..." />
            </div>
            <div>
                 <label htmlFor="image-upload" className="block text-sm font-medium text-foreground mb-1">Upload Image</label>
                <Input id="image-upload" type="file" />
            </div>
            <Button>Upload and Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
