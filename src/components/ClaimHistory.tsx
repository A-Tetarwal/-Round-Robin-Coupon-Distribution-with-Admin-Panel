
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ClaimRecord } from '@/lib/types';
import { timeAgo } from '@/lib/utils';

interface ClaimHistoryProps {
  claims: ClaimRecord[];
}

export function ClaimHistory({ claims }: ClaimHistoryProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Code</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>User Agent</TableHead>
            <TableHead>Claimed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                No claims have been made yet.
              </TableCell>
            </TableRow>
          ) : (
            claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.couponCode}</TableCell>
                <TableCell>{claim.ipAddress}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {claim.userAgent}
                </TableCell>
                <TableCell>{timeAgo(claim.claimedAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
