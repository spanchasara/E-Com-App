export type Order = {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
};

export type PaginatedOrders = {
  docs: Order[];
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
