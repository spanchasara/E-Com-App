import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  @ViewChild('f', { static: false })
  registerForm!: NgForm;

  onSubmit() {
    console.log(this.registerForm);
  }
}
