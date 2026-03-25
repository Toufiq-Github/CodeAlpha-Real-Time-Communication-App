"use server";

import { patientSymptomGuidance } from "@/ai/flows/patient-symptom-guidance-flow";
import { z } from "zod";

const SymptomSchema = z.string().min(10, "Please describe your symptoms in more detail.");

export async function getSymptomGuidance(prevState: any, formData: FormData) {
  try {
    const symptoms = formData.get("symptoms");
    const validation = SymptomSchema.safeParse(symptoms);

    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    const result = await patientSymptomGuidance({ symptoms: validation.data });
    
    return { data: result, error: null };
  } catch (error) {
    console.error("Error getting symptom guidance:", error);
    return { data: null, error: "An unexpected error occurred. Please try again later." };
  }
}
