import { Component, OnInit } from "@angular/core";
import { loadStripe } from "@stripe/stripe-js";
import { CreateOrderBody } from "src/app/models/order.model";
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

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    const order = JSON.parse(sessionStorage.getItem("currentOrder") || "");
    this.action = order.action;
    this.orderPreview = order.orderPreview;
    this.addressId = JSON.parse(
      sessionStorage.getItem("currentAddress") || ""
    )._id;
  }

  showPreviewOrder(data: any) {
    this.toggleOrderPreview = data;
    this.ordersService
      .refineOrder(this.action, this.orderPreview)
      .subscribe((data) => {
        this.order = data;
      });
  }

  placeOrder() {
    this.ordersService
      .createOrder(this.action, {
        addressId: "",
        ...this.orderPreview,
      })
      .subscribe((data) => {
        if (!data?.orderId) return;

        this.ordersService
          .makePayment({ ...this.order, orderId: data.orderId })
          .subscribe(async (res: any) => {
            let stripe = await loadStripe(environment.stripePublicKey);
            stripe?.redirectToCheckout({
              sessionId: res.id,
            });
          });
      });
  }
}
