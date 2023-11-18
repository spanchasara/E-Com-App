import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/services/auth.service";
import { CartService } from "src/app/services/cart.service";
import { UserStore } from "src/app/store/user-store";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isCustomer: boolean = false;
  totalQty: number = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private userStore: UserStore
  ) {}
  ngOnInit() {
    this.isLoggedIn = localStorage.getItem("userToken") ? true : false;

    this.userStore.user$.subscribe((user) => {
      this.isCustomer = user.role === "customer";
    });

    this.authService.isAuthenticated.subscribe((loginStatus) => {
      this.isLoggedIn = loginStatus;

      this.callCart();
    });

    this.cartService.totalQty.subscribe((totalQty) => {
      this.totalQty = totalQty;
    });

    this.callCart();
  }

  callCart() {
    if (this.isCustomer) {
      if (this.isLoggedIn) {
        this.cartService.getCart().subscribe();
      } else {
        this.cartService.getLocalCart();
      }
    }
  }

  logout() {
    this.totalQty = 0;
    this.authService.logout();
  }
}
