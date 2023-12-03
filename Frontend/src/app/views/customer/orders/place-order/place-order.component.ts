import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  inject,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Coupon, PaginatedCoupons } from "src/app/models/coupon.model";
import { CreateOrderBody } from "src/app/models/order.model";
import { CouponService } from "src/app/services/coupon.service";
import { OrdersService } from "src/app/services/orders.service";
import { environment } from "src/environment/environment";

@Component({
  selector: "app-place-order",
  templateUrl: "./place-order.component.html",
  styleUrls: ["./place-order.component.css"],
})
export class PlaceOrderComponent implements OnInit {
  orderPreview!: CreateOrderBody | null;
  action!: string;
  order: any;
  toggleOrderPreview: boolean = false;
  addressId!: string;
  coupon: Coupon | null = null;
  allCoupons!: PaginatedCoupons;

  filters = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Available",
      value: "available",
    },
    {
      label: "Used",
      value: "used",
    },
    {
      label: "Not Active Yet",
      value: "not-active",
    },
  ];

  selectedFilter = this.filters[1];

  constructor(
    private ordersService: OrdersService,
    private couponService: CouponService
  ) {}
  private modalService = inject(NgbModal);

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: "lg", scrollable: true });
  }

  ngOnInit(): void {
    const order = JSON.parse(sessionStorage.getItem("currentOrder") || "");
    this.action = order.action;
    this.orderPreview = order.orderPreview;
    this.addressId = JSON.parse(
      sessionStorage.getItem("currentAddress") || ""
    )._id;

    this.getCoupons({});
  }

  getCoupons(options: any) {
    this.couponService.getAllCustomerCoupons(options).subscribe((data) => {
      this.allCoupons = data;
    });
  }

  showPreviewOrder(data: any) {
    this.toggleOrderPreview = data;
    this.ordersService
      .refineOrder(this.action, this.orderPreview)
      .subscribe((data) => {
        this.order = data;
      });
  }

  applyDiscount(coupon: Coupon) {
    this.modalService.dismissAll();
    this.coupon = coupon;
    this.order.totalAmount -=
      (this.order.totalAmount * coupon.discountPercent) / 100;
  }

  removeCoupon() {
    this.coupon = null;
    this.ordersService
      .refineOrder(this.action, this.orderPreview)
      .subscribe((data) => {
        this.order = data;
      });
  }

  placeOrder() {
    this.addressId =
      this.addressId ||
      JSON.parse(sessionStorage.getItem("currentAddress") || "")._id;

    const body = {
      addressId: this.addressId,
      ...this.orderPreview,
    };

    const coupon = this.coupon ? this.coupon._id : null;

    this.ordersService
      .createOrder(this.action, { ...body, coupon })
      .subscribe((data) => {
        if (!data?.orderId) return;

        this.ordersService
          .makePayment({
            ...this.order,
            orderId: data.orderId,
            couponCode: this.coupon?.couponCode,
          })
          .subscribe(async (res: any) => {
            let stripe = await loadStripe(environment.stripePublicKey);
            stripe?.redirectToCheckout({
              sessionId: res.id,
            });
          });
      });
  }

  pageChanged(page: number) {
    this.getCoupons({ page });
  }

  filterChanged(event: any) {
    const { value } = event.target;
    this.selectedFilter = this.filters.find((f) => f.value === value)!;

    this.getCoupons({ keyword: value });
  }
}
