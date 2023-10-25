import { Component } from '@angular/core';

@Component({
  selector: 'app-not-authorized',
  template: `
  <div style="text-align: center; margin-top: 100px">
    <h1>403 - Forbidden Resource</h1>
    <p>Not Authorized to access the page.</p>
  </div> `,
})
export class NotAuthorizedComponent {

}
