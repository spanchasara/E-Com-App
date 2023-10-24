import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductStore } from 'src/app/store/products/product.store';
import { PaginatedProducts, Product } from 'src/app/utils/product/product.model';
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
  selectedSortOption: string = 'Default';
  search: string = '';

  constructor(
    private productService: ProductService,
    private productStore: ProductStore,
    private router: Router
  ) {}

  ngOnInit() {
    this.productStore.products$.subscribe((data) => {
      this.products = data;
    });

    if (!this.products || this.products.totalDocs === 0) {
      this.getProducts({});
    }
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
