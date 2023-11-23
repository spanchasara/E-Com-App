import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
  product = {
    rating: 3,
    comment: "",
  };
  app = {
    rating: 3,
    comment: "",
  };

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
    this.feedbackService
      .addFeedback({ ...this.product, orderId: this.orderId }, "product")
      .subscribe();
    this.feedbackService
      .addFeedback({ ...this.app, orderId: this.orderId }, "app")
      .subscribe();
  }
}
