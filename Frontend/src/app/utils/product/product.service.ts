import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';
import { PaginatedProducts, Product } from './product.model';
import { LoaderService } from '../shared/loader.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService,
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

  addProduct(product: Product) {
    this.loaderService.show();
    delete product.sellerId;
    delete product._id;
    return this.httpClient
      .post<Product>(this.apiUrl + 'product', product, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();

          Swal.fire('Success', 'Product Added Successfully!!', 'success').then(
            (result) => {
              if (result.isConfirmed) this.router.navigate(['/']);
            }
          );
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
          return of(error);
        })
      );
  }
  editProduct(id: string, product: Product) {
    this.loaderService.show();
    delete product.sellerId;
    delete product._id;
    return this.httpClient
      .patch<Product>(this.apiUrl + 'product/' + id, product, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();

          Swal.fire(
            'Success',
            'Product Updated Successfully!!',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/products', id]);
            }
          });
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          Swal.fire('Error', error.error?.message, 'error');
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
        tap((resData) => {
          this.loaderService.hide();
          console.log('deleted');

          Swal.fire(
            'Success',
            'Product Deleted Successfully!!',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/']);
              this.callGetProducts.next(true);
              // this.router.navigate(['/seller/dashboard'], {
              //   queryParams: { refresh: new Date().getTime() },
              // });
              // window.location.reload();
            }
          });
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
