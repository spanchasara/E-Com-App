export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
};
export type UpdateUser = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
};

export type PaginatedUsers = {
  docs: User[];
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
