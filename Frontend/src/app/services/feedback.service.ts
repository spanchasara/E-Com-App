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
export class FeedbackService {
  apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private swalService: SwalService,
    private router: Router
  ) {}

  getFeedback(orderId: string) {
    this.loaderService.show();
    return this.http
      .get(this.apiUrl + `feedback/${orderId}`, {
        observe: "response",
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          return of(undefined);
        })
      );
  }

  addFeedback(feedbackBody: any, type: string = "app") {
    this.loaderService.show();
    return this.http
      .post(this.apiUrl + `feedback/${type}`, feedbackBody, {
        observe: "response",
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success("Feedback Added Successfully!!");
          this.router.navigate(["/"]);
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
