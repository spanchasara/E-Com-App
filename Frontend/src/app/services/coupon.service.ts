import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { tap, catchError, of, Subject } from "rxjs";

import { environment } from "src/environment/environment";
import { Address } from "../models/address.model";
import { LoaderService } from "./loader.service";
import { SwalService } from "./swal.service";
import { CouponBody, Coupon, PaginatedCoupons } from "../models/coupon.model";

@Injectable({ providedIn: "root" })
export class CouponService {
  apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private swalService: SwalService,
    private router: Router
  ) {}
  callGetAllCoupons = new Subject<boolean>();

  addCoupon(couponBody: CouponBody) {
    this.loaderService.show();
    return this.http
      .post<Coupon>(this.apiUrl + "coupon", couponBody, {
        observe: "response",
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success("Coupon Added Successfully!!");
          this.router.navigate(["/admin", "coupons"]);
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  editCoupon(couponId: string, couponBody: CouponBody) {
    this.loaderService.show();

    return this.http
      .patch<Address>(this.apiUrl + `coupon/${couponId}`, couponBody, {
        observe: "response",
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success("Coupon Updated Successfully!!");
          this.router.navigate(["/admin", "coupons"]);
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);

          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  getAllCoupons(options: {
    isOwn?: boolean;
    isEnabled?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    this.loaderService.show();
    let params = new HttpParams();

    params = params.append("page", options?.page || 1);
    params = params.append(
      "isOwn",
      options?.isOwn === undefined ? true : options?.isOwn
    );
    params = params.append(
      "isEnabled",
      options?.isEnabled === undefined ? true : options?.isEnabled
    );
    params = params.append("limit", options?.limit || 10);
    params = params.append("sort", options?.sort || "expiryDate");

    return this.http
      .get<PaginatedCoupons>(this.apiUrl + "coupon/all", {
        params,
      })
      .pipe(
        tap(() => {
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

  getAllCustomerCoupons(options: {
    keyword?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    this.loaderService.show();
    let params = new HttpParams();

    params = params.append("keyword", options?.keyword || "all");
    params = params.append("page", options?.page || 1);
    params = params.append("limit", options?.limit || 9);
    params = params.append("sort", options?.sort || "expiryDate");

    return this.http
      .get<PaginatedCoupons>(this.apiUrl + "coupon/all-customer", {
        params,
      })
      .pipe(
        tap(() => {
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

  getSingleCoupon(couponId: string) {
    this.loaderService.show();
    return this.http.get<Coupon>(this.apiUrl + `coupon/${couponId}`).pipe(
      tap(() => {
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

  deleteCoupon(couponId: string) {
    this.loaderService.show();
    return this.http
      .delete<Address>(this.apiUrl + `coupon/${couponId}`, {
        observe: "response",
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success("Coupon Deleted Successfully!!");
          this.callGetAllCoupons.next(true);
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }
}
