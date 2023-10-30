import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';

import { Cart, UpdateBody, emptyCart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { LoaderService } from './loader.service';
import { ProductService } from './product.service';
import { CartStore } from '../store/cart.store';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService,
    private productService: ProductService,
    private cartStore: CartStore
  ) {}

  apiUrl = environment.apiUrl;
  callGetCart = new Subject<boolean>();
  callLocalCart = new Subject<boolean>();

  getCart(): Observable<any> {
    this.loaderService.show();

    return this.httpClient.get<Cart>(this.apiUrl + 'cart').pipe(
      tap(() => {
        this.loaderService.hide();
      }),
      catchError((error) => {
        this.loaderService.hide();
        console.log(error);
        Swal.fire({
          title: 'Error',
          html: error.error?.message,
          icon: 'error',
          width: 400,
        });
        return of(error);
      })
    );
  }

  updateCart(updateBody: UpdateBody, showLoader = true): Observable<any> {
    if (showLoader) this.loaderService.show();

    return this.httpClient.patch<Cart>(this.apiUrl + 'cart', updateBody).pipe(
      tap(() => {
        if (showLoader) this.loaderService.hide();

        if (updateBody?.qty === undefined) {
          const { productId, isAdd } = updateBody;
          this.cartStore.updateCartData(productId, isAdd);
        }

        this.callGetCart.next(true);
      }),
      catchError((error) => {
        if (showLoader) this.loaderService.hide();
        this.callGetCart.next(true);
        console.log(error);
        Swal.fire({
          title: 'Error',
          html: error.error?.message,
          icon: 'error',
          width: 400,
        });
        return of(error);
      })
    );
  }

  getLocalCart(): Cart {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : emptyCart;
  }

  updateLocalCart(updateBody: UpdateBody) {
    const { productId, isAdd, qty } = updateBody;

    const localCart = this.getLocalCart();

    this.productService.getProducts(true, productId).subscribe((product) => {
      const cart =
        qty === undefined
          ? this.updateLocalCartAddOrRemove(localCart, product, isAdd)
          : this.updateLocalCartQty(localCart, product, qty);

      cart.totalQty = cart.products.reduce((acc, curr) => acc + curr.qty, 0);
      cart.totalAmount = cart.products.reduce(
        (acc, curr) => acc + curr.productId.price * curr.qty,
        0
      );

      localStorage.setItem('cart', JSON.stringify(cart));
      this.cartStore.updateCartData(productId, isAdd);
      this.callLocalCart.next(true);
    });
  }

  updateLocalCartAddOrRemove(
    cart: Cart,
    product: Product,
    isAdd: boolean = true
  ) {
    if (isAdd) {
      cart.products.push({
        _id: '',
        qty: 1,
        productId: {
          _id: product._id as string,
          title: product.title,
          price: product.price,
          stock: product.stock,
        },
      });
    } else {
      const index = cart.products.findIndex(
        (product) => product.productId._id === product._id
      );
      cart.products.splice(index, 1);
    }

    return cart;
  }

  updateLocalCartQty(cart: Cart, product: Product, qty: number) {
    const index = cart.products.findIndex(
      (prod) => prod.productId._id === product._id
    );

    if (index > -1) {
      cart.products[index].qty = product.stock > qty ? qty : product.stock;
    }

    if (product.stock < qty) {
      Swal.fire({
        title: 'Warning',
        html: `Only ${product.stock} ${
          product.stock > 1 ? 'are' : 'is'
        } available in stock`,
        icon: 'warning',
        width: 400,
      });
    }

    return cart;
  }
}
