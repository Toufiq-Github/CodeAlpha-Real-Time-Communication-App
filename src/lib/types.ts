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
  patientUserId: string;
  doctorUserId: string;
};

export type Doctor = {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  email: string;
  status: "Active" | "Inactive";
};

export type UserRole = 'Patient' | 'Doctor' | 'Admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
