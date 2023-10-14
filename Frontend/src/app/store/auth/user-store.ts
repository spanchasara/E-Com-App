// auth-store.ts
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { User } from '../../utils/user/user.model';

export interface UserState {
  user: User | null;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class UserStore extends Store<UserState> {
  constructor() {
    super({ user: null });
  }

  updateUserData(user: User | null = null) {
    this.update({ user });
  }

  clearUserData() {
    this.update({ user: null });
  }
}
