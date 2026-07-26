'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, ShieldCheck, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase/auth/use-user";

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const db = useFirestore();
  
  const doctorsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'Doctor'));
  }, [db]);
  const { data: doctors, loading: doctorsLoading } = useCollection(doctorsQuery);

  const adminsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'Admin'));
  }, [db]);
  const { data: admins, loading: adminsLoading } = useCollection(adminsQuery);
  
  useEffect(() => {
    if (!userLoading && user && user.role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [user, userLoading, router]);

  const isLoading = userLoading || doctorsLoading || adminsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <p className="text-[#808080] font-bold uppercase tracking-widest text-[10px]">Authorizing Admin Access...</p>
      </div>
    );
  }

  if (!user || user.role !== 'Admin') {
    return null;
  }
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tighter text-white uppercase">System Control</h1>
          <p className="text-[#B3B3B3] text-lg font-medium tracking-tight mt-1">
            Manage operational team units and system access levels.
          </p>
        </div>
        <Button className="h-12 px-6 rounded-xl bg-white text-black hover:bg-white/90">
            <PlusCircle className="mr-2 h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Add System User</span>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-[#404040] bg-[#171717]">
          <CardHeader className="border-b border-[#404040] p-8">
            <CardTitle className="flex items-center gap-3 text-white uppercase text-xl">
              <User className="h-5 w-5 text-[#D5D5D5]" /> 
              Specialist Roster
            </CardTitle>
            <CardDescription className="text-[#B3B3B3] font-medium">Verified professional medical staff.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-[#404040]">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-12 px-8">Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-12">Identity</TableHead>
                  <TableHead className="text-right px-8 h-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors && doctors.map((doc) => (
                  <TableRow key={doc.id} className="border-[#404040] hover:bg-white/[0.02]">
                    <TableCell className="font-semibold text-white uppercase tracking-tight px-8">{doc.name}</TableCell>
                    <TableCell className="text-[#B3B3B3] font-medium">{doc.email}</TableCell>
                    <TableCell className="text-right px-8">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-[#808080]">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#171717] border-[#404040]">
                          <DropdownMenuItem className="text-white uppercase text-[10px] font-bold tracking-widest">Edit Access</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive uppercase text-[10px] font-bold tracking-widest">Revoke Access</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-[#404040] bg-[#171717]">
          <CardHeader className="border-b border-[#404040] p-8">
            <CardTitle className="flex items-center gap-3 text-white uppercase text-xl">
              <ShieldCheck className="h-5 w-5 text-[#D5D5D5]" /> 
              Control Layer
            </CardTitle>
            <CardDescription className="text-[#B3B3B3] font-medium">System administrators with root privileges.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-[#404040]">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-12 px-8">Admin</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#808080] h-12">Identity</TableHead>
                  <TableHead className="text-right px-8 h-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins && admins.map((admin) => (
                  <TableRow key={admin.id} className="border-[#404040] hover:bg-white/[0.02]">
                    <TableCell className="font-semibold text-white uppercase tracking-tight px-8">{admin.name}</TableCell>
                    <TableCell className="text-[#B3B3B3] font-medium">{admin.email}</TableCell>
                    <TableCell className="text-right px-8">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-[#808080]">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#171717] border-[#404040]">
                          <DropdownMenuItem className="text-white uppercase text-[10px] font-bold tracking-widest">Config System</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
