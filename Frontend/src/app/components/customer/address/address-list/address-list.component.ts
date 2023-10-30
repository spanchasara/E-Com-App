import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStore } from 'src/app/store/auth/user-store';
import { Address } from 'src/app/utils/address/address.model';
import { AddressService } from 'src/app/utils/address/address.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
})
export class AddressListComponent implements OnInit {
  role: string = '';
  addresses: Address[] = [];
  currentUserId: string = '';
  currentAddressId: string = '';
  newAddressId: string = '';

  constructor(
    private addressService: AddressService,
    private userStore: UserStore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAddresses();

    this.addressService.callGetUsersAddress.subscribe(() => {
      this.getAddresses();
    });
  }
  get tableData() {
    return this.addresses;
  }
  deleteAddress(addressId: string) {
    Swal.fire({
      title: 'Warning',
      showCancelButton: true,
      icon: 'warning',
      html: 'Want to Delete Product ?',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addressService.deleteAddress(addressId).subscribe();
      }
    });
  }
  getAddresses() {
    this.addressService.getAllUsersAddresses().subscribe((data) => {
      this.addresses = data;

      this.currentAddressId = data.filter((d: Address) => d.isDefault)[0]._id;
      this.newAddressId = this.currentAddressId;

      this.role = this.userStore.getValue().user?.role || '';
      this.currentUserId = this.userStore.getValue().user?._id || '';
      if (
        this.role !== 'customer' &&
        this.currentUserId !== '' &&
        this.currentUserId !== this.addresses[0].userId
      ) {
        this.router.navigate(['/']);
      }
    });
  }

  check(e: Event) {
    console.log(e);
    this.newAddressId = (e.target as HTMLInputElement).value;
  }
  updateDefaultAddress() {
    this.addressService
      .changeDefaultAddress(this.currentAddressId, this.newAddressId)
      .subscribe();
  }
}
