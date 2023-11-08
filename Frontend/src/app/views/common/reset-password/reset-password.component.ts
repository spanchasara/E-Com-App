import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  resetPasswordLinkSent: boolean = false;
  resetToken: string = "";

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get("token");

      if (params.has("token")) {
        if (token) {
          this.resetPasswordLinkSent = true;
          this.resetToken = token;
        } else return this.router.navigate(["/"]);
      }

      return;
    });
  }

  sendResetPasswordLink(email: string) {
    if (email === "") return;

    this.authService.sendResetPasswordLink(email).subscribe();
  }

  resetPassword(newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) return;

    this.authService.resetPassword(this.resetToken, newPassword).subscribe();
  }
}
