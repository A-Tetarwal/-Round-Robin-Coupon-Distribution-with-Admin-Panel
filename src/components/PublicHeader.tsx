
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function PublicHeader() {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-bold text-brand-700">Coupon Circularity</Link>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin">Admin Login</Link>
        </Button>
      </div>
    </header>
  );
}
