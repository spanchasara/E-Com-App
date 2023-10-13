import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/store/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  @ViewChild('f', { static: false })
  registerForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.signup(this.registerForm.form.value).subscribe(
      () => {
        Swal.fire('Success', 'Registered Successfully!!', 'success').then(
          (result) => {
            if (result.isConfirmed) this.router.navigate(['/login']);
          }
        );
      },
      (e) => {
        console.log(e.error.message);
        Swal.fire('Error', e.error.message, 'error');
      }
    );
  }
}
