import { WalletStore } from "./wallet.store";
import { STORAGE } from "../common/enums/enum";
import { inject, Injectable } from "@angular/core";
import { returnsDifferenceInDays, saveAmountPerDay } from "../common/utils/utils";

@Injectable({ providedIn: 'root' })
export class DayService {
  readonly walletStore = inject(WalletStore);

  public compareDate(): void {
    const { date } = JSON.parse(localStorage.getItem(STORAGE.AMOUNT_PER_DAY)!)
    const [dayStorage, monthStorage, ageStorage] = date.split('/');
    const dateNow = new Date().toLocaleDateString('es-AR');
    const [dayNow, monthNow, ageNow] = dateNow.split('/');

    if ( (ageNow > ageStorage)
        || (ageNow === ageStorage && monthNow > monthStorage)
        || (ageNow === ageStorage && monthNow === monthStorage && dayNow > dayStorage))
      {
        this.updateAmountPerDay();
      }
  }


  public updateAmountPerDay(): void {
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    const days: number = returnsDifferenceInDays(todayFormatted, this.walletStore.endSelectedDay());

    days && this.walletStore.setMoneyPerDay( this.walletStore.totalMoney() / days );
    saveAmountPerDay();
  }

}
