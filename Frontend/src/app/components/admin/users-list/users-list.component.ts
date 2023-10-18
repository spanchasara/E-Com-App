import { Component } from '@angular/core';
import { UserStore } from 'src/app/store/auth/user-store';
import { User } from 'src/app/utils/user/user.model';
import { UserService } from 'src/app/utils/user/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
})
export class UsersListComponent {
  role: string = 'customer';

  constructor(private userService: UserService, private userStore: UserStore) {}

  ngOnInit() {
    this.userService.getAllUsers(this.role).subscribe();
  }

  get tableData() {
    return this.userStore.getValue().users?.docs;
  }

  toggleUserStatus(user: User, isSuspended: boolean = false) {
    this.userService
      .toggleAccountStatus(user._id, isSuspended)
      .subscribe(() => {
        this.userService.getAllUsers(this.role).subscribe();
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
}
