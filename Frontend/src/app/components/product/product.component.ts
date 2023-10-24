import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStore } from 'src/app/store/auth/user-store';
import { ProductStore } from 'src/app/store/products/product.store';
import { Product } from 'src/app/utils/product/product.model';
import { ProductService } from 'src/app/utils/product/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  id: string | null = null;
  product: Product | null = null;
  slides = [
    {
      src: 'https://picsum.photos/id/944/900/500',
    },
    {
      src: 'https://picsum.photos/id/1011/900/500',
    },
    {
      src: 'https://picsum.photos/id/984/900/500',
    },
  ];
  currentUserId: string = '';
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private userStore: UserStore,
    private productStore: ProductStore
  ) {}
  currentSeller: boolean = false;
  isSellerByRole: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.productService.getProducts(true, id as string).subscribe((data) => {
        this.product = data;
        this.currentUserId = this.userStore.getValue().user?._id || '';
        if (this.currentUserId === this.product?.sellerId) {
          this.currentSeller = true;
        }
      });
      this.isSellerByRole = this.userStore.getValue().user?.role === 'seller';
    });
  }
  ngAfterViewInit(): void {}

  objectKeys(obj: any) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
  editProduct() {
    this.router.navigate(['/editProduct', this.product?._id])
  }
  deleteProduct() {
    Swal.fire('Warning', 'Want to Delete Product!!', 'warning').then(
      (result) => {
        if (result.isConfirmed) {
          // console.log(this.product._id);
          this.productService.deleteProduct(this.product?._id).subscribe();
        }
      }
    );
  }
  clearStore() {
    this.productStore.reset();
  }
}
