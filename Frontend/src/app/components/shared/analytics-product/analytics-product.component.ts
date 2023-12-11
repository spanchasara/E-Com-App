import { Component, Input } from "@angular/core";

@Component({
  selector: "app-analytics-product",
  templateUrl: "./analytics-product.component.html",
  styleUrls: ["./analytics-product.component.css"],
})
export class AnalyticsProductComponent {
  @Input() product: any;
}
