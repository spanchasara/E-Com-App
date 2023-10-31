import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'src/environment/environment';
import { PaginatedProducts, Product } from '../models/product.model';
import { LoaderService } from './loader.service';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService,
    private swalService: SwalService,
    private router: Router
  ) {}
  isAuthenticated = new Subject<boolean>();

  apiUrl = environment.apiUrl;
  error = new Subject<string>();
  callGetProducts = new Subject<boolean>();

  getProducts(
    isSingle: boolean = false,
    productData:
      | string
      | {
          keyword?: string;
          page?: number;
          limit?: number;
          sort?: string;
        }
  ): Observable<any> {
    this.loaderService.show();
    let params = new HttpParams();

    if (!isSingle && typeof productData === 'object') {
      params = params.append('keyword', productData?.keyword || '');
      params = params.append('page', productData?.page || 1);
      params = params.append('limit', productData?.limit || 10);
      params = params.append('sort', productData?.sort || '');
    }

    return this.httpClient
      .get<PaginatedProducts | Product>(
        this.apiUrl + `product/${isSingle ? productData : ''}`,
        {
          params,
        }
      )
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

  getSellerProducts(options: {
    keyword?: string;
    outOfStock?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }): Observable<any> {
    this.loaderService.show();
    let params = new HttpParams();

    params = params.append('keyword', options?.keyword || '');
    params = params.append('outOfStock', options?.outOfStock || false);
    params = params.append('page', options?.page || 1);
    params = params.append('limit', options?.limit || 10);
    params = params.append('sort', options?.sort || '');

    return this.httpClient
      .get<PaginatedProducts | Product>(this.apiUrl + 'product/get-seller', {
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

  addProduct(product: Product) {
    this.loaderService.show();
    delete product.sellerId;
    return this.httpClient
      .post<Product>(this.apiUrl + 'product', product, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success('Product Added Successfully!!');
          this.router.navigate(['/']);
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }
  editProduct(id: string, product: Product) {
    this.loaderService.show();
    delete product.sellerId;
    return this.httpClient
      .patch<Product>(this.apiUrl + 'product/' + id, product, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success('Product Updated Successfully!!');
          this.router.navigate(['/products', id]);
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }
  deleteProduct(id: string | undefined) {
    this.loaderService.show();
    return this.httpClient
      .delete<{ message: string }>(this.apiUrl + 'product/' + id, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success('Product Deleted Successfully!!');
          this.router.navigate(['/']);
          this.callGetProducts.next(true);
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
