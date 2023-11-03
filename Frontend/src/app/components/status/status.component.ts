import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OrdersService } from "src/app/services/orders.service";

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.css"],
})
export class StatusComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService
  ) {}

  status!: string;
  orderId!: string;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.status = params["status"];
      this.orderId = params["order_id"];

      if (!this.orderId || !this.status) {
        this.router.navigate(["/"]);
      }

      this.ordersService
        .updateOrderStatus(this.orderId, this.status)
        .subscribe();
    });
  }
}
