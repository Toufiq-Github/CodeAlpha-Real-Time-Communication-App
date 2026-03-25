import type { NavItem } from "@/lib/types";
import { Calendar, LayoutDashboard, Search } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const patientNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Symptom Checker",
    icon: LayoutDashboard,
    tooltip: "Symptom Checker",
  },
  {
    href: "/dashboard/find-doctor",
    label: "Find a Doctor",
    icon: Search,
    tooltip: "Find a Doctor",
  },
  {
    href: "/dashboard/appointments",
    label: "Appointments",
    icon: Calendar,
    tooltip: "Appointments",
  },
];

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <DashboardSidebar navItems={patientNavItems} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
