import {
  SocialUser,
} from "@abacritt/angularx-social-login";
import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  @ViewChild("f", { static: false })
  loginForm!: NgForm;

  user!: SocialUser;
  constructor(
    private authService: AuthService,
  ) {}
  onSubmit() {
    this.authService.signin(this.loginForm.form.value).subscribe();
  }

  ngOnInit(): void {
    this.authService.googleLogin();
  }
}
