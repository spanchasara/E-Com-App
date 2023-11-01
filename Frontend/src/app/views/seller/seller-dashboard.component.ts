import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-seller-dashboard",
  templateUrl: "./seller-dashboard.component.html",
})
export class SellerDashboardComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  action: string = "products";

  ngOnInit() {
    this.route.children[0].url.subscribe((url) => {
      this.action = url[0].path;
    });
  }

  toggleAction(action: string) {
    this.action = action;
  }
}
