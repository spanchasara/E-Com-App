import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address.service';
import { UserStore } from 'src/app/store/user-store';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css'],
})
export class EditAddressComponent implements OnInit {
  id: string = '';
  address!: Address;
  role: string = '';
  currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addressService: AddressService,
    private userStore: UserStore
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') || '';

      if (!this.id.match(/^[0-9a-fA-F]{24}$/)) {
        this.router.navigate(['/not-found']);
      } 
      else {
        this.addressService.getSingleAddress(this.id).subscribe((data) => {
          this.role = this.userStore.getValue().user?.role || '';
          this.currentUserId = this.userStore.getValue().user?._id || '';
          if (
            this.role !== 'customer' &&
            this.currentUserId !== '' &&
            this.currentUserId !== this.address.userId
          ) {
            this.router.navigate(['/']);
          }
          this.address = data;
        });
      }
    });
  }
}
