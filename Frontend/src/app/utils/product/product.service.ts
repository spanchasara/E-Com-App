import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';
import { PaginatedProducts, Product } from './product.model';
import { ProductStore } from 'src/app/store/products/product.store';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private httpClient: HttpClient,
    private productStore: ProductStore
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
          this.productStore.updateProductData(isSingle, resData);
        }),
        catchError((error) => {
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }
}
