import { Component, OnInit } from '@angular/core';
import { UserStore } from 'src/app/store/auth/user-store';
import { AuthService } from 'src/app/utils/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService) {}
  isAdmin: boolean = false;
  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('userToken') ? true : false;
    this.authService.isAuthenticated.subscribe((loginStatus) => {
      this.isLoggedIn = loginStatus;
    });
      this.isAdmin = !!this.authService.isAdmin();
      console.log(this.authService.isAdmin())
  }

  logout() {
    this.authService.logout();
  }
}
