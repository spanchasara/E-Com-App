import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';
import { LoaderService } from '../shared/loader.service';
import { Cart, UpdateBody } from './cart.model';
import { CartStore } from 'src/app/store/cart/cart.store';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService,
    private cartStore: CartStore
  ) {}

  apiUrl = environment.apiUrl;
  callGetCart = new Subject<boolean>();

  getCart(): Observable<any> {
    this.loaderService.show();

    return this.httpClient.get<Cart>(this.apiUrl + 'cart').pipe(
      tap(() => {
        this.loaderService.hide();
      }),
      catchError((error) => {
        this.loaderService.hide();
        console.log(error);
        Swal.fire('Error', error.error?.message, 'error');
        return of(error);
      })
    );
  }

  updateCart(updateBody: UpdateBody): Observable<any> {
    this.loaderService.show();

    return this.httpClient.patch<Cart>(this.apiUrl + 'cart', updateBody).pipe(
      tap(() => {
        this.loaderService.hide();

        if (updateBody?.qty === undefined) {
          const { productId, isAdd } = updateBody;
          this.cartStore.updateCartData(productId, isAdd);
        }

        this.callGetCart.next(true);
      }),
      catchError((error) => {
        this.loaderService.hide();
        this.callGetCart.next(true);
        console.log(error);
        Swal.fire('Error', error.error?.message, 'error');
        return of(error);
      })
    );
  }
}
