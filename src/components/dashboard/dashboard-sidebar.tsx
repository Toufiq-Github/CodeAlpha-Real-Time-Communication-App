
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
import { LogOut, UserCircle, Settings } from "lucide-react";
import type { NavItem } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../logo";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useUser } from "@/firebase/auth/use-user";
import { cn } from "@/lib/utils";

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
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-card/50">
      <SidebarHeader className="py-6 px-4">
        <div className="flex h-12 w-full items-center justify-center group-data-[collapsible=icon]:hidden">
          <Logo />
        </div>
        <div className="hidden h-12 w-full items-center justify-center group-data-[collapsible=icon]:flex">
            <Logo className="[&>span]:hidden" />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarMenu className="gap-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                href={item.href}
                isActive={pathname === item.href}
                asChild
                tooltip={item.tooltip}
                className={cn(
                  "h-12 rounded-xl transition-all duration-200",
                  pathname === item.href ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-bold">{item.label}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 bg-card/30">
         <SidebarMenu className="gap-2">
            <SidebarMenuItem>
                <SidebarMenuButton 
                    className="h-12 rounded-xl hover:bg-white/5 text-muted-foreground"
                    tooltip={user?.email || 'Profile'}
                >
                    <UserCircle className="h-5 w-5" />
                    <span className="font-bold truncate">{user?.name || 'Loading...'}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton 
                    className="h-12 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    tooltip="Logout" 
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-bold">Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
