import { Component } from '@angular/core';
import { PaginatedProducts } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent {
  sellerProducts!: PaginatedProducts;
  outOfStock: boolean = false;

  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.getSellerProducts({
      sort: '-createdAt',
    });

    this.productService.callGetProducts.subscribe((data) => {
      if (data) {
        this.getSellerProducts({
          sort: '-createdAt',
        });
      }
    });
  }

  getSellerProducts(options: any) {
    this.productService.getSellerProducts(options).subscribe((data) => {
      this.sellerProducts = data;
    });
  }

  toggleOutOfStock(e: any) {
    this.outOfStock = e.target.checked;

    this.getSellerProducts({
      sort: '-createdAt',
      outOfStock: this.outOfStock,
    });
  }

  pageChanged(page: number) {
    this.getSellerProducts({
      sort: '-createdAt',
      page,
      outOfStock: this.outOfStock,
    });
  }
}
