import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface ProductState {
  search: string;
  sort: string;
}

const initialState = {
  search: '',
  sort: 'Default',
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'product-management' })
export class ProductStore extends Store<ProductState> {
  constructor() {
    super(initialState);
  }

  search$ = this._select((state: { search: string }) => state.search);
  sort$ = this._select((state: { sort: string }) => state.sort);

  updateProductData(productData: Partial<ProductState>) {
    this.update(productData);
  }

  clearProductData() {
    this.update(initialState);
  }
}
