import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  hideFooter: boolean = false;
  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check the current route to determine whether to hide the footer
        this.hideFooter = this.shouldHideFooter(event.url);
      }
    });
  }
  private shouldHideFooter(url: string) {
    return url.includes('/login') || url.includes('/register');
  }
}
