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
  loginRole: string | null = null;
  constructor(private authService: AuthService, private userStore: UserStore) {}
  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('userToken') ? true : false;
    this.authService.isAuthenticated.subscribe((loginStatus) => {
      this.isLoggedIn = loginStatus;

      this.userStore.user$.subscribe((user) => {
        this.loginRole = user.role;
      });
    });
  }

  logout() {
    this.authService.logout();
  }
}
