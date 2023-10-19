// auth-store.ts
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { PaginatedUsers, User } from '../../utils/user/user.model';

export interface UserState {
  user: User | null;
  users: PaginatedUsers | null;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user' })
export class UserStore extends Store<UserState> {
  users$ = this._select((state: { users: any }) => state.users);
  user$ = this._select((state: { user: any }) => state.user);


  constructor() {
    super({ user: null, users: null });
  }

  updateUserData(userData: any) {
    this.update(userData);
  }

  clearUserData() {
    this.update({ user: null });
  }
}
