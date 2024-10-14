import { inject, Injectable } from '@angular/core';

import { User } from '../../common/interfaces/interface';
import { UserStore } from '../../store/user.store';
import { WalletStore } from '../../store/wallet.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userStore = inject(UserStore);
  private walletStore = inject(WalletStore);

  public login(mail: string, password: string): boolean {
    const userExists = localStorage.getItem('user:' + mail);
    if(userExists) {
      const currentUser: User = JSON.parse(userExists);

      if(currentUser.password === password) {
        localStorage.setItem('tokenMF', mail);
        this.walletStore.setUserId(currentUser.mail!);
        return true;
      }
    }

    return false;
  }

  public register(newUser: User): void {
    this.userStore.setUser(newUser);
  }
}
