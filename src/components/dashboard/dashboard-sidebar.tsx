"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LogOut, 
  UserCircle, 
  LayoutDashboard, 
  History, 
  Users, 
  Settings, 
  Video,
  Search
} from "lucide-react";
import type { NavItem } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../logo";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useUser } from "@/firebase/auth/use-user";
import { cn } from "@/lib/utils";
import Link from "next/link";

const IconMap = {
  LayoutDashboard,
  History,
  Users,
  Settings,
  Video,
  Search
};

interface DashboardSidebarProps {
  navItems: NavItem[];
}

export function DashboardSidebar({ navItems }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();

  const handleLogout = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/');
      });
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="py-8 px-6">
        <div className="flex w-full items-center justify-start group-data-[collapsible=icon]:hidden">
          <Link href="/dashboard">
            <Logo size="sm" />
          </Link>
        </div>
        <div className="hidden h-12 w-full items-center justify-center group-data-[collapsible=icon]:flex">
            <Link href="/dashboard">
                <Logo className="[&>span]:hidden" />
            </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 pt-4">
        <SidebarMenu className="gap-2">
          {navItems.map((item) => {
            const Icon = IconMap[item.icon as keyof typeof IconMap] || LayoutDashboard;
            const isActive = pathname === item.href;
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  suppressHydrationWarning
                  isActive={isActive}
                  asChild
                  tooltip={item.tooltip}
                  className={cn(
                    "h-11 transition-all duration-200 text-[14px] font-medium px-4",
                    isActive 
                      ? "sidebar-item-active font-semibold bg-white/5 border border-white/10" 
                      : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-foreground"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-4">
                      <Icon className={cn("h-5 w-5", isActive ? "text-accent" : "text-sidebar-foreground")} />
                      <span className={cn("tracking-tight", isActive ? "text-accent" : "")}>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border bg-black/10">
         <SidebarMenu className="gap-2">
            <SidebarMenuItem>
                <SidebarMenuButton 
                    suppressHydrationWarning
                    className="h-11 rounded-[12px] hover:bg-sidebar-accent text-sidebar-foreground hover:text-foreground text-[14px]"
                    tooltip={user?.email || 'Profile'}
                    asChild
                >
                    <Link href="/dashboard/settings" className="flex items-center gap-4">
                        <UserCircle className="h-5 w-5" />
                        <span className="font-medium truncate">{user?.name || 'Session User'}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton 
                    suppressHydrationWarning
                    className="h-11 rounded-[12px] hover:bg-destructive/10 text-sidebar-foreground hover:text-destructive transition-colors text-[14px]"
                    tooltip="Logout" 
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}