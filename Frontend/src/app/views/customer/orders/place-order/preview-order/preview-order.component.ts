import { Component, Input } from "@angular/core";
import { Cart } from "src/app/models/cart.model";
import { Coupon } from "src/app/models/coupon.model";

@Component({
  selector: "app-preview-order",
  templateUrl: "./preview-order.component.html",
  styleUrls: ["./preview-order.component.css"],
})
export class PreviewOrderComponent {
  @Input() order!: Cart;
  @Input() coupon!: Coupon | null;

  constructor() {}
}
