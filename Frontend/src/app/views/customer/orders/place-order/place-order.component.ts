import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CreateOrderBody } from "src/app/models/order.model";
import { OrdersService } from "src/app/services/orders.service";

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

  constructor(private ordersService: OrdersService, private router: Router) {}

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
    this.ordersService.createOrder(this.action, {
      addressId: this.addressId,
      ...this.orderPreview,
    }).subscribe((data) => {
      console.log(data);
      this.ordersService.updateOrderStatus(data.orderId, "success").subscribe();
      this.router.navigate(['/orders'])
    });
  }
}
