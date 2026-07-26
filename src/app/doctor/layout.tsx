
import type { NavItem } from "@/lib/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const standardNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    tooltip: "Overview",
  },
  {
    href: "/search",
    label: "Teams",
    icon: "Users",
    tooltip: "Active Units",
  },
];

export default function StandardDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <DashboardSidebar navItems={standardNavItems} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
