import { Address } from "./address.model";
import { Cart } from "./cart.model";
import { Coupon } from "./coupon.model";
import { ProductImage } from "./product.model";

export type PlaceOrder = {
  products: ProjectOrder[];
  addressId: string;
};

export type CreateOrderBody = {
  addressId: string;
  productId?: string;
  qty?: number;
  selectedProductIds?: string[];
  coupon: string | null;
};

export type ProjectOrder = {
  productId: string;
  qty: number;
};
export type PlacedOrder = {
  _id: string;
  totalAmount: number;
  totalQty: number;
  products: ProjectOrder[];
  deliveredDate: Date | null;
  addressId: string;
  customerId: string;
  createdAt: Date;
};

export type PaginatedOrders = {
  docs: Order[];
  totalDocs: number;
  limit: number;
  page: number;
};

export type Order = {
  orderId: string;
  totalAmount: number;
  totalQty: number;
  products: OrderedProducts[];
  address: Address;
  coupon: Coupon;
  customerId: string;
  createdAt: Date | string;
};

export type OrderedProducts = {
  _id: string;
  productId: string;
  title: string;
  price: number;
  qty: number;
  deliveredDate: Date | string | null;
  amount: number;
  images: ProductImage[];
  sellerId: string;
};
