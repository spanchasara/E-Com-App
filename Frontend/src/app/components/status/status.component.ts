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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const status = params["status"];
      const orderId = params["order_id"];

      if (!orderId || !status) {
        return this.router.navigate(["/"]);
      }

      return this.ordersService
        .updateOrderStatus(orderId, status)
        .subscribe((data) => {
          this.status = status;
        });
    });
  }
}
