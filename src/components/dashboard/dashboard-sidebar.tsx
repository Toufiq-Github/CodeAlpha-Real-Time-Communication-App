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
import { LogOut, UserCircle } from "lucide-react";
import type { NavItem } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../logo";
import { Button } from "../ui/button";

interface DashboardSidebarProps {
  navItems: NavItem[];
}

export function DashboardSidebar({ navItems }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, this would clear the session
    router.push('/');
  }

  return (
    <Sidebar collapsible="icon" className="group-data-[variant=inset]:bg-sidebar">
      <SidebarHeader>
        <div className="flex h-12 w-full items-center justify-center p-2 group-data-[collapsible=icon]:hidden">
          <Logo className="text-sidebar-foreground" />
        </div>
        <div className="hidden h-12 w-full items-center justify-center p-2 group-data-[collapsible=icon]:flex">
            <Logo className="[&>span]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                href={item.href}
                isActive={pathname === item.href}
                asChild
                tooltip={item.tooltip}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile">
                    <UserCircle />
                    <span>Profile</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
