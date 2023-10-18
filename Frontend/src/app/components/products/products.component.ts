import { Component } from '@angular/core';
import { PaginatedProducts } from 'src/app/utils/product/product.model';
import { ProductService } from 'src/app/utils/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts({});
  }

  getProducts(options: any) {
    this.productService.getProducts(false, options).subscribe((data) => {
      console.log('Products Fetched ', data);
      this.products = data;
    });
  }

  getOptions() {
    return Object.keys(this.sortOptions);
  }

  check(e: Event) {
    this.selectedSortOption = (e.target as HTMLSelectElement).value;

    this.getProducts({
      sort: this.sortOptions[
        this.selectedSortOption as keyof typeof this.sortOptions
      ],
    });
  }

  resetForm() {
    this.getProducts({});
    this.search = '';
    this.selectedSortOption = 'Default';
  }
}
