import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { UpdateUser, User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { UserStore } from 'src/app/store/auth/user-store';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private userStore: UserStore,
    private router: Router) {}
  updateUser(updateUserData: UpdateUser) {
    return this.httpClient
      .patch<User>(this.apiUrl + 'user/update-me', updateUserData, {
        observe: 'response',
      })
      .pipe(
        tap((resData) => {
          console.log(resData)
          const user = resData.body
          this.userStore.updateUserData(user);
          console.log(user)
          Swal.fire('Success', 'User Updated Successfully!!', 'success').then(
            (result) => {
                if(result.isConfirmed)
                    this.router.navigate(['/user'])
            }
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
