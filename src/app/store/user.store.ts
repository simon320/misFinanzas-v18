import { computed } from '@angular/core';
import { patchState, signalStore, watchState, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';

import { User } from '../common/interfaces/interface';


const intialState: User = {_id: '', name: '', mail: '', password: '', photo: ''};

export const UserStore = signalStore(
  { providedIn: 'root'},
  withState(intialState),
  withComputed((state) => ({
    user: computed(() => state),
    userId: computed(() => state._id()),
  })),
  withMethods((store) => ({
    setUser: (user: User) => patchState(store, {...user}),
    setUserId: (userId: string) => patchState(store, { _id: userId }),
  })),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {
        if(state.mail !== '') {
          const key = 'user:' + state.mail;
          localStorage.setItem( key, JSON.stringify( state ));
        }
      })
    }
  })
)
