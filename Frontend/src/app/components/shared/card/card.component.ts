import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { UserStore } from 'src/app/store/auth/user-store';
import { CartStore } from 'src/app/store/cart/cart.store';
import { CartService } from 'src/app/utils/cart/cart.service';
import { Product } from 'src/app/utils/product/product.model';
import { ProductService } from 'src/app/utils/product/product.service';
import Swal from 'sweetalert2';

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
    // defaultImage: 'https://picsum.photos/200'
  };
  isSellerByRole: boolean = false;
  isCurrentSeller: boolean = false;
  addedProducts: { [key: string]: boolean } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private userStore: UserStore,
    private cartStore: CartStore
  ) {}

  ngOnInit(): void {
    this.cartStore.addedProducts$.subscribe((addedProducts) => {
      console.log(addedProducts);
      this.addedProducts = addedProducts;
    });
  }

  ngAfterViewInit(): void {
    this.isSellerByRole = this.userStore.getValue().user?.role === 'seller';
    this.isCurrentSeller =
      this.product?.sellerId === this.userStore.getValue().user?._id;
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
    console.log(productId, isAdd);
    this.cartService.updateCart({ productId, isAdd }).subscribe();
  }
}
