import { Component, Input, OnInit } from '@angular/core';
import { Cart } from 'src/app/utils/cart/cart.model';
import { CartService } from 'src/app/utils/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  constructor(private cartService: CartService) {}
  cart!: Cart;

  ngOnInit(): void {
    this.getCart();

    this.cartService.callGetCart.subscribe((call) => {
      if (call) this.getCart();
    });
  }

  getCart() {
    this.cartService.getCart().subscribe((data) => {
      this.cart = data;
    });
  }

  updateCart(productId: string, qty: number) {
    this.cartService.updateCart({ productId, qty }).subscribe();
  }

  removeFromCart(productId: string) {
    this.cartService.updateCart({ productId, isAdd: false }).subscribe();
  }
}
