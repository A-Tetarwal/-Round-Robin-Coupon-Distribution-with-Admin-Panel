
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DataService } from '@/lib/data-service';
import { getClientIP, getOrCreateSessionId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Coupon } from '@/lib/types';

export function CouponClaim() {
  const { toast } = useToast();
  const [claiming, setClaiming] = useState(false);
  const [claimedCoupon, setClaimedCoupon] = useState<Coupon | null>(null);

  const handleClaimCoupon = async () => {
    setClaiming(true);
    
    try {
      // Get user identification data
      const ipAddress = getClientIP();
      const sessionId = getOrCreateSessionId();
      const userAgent = navigator.userAgent;
      
      // Attempt to claim a coupon
      const result = DataService.claimCoupon(ipAddress, userAgent, sessionId);
      
      if (result.success && result.coupon) {
        setClaimedCoupon(result.coupon);
        toast({
          title: "Success!",
          description: result.message,
        });
      } else {
        toast({
          title: "Could not claim coupon",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClaiming(false);
    }
  };

  const resetClaim = () => {
    setClaimedCoupon(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Claim Your Coupon</CardTitle>
        <CardDescription className="text-center">
          Get exclusive discounts with our promotional coupons
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {claimedCoupon ? (
          <div className="bg-brand-50 p-6 rounded-lg border-2 border-brand-200 text-center">
            <h3 className="font-bold text-xl mb-2">Your Coupon Code:</h3>
            <div className="bg-white p-3 rounded border border-brand-300 font-mono text-xl font-bold text-brand-700 tracking-wider mb-3">
              {claimedCoupon.code}
            </div>
            <p className="text-sm text-gray-600 mb-2">{claimedCoupon.description}</p>
            {claimedCoupon.expiresAt && (
              <p className="text-xs text-gray-500">
                Expires: {new Date(claimedCoupon.expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="mb-4">
              Click the button below to claim your exclusive coupon. Each user can claim one coupon at a time.
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Note: There's a 1-hour cooldown period between claims.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        {claimedCoupon ? (
          <Button onClick={resetClaim} variant="outline">
            Close
          </Button>
        ) : (
          <Button onClick={handleClaimCoupon} disabled={claiming}>
            {claiming ? 'Claiming...' : 'Claim My Coupon'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
