import type { Appointment, Doctor } from "./types";

export const mockPatientAppointments: Appointment[] = [
  {
    id: "APT001",
    patientName: "Jane Doe",
    doctorName: "Dr. Alan Grant",
    date: "2024-08-15",
    time: "10:00 AM",
    status: "Accepted",
    meetLink: "https://meet.google.com/xyz-abc-def",
  },
  {
    id: "APT002",
    patientName: "Jane Doe",
    doctorName: "Dr. Ellie Sattler",
    date: "2024-08-20",
    time: "02:30 PM",
    status: "Pending",
  },
];

export const mockDoctorAppointments: Appointment[] = [
    {
        id: "APT003",
        patientName: "John Smith",
        doctorName: "Dr. Alan Grant",
        date: "2024-08-16",
        time: "09:00 AM",
        status: "Pending",
    },
    {
        id: "APT004",
        patientName: "Sarah Connor",
        doctorName: "Dr. Alan Grant",
        date: "2024-08-16",
        time: "11:30 AM",
        status: "Pending",
    },
    {
        id: "APT001",
        patientName: "Jane Doe",
        doctorName: "Dr. Alan Grant",
        date: "2024-08-15",
        time: "10:00 AM",
        status: "Accepted",
        meetLink: "https://meet.google.com/xyz-abc-def",
    },
];

export const mockDoctors: Doctor[] = [
  {
    id: "DOC001",
    userId: "user1",
    name: "Dr. Alan Grant",
    specialty: "Retina Specialist",
    email: "alan.grant@opticare.ai",
    status: "Active",
  },
  {
    id: "DOC002",
    userId: "user2",
    name: "Dr. Ellie Sattler",
    specialty: "Glaucoma Specialist",
    email: "ellie.sattler@opticare.ai",
    status: "Active",
  },
  {
    id: "DOC003",
    userId: "user3",
    name: "Dr. Ian Malcolm",
    specialty: "Pediatric Ophthalmology",
    email: "ian.malcolm@opticare.ai",
    status: "Inactive",
  },
];
