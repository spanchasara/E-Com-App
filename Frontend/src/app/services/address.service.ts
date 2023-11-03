import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError, of, Subject } from 'rxjs';

import { environment } from 'src/environment/environment';
import { Address } from '../models/address.model';
import { LoaderService } from './loader.service';
import { SwalService } from './swal.service';

@Injectable({ providedIn: 'root' })
export class AddressService {
  apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private swalService: SwalService,
    private router: Router
  ) {}
  callGetUsersAddress = new Subject<boolean>();

  addAddress(address: Address) {
    this.loaderService.show();
    delete address.userId;
    return this.http
      .post<Address>(this.apiUrl + 'address', address, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success('Address Added Successfully!!');
          this.router.navigate(['/place-order']);
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  editAddress(address: Address) {
    this.loaderService.show();
    const addressId = address._id;
    delete address._id;
    delete address.userId;
    delete address.createdAt;
    delete address.updatedAt;
    delete address.__v;
    return this.http
      .patch<Address>(this.apiUrl + `address/${addressId}`, address, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success('Address Updated Successfully!!');
          this.router.navigate(['/place-order']);
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);

          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  getAllUsersAddresses() {
    this.loaderService.show();
    return this.http.get<Address[]>(this.apiUrl + 'address/user').pipe(
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

  getSingleAddress(addressId: string) {
    this.loaderService.show();
    return this.http.get<Address>(this.apiUrl + `address/${addressId}`).pipe(
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

  deleteAddress(addressId: string) {
    this.loaderService.show();
    return this.http
      .delete<Address>(this.apiUrl + `address/${addressId}`, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.swalService.success('Address Deleted Successfully!!');
          this.callGetUsersAddress.next(true);
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
