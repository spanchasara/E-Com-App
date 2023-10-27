export type Cart = {
  _id: string;
  customerId: string;
  totalAmount: number;
  totalQty: number;
  products: CartProduct[];
};

export type CartProduct = {
  _id: string;
  productId: Product;
  qty: number;
};

type Product = {
  _id: string;
  title: string;
  price: number;
  stock: number;
};

export type UpdateBody = {
  productId: string;
  qty?: number;
  isAdd?: boolean;
};
