export enum CouponType {
  general = "general",
  festival = "festival",
  firstOrder = "first-order",
}

export type Coupon = {
  _id: string;
  couponCode: string;
  discountPercent: number;
  expiryDate: Date;
  isEnabled: boolean;
  createdBy: CouponUser;
  createdAt: Date;
  usedBy: string[];
  name: string;
  type: CouponType;
  activationDate: Date;
};

export type CouponBody = {
  couponCode?: string;
  name?: string;
  type?: CouponType;
  discountPercent?: number;
  expiryDate?: Date;
  activationDate?: Date;
  isEnabled?: boolean;
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
