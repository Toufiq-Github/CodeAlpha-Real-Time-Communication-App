import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
};

export type AppointmentStatus = "Pending" | "Accepted" | "Rejected";

export type Appointment = {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  meetLink?: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  email: string;
  status: "Active" | "Inactive";
};
