export type Product = {
  _id?: string;
  title: string;
  description: string;
  sellerId?: string;
  specifications: object;
  price: number;
  stock: number;
  images?: ProductImage[];
  feedbacks?: any[];
  avgRating?: number;
};

export type ProductImage = {
  url: string;
  publicId: string;
};

export type PaginatedProducts = {
  docs: Product[];
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
