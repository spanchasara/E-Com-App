import { Injectable } from '@angular/core';
import { SignIn, Signup } from './auth.model';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.model';
import { environment } from 'src/environment/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserStore } from '../../store/auth/user-store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
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

          localStorage.setItem('userToken', token);
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
    localStorage.removeItem('userToken');
    this.userStore.clearUserData();
    this.isAuthenticated.next(false);
    this.router.navigate(['/']);
  }

  checkUserExists() {
    return localStorage.getItem('userToken') && this.userStore.getValue().user;
  }

  clearStore() {
    this.userStore.reset();
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.httpClient
      .post<User>(this.apiUrl + 'auth/change-password', {oldPassword, newPassword}, {
        observe: 'response',
      })
      .pipe(
        tap((resData) => {
          console.log(resData)
          Swal.fire('Success', 'Password Updated Successfully!!', 'success').then(
          );
        }),
        catchError((error) => {
            console.log(error)
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }

}
