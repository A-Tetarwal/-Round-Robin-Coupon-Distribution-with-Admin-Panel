
import { v4 as uuidv4 } from 'uuid';
import { Coupon, ClaimRecord, User, AdminUser } from './types';

// In-memory data store (in a real app, this would be a database)
let coupons: Coupon[] = [
  {
    id: uuidv4(),
    code: 'FIRST10',
    description: '10% off your first purchase',
    isActive: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  },
  {
    id: uuidv4(),
    code: 'SUMMER25',
    description: '25% off summer items',
    isActive: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
  },
  {
    id: uuidv4(),
    code: 'FREESHIP',
    description: 'Free shipping on orders over $50',
    isActive: true,
    createdAt: new Date().toISOString(),
    expiresAt: null, // No expiration
  },
];

let claims: ClaimRecord[] = [];
let users: Record<string, User> = {};

// Admin user (in a real app, this would be stored securely in a database)
const adminUsers: AdminUser[] = [
  {
    username: 'admin',
    passwordHash: 'admin123', // In a real app, this would be a proper hash
  },
];

// Cooldown period in milliseconds (1 hour)
const COOLDOWN_PERIOD = 60 * 60 * 1000;

export const DataService = {
  // Admin authentication
  authenticateAdmin: (username: string, password: string): boolean => {
    const admin = adminUsers.find(user => user.username === username);
    return admin ? admin.passwordHash === password : false;
  },

  // Get all coupons (admin only)
  getAllCoupons: (): Coupon[] => {
    return [...coupons];
  },

  // Get active coupons
  getActiveCoupons: (): Coupon[] => {
    return coupons.filter(coupon => coupon.isActive);
  },

  // Add a new coupon (admin only)
  addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt'>): Coupon => {
    const newCoupon: Coupon = {
      id: uuidv4(),
      ...coupon,
      createdAt: new Date().toISOString(),
    };
    coupons.push(newCoupon);
    return newCoupon;
  },

  // Update a coupon (admin only)
  updateCoupon: (id: string, couponData: Partial<Coupon>): Coupon | null => {
    const index = coupons.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedCoupon = { ...coupons[index], ...couponData };
    coupons[index] = updatedCoupon;
    return updatedCoupon;
  },

  // Delete a coupon (admin only)
  deleteCoupon: (id: string): boolean => {
    const initialLength = coupons.length;
    coupons = coupons.filter(c => c.id !== id);
    return coupons.length < initialLength;
  },

  // Get all claims (admin only)
  getAllClaims: (): ClaimRecord[] => {
    return [...claims];
  },

  // Claim a coupon (round-robin distribution)
  claimCoupon: (ipAddress: string, userAgent: string, sessionId: string): { success: boolean; message: string; coupon?: Coupon } => {
    // Generate a unique identifier for this user
    const userIdentifier = `${ipAddress}_${sessionId}`;
    
    // Check if user exists, if not create a new user record
    if (!users[userIdentifier]) {
      users[userIdentifier] = {
        ipAddress,
        sessionId,
        lastClaim: null,
      };
    }
    
    // Check cooldown period
    if (users[userIdentifier].lastClaim) {
      const lastClaimTime = new Date(users[userIdentifier].lastClaim).getTime();
      const currentTime = Date.now();
      
      if (currentTime - lastClaimTime < COOLDOWN_PERIOD) {
        const timeLeft = Math.ceil((COOLDOWN_PERIOD - (currentTime - lastClaimTime)) / 60000);
        return {
          success: false,
          message: `You need to wait ${timeLeft} more minutes before claiming another coupon.`,
        };
      }
    }
    
    // Filter active coupons
    const activeCoupons = coupons.filter(coupon => 
      coupon.isActive && 
      (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())
    );
    
    if (activeCoupons.length === 0) {
      return {
        success: false,
        message: 'Sorry, there are no active coupons available at this time.',
      };
    }

    // Get the user's previously claimed coupons
    const userClaims = claims.filter(claim => 
      claim.ipAddress === ipAddress && claim.userAgent === userAgent
    );

    // Find a coupon that the user hasn't claimed yet (round-robin)
    const userClaimedCouponIds = new Set(userClaims.map(claim => claim.couponId));
    const availableCoupons = activeCoupons.filter(coupon => !userClaimedCouponIds.has(coupon.id));
    
    if (availableCoupons.length === 0) {
      return {
        success: false,
        message: 'You have already claimed all available coupons.',
      };
    }
    
    // Get the next coupon in the round-robin sequence
    const nextCoupon = availableCoupons[0];
    
    // Record the claim
    const newClaim: ClaimRecord = {
      id: uuidv4(),
      couponId: nextCoupon.id,
      couponCode: nextCoupon.code,
      ipAddress,
      userAgent,
      claimedAt: new Date().toISOString(),
    };
    claims.push(newClaim);
    
    // Update user's last claim time
    users[userIdentifier].lastClaim = new Date().toISOString();
    
    return {
      success: true,
      message: 'Coupon claimed successfully!',
      coupon: nextCoupon,
    };
  },

  // Get user claims
  getUserClaims: (ipAddress: string, sessionId: string): ClaimRecord[] => {
    return claims.filter(claim => claim.ipAddress === ipAddress);
  },
};
