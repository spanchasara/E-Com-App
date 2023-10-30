import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  @ViewChild('f', { static: false })
  registerForm!: NgForm;
  passwordMismatch: boolean = true;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (
      this.registerForm.form.value?.confirmPassword !=
      this.registerForm.form.value?.password
    )
      this.passwordMismatch = false;
    else {
      const formData = {
        firstName: this.registerForm.form.value?.firstName,
        lastName: this.registerForm.form.value?.lastName,
        email: this.registerForm.form.value?.email,
        password: this.registerForm.form.value?.password,
        username: this.registerForm.form.value?.username,
      };
      this.authService.signup(formData).subscribe();
    }
  }
}
