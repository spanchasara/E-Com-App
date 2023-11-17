import { Component, Input } from "@angular/core";
import { Cart } from "src/app/models/cart.model";

@Component({
  selector: "app-preview-order",
  templateUrl: "./preview-order.component.html",
  styleUrls: ["./preview-order.component.css"],
})
export class PreviewOrderComponent {
  @Input() order!: Cart;

  constructor() {}
}
