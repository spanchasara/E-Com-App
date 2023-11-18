import { Component, OnInit } from "@angular/core";
import { PaginatedOrders } from "src/app/models/order.model";
import { OrdersService } from "src/app/services/orders.service";

@Component({
  selector: "app-seller-orders",
  templateUrl: "./seller-orders.component.html",
  styleUrls: ["./seller-orders.component.css"],
})
export class SellerOrdersComponent implements OnInit {
  constructor(private ordersService: OrdersService) {}

  isCurrentOrder: boolean = true;

  orders!: PaginatedOrders;

  ngOnInit() {
    this.getOrders({
      isCurrent: this.isCurrentOrder,
    });

    this.ordersService.callGetOrders.subscribe((role) => {
      if (role === "seller") {
        this.getOrders({
          isCurrent: this.isCurrentOrder,
        });
      }
    });
  }

  getOrders(options: any) {
    this.ordersService.getSellerOrders(options).subscribe((orders) => {
      this.orders = orders;
    });
  }

  toggleOrder(order: boolean) {
    this.isCurrentOrder = order;

    this.getOrders({ isCurrent: order });
  }

  pageChanged(page: number) {
    this.getOrders({ page, isCurrent: this.isCurrentOrder });
  }
}
