import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface CartState {
  addedProducts: { [key: string]: boolean };
}

const initialState: CartState = {
  addedProducts: {},
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'cart-management' })
export class CartStore extends Store<CartState> {
  constructor() {
    super(initialState);
  }

  addedProducts$ = this._select(
    (state: { addedProducts: { [key: string]: boolean } }) =>
      state.addedProducts
  );

  updateCartData(productId: string, isAdd: boolean = false) {
    const addedProducts = { ...this.getValue().addedProducts };
    addedProducts[productId] = isAdd;
    this.update({ addedProducts });
  }

  clearCartData() {
    this.update(initialState);
  }
}
