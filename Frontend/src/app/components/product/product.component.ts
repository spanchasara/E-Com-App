import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/utils/product/product.model';
import { ProductService } from 'src/app/utils/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
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
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.productService.getProducts(true, id as string).subscribe((data) => {
        this.product = data;
      });
    });
  }

  objectKeys(obj: any) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
}
