import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Product, ProductImage } from "src/app/models/product.model";
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
export class ProductComponent implements OnInit, AfterViewInit {
  id: string | null = null;
  product: Product | null = null;
  slides: ProductImage[] = [
    {
      url: "assets/laptop.jpg",
      publicId: "assets/laptop.jpg",
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
  isAuthenticated: boolean = false;

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
        this.isAuthenticated = !!this.userStore.getValue().user;
      });
    });

    this.cartStore.addedProducts$.subscribe((addedProducts) => {
      this.addedProducts = addedProducts;
    });
  }

  ngAfterViewInit(): void {
    this.isAuthenticated = !!this.userStore.getValue().user;
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
