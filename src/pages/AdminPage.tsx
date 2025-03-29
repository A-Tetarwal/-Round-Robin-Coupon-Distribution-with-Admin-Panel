
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLogin } from '@/components/AdminLogin';

const AdminPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <AdminLogin />;
};

export default AdminPage;
