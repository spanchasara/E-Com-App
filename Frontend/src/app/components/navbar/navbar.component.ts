import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  constructor(private cookieService: CookieService){}
  getLoginStatus() {
    return this.isLoggedIn;
  }
  login() {
    this.isLoggedIn = true;
  }
  logout() {
    this.cookieService.set('userToken', '');
  }
}
