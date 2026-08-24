'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { fetchAdminLeads } from '@/lib/firebase/services';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LeadDoc } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<LeadDoc[]>([]);

  useEffect(() => {
    // Check session or Firebase Auth state
    const isAuthedSession = sessionStorage.getItem('erickson_admin_authed') === 'true';

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user || isAuthedSession) {
        setAuthenticated(true);
        loadLeads();
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadLeads = async () => {
    const fetched = await fetchAdminLeads();
    setLeads(fetched || []);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('erickson_admin_authed');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071E2A] flex items-center justify-center p-4">
        <div className="text-[#FFD978] font-semibold animate-pulse">
          Authenticating Admin Portal...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <AdminDashboard leads={leads} onLogout={handleLogout} />;
}
