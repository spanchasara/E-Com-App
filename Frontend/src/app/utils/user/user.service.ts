import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { PaginatedUsers, UpdateUser, User } from './user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { UserStore } from 'src/app/store/auth/user-store';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private userStore: UserStore,
    private router: Router
  ) {}
  updateUser(updateUserData: UpdateUser) {
    return this.httpClient
      .patch<User>(this.apiUrl + 'user/update-me', updateUserData, {
        observe: 'response',
      })
      .pipe(
        tap((resData) => {
          console.log(resData);
          const user = resData.body;
          this.userStore.updateUserData({ user });
          console.log(user);
          Swal.fire('Success', 'User Updated Successfully!!', 'success').then(
            (result) => {
              if (result.isConfirmed) this.router.navigate(['/user']);
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

  getAllUsers(role: string = '', options: any = {}) {
    let params = new HttpParams();

    params = params.append('limit', options?.limit || 10);
    params = params.append('page', options?.page || 1);

    return this.httpClient
      .get<PaginatedUsers>(this.apiUrl + `user/${role}`, {
        params,
      })
      .pipe(
        tap((resData) => {
          const users = resData;
          this.userStore.updateUserData({ users });
        }),
        catchError((error) => {
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }

  toggleAccountStatus(userId: string, isSuspended: boolean = false) {
    let params = new HttpParams();

    params = params.append('isSuspended', isSuspended);

    return this.httpClient
      .patch<PaginatedUsers>(
        this.apiUrl + `user/toggle-account-status/${userId}`,
        {},
        {
          params,
        }
      )
      .pipe(
        tap((resData) => {
          console.log(resData);
        }),
        catchError((error) => {
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }
}
