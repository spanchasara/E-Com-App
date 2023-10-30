import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/utils/auth/auth.service';
import { Cart } from 'src/app/utils/cart/cart.model';
import { CartService } from 'src/app/utils/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}
  cart!: Cart;
  isAuthenticated: boolean = false;

  ngOnInit() {
    const { isAuthenticated } = this.authService.checkUserExists();
    this.isAuthenticated = isAuthenticated;

    if (isAuthenticated) {
      this.getCart();

      this.cartService.callGetCart.subscribe((call) => {
        if (call) this.getCart();
      });
    } else {
      this.cart = this.cartService.getLocalCart();
      console.log(this.cart);
      this.cartService.callLocalCart.subscribe((call) => {
        if (call) this.cart = this.cartService.getLocalCart();
      });
    }
  }

  getCart() {
    this.cartService.getCart().subscribe((data) => {
      this.cart = data;
    });
  }

  updateCart(productId: string, qty: number) {
    if (this.isAuthenticated) {
      this.cartService.updateCart({ productId, qty }).subscribe();
    } else {
      this.cartService.updateLocalCart({ productId, qty });
    }
  }

  removeFromCart(productId: string) {
    if (this.isAuthenticated) {
      this.cartService.updateCart({ productId, isAdd: false }).subscribe();
    } else {
      this.cartService.updateLocalCart({ productId, isAdd: false });
    }
  }
}
