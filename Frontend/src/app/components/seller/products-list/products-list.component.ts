import { Component } from '@angular/core';
import { PaginatedProducts } from 'src/app/utils/product/product.model';
import { ProductService } from 'src/app/utils/product/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent {
  sellerProducts!: PaginatedProducts;
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
    const outOfStock = e.target.checked;

    this.getSellerProducts({
      sort: '-createdAt',
      outOfStock,
    });
  }
}
