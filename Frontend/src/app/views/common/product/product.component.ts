import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { ProductService } from "src/app/services/product.service";
import { CartStore } from "src/app/store/cart.store";
import { UserStore } from "src/app/store/user-store";
import { SwalService } from "src/app/services/swal.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit {
  id: string | null = null;
  product: Product | null = null;
  slides = [
    {
      src: "https://picsum.photos/id/944/900/500",
    },
    {
      src: "https://picsum.photos/id/1011/900/500",
    },
    {
      src: "https://picsum.photos/id/984/900/500",
    },
  ];
  currentUserId: string = "";
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private swalService: SwalService,
    private router: Router,
    private userStore: UserStore,
    private cartService: CartService,
    private cartStore: CartStore
  ) {}

  currentSeller: boolean = false;
  isSellerByRole: boolean = false;
  isAdmin: boolean = false;
  addedProducts: { [key: string]: boolean } = {};

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      this.productService.getProducts(true, id as string).subscribe((data) => {
        this.product = data;
        this.currentUserId = this.userStore.getValue().user?._id || "";
        if (this.currentUserId === this.product?.sellerId) {
          this.currentSeller = true;
        }
        this.isSellerByRole = this.userStore.getValue().user?.role === "seller";
        this.isAdmin = this.userStore.getValue().user?.role === "admin";
      });
    });

    this.cartStore.addedProducts$.subscribe((addedProducts) => {
      this.addedProducts = addedProducts;
    });
  }

  objectKeys(obj: any) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
  editProduct() {
    this.router.navigate(["seller/products/edit", this.product?._id]);
  }
  deleteProduct() {
    this.swalService
      .confirmWarning("Want to Delete Product ?")
      .then((result) => {
        if (result.isConfirmed) {
          this.productService.deleteProduct(this.product?._id).subscribe();
        }
      });
  }

  checkObj(obj: any) {
    return Object.keys(obj).length !== 0;
  }

  toggleCart(productId: string, isAdd: boolean = true) {
    if (!productId) return;
    this.cartService.updateCart({ productId, isAdd }).subscribe();
  }
}
