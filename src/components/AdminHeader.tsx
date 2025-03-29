
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-brand-700">Coupon Admin</h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
}
