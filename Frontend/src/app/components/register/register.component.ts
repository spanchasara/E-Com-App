import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/utils/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  @ViewChild('f', { static: false })
  registerForm!: NgForm;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.signup(this.registerForm.form.value).subscribe();
  }
}
