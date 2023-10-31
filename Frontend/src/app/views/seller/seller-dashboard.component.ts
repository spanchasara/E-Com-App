import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
})
export class SellerDashboardComponent {
  action: string = 'products';

  toggleAction(action: string) {
    this.action = action;
  }
}
