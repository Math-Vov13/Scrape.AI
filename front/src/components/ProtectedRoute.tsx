'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

import { ReactNode } from 'react';

const ProtectedRoute = ({ children, validateAdmin }: { children: ReactNode, validateAdmin: boolean }) => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until loading is complete
    if (user === null) {
      router.push('/login');
    }

    console.log('validate Admin:', validateAdmin);
    if (validateAdmin && isAdmin === false) {
      router.push('/');
    }
  }, [loading, user, validateAdmin]);

  return user ? children : null;
};

export default ProtectedRoute;
