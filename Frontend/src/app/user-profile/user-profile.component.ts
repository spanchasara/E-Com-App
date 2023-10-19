import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UpdateUser, User } from '../utils/user/user.model';
import { UserStore } from '../store/auth/user-store';
import { NgForm } from '@angular/forms';
import { UserService } from '../utils/user/user.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoaderService } from '../utils/shared/loader.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements AfterViewInit {
  @ViewChild('updateProfileForm', { static: true })
  updateProfileForm!: NgForm;

  @ViewChild('changePasswordContainer', { read: ViewContainerRef })
  changePasswordContainer!: ViewContainerRef;
  changePasswordMode: boolean = false;
  editMode: boolean = false;
  userObject: User | null | undefined;

  constructor(
    private userStore: UserStore,
    private userService: UserService,
    private loaderService: LoaderService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngAfterViewInit(): void {
    this.loaderService.show();
    setTimeout(() => {
      const user = this.userStore.getValue().user;
      this.userObject = user;
      this.updateProfileForm.setValue({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        username: user?.username,
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
}
