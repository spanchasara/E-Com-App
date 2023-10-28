import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from 'src/app/store/auth/user-store';
import { Address } from 'src/app/utils/address/address.model';
import { AddressService } from 'src/app/utils/address/address.service';
import { environment } from 'src/environment/environment';
@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css'],
})
export class AddressFormComponent implements AfterViewInit {
  @ViewChild('f',{static: false})
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
    isDefault: false
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
    if (user?.role !== 'customer') this.router.navigate(['/notAuthorized']);
    this.states = environment.states 
    // console.log(this.states);
    
    console.log(this.address)

    if(this.editMode) {
       this.address.state ;
    }
  }
  onSubmit() {
      // this.address.fullName= this.addressForm.form.value?.fullName;
      // this.address.phoneNo= this.addressForm.form.value?.phoneNo;
      // this.address.country= this.address?.country;
      // this.address.state= this.addressForm.form.value?.state;
      // this.address.city= this.addressForm.form.value?.city;
      // this.address.addressLane1= this.addressForm.form.value?.addressLane1;
      // this.address.addressLane2= this.addressForm.form.value?.addressLane2;
      // this.address.landmark= this.addressForm.form.value?.landmark;
      // this.address.pincode= this.addressForm.form.value?.pincode;
     console.log(this.address)
    if(!this.editMode)
      this.addressService.addAddress(this.address).subscribe();  
    else
      this.addressService.editAddress(this.address).subscribe();  
  }

  check(e: any) {
    console.log(e)
  }
  
}
