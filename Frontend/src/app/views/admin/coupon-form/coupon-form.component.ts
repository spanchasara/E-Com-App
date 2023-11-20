import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Coupon, CouponBody } from "src/app/models/coupon.model";
import { CouponService } from "src/app/services/coupon.service";

@Component({
  selector: "app-coupon-form",
  templateUrl: "./coupon-form.component.html",
  styleUrls: ["./coupon-form.component.css"],
})
export class CouponFormComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private couponService: CouponService
  ) {}
  coupon!: Coupon | CouponBody;
  editMode = false;
  today = new Date();

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.editMode = params.has("id");

      const id = params.get("id") || "";

      if (this.editMode) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          this.couponService.getSingleCoupon(id).subscribe((data) => {
            this.coupon = data as Coupon;
          });
        } else {
          this.router.navigate(["/not-found"]);
        }
      } else {
        this.coupon = {
          discountPercent: 0,
          validityPeriod: 0,
          userUsageLimit: 0,
          couponUsageLimit: 0,
          expiryDate: new Date(),
          isActive: false,
        };
      }
    });
  }

  onSubmit(form: NgForm) {
    if (this.editMode) {
      this.couponService
        .editCoupon((this.coupon as Coupon)._id, form.value)
        .subscribe();
    } else {
      this.couponService.addCoupon(form.value).subscribe();
    }
  }
}
