import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from './address.model';
import { LoaderService } from '../shared/loader.service';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { tap, catchError, of, Subject } from 'rxjs';
import Swal from 'sweetalert2';

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
          console.log('added');
          this.loaderService.hide();
          Swal.fire('Success', 'Address Added Successfully!!', 'success').then(
            (result) => {
              if (result.isConfirmed) this.router.navigate(['/address']);
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
          Swal.fire(
            'Success',
            'Address Updated Successfully!!',
            'success'
          ).then((result) => {
            if (result.isConfirmed) this.router.navigate(['/address']);
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

  getAllUsersAddresses() {
    this.loaderService.show();
    return this.http.get<Address[]>(this.apiUrl + 'address/user').pipe(
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

  getSingleAddress(addressId: string) {
    this.loaderService.show();
    return this.http.get<Address>(this.apiUrl + `address/${addressId}`).pipe(
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

  deleteAddress(addressId: string) {
    this.loaderService.show();
    return this.http
      .delete<Address>(this.apiUrl + `address/${addressId}`, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.loaderService.hide();
          Swal.fire(
            'Success',
            'Address Deleted Successfully!!',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              this.callGetUsersAddress.next(true);
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
          Swal.fire(
            'Success',
            'Default Address Updated Successfully!!',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              this.callGetUsersAddress.next(true);
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
