import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, of, tap } from "rxjs";

import { environment } from "src/environment/environment";
import { PaginatedUsers, UpdateUser, User } from "../models/user.model";
import { LoaderService } from "./loader.service";
import { UserStore } from "../store/user-store";
import { SwalService } from "./swal.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  apiUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private userStore: UserStore,
    private router: Router,
    private loaderService: LoaderService,
    private swalService: SwalService
  ) {}

  updateUser(updateUserData: UpdateUser) {
    this.loaderService.show();
    return this.httpClient
      .patch<User>(this.apiUrl + "user/update-me", updateUserData, {
        observe: "response",
      })
      .pipe(
        tap((resData) => {
          this.loaderService.hide();
          const user = resData.body;
          this.userStore.updateUserData({ user });
          this.swalService.success("User Updated Successfully!!");
          this.router.navigate(["/user"]);
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  getAllUsers(role: string = "", options: any = {}) {
    let params = new HttpParams();
    this.loaderService.show();
    params = params.append("limit", options?.limit || 10);
    params = params.append("page", options?.page || 1);

    return this.httpClient
      .get<PaginatedUsers>(this.apiUrl + `user/${role}`, {
        params,
      })
      .pipe(
        tap((resData) => {
          this.loaderService.hide();
          const users = resData;
          this.userStore.updateUserData({ users });
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  getMe() {
    this.loaderService.show();
    return this.httpClient.get<User>(this.apiUrl + "user/get-me").pipe(
      tap((resData) => {
        this.loaderService.hide();
        const user = resData;
        this.userStore.updateUserData({ user });
      }),
      catchError((error) => {
        this.loaderService.hide();
        console.log(error);
        this.swalService.error(error.error?.message);
        return of(error);
      })
    );
  }

  getPublicUser(id: string) {
    this.loaderService.show();
    return this.httpClient.get<User>(this.apiUrl + `user/public/${id}`).pipe(
      tap((resData) => {
        this.loaderService.hide();
        return resData;
      }),
      catchError((error) => {
        this.loaderService.hide();
        console.log(error);
        this.swalService.error(error.error?.message);
        return of(error);
      })
    );
  }

  toggleAccountStatus(userId: string, isSuspended: boolean = false) {
    let params = new HttpParams();
    this.loaderService.show();

    params = params.append("isSuspended", isSuspended);

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
          this.loaderService.hide();
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  sellerRegistration(companyName: string) {
    return this.httpClient
      .post<User>(this.apiUrl + "user/seller-register", { companyName })
      .pipe(
        tap((resData) => {
          const user = resData;
          this.userStore.updateUserData({ user });
        }),
        catchError((error) => {
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  toggleRole(role: string) {
    return this.httpClient
      .post<User>(this.apiUrl + `user/toggle-role/${role}`, {})
      .pipe(
        tap((resData) => {
          const user = resData;
          this.userStore.updateUserData({ user });
        }),
        catchError((error) => {
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  toggleAdmin(userId: string, isAdmin: boolean = true) {
    const role = isAdmin ? "admin" : "customer";

    return this.httpClient
      .post<User>(this.apiUrl + `user/mark-admin/${userId}/${role}`, {})
      .pipe(
        tap((resData) => {
          this.swalService.success(
            `User ${isAdmin ? "Marked" : "Unmarked"} as Admin Successfully!!`
          );
        }),
        catchError((error) => {
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }
}
