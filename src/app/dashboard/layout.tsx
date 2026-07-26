
import type { NavItem } from "@/lib/types";
import { LayoutDashboard, Users, Search, Settings, Video } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    tooltip: "My Hub",
  },
  {
    href: "/search",
    label: "Team Search",
    icon: Search,
    tooltip: "Find Members",
  },
  {
    href: "/dashboard/recent",
    label: "History",
    icon: Video,
    tooltip: "Past Meetings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar navItems={navItems} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
