import { ProductImage } from "./product.model";

export type MetricAnalytics = {
  worstProducts: metricProduct[];
  allProducts: metricProduct[];
  bestProducts: metricProduct[];
  totalProductsSold: number;
  totalSales: number;
  totalOrders: number;
  avgRating: number;
};

type metricProduct = {
  totalAmount: number;
  totalQty: number;
  avgRating: number;
  orderIds: string[];
  productId: string;
  title: string;
  stock: number;
  price: number;
  images: ProductImage[];
};

export type PeriodicAnalytics = {
  monthAnalysis: monthStats[];
  yearAnalysis: yearStats[];
};

type monthStats = {
  totalAmount: number;
  totalQty: number;
  orderIds: string[];
  month: number;
};

type yearStats = {
  totalAmount: number;
  totalQty: number;
  orderIds: string[];
  year: number;
};
