import { Component, OnInit } from '@angular/core';

import { PaginatedProducts } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
})
export class WelcomePageComponent implements OnInit {
  constructor(private productService: ProductService) {}

  products!: PaginatedProducts;

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

  ngOnInit() {
    this.productService
      .getProducts(false, {
        limit: 3,
        sort: '-createdAt',
      })
      .subscribe((data) => {
        this.products = data;
      });
  }
}
