import { Injectable } from '@angular/core';
import { SignIn, Signup } from './auth.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.model';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}
  error = new Subject<string>();
  signup(userData: Signup) {
    return this.httpClient.post<{ message: string }>(
      this.apiUrl + 'auth/register',
      userData,
      {
        observe: 'response',
      }
    );
  }
  signin(userData: SignIn) {
    return this.httpClient.post<{ user: User, token: string }>(
      this.apiUrl + 'auth/login',
      userData,
      {
        observe: 'response',
      }
    );
  }
}
