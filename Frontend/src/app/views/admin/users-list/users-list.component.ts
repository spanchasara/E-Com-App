import { Component, OnInit } from '@angular/core';

import { PaginatedUsers, User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UserStore } from 'src/app/store/user-store';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  role: string = 'customer';
  currentUserId: string = '';
  users!: PaginatedUsers | null;

  constructor(private userService: UserService, private userStore: UserStore) {}

  ngOnInit() {
    this.userService.getAllUsers(this.role).subscribe();
    this.currentUserId = this.userStore.getValue().user?._id || '';

    this.userStore.users$.subscribe((users) => {
      this.users = users;
    });
  }

  get tableData() {
    return this.users?.docs;
  }

  toggleUserStatus(user: User, isSuspended: boolean = false) {
    this.userService
      .toggleAccountStatus(user._id, isSuspended)
      .subscribe(() => {
        const options = { page: this.users?.page || 1 };
        this.userService.getAllUsers(this.role, options).subscribe();
      });
  }

  toggleState(role: string) {
    this.role = role;
    this.userService.getAllUsers(this.role).subscribe();
  }

  parseDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  pageChange(page: number) {
    const options = { page };
    this.userService.getAllUsers(this.role, options).subscribe();
  }
}
