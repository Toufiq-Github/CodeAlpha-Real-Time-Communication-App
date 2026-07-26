
import type { NavItem } from "@/lib/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const adminNavItems: NavItem[] = [
  {
    href: "/admin",
    label: "System Control",
    icon: "UserCog",
    tooltip: "Admin Access",
  },
  {
    href: "/dashboard",
    label: "User Dashboard",
    icon: "LayoutDashboard",
    tooltip: "Return to Hub",
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
