import { AfterViewInit, Component, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { Address } from "src/app/models/address.model";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.css"],
})
export class AddressComponent {
  currentAddress: Address | null = null;
  toggleAddressForm: boolean = false;
  @Output() showPreviewOrder: Subject<any> = new Subject<any>();

  loadCurrentAddress(data: any) {
    this.currentAddress = data;
    if (
      sessionStorage.getItem("currentAddressId") &&
      sessionStorage.getItem("currentAddressId") === ""
    )
      sessionStorage.setItem(
        "currentAddressId",
        this.currentAddress?._id || ""
      );
    else
      sessionStorage.setItem(
        "currentAddressId",
        this.currentAddress?._id || ""
      );
  }
  toggleAddress() {
    this.toggleAddressForm = true;
    this.showPreviewOrder.next(false);
  }
  closeAddressForm(data: any) {
    this.toggleAddressForm = false;
    this.showPreviewOrder.next(true);
  }
}
