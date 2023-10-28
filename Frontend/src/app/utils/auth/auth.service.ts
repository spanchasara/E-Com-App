import { Injectable } from '@angular/core';
import { SignIn, Signup } from './auth.model';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  of,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.model';
import { environment } from 'src/environment/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserStore } from '../../store/auth/user-store';
import { LoaderService } from '../shared/loader.service';
import { CartStore } from 'src/app/store/cart/cart.store';
import { ProductStore } from 'src/app/store/products/product.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private userStore: UserStore,
    private productStore: ProductStore,
    // private cartStore: CartStore,
    private loaderService: LoaderService
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
          Swal.fire('Success', 'Registered Successfully!!', 'success').then(
            (result) => {
              if (result.isConfirmed) this.router.navigate(['/login']);
            }
          );
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
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

          Swal.fire('Success', 'LoggedIn Successfully!!', 'success').then(
            (result) => {
              if (result.isConfirmed && user) {
                if (user.role === 'admin') {
                  this.router.navigate(['/admin/dashboard']);
                } else if (user.role === 'seller') {
                  this.router.navigate(['/seller/dashboard']);
                } else {
                  this.router.navigate(['/']);
                }
              }
            }
          );
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
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
    console.log('autoLogout', expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      Swal.fire(
        'Session Expiry',
        'The session will expire in 15 seconds',
        'warning'
      );
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
    return {
      isAuthenticated:
        localStorage.getItem('userToken') && !!this.userStore.getValue().user,
      role: this.userStore.getValue().user?.role,
    };
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
          Swal.fire(
            'Success',
            'Password Updated Successfully!!',
            'success'
          ).then();
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }
}
