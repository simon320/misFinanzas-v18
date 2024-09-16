import { Injectable } from "@angular/core";

import { SignalStore } from "./signal.store";
import { User } from "../common/interfaces/interface";

@Injectable({ providedIn: 'root' })
export class UserStore extends SignalStore<User> {
  constructor() {
    super();
  }
}


// @Injectable({ providedIn: 'root' })
// export class WalletStore extends SignalStore<Wallet> {
//   constructor() {
//     super();
//   }
// }


// @Injectable({ providedIn: 'root' })
// export class DayStore extends SignalStore<Date> {
//   constructor() {
//     super();
//   }
// }
