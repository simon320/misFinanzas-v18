import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';

import { WalletStore } from '../../store/wallet.store';
import { CrossSVG } from "../../common/icons/cross.svg";
import { Movement } from '../../common/interfaces/interface';
import { MyDatePipe } from '../../common/pipes/my-date.pipe';
import { MyCurrencyPipe } from '../../common/pipes/my-currency.pipe';
import { ToastService } from '../../common/components/toast/toast.service';
import { ShowAmountCharactersPipe } from "../../common/pipes/my-short-description.pipe";

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [CommonModule, MyCurrencyPipe, MyDatePipe, CrossSVG, ShowAmountCharactersPipe],
  templateUrl: './day.component.html',
  styleUrl: './day.component.scss'
})
export class DayComponent {
  readonly walletStore = inject(WalletStore);
  private toastService = inject(ToastService);
  public showMovement = signal<Movement[]>([]);

  constructor() {
    effect(() => {
      this.walletStore.daySelected()
      this.showMovement.set( this.walletStore.movementDayFilter() );
    }, {allowSignalWrites: true})
  }

  public totalPriceOfMovements = computed(() => {
    let total = 0;
    if (this.walletStore.movementDayFilter()) {
      this.walletStore.movementDayFilter().forEach( movement => {
        if(movement.character === 'expense')
          total -= movement.amount;
        else
          total += movement.amount;
      })
    }
    return total;
  });

  public goToMoreDetails(): void {
    // this.router.navigate([URL.DESCRIPTION_DAY, this.daySelected]);
  }

  public async deleteMovement(index: number): Promise<void> {
    const result = await this.toastService.confirm('¿Estas seguro de querer eliminar este movimiento?');

    if (result)
      this.walletStore.removeMovement( this.walletStore.movementDayFilter()[index] );

    return;
  }

}
