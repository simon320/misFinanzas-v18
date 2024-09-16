import { computed, effect, Injectable, Signal, signal } from '@angular/core';

import { User } from '../common/interfaces/interface';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private intialState: User = {name: '', mail: '', password: ''};
  private userSignal = signal<User>(this.intialState);

  constructor() {
    this.update();
  }

  private update(): void {
    effect(()=> {
      const user = this.userSignal;

      if(user().mail !== '') {
        const key = 'user:' + user().mail;
        localStorage.setItem(key, JSON.stringify(this.userSignal()));
        console.log('¡Usuario actulizado!');
      }
    });
  }

  public setSignal(user: User): void{
    this.userSignal.set(user);
  }

  public getSignal(): Signal<User>{
    return computed(() => this.userSignal());
  }

}
