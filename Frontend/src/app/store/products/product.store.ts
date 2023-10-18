import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import {
  PaginatedProducts,
  Product,
} from 'src/app/utils/product/product.model';

export interface UserState {
  products: PaginatedProducts;
  currentProduct: Product | null;
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
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'product' })
export class ProductStore extends Store<UserState> {
  constructor() {
    super(initialState);
  }

  updateProductData(
    isSingle: boolean = false,
    data: PaginatedProducts | Product
  ) {
    if (isSingle) {
      this.update((state) => ({
        ...state,
        currentProduct: data as Product,
      }));
    } else {
      this.update((state) => ({
        ...state,
        products: data as PaginatedProducts,
      }));
    }
  }

  clearProductData() {
    this.update(initialState);
  }
}
