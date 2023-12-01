import { Component, Input, OnInit } from '@angular/core';
import { ProductImage } from 'src/app/models/product.model';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ["./carousel.component.css"],
})
export class CarouselComponent {
  @Input() slides: ProductImage[] = [];
}
