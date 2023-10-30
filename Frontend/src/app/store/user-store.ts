import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

import { PaginatedUsers, User } from '../models/user.model';

export interface UserState {
  user: User | null;
  users: PaginatedUsers | null;
}

const initialState: UserState = {
  user: null,
  users: null,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-management' })
export class UserStore extends Store<UserState> {
  users$ = this._select((state: { users: any }) => state.users);
  user$ = this._select((state: { user: any }) => state.user);

  constructor() {
    super(initialState);
  }

  updateUserData(userData: Partial<UserState>) {
    this.update(userData);
  }

  clearUserData() {
    this.update(initialState);
  }
}
