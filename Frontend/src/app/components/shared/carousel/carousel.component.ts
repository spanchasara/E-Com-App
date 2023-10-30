import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
})
export class CarouselComponent {
  @Input() slides: any[] = [];
}
