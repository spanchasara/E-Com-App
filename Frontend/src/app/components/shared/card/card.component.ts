import { Component, Input } from '@angular/core';
import { Product } from 'src/app/utils/product/product.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() product : Product = {
    _id:'',
    title:'',
    description:'',
    price: 0,
    stock: 0,
    sellerId: '',
    specifications: {}
    // defaultImage: 'https://picsum.photos/200'
  }
}
