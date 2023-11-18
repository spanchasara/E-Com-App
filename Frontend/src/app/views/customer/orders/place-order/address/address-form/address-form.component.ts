import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from 'src/environment/environment';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address.service';
import { UserStore } from 'src/app/store/user-store';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css'],
})
export class AddressFormComponent implements AfterViewInit {
  @ViewChild('f', { static: false })
  addressForm!: NgForm;
  @Input() address: Address = {
    fullName: '',
    phoneNo: '',
    country: 'India',
    state: '',
    city: '',
    addressLane1: '',
    addressLane2: '',
    landmark: '',
    pincode: '',
    isDefault: false,
  };
  @Input() editMode: boolean = false;
  states: any[] = [];

  constructor(
    private addressService: AddressService,
    private userStore: UserStore,
    private router: Router
  ) {}

  ngAfterViewInit() {
    const user = this.userStore.getValue().user;
    this.address.userId = user?._id || '';
    if (user?.role !== 'customer') this.router.navigate(['/']);
    this.states = environment.states;
    if (this.editMode) {
      this.address.state;
    }
  }

  onSubmit() {
    if (!this.editMode)
      this.addressService.addAddress(this.address).subscribe();
    else this.addressService.editAddress(this.address).subscribe();
  }
}
