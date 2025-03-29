
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DataService } from '@/lib/data-service';
import { useToast } from '@/hooks/use-toast';
import { Coupon } from '@/lib/types';

interface CouponFormProps {
  onSuccess: () => void;
  editCoupon?: Coupon;
}

export function CouponForm({ onSuccess, editCoupon }: CouponFormProps) {
  const { toast } = useToast();
  const [code, setCode] = useState(editCoupon?.code || '');
  const [description, setDescription] = useState(editCoupon?.description || '');
  const [isActive, setIsActive] = useState(editCoupon?.isActive || true);
  const [expiresAt, setExpiresAt] = useState<string | undefined>(
    editCoupon?.expiresAt ? new Date(editCoupon.expiresAt).toISOString().split('T')[0] : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editCoupon) {
        // Update existing coupon
        DataService.updateCoupon(editCoupon.id, {
          code,
          description,
          isActive,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        });
        toast({
          title: "Coupon Updated",
          description: `Coupon ${code} has been updated successfully.`,
        });
      } else {
        // Add new coupon
        DataService.addCoupon({
          code,
          description,
          isActive,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        });
        toast({
          title: "Coupon Added",
          description: `Coupon ${code} has been added successfully.`,
        });
      }
      
      onSuccess();
      
      // Reset form if it's not editing
      if (!editCoupon) {
        setCode('');
        setDescription('');
        setIsActive(true);
        setExpiresAt(undefined);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the coupon. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editCoupon ? 'Edit Coupon' : 'Add New Coupon'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input 
              id="code" 
              value={code} 
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SUMMER25" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="25% off summer items"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expires">Expiration Date (Optional)</Label>
            <Input 
              id="expires" 
              type="date" 
              value={expiresAt} 
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="active" 
              checked={isActive} 
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button type="submit">
            {editCoupon ? 'Update Coupon' : 'Add Coupon'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
