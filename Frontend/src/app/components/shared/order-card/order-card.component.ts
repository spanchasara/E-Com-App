import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Order } from "src/app/models/order.model";
import { OrdersService } from "src/app/services/orders.service";

@Component({
  selector: "app-order-card",
  templateUrl: "./order-card.component.html",
  styleUrls: ["./order-card.component.css"],
})
export class OrderCardComponent {
  @Input() isCurrentOrder: boolean = false;
  @Input() role!: string;
  @Input() order!: Order;

  constructor(private ordersService: OrdersService) {}

  markAsDelivered(orderId: string) {
    this.ordersService.markDelivered(orderId).subscribe();
  }

  getTotalAmt() {
    const { totalAmount, coupon } = this.order;

    if (this.role === "seller") return totalAmount;

    return coupon
      ? totalAmount * (1 - coupon.discountPercent / 100)
      : totalAmount;
  }
}
