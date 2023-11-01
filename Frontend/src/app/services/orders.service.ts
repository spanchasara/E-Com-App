import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, of, tap } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environment/environment";

import { Cart, UpdateBody, emptyCart } from "../models/cart.model";
import { Product } from "../models/product.model";
import { LoaderService } from "./loader.service";
import { ProductService } from "./product.service";
import { CartStore } from "../store/cart.store";
import { SwalService } from "./swal.service";
import { PaginatedOrders } from "../models/order.model";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService,
    private swalService: SwalService,
    private productService: ProductService,
    private cartStore: CartStore
  ) {}

  apiUrl = environment.apiUrl;
  callGetCart = new Subject<boolean>();
  callLocalCart = new Subject<boolean>();

  getAdminOrders(options: {
    page?: number;
    limit?: number;
    sort?: string;
  }): Observable<any> {
    this.loaderService.show();

    let params = new HttpParams();

    params = params.append("page", options?.page || 1);
    params = params.append("limit", options?.limit || 5);
    params = params.append("sort", options?.sort || "-createdAt");

    return this.httpClient
      .get<PaginatedOrders>(this.apiUrl + "order/admin/get-all", { params })
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

  getSellerOrders(options: {
    page?: number;
    limit?: number;
    sort?: string;
    isCurrent: boolean;
  }): Observable<any> {
    this.loaderService.show();

    let params = new HttpParams();

    params = params.append("page", options?.page || 1);
    params = params.append("limit", options?.limit || 5);
    params = params.append("sort", options?.sort || "-createdAt");
    params = params.append("isCurrent", options.isCurrent);

    return this.httpClient
      .get<PaginatedOrders>(this.apiUrl + "order/seller", { params })
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

  getCustomerOrders(): Observable<any> {
    this.loaderService.show();

    return this.httpClient.get<Cart>(this.apiUrl + "cart").pipe(
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
}
