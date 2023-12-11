import { Component, Input } from "@angular/core";

@Component({
  selector: "app-metrics",
  templateUrl: "./metrics.component.html",
  styleUrls: ["./metrics.component.css"],
})
export class MetricsComponent {
  @Input() metricData: any;
}
