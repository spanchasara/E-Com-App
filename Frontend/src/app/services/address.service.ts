import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError, of, Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from 'src/environment/environment';
import { Address } from '../models/address.model';
import { LoaderService } from './loader.service';

@Injectable({ providedIn: 'root' })
export class AddressService {
  apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
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
          Swal.fire({
            title: 'Success',
            html: 'Address Added Successfully!!',
            icon: 'success',
            width: 400,
          }).then((result) => {
            if (result.isConfirmed) this.router.navigate(['/address']);
          });
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          Swal.fire({
            title: 'Error',
            html: error.error?.message,
            icon: 'error',
            width: 400,
          });
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
    delete address.isDefault;
    return this.http
      .patch<Address>(this.apiUrl + `address/${addressId}`, address, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          Swal.fire({
            title: 'Success',
            html: 'Address Updated Successfully!!',
            icon: 'success',
            width: 400,
          }).then((result) => {
            if (result.isConfirmed) this.router.navigate(['/address']);
          });
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);

          Swal.fire({
            title: 'Error',
            html: error.error?.message,
            icon: 'error',
            width: 400,
          });
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
        Swal.fire({
          title: 'Error',
          html: error.error?.message,
          icon: 'error',
          width: 400,
        });
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
        Swal.fire({
          title: 'Error',
          html: error.error?.message,
          icon: 'error',
          width: 400,
        });
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
          Swal.fire({
            title: 'Success',
            html: 'Address Deleted Successfully!!',
            icon: 'success',
            width: 400,
          }).then((result) => {
            if (result.isConfirmed) {
              this.callGetUsersAddress.next(true);
            }
          });
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          Swal.fire({
            title: 'Error',
            html: error.error?.message,
            icon: 'error',
            width: 400,
          });
          return of(error);
        })
      );
  }

  changeDefaultAddress(oldAddressId: string, newAddressId: string) {
    this.loaderService.show();
    return this.http
      .patch<Address>(
        this.apiUrl + `address/toggle-default`,
        {
          oldAddressId,
          newAddressId,
        },
        { observe: 'response' }
      )
      .pipe(
        tap(() => {
          this.loaderService.hide();
          Swal.fire({
            title: 'Success',
            html: 'Default Address Updated Successfully!!',
            icon: 'success',
            width: 400,
          }).then((result) => {
            if (result.isConfirmed) {
              this.callGetUsersAddress.next(true);
            }
          });
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          Swal.fire({
            title: 'Error',
            html: error.error?.message,
            icon: 'error',
            width: 400,
          });
          return of(error);
        })
      );
  }
}
