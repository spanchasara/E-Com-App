import { Component, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";

import { Address } from "src/app/models/address.model";
import { AddressService } from "src/app/services/address.service";
import { UserStore } from "src/app/store/user-store";
import { SwalService } from "src/app/services/swal.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-address-list",
  templateUrl: "./address-list.component.html",
  styleUrls: ["./address-list.component.css"],
})
export class AddressListComponent implements OnInit {
  role: string = "";
  addresses: Address[] = [];
  currentUserId: string = "";
  currentAddressId: string = "";
  currentAddress: Address | null = null;
  @Output() addressSubject: Subject<any> = new Subject<any>();
  @Output() closeForm: Subject<any> = new Subject<any>();
  constructor(
    private addressService: AddressService,
    private swalService: SwalService,
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
    this.swalService
      .confirmWarning("Want to Delete Address ?")
      .then((result) => {
        if (result.isConfirmed) {
          this.addressService.deleteAddress(addressId).subscribe();
        }
      });
  }

  getAddresses() {
    this.addressService.getAllUsersAddresses().subscribe((data) => {
      this.addresses = data;

      this.currentAddress = data.filter((d: Address) => d.isDefault)[0];
      this.currentAddressId = this.currentAddress?._id || "";
      this.role = this.userStore.getValue().user?.role || "";
      this.currentUserId = this.userStore.getValue().user?._id || "";
      if (
        this.role !== "customer" &&
        this.currentUserId !== "" &&
        this.currentUserId !== this.addresses[0].userId
      ) {
        this.router.navigate(["/"]);
      }
      this.addressSubject.next(this.currentAddress);
    });
  }

  changeCurrentAddress(e: Event) {
    this.currentAddressId = (e.target as HTMLInputElement).value;
  }
  useThisAddress() {
    this.addressService
      .getSingleAddress(this.currentAddressId)
      .subscribe((data) => {
        this.currentAddress = data;
        this.currentAddressId = this.currentAddress?._id || "";
        this.addressSubject.next(this.currentAddress);
        this.closeForm.next(true);
      });
  }
}
