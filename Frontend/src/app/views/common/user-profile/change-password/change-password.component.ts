import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  @ViewChild('changePasswordForm', { static: true })
  changePasswordForm!: NgForm;

  @Output() unloadComponent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  changePassword() {
    if (
      this.changePasswordForm.value.newPassword ===
      this.changePasswordForm.value.confirmPassword
    )
      this.authService
        .changePassword(
          this.changePasswordForm.value?.oldPassword,
          this.changePasswordForm.value?.newPassword
        )
        .subscribe(() => {
          this.cancelForm();
        });
    else {
      Swal.fire({
        title: 'Error',
        html: 'The new Password should be same as confirm password',
        icon: 'error',
        width: 400,
      });
    }
  }
  cancelForm() {
    this.unloadComponent.emit();
  }
}
