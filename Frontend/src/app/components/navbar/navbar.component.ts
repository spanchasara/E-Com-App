import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UserStore } from 'src/app/store/user-store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  loginRole: string | null = null;
  isCustomer: boolean = false;
  constructor(private authService: AuthService,
    private userStore: UserStore) {}
  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('userToken') ? true : false;

    this.userStore.user$.subscribe((user) => {
      this.isCustomer = user.role === 'customer'
    })


    this.authService.isAuthenticated.subscribe((loginStatus) => {
      this.isLoggedIn = loginStatus;
    });
  }

  logout() {
    this.authService.logout();
  }
}
