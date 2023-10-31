import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css'],
})
export class SellerOrdersComponent {
  order: string = 'current';

  toggleOrder(order: string) {
    this.order = order;
  }
}
