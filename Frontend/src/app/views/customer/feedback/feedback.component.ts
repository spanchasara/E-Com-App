import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FeedbackBody } from "src/app/models/feedback.model";
import { Order } from "src/app/models/order.model";
import { FeedbackService } from "src/app/services/feedback.service";
import { OrdersService } from "src/app/services/orders.service";
import { SwalService } from "src/app/services/swal.service";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"],
})
export class FeedbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrdersService,
    private feedbackService: FeedbackService,
    private swalService: SwalService
  ) {}

  orderId = "";
  order: Order | null = null;

  app = {
    orderId: "",
    rating: 3,
    comment: "",
  };

  productFeedback: FeedbackBody[] = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      if (params.has("orderId")) {
        this.orderId = params.get("orderId") as string;

        this.feedbackService.getFeedback(this.orderId).subscribe((data) => {
          if (data) {
            this.swalService.info("Feedback Already Given !!");
            this.router.navigate(["/"]);
          } else {
            this.orderService
              .getCustomerOrders(true, this.orderId)
              .subscribe((data) => {
                if (data) {
                  this.order = data as Order;

                  data.products.forEach((product: any) => {
                    this.productFeedback.push({
                      orderId: this.orderId,
                      productId: product.productId,
                      rating: 3,
                      comment: "",
                    });
                  });

                  this.app.orderId = this.orderId;
                } else {
                  this.router.navigate(["/"]);
                }
              });
          }
        });
      } else {
        this.swalService.error("Invalid Request !!");
        this.router.navigate(["/"]);
      }
    });
  }

  submitFeedback() {
    this.productFeedback.push(this.app);

    this.feedbackService.addFeedback(this.productFeedback).subscribe();
  }

  getTotalAmt() {
    const { totalAmount, coupon } = this.order as Order;

    return coupon
      ? totalAmount * (1 - coupon.discountPercent / 100)
      : totalAmount;
  }

  ratingChange(rating: number, index: number) {
    if (index >= 0) this.productFeedback[index].rating = rating;
    else this.app.rating = rating;
  }
}
