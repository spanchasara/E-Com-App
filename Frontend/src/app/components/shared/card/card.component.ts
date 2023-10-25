import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { UserStore } from 'src/app/store/auth/user-store';
import { Product } from 'src/app/utils/product/product.model';
import { ProductService } from 'src/app/utils/product/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements AfterViewInit {
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

  constructor(
    private productService: ProductService,
    private userStore: UserStore
  ) {}

  ngAfterViewInit(): void {
    this.isSellerByRole = this.userStore.getValue().user?.role === 'seller';
    this.isCurrentSeller =
      this.product?.sellerId === this.userStore.getValue().user?._id;
  }
  deleteProduct() {
    Swal.fire('Warning', 'Want to Delete Product ?', 'warning').then(
      (result) => {
        if (result.isConfirmed) {
          this.productService.deleteProduct(this.product._id).subscribe();
        }
      }
    );
  }
}
