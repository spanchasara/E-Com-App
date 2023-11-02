import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, of, tap } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environment/environment";

import { Cart } from "../models/cart.model";
import { LoaderService } from "./loader.service";
import { ProductService } from "./product.service";
import { CartStore } from "../store/cart.store";
import { SwalService } from "./swal.service";
import {
  CreateOrderBody,
  PaginatedOrders,
  PlaceOrder,
  PlacedOrder,
} from "../models/order.model";
import { Product } from "../models/product.model";
import { CartService } from "./cart.service";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService,
    private swalService: SwalService,
    private productService: ProductService,
    private cartService: CartService,
    private cartStore: CartStore
  ) {}

  apiUrl = environment.apiUrl;
  callGetOrders = new Subject<string>();

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

  markDelivered(orderId: string): Observable<any> {
    this.loaderService.show();

    return this.httpClient
      .patch(this.apiUrl + `order/delivered/${orderId}`, {})
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.callGetOrders.next("seller");
          this.swalService.success("Order marked as delivered!!");
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  createOrder(action: string, orderBody: CreateOrderBody): Observable<any> {
    this.loaderService.show();

    if (action === "full") this.cartStore.clearCartData();

    if (action === "partial") {
      orderBody.selectedProductIds?.forEach((productId) => {
        this.cartStore.updateCartData(productId, false);
      });
    }

    return this.httpClient
      .post(this.apiUrl + `order/${action}`, orderBody)
      .pipe(
        tap(() => {
          this.loaderService.hide();
          // this.swalService.success("Order Placed Successfully!!");
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  getCustomerOrders(
    isSingle: boolean = false,
    order:
      | string
      | {
          page?: number;
          limit?: number;
          sort?: string;
        }
  ): Observable<any> {
    this.loaderService.show();

    let params = new HttpParams();
    if (!isSingle && typeof order === "object") {
      params = params.append("page", order?.page || 1);
      params = params.append("limit", order?.limit || 5);
      params = params.append("sort", order?.sort || "-createdAt");
    }
    let orderId;
    if (isSingle) orderId = order;
    return this.httpClient
      .get<PaginatedOrders>(this.apiUrl + `order/${isSingle ? orderId : ""}`, {
        params,
      })
      .pipe(
        tap((data) => {
          console.log(data);
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

  refineOrder(action: string, data: CreateOrderBody | null): Observable<any> {
    return new Observable((observer) => {
      let body = {};

      if (action === "single") {
        const productId = data?.productId || "";
        const qty = data?.qty || 1;
        this.productService
          .getProducts(true, productId)
          .subscribe((data: Product) => {
            body = {
              totalAmount: data.price * qty,
              totalQty: qty,
              products: [
                {
                  productId: {
                    _id: data._id || "",
                    title: data.title,
                    price: data.price,
                  },
                  qty,
                },
              ],
            };
            observer.next(body);
            observer.complete();
          });
      } else {
        this.cartService.getCart().subscribe((cartItems: Cart) => {
          if (action === "full") {
            body = cartItems;
          } else if (action === "partial") {
            const selectedProductIds = data?.selectedProductIds || [];
            cartItems.products = cartItems.products.filter((product) =>
              selectedProductIds.includes(product.productId._id)
            );

            cartItems.totalQty = cartItems.products.reduce(
              (total, product) => total + product.qty,
              0
            );

            cartItems.totalAmount = cartItems.products.reduce(
              (total, product) => total + product.qty * product.productId.price,
              0
            );

            body = cartItems;
          }
          observer.next(body);
          observer.complete();
        });
      }
    });
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    this.loaderService.show();

    let params = new HttpParams();

    params = params.append("orderId", orderId);
    params = params.append("status", status);
    return this.httpClient
      .patch(this.apiUrl + "order", {}, {
        params
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success("Order Placed Successfully!!");
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
