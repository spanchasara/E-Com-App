export type Coupon = {
  _id: string;
  couponCode: string;
  discountPercent: number;
  validityPeriod: number;
  userUsageLimit: number;
  couponUsageLimit: number;
  expiryDate: Date;
  isActive: boolean;
  createdBy: CouponUser;
  createdAt: Date;
};

export type CouponBody = {
  couponCode?: string;
  discountPercent?: number;
  validityPeriod?: number;
  userUsageLimit?: number;
  couponUsageLimit?: number;
  expiryDate?: Date;
  isActive?: boolean;
};

export type PaginatedCoupons = {
  docs: Coupon[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

type CouponUser = {
  _id: string;
  username: string;
};
