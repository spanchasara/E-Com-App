import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import {
  PaginatedProducts,
  Product,
} from 'src/app/utils/product/product.model';

export interface ProductState {
  products: PaginatedProducts;
  currentProduct: Product | null;
  search: string;
  sort: string;
}

const initialState = {
  products: {
    docs: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  },
  currentProduct: null,
  search: '',
  sort: 'Default',
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'product-management' })
export class ProductStore extends Store<ProductState> {
  constructor() {
    super(initialState);
  }

  products$ = this._select(
    (state: { products: PaginatedProducts }) => state.products
  );

  search$ = this._select((state: { search: string }) => state.search);
  sort$ = this._select((state: { sort: string }) => state.sort);

  updateProductData(productData: Partial<ProductState>) {
    this.update(productData);
  }

  clearProductData() {
    this.update(initialState);
  }
}
