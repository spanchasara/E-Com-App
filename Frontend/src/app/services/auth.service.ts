import { Injectable } from '@angular/core';
import { SignIn, Signup } from '../models/auth.model';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { environment } from 'src/environment/environment';
import { UserStore } from '../store/user-store';
import { ProductStore } from '../store/product.store';
import { CartStore } from '../store/cart.store';
import { LoaderService } from './loader.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private userStore: UserStore,
    private productStore: ProductStore,
    private cartStore: CartStore,
    private loaderService: LoaderService,
    private cartService: CartService
  ) {}
  isAuthenticated = new Subject<boolean>();

  apiUrl = environment.apiUrl;
  error = new Subject<string>();

  private tokenExpirationTimer: any;

  signup(userData: Signup): Observable<any> {
    this.loaderService.show();
    return this.httpClient
      .post<{ message: string }>(this.apiUrl + 'auth/register', userData, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          Swal.fire({
            title: 'Success',
            html: 'Registered Successfully!!',
            icon: 'success',
            width: 400,
          }).then((result) => {
            if (result.isConfirmed) this.router.navigate(['/login']);
          });
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

  signin(userData: SignIn): Observable<any> {
    this.loaderService.show();
    return this.httpClient
      .post<{ user: User; token: string; tokenExpiresIn: number }>(
        this.apiUrl + 'auth/login',
        userData,
        {
          observe: 'response',
        }
      )
      .pipe(
        tap((resData) => {
          this.loaderService.hide();
          const token = resData.body?.token || '';
          const user = resData.body?.user || null;
          const expiresInDuration = resData.body?.tokenExpiresIn || 0;

          localStorage.setItem('userToken', token);
          this.userStore.updateUserData({ user });

          this.autoLogout(expiresInDuration * 1000);
          this.isAuthenticated.next(true);

          if (user?.role === 'customer') {
            const localCart = this.cartService.getLocalCart();
            localCart.products.forEach((product) => {
              this.cartService
                .updateCart(
                  {
                    productId: product.productId._id,
                    qty: product.qty,
                  },
                  false
                )
                .subscribe();
            });
          }
          localStorage.removeItem('cart');

          Swal.fire({
            title: 'Success',
            html: 'LoggedIn Successfully!!',
            icon: 'success',
            width: 400,
          }).then((result) => {
            if (result.isConfirmed && user) {
              if (user.role === 'admin') {
                this.router.navigate(['/admin']);
              } else if (user.role === 'seller') {
                this.router.navigate(['/seller']);
              } else {
                this.router.navigate(['/']);
              }
            }
          });
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

  logout() {
    this.loaderService.show();
    localStorage.removeItem('userToken');
    this.userStore.clearUserData();
    this.productStore.clearProductData();
    // this.cartStore.clearCartData();
    this.isAuthenticated.next(false);
    this.loaderService.hide();
    this.router.navigate(['/']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      Swal.fire({
        title: 'Session Expiry',
        html: 'The session will expire in 15 seconds',
        icon: 'warning',
        width: 400,
      });
      setTimeout(() => {
        this.logout();
      }, 5000);
    }, expirationDuration - 15000);
  }

  checkRole(role: string) {
    return !!(
      this.userStore.getValue().user &&
      this.userStore.getValue().user?.role === role
    );
  }

  checkUserExists() {
    return (
      !!localStorage.getItem('userToken') && !!this.userStore.getValue().user
    );
  }

  clearStore() {
    this.userStore.reset();
  }

  changePassword(oldPassword: string, newPassword: string) {
    this.loaderService.show();
    return this.httpClient
      .post<User>(
        this.apiUrl + 'auth/change-password',
        { oldPassword, newPassword },
        {
          observe: 'response',
        }
      )
      .pipe(
        tap((resData) => {
          this.loaderService.hide();
          Swal.fire({
            title: 'Success',
            html: 'Password Updated Successfully!!',
            icon: 'success',
            width: 400,
          }).then();
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
}
