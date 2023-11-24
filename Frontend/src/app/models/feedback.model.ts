export type FeedbackBody = {
  orderId: string;
  productId?: string;
  rating: number;
  comment: string;
};

// export type PaginatedCoupons = {
//   docs: Coupon[];
//   totalDocs: number;
//   limit: number;
//   page: number;
//   totalPages: number;
//   pagingCounter: number;
//   hasPrevPage: boolean;
//   hasNextPage: boolean;
//   prevPage: number | null;
//   nextPage: number | null;
// };

// type CouponUser = {
//   _id: string;
//   username: string;
// };
