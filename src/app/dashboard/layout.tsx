import type { NavItem } from "@/lib/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Command Center",
    icon: "LayoutDashboard",
    tooltip: "Main Workspace",
  },
  {
    href: "/dashboard/history",
    label: "Session History",
    icon: "History",
    tooltip: "Past Meetings",
  },
  {
    href: "/dashboard/search",
    label: "Team Search",
    icon: "Users",
    tooltip: "Find Members",
  },
  {
    href: "/dashboard/settings",
    label: "Organization",
    icon: "Settings",
    tooltip: "Global Config",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/20">
        <DashboardSidebar navItems={navItems} />
        <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
      </div>
    </SidebarProvider>
  );
}
