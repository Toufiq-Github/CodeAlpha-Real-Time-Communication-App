import { SymptomCheckerForm } from "@/components/dashboard/symptom-checker-form";

export default function PatientDashboardPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">AI Symptom Checker</h1>
        <p className="text-muted-foreground">
          Describe your eye symptoms below. Our AI will provide preliminary guidance.
        </p>
      </div>
      <SymptomCheckerForm />
    </div>
  );
}
