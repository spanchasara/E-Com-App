import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/utils/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent{
  @ViewChild('f', { static: false })
  loginForm!: NgForm;
  constructor(private authService: AuthService) {}
  onSubmit() {
    this.authService.signin(this.loginForm.form.value).subscribe(
    );
  }
}
