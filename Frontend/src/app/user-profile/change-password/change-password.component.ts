import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/utils/auth/auth.service';
import Swal from 'sweetalert2';

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
      Swal.fire(
        'Error',
        'The new Password should be same as confirm password',
        'error'
      );
    }
  }
  cancelForm() {
    console.log('event emiited');
    this.unloadComponent.emit();
  }
}
