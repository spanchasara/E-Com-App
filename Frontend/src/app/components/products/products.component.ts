import { Component, OnInit } from '@angular/core';
import { ProductStore } from 'src/app/store/products/product.store';
import { PaginatedProducts } from 'src/app/utils/product/product.model';
import { ProductService } from 'src/app/utils/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products!: PaginatedProducts;
  sortOptions = {
    Default: '',
    'Price Low to High': 'price',
    'Price High to Low': '-price',
    'Name A to Z': 'title',
    'Name Z to A': '-title',
    'Newest Arrivals': '-createdAt',
  };

  constructor(
    private productService: ProductService,
    private productStore: ProductStore
  ) {}

  ngOnInit() {
    const sortOptionKey = this.productStore.getValue().sort;
    const sortOptionValue =
      this.sortOptions[sortOptionKey as keyof typeof this.sortOptions];
    this.getProducts({
      keyword: this.productStore.getValue().search,
      sort: sortOptionValue,
    });
  }

  getProducts(options: any) {
    this.productService.getProducts(false, options).subscribe((data) => {
      this.products = data;
    });
  }

  sortOption(sort: string) {
    this.getProducts({
      sort,
    });
  }

  enteredSearch(keyword: string) {
    this.getProducts({
      keyword,
    });
  }
}
