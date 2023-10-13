import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/store/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild('f', { static: false })
  loginForm!: NgForm;
  constructor(private authService: AuthService, private router: Router, 
    private cookieService: CookieService) {}
  onSubmit() {
    // console.log(this.loginForm.value);
    this.authService.signin(this.loginForm.form.value).subscribe(
      (resData) => {
        this.cookieService.set('userToken', resData.body?.token || '');
        console.log(resData)
        Swal.fire('Success', 'LoggedIn Successfully!!', 'success').then(
          (result) => {
            // if (result.isConfirmed) this.router.navigate(['/']);
          }
        );
      },
      (e) => {
        console.log(e.error.message)
        Swal.fire('Error', e.error.message, 'error')
      }
    );

  }
}
