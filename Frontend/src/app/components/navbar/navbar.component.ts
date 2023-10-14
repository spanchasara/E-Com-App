import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/utils/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.check('userToken');

    this.authService.isAuthenticated.subscribe((loginStatus) => {
      this.isLoggedIn = loginStatus;
    });
  }

  logout() {
    this.authService.logout();
  }
}
