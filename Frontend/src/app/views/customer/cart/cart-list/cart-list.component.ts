import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Cart, CartProduct } from "src/app/models/cart.model";
import { AuthService } from "src/app/services/auth.service";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart-list",
  templateUrl: "./cart-list.component.html",
  styleUrls: ["./cart-list.component.css"],
})
export class CartListComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}
  cart!: Cart;
  isAuthenticated: boolean = false;
  selectedProductIds: string[] = [];

  ngOnInit() {
    const isAuthenticated = this.authService.checkUserExists();
    this.isAuthenticated = isAuthenticated;

    if (isAuthenticated) {
      this.getCart();

      this.cartService.callGetCart.subscribe((call) => {
        if (call) {
          this.getCart();
        }
      });
    } else {
      this.cart = this.cartService.getLocalCart();
      this.selectedProductIds = this.cart.products.map(
        (product) => product.productId._id
      );

      this.cartService.callLocalCart.subscribe((call) => {
        if (call) {
          this.cart = this.cartService.getLocalCart();
          this.selectedProductIds = this.cart.products.map(
            (product) => product.productId._id
          );
        }
      });
    }
  }

  getCart() {
    this.cartService.getCart().subscribe((data) => {
      this.cart = data;
      this.selectedProductIds = this.cart.products.map(
        (product) => product.productId._id
      );
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

  buyNow() {
    if (this.selectedProductIds.length === this.cart.products.length) {
      sessionStorage.setItem(
        "currentOrder",
        JSON.stringify({ action: "full", orderPreview: {} })
      );
    } else {
      sessionStorage.setItem(
        "currentOrder",
        JSON.stringify({
          action: "partial",
          orderPreview: { selectedProductIds: this.selectedProductIds },
        })
      );
    }
    this.router.navigate(["/place-order"]);
  }

  updateSelectedProducts(product: CartProduct) {
    const index = this.selectedProductIds.indexOf(
      product?.productId?._id || ""
    );

    if (index === -1) {
      this.cart.totalAmount += product.qty * product.productId.price;
      this.cart.totalQty += product.qty;
      this.selectedProductIds.push(product?.productId?._id || "");
    } else {
      this.cart.totalAmount -= product.qty * product.productId.price;
      this.cart.totalQty -= product.qty;
      this.selectedProductIds.splice(index, 1);
    }
  }
}
