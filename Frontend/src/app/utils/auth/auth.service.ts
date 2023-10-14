import { Injectable } from '@angular/core';
import { SignIn, Signup } from './auth.model';
import {
  Observable,
  Subject,
  catchError,
  of,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.model';
import { environment } from 'src/environment/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserStore } from '../../store/auth/user-store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private userStore: UserStore
  ) {}
  isAuthenticated = new Subject<boolean>();

  apiUrl = environment.apiUrl;
  error = new Subject<string>();

  signup(userData: Signup): Observable<any> {
    return this.httpClient
      .post<{ message: string }>(this.apiUrl + 'auth/register', userData, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          Swal.fire('Success', 'Registered Successfully!!', 'success').then(
            (result) => {
              if (result.isConfirmed) this.router.navigate(['/login']);
            }
          );
        }),
        catchError((error) => {
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }

  signin(userData: SignIn): Observable<any> {
    return this.httpClient
      .post<{ user: User; token: string }>(
        this.apiUrl + 'auth/login',
        userData,
        {
          observe: 'response',
        }
      )
      .pipe(
        tap((resData) => {
          const token = resData.body?.token || '';
          const user = resData.body?.user || null;

          this.cookieService.set('userToken', token);
          this.userStore.updateUserData(user);

          this.isAuthenticated.next(true);

          Swal.fire('Success', 'LoggedIn Successfully!!', 'success').then(
            (result) => {
              if (result.isConfirmed) this.router.navigate(['/']);
            }
          );
        }),
        catchError((error) => {
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }

  logout() {
    this.cookieService.deleteAll();
    this.userStore.clearUserData();
    this.isAuthenticated.next(false);
    this.router.navigate(['/']);
  }
  checkUserExists() {
    return (
      this.cookieService.check('userToken') && this.userStore.getValue().user
    );
  }
  clearStore() {
    this.userStore.reset();
  }
}
