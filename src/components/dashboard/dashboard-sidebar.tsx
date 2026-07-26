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
  Search,
  ShieldAlert
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
  Search,
  UserCog: ShieldAlert
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
      </SidebarHeader>
      
      <SidebarContent className="px-4 pt-4">
        <SidebarMenu className="gap-2">
          {navItems.map((item) => {
            const Icon = IconMap[item.icon as keyof typeof IconMap] || LayoutDashboard;
            const isActive = pathname === item.href;
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  asChild
                  className={cn(
                    "h-11 transition-all duration-200 text-[14px] font-medium px-4 rounded-lg",
                    isActive 
                      ? "bg-white text-black hover:bg-white" 
                      : "hover:bg-white/5 text-sidebar-foreground hover:text-white"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-4">
                      <Icon className={cn("h-5 w-5", isActive ? "text-black" : "text-[#D5D5D5]")} />
                      <span className={cn("tracking-tight", isActive ? "text-black font-semibold" : "")}>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
         <SidebarMenu className="gap-2">
            <SidebarMenuItem>
                <SidebarMenuButton 
                    className="h-11 rounded-lg hover:bg-white/5 text-sidebar-foreground hover:text-white text-[14px]"
                    asChild
                >
                    <Link href="/dashboard/settings" className="flex items-center gap-4">
                        <UserCircle className="h-5 w-5 text-[#D5D5D5]" />
                        <span className="font-medium truncate">{user?.name || 'Session User'}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton 
                    className="h-11 rounded-lg hover:bg-destructive/10 text-sidebar-foreground hover:text-destructive transition-colors text-[14px]"
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
