"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getSymptomGuidance } from "@/app/actions/symptoms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Bot, CircleDashed, List, AlertTriangle } from "lucide-react";

const initialState = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        "Get Guidance"
      )}
    </Button>
  );
}

export function SymptomCheckerForm() {
  const [state, formAction] = useFormState(getSymptomGuidance, initialState);
  const [symptoms, setSymptoms] = useState('');

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Textarea
              name="symptoms"
              placeholder="e.g., 'My right eye is red, itchy, and sensitive to light.'"
              className="min-h-[150px]"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <div>
        {state.data && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex-row items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <CardTitle>Preliminary Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{state.data.preliminaryGuidance}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center gap-2">
                <List className="h-6 w-6 text-primary" />
                <CardTitle>Potential Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {state.data.potentialConditions.map((condition: string, index: number) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

             <Card className="border-status-warning bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader className="flex-row items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-status-warning" />
                <CardTitle className="text-status-warning">Disclaimer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700 dark:text-yellow-300">{state.data.disclaimer}</p>
              </CardContent>
            </Card>
          </div>
        )}
        {state.error && (
            <Card className="border-destructive bg-red-50 dark:bg-red-900/20">
              <CardHeader className="flex-row items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-destructive">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive/90">{state.error}</p>
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
