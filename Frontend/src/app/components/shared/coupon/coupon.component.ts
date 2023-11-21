import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Coupon } from "src/app/models/coupon.model";

@Component({
  selector: "app-coupon",
  templateUrl: "./coupon.component.html",
  styleUrls: ["./coupon.component.css"],
})
export class CouponComponent {
  @Input() coupon!: Coupon;
  @Output() applyDiscount = new EventEmitter<Coupon>();

  applyCoupon(obj: Coupon) {
    this.applyDiscount.emit(obj);
  }
}
