import type { NavItem } from "@/lib/types";
import { UserCog } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const adminNavItems: NavItem[] = [
  {
    href: "/admin",
    label: "Doctor Management",
    icon: UserCog,
    tooltip: "Doctor Management",
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <DashboardSidebar navItems={adminNavItems} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
