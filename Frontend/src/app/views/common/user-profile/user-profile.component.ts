import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { UpdateUser, User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UserStore } from 'src/app/store/user-store';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements AfterViewInit, OnInit {
  @ViewChild('updateProfileForm', { static: true })
  updateProfileForm!: NgForm;
  @ViewChild('sellerRegistrationForm', { static: true })
  sellerRegistrationForm!: NgForm;
  @ViewChild('changePasswordContainer', { read: ViewContainerRef })
  changePasswordContainer!: ViewContainerRef;

  changePasswordMode: boolean = false;
  editMode: boolean = false;
  userObject: User | null | undefined;
  textInput: string = '';
  sellerCheck: boolean = true;
  toggleAccountRoleCheck: boolean = false;
  showCompany: boolean = true;

  constructor(
    private userStore: UserStore,
    private userService: UserService,
    private modalService: NgbModal,
    private router: Router,
    private loaderService: LoaderService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  loadProfile() {
    this.loaderService.show();
    setTimeout(() => {
      this.userStore.user$.subscribe((user) => {
        this.userObject = user;
        this.showCompany = user?.role === 'seller';
        this.toggleAccountRoleCheck =
          user?.role !== 'admin' && user?.companyName;
        this.sellerCheck = user?.role === 'customer' && !user?.companyName;

        const obj = {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          username: user?.username,
          companyName: '',
        };

        if (user?.role === 'seller') {
          obj.companyName = user?.companyName;
        }
        this.updateProfileForm.setValue(obj);
      });
      this.loaderService.hide();
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngAfterViewInit(): void {
    this.loadProfile();
  }

  toggleEditMode(isCancel = false) {
    this.editMode = !this.editMode;

    if (isCancel) {
      const user = this.userStore.getValue().user;

      this.updateProfileForm.setValue({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        companyName: user?.companyName,
        username: user?.username,
      });
    }
  }

  onSubmit() {
    const updateUserData: UpdateUser = {
      firstName: this.updateProfileForm.value?.firstName,
      lastName: this.updateProfileForm.value?.lastName,
      email: this.updateProfileForm.value?.email,
      username: this.updateProfileForm.value?.username,
    };

    if (this.userObject?.role === 'seller') {
      updateUserData.companyName = this.updateProfileForm.value?.companyName;
    }

    this.userService.updateUser(updateUserData).subscribe((res) => {
      this.toggleEditMode(true);
    });
  }

  togglePasswordMode() {
    this.changePasswordMode = true;
    const dynamicComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        ChangePasswordComponent
      );
    const dynamicComponentRef = dynamicComponentFactory.create(
      this.changePasswordContainer?.injector
    );
    this.changePasswordContainer.clear();
    this.changePasswordContainer.insert(dynamicComponentRef.hostView);
  }

  unloadForm() {
    this.changePasswordContainer.clear();
    this.changePasswordMode = false;
  }

  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  saveSeller() {
    if (this.textInput === '') {
      return;
    }

    this.userService.sellerRegistration(this.textInput).subscribe((resData) => {
      Swal.fire({
        title: 'Success',
        html: 'Registered as Seller Successfully!!',
        icon: 'success',
        width: 400,
      }).then((result) => {
        if (result.isConfirmed) {
          this.modalService.dismissAll('Close click');
          this.saveSellerCheck();
          this.router.navigate(['/user'], { replaceUrl: true });
        }
      });
    });
  }

  saveSellerCheck() {
    this.sellerCheck =
      this.userObject?.role === 'customer' && !this.userObject?.companyName;
  }

  closeModal() {
    this.textInput = '';
    this.modalService.dismissAll('Close click');
  }

  toggleAccountRole() {
    this.toggleAccountRoleCheck =
      this.userObject?.role !== 'admin' && !!this.userObject?.companyName;

    if (this.userObject?.role === 'customer') {
      this.showCompany = true;
      this.userService.toggleRole('seller').subscribe(() => {
        Swal.fire({
          title: 'Success',
          html: 'Shifted to seller!!',
          icon: 'success',
          width: 400,
        });
      });
    } else if (this.userObject?.role === 'seller') {
      this.showCompany = false;
      this.userService.toggleRole('customer').subscribe(() => {
        Swal.fire({
          title: 'Success',
          html: 'Shifted to customer!!',
          icon: 'success',
          width: 400,
        });
      });
    }
  }
}
