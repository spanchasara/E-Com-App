import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  product!: Product;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private ngZone: NgZone
  ) {}
  id:string=''

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') || '';
      
      if (!this.id.match(/^[0-9a-fA-F]{24}$/)) {
        this.router.navigate(['/not-found']);
      } else {
        this.productService
          .getProducts(true, this.id as string)
          .subscribe((data) => {
            this.ngZone.run(() => {
              this.product = {
                title: data.title,
                description: data.description,
                stock: data.stock,
                price: data.price,
                specifications: data.specifications,
                sellerId : data.sellerId,
                images: data.images
              };
            });
          });
      }
    });
  }
}
