import { Component, OnInit } from '@angular/core';

import { PaginatedProducts } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { ProductStore } from 'src/app/store/product.store';

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

  changer(products: PaginatedProducts) {
    this.products= products;
  }

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
