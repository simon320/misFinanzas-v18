import { computed } from '@angular/core';
import { patchState, signalStore, watchState, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';

import { Account, Movement, Wallet } from '../common/interfaces/interface';
import { returnsDifferenceInDays, saveAmountPerDay } from '../common/utils/utils';


const intialState: Wallet = {
      userId: '',
      total_money: 0,
      money_saved: [],
      money_per_day: 0,
      start_selected_day: '',
      end_selected_day: '',
      movement: [],
      day: new Date(),
      accounts: []
    };

export const WalletStore = signalStore(
  { providedIn: 'root'},
  withState(intialState),
  withComputed((state) => ({
    wallet: computed(() => state),
    totalMoney: computed(() => state.total_money()),
    moneySaved: computed(() => state.money_saved()),
    moneyPerDay: computed(() => state.money_per_day()),
    startSelectedDay: computed(() => state.start_selected_day()),
    endSelectedDay: computed(() => state.end_selected_day()),
    movement: computed(() => state.movement()),
    daySelected: computed(() => state.day()),
    movementDayFilter: computed(() => state.movement() &&
        state.movement().filter((movement: Movement) =>
            movement.day.toString().slice(0, 10).split('-').join('/') === state.day()?.toString()
        ).reverse()
    ),
    accounts: computed(() => state.accounts()),
  })),
  withMethods((store) => ({
    setWallet: (wallet: Wallet) => patchState(store, {...wallet}),

    setAccounts: (accounts: Account[]) => patchState(store, { accounts }),

    setUserId: (userId: string) => patchState(store, { userId }),

    setStartDay: (date: Date) => patchState(store, { start_selected_day: date }),

    setEndDay: (date: Date) => patchState(store, { end_selected_day: date }),

    setDaySelect: (date: Date) => patchState(store, { day: date }),

    /**
     * El metodo setea un string vacio en los campos start_selected_day y end_selected_day.
     * @returns void
     */
    resetSelectedDays: () => patchState(store, { start_selected_day: '', end_selected_day: '', money_per_day: 0 }),

    setMoneyPerDay: (amount: number) => patchState(store, { money_per_day: amount }),

    addAccount: (account: Account) => {
      if(account.type !== 'Tarjeta de Credito')
        patchState(store, { accounts: [ ...store.accounts(), account ], total_money: store.totalMoney() + account.amount! })

      else
        patchState(store, { accounts: [ ...store.accounts(), account ] });
    },

    addMovement: (total_money: number, movement: Movement) => patchState(store, { total_money, movement: [ movement, ...store.movement()] }),

    debitCreditCard: (total_money: number, accounts: Account[]) => patchState(store, { total_money, accounts }),

    removeAccount: (accounts: Account[], total_money: number) => patchState(store, { accounts, total_money }),

    removeMovement: (removedMovement: Movement) => {
      const newMovementArray = store.movement().filter(movement =>  movement.id != removedMovement.id)
      const accountsList: Account[] = store.accounts();
      let totalMoney: number = store.totalMoney();

      accountsList.map( account => {
        if(account.id === removedMovement.accountId) {
          let totalAmountAccount = account.amount ? account.amount : 0;

          if(removedMovement.character === 'expense') {
            totalMoney += removedMovement.amount
            totalAmountAccount += removedMovement.amount
          }
          else {
            totalMoney -= removedMovement.amount
            totalAmountAccount -= removedMovement.amount;
          }

          account.amount = totalAmountAccount;
        }
      });
      const today = new Date();
      const todayFormatted = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
      const days: number = returnsDifferenceInDays(todayFormatted, store.endSelectedDay());

      patchState(store, {
        movement: newMovementArray,
        accounts: accountsList,
        total_money: totalMoney,
        money_per_day: ( days ? totalMoney / days : store.moneyPerDay())
      });

      saveAmountPerDay();
    },

  })),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {

        if(localStorage.getItem('tokenMF') && state.userId !== '') {
            const key = 'wallet:' + localStorage.getItem('tokenMF');
            localStorage.setItem(key, JSON.stringify( state ));
          }
      })
    }
  })
)