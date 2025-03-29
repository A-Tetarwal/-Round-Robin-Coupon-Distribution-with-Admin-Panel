
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Coupon } from '@/lib/types';
import { DataService } from '@/lib/data-service';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CouponListProps {
  coupons: Coupon[];
  onRefresh: () => void;
  onEdit: (coupon: Coupon) => void;
}

export function CouponList({ coupons, onRefresh, onEdit }: CouponListProps) {
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleToggleActive = (id: string, currentState: boolean) => {
    DataService.updateCoupon(id, { isActive: !currentState });
    toast({
      title: "Coupon Updated",
      description: `Coupon has been ${!currentState ? 'activated' : 'deactivated'}.`,
    });
    onRefresh();
  };

  const handleDelete = () => {
    if (deleteId) {
      DataService.deleteCoupon(deleteId);
      toast({
        title: "Coupon Deleted",
        description: "Coupon has been deleted successfully.",
      });
      setDeleteId(null);
      onRefresh();
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No coupons found. Add your first coupon above.
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>{coupon.description}</TableCell>
                <TableCell>{formatDate(coupon.expiresAt)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch 
                      checked={coupon.isActive} 
                      onCheckedChange={() => handleToggleActive(coupon.id, coupon.isActive)}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(coupon)}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setDeleteId(coupon.id)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this coupon? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
