import type { NavItem } from "@/lib/types";
import { Calendar, Users } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const doctorNavItems: NavItem[] = [
  {
    href: "/doctor",
    label: "Appointments",
    icon: Calendar,
    tooltip: "Appointments",
  },
  {
    href: "/doctor/patients",
    label: "Patients",
    icon: Users,
    tooltip: "Patients",
  },
];

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <DashboardSidebar navItems={doctorNavItems} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
