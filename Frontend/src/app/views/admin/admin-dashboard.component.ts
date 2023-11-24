import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
})
export class AdminDashboardComponent {
  constructor(private route: ActivatedRoute) {}
  action: string = "products";

  ngOnInit() {
    this.action = window.location.href.split("/").slice(-1)[0];
  }

  toggleAction(action: string) {
    this.action = action;
  }
}
