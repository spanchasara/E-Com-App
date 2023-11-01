import { Component, Input } from "@angular/core";
import { Order } from "src/app/models/order.model";

@Component({
  selector: "app-order-card",
  templateUrl: "./order-card.component.html",
  styleUrls: ["./order-card.component.css"],
})
export class OrderCardComponent {
  @Input() isCurrentOrder: boolean = false;

  @Input() order!: Order;

  constructor() {}
}
