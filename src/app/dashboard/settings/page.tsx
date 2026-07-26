'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, Zap, Save, RefreshCw } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function OrganizationSettingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    
    const userRef = doc(db, 'users', user.id);
    const updateData = { name, avatarUrl };

    updateDoc(userRef, updateData)
      .then(() => {
        toast({
          title: "Profile Synchronized",
          description: "Your organization settings have been updated.",
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Organization <span className="text-primary">Settings</span></h1>
        <p className="text-muted-foreground text-lg font-medium tracking-tight">Manage your professional identity and workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
            <Card className="glass-panel border-none rounded-[2rem] overflow-hidden">
                <div className="h-32 bg-primary/20 flex items-center justify-center">
                    <Avatar className="h-24 w-24 border-4 border-slate-950 shadow-2xl -mb-24">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">
                            {name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <CardContent className="pt-16 text-center space-y-2 pb-8">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">{name}</h3>
                    <p className="text-xs text-muted-foreground font-bold tracking-widest opacity-60 truncate px-4">{user?.email}</p>
                    <div className="pt-4 flex justify-center gap-2">
                         <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">Active Member</div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <Shield className="h-5 w-5 text-emerald-500" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Security Layer</p>
                        <p className="text-xs font-bold text-white">Encrypted Workspace</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <Zap className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Discovery Mode</p>
                        <p className="text-xs font-bold text-white">Public Directory</p>
                    </div>
                </div>
            </div>
        </div>

        <Card className="md:col-span-2 glass-panel border-none rounded-[2rem]">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-xl font-black uppercase">Identity Control</CardTitle>
            <CardDescription className="text-base font-medium">Update your presence across the TeamSync ecosystem.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1">Display Name</Label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <Input 
                        id="name"
                        className="h-14 pl-12 rounded-xl bg-white/5 border-white/10 text-base font-medium focus-visible:ring-primary/50 text-white"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1">Corporate Email</Label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20" />
                    <Input 
                        id="email"
                        disabled
                        className="h-14 pl-12 rounded-xl bg-white/[0.02] border-white/5 text-muted-foreground/40 text-base font-medium cursor-not-allowed"
                        value={user?.email || ''}
                    />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="avatar" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1">Avatar Resource (URL)</Label>
                <div className="relative">
                    <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <Input 
                        id="avatar"
                        className="h-14 pl-12 rounded-xl bg-white/5 border-white/10 text-base font-medium focus-visible:ring-primary/50 text-white"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isSaving}
                className="h-14 w-full sm:w-auto px-10 rounded-xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 gap-2"
              >
                {isSaving ? 'Syncing...' : 'Save Changes'}
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}