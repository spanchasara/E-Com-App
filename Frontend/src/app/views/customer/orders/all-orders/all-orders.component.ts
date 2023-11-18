import { Component, OnInit } from '@angular/core';
import { PaginatedOrders } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent  implements OnInit {
  constructor(private ordersService: OrdersService) {}

  orders!: PaginatedOrders;

  ngOnInit() {
    this.getOrders({});
  }

  getOrders(options: any) {
    this.ordersService.getCustomerOrders(false, options).subscribe((orders) => {
      this.orders = orders;
    });
  }

  pageChanged(page: number) {
    this.ordersService.getCustomerOrders(false, { page }).subscribe((orders) => {
      this.orders = orders;
    });
  }
}