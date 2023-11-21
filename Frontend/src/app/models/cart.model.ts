export type Cart = {
  [x: string]: any;
  _id: string;
  customerId: string;
  totalAmount: number;
  totalQty: number;
  products: CartProduct[];
};

export const emptyCart: Cart = {
  _id: "",
  customerId: "",
  totalAmount: 0,
  totalQty: 0,
  products: [],
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
  images: CloudImage[];
};

type CloudImage = {
  url: string;
  publicId: string;
};

export type UpdateBody = {
  productId: string;
  qty?: number;
  isAdd?: boolean;
};
