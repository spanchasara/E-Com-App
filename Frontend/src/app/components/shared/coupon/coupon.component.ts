import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Coupon, CouponType } from "src/app/models/coupon.model";
import { OrdersService } from "src/app/services/orders.service";
import { SwalService } from "src/app/services/swal.service";
import { UserStore } from "src/app/store/user-store";

@Component({
  selector: "app-coupon",
  templateUrl: "./coupon.component.html",
  styleUrls: ["./coupon.component.css"],
})
export class CouponComponent {
  @Input() coupon!: Coupon;
  @Output() applyDiscount = new EventEmitter<Coupon>();
  userId!: string;
  isCouponUsed: boolean = false;

  constructor(
    private userStore: UserStore,
    private orderService: OrdersService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.userStore.user$.subscribe((user) => {
      if (user) {
        this.userId = user._id;
      }
    });

    this.isCouponUsed = this.coupon.usedBy.includes(this.userId);
  }

  checkisNotActiveCoupon() {
    return new Date(this.coupon.activationDate).getTime() > Date.now();
  }

  applyCoupon() {
    if (this.isCouponUsed) {
      this.swalService.error("Coupon already used !!");
      return;
    }

    if (new Date(this.coupon.activationDate).getTime() > Date.now()) {
      this.swalService.error("Coupon not activated yet !!");
      return;
    }

    if (new Date(this.coupon.expiryDate).getTime() < Date.now()) {
      this.swalService.error("Coupon expired !!");
      return;
    }

    if (this.coupon.type === CouponType.firstOrder) {
      this.orderService.getCustomerOrders(false, {}).subscribe((data) => {
        if (data.totalDocs > 0) {
          this.swalService.error(
            "This coupon is only valid for first order !!"
          );
          return;
        }

        this.swalService.success("Coupon applied successfully !!");
        this.applyDiscount.emit(this.coupon);
      });
    } else {
      this.swalService.success("Coupon applied successfully !!");
      this.applyDiscount.emit(this.coupon);
    }
  }
}
