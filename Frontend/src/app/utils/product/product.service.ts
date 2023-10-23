import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';
import { PaginatedProducts, Product } from './product.model';
import { ProductStore } from 'src/app/store/products/product.store';
import { LoaderService } from '../shared/loader.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private httpClient: HttpClient,
    private productStore: ProductStore,
    private loaderService: LoaderService
  ) {}
  isAuthenticated = new Subject<boolean>();

  apiUrl = environment.apiUrl;
  error = new Subject<string>();

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
        tap((resData) => {
          this.loaderService.hide();

          const obj: any = {};
          obj[isSingle ? 'currentProduct' : 'products'] = resData;

          this.productStore.updateProductData(obj);
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }

  getSellerProducts(options: {
    keyword?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Observable<any> {
    this.loaderService.show();
    let params = new HttpParams();

    params = params.append('keyword', options?.keyword || '');
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
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }
}
