import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { CartStore } from 'src/app/store/cart.store';
import { UserStore } from 'src/app/store/user-store';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() product: Product = {
    _id: '',
    title: '',
    description: '',
    price: 0,
    stock: 0,
    sellerId: '',
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
    private userStore: UserStore,
    private cartStore: CartStore
  ) {}

  ngOnInit(): void {
    this.cartStore.addedProducts$.subscribe((addedProducts) => {
      this.addedProducts = addedProducts;
    });
  }

  ngAfterViewInit(): void {
    this.isSellerByRole = this.userStore.getValue().user?.role === 'seller';
    this.isAdmin = this.userStore.getValue().user?.role === 'admin';
    this.isCurrentSeller =
      this.product?.sellerId === this.userStore.getValue().user?._id;
    this.isAuthenticated = !!this.userStore.getValue().user;
  }

  deleteProduct() {
    Swal.fire({
      title: 'Warning',
      showCancelButton: true,
      icon: 'warning',
      html: 'Want to Delete Product ?',
      confirmButtonText: 'Yes',
    }).then((result) => {
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
}
