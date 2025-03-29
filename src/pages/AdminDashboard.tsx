
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminHeader } from '@/components/AdminHeader';
import { CouponForm } from '@/components/CouponForm';
import { CouponList } from '@/components/CouponList';
import { ClaimHistory } from '@/components/ClaimHistory';
import { DataService } from '@/lib/data-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Coupon } from '@/lib/types';

const AdminDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [claims, setClaims] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>(undefined);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  const loadData = () => {
    setCoupons(DataService.getAllCoupons());
    setClaims(DataService.getAllClaims());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddNewClick = () => {
    setEditingCoupon(undefined);
    setShowForm(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCoupon(undefined);
    loadData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage your coupons and view claim history
          </p>
        </div>
        
        <Tabs defaultValue="coupons">
          <TabsList className="mb-6">
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="claims">Claim History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coupons" className="space-y-6">
            {showForm ? (
              <CouponForm 
                onSuccess={handleFormSuccess} 
                editCoupon={editingCoupon}
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Manage Coupons</h2>
                  <Button onClick={handleAddNewClick}>Add New Coupon</Button>
                </div>
                <CouponList 
                  coupons={coupons} 
                  onRefresh={loadData}
                  onEdit={handleEditCoupon}
                />
              </>
            )}
          </TabsContent>
          
          <TabsContent value="claims">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Claim History</h2>
              <ClaimHistory claims={claims} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t border-gray-200 py-4">
        <div className="container text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Coupon Circularity Admin Panel</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
