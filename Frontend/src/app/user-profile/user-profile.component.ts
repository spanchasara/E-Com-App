import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UpdateUser, User } from '../utils/user/user.model';
import { UserStore } from '../store/auth/user-store';
import { NgForm } from '@angular/forms';
import { UserService } from '../utils/user/user.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoaderService } from '../utils/shared/loader.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements AfterViewInit {
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

  constructor(
    private userStore: UserStore,
    private userService: UserService,
    private modalService: NgbModal,
    private router: Router,
    private loaderService: LoaderService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngAfterViewInit(): void {
    this.loaderService.show();
    setTimeout(() => {
      this.userStore.user$.subscribe((user) => {
        console.log("heyy ", user)
        this.userObject = user;
        this.toggleAccountRoleCheck =
          user?.role !== 'admin' && user?.companyName;
        this.sellerCheck = user?.role === 'customer' && !user?.companyName;
        this.updateProfileForm.setValue({
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          username: user?.username,
        });
      });
      this.loaderService.hide();
    });
  }

  toggleEditMode(isCancel = false) {
    this.editMode = !this.editMode;

    if (isCancel) {
      const user = this.userStore.getValue().user;

      this.updateProfileForm.setValue({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
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
    // const dynamicComponentInstance =
    //   dynamicComponentRef.instance as ChangePasswordComponent;
    this.changePasswordContainer.insert(dynamicComponentRef.hostView);
  }

  unloadForm() {
    console.log('event listened');
    this.changePasswordContainer.clear();
    this.changePasswordMode = false;
  }

  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true });
    console.log('seller registration form' + this.sellerRegistrationForm.value);
  }

  saveSeller() {
    if (this.textInput === '') {
      return;
    }

    this.userService.sellerRegistration(this.textInput).subscribe((resData) => {
      Swal.fire(
        'Success',
        'Registered as Seller Successfully!!',
        'success'
      ).then((result) => {
        if (result.isConfirmed) {
          this.modalService.dismissAll('Close click');
          // this.router.navigate(['/user']);
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
      this.userService.toggleRole('seller').subscribe(() => {
        Swal.fire('Success', 'Shifted to seller!!', 'success');
      });
    }
    else if(this.userObject?.role === 'seller'){
      this.userService.toggleRole('customer').subscribe(() => {
        Swal.fire('Success', 'Shifted to customer!!', 'success');
      });
    }
  }
}
