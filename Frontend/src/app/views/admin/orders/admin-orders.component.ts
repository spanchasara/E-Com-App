import { Component, OnInit } from "@angular/core";
import { PaginatedOrders } from "src/app/models/order.model";
import { OrdersService } from "src/app/services/orders.service";

@Component({
  selector: "app-admin-orders",
  templateUrl: "./admin-orders.component.html",
  styleUrls: ["./admin-orders.component.css"],
})
export class AdminOrdersComponent implements OnInit {
  constructor(private ordersService: OrdersService) {}

  orders!: PaginatedOrders;

  ngOnInit() {
    this.getOrders({});
  }

  getOrders(options: any) {
    this.ordersService.getAdminOrders(options).subscribe((orders) => {
      this.orders = orders;
    });
  }

  pageChanged(page: number) {
    this.ordersService.getAdminOrders({ page }).subscribe((orders) => {
      this.orders = orders;
    });
  }
}
