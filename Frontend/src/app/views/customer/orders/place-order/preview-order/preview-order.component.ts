import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Address } from "src/app/models/address.model";
import { Cart } from "src/app/models/cart.model";

@Component({
  selector: "app-preview-order",
  templateUrl: "./preview-order.component.html",
  styleUrls: ["./preview-order.component.css"],
})
export class PreviewOrderComponent implements OnInit, OnDestroy {
  @Input() order!: Cart;
  @Input() finalOrderPreview: boolean = false;

  currentAddress!: Address;
  address: string = "";
  constructor() {}

  ngOnInit(): void {
    this.currentAddress = JSON.parse(
      sessionStorage.getItem("currentAddress") || ""
    );
  }
  
  ngOnDestroy(): void {
    sessionStorage.clear();
  }
}
