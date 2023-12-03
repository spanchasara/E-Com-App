import { Component, OnInit, TemplateRef, inject } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PaginatedCoupons } from "src/app/models/coupon.model";
import { CouponService } from "src/app/services/coupon.service";
import { SwalService } from "src/app/services/swal.service";

@Component({
  selector: "app-coupons-list",
  templateUrl: "./coupons-list.component.html",
  styleUrls: ["./coupons-list.component.css"],
})
export class CouponsListComponent implements OnInit {
  isOwn = true;
  currentUserId: string = "";
  coupons!: PaginatedCoupons | null;

  constructor(
    private couponService: CouponService,
    private swalService: SwalService
  ) {}
  private modalService = inject(NgbModal);
  selectedList: any;
  ngOnInit() {
    this.getData({
      isOwn: this.isOwn,
    });
  }

  open(content: TemplateRef<any>, selectedList: any) {
    if (selectedList.length == 0) {
      return;
    }

    this.selectedList = selectedList;
    this.modalService.open(content, { centered: true });
  }

  getData(options = {}) {
    this.couponService.getAllCoupons(options).subscribe((data) => {
      this.coupons = data;
    });
  }

  get tableData() {
    return this.coupons?.docs;
  }

  toggleCouponStatus(couponId: string, isEnabled: boolean = false) {
    this.couponService.editCoupon(couponId, { isEnabled }).subscribe(() => {
      const options = { page: this.coupons?.page || 1, isOwn: this.isOwn };
      this.getData(options);
    });
  }

  toggleState(isOwn: boolean = true) {
    this.isOwn = isOwn;
    this.getData({
      isOwn: this.isOwn,
    });
  }

  deleteCoupon(couponId: string) {
    this.swalService
      .confirmWarning("Want to Delete Coupon ?")
      .then((result) => {
        if (result.isConfirmed) {
          this.couponService.deleteCoupon(couponId).subscribe(() => {
            const options = {
              page: this.coupons?.page || 1,
              isOwn: this.isOwn,
            };
            this.getData(options);
          });
        }
      });
  }

  pageChange(page: number) {
    const options = { page, isOwn: this.isOwn };
    this.getData(options);
  }
}
