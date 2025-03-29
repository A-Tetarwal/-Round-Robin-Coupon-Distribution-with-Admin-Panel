
import React from 'react';
import { CouponClaim } from '@/components/CouponClaim';
import { PublicHeader } from '@/components/PublicHeader';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50 to-white">
      <PublicHeader />
      
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold text-brand-800 mb-4">
            Welcome to Coupon Circularity
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Our round-robin coupon distribution system ensures everyone gets 
            access to our best offers. Claim your coupon below!
          </p>
        </div>
        
        <CouponClaim />
        
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Our system prevents abuse by limiting claims per user and device.</p>
          <p>Each user can claim one coupon with a cooldown period between claims.</p>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 py-6">
        <div className="container text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Coupon Circularity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
