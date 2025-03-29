
export interface Coupon {
  id: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
}

export interface ClaimRecord {
  id: string;
  couponId: string;
  couponCode: string;
  ipAddress: string;
  userAgent: string;
  claimedAt: string;
}

export interface AdminUser {
  username: string;
  passwordHash: string;
}

export interface User {
  ipAddress: string;
  sessionId: string;
  lastClaim: string | null;
}
