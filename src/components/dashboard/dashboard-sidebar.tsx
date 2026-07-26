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
    <Sidebar collapsible="icon" className="border-r border-border bg-[#0B0B0B]">
      <SidebarHeader className="py-10 px-6">
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
      
      <SidebarContent className="px-4 pt-6">
        <SidebarMenu className="gap-3">
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
                    "h-12 transition-all duration-200 text-[16px] font-medium px-4",
                    isActive 
                      ? "sidebar-item-active font-semibold" 
                      : "hover:bg-[#1F1F1F] text-[#BDBDBD] hover:text-[#FFFFFF]"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-4">
                      <Icon className={cn("h-[24px] w-[24px]", isActive ? "text-white" : "text-[#BDBDBD]")} />
                      <span className="tracking-tight">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-border bg-black/10">
         <SidebarMenu className="gap-3">
            <SidebarMenuItem>
                <SidebarMenuButton 
                    suppressHydrationWarning
                    className="h-12 rounded-[12px] hover:bg-[#1F1F1F] text-[#BDBDBD] hover:text-[#FFFFFF] text-[16px]"
                    tooltip={user?.email || 'Profile'}
                    asChild
                >
                    <Link href="/dashboard/settings" className="flex items-center gap-4">
                        <UserCircle className="h-[24px] w-[24px]" />
                        <span className="font-medium truncate">{user?.name || 'Session User'}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton 
                    suppressHydrationWarning
                    className="h-12 rounded-[12px] hover:bg-destructive/10 text-[#BDBDBD] hover:text-destructive transition-colors text-[16px]"
                    tooltip="Logout" 
                    onClick={handleLogout}
                >
                    <LogOut className="h-[24px] w-[24px]" />
                    <span className="font-medium">Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
