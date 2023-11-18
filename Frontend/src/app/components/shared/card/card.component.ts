import { AfterViewInit, Component, Input, OnInit } from "@angular/core";

import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { ProductService } from "src/app/services/product.service";
import { CartStore } from "src/app/store/cart.store";
import { UserStore } from "src/app/store/user-store";
import { SwalService } from "src/app/services/swal.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() product: Product = {
    _id: "",
    title: "",
    description: "",
    price: 0,
    stock: 0,
    sellerId: "",
    specifications: {},
  };
  isSellerByRole: boolean = false;
  isCurrentSeller: boolean = false;
  isAdmin: boolean = false;
  addedProducts: { [key: string]: boolean } = {};
  isAuthenticated: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private swalService: SwalService,
    private userStore: UserStore,
    private cartStore: CartStore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartStore.addedProducts$.subscribe((addedProducts) => {
      this.addedProducts = addedProducts;
    });
  }

  ngAfterViewInit(): void {
    this.isSellerByRole = this.userStore.getValue().user?.role === "seller";
    this.isAdmin = this.userStore.getValue().user?.role === "admin";
    this.isCurrentSeller =
      this.product?.sellerId === this.userStore.getValue().user?._id;
    this.isAuthenticated = !!this.userStore.getValue().user;
  }

  deleteProduct() {
    this.swalService
      .confirmWarning("Want to Delete Product ?")
      .then((result) => {
        if (result.isConfirmed) {
          this.productService.deleteProduct(this.product._id).subscribe();
        }
      });
  }

  toggleCart(productId: string, isAdd: boolean = true) {
    if (!productId) return;

    if (this.isAuthenticated) {
      this.cartService.updateCart({ productId, isAdd }).subscribe();
    } else {
      this.cartService.updateLocalCart({ productId, isAdd });
    }
  }
  buyNow() {
    const currentOrder = {
      action: "single",
      orderPreview: {
        productId: this.product?._id,
        qty: 1,
      },
    };
    sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
    this.router.navigate(["/place-order"]);
  }
}
