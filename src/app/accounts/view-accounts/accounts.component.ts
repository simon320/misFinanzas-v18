import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2, Signal, computed, inject, signal, viewChild } from '@angular/core';

import { PATH } from '../../common/enums/enum';
import { PlusSVG } from '../../common/icons/plus.svg';
import { WalletStore } from '../../store/wallet.store';
import { OrderSVG } from "../../common/icons/re-order.svg";
import { MyTimePipe } from '../../common/pipes/my-time.pipe';
import { MyDatePipe } from '../../common/pipes/my-date.pipe';
import { MyCurrencyPipe } from '../../common/pipes/my-currency.pipe';
import { Account, Movement } from '../../common/interfaces/interface';
import { CardIconComponent } from '../../common/icons/card.svg';
import { CheckboxComponent } from '../../common/icons/checkbox.svg';
import { TrashCanComponent } from '../../common/icons/trash-can.svg';
import { ToastService } from '../../common/components/toast/toast.service';
import { effectMoney, returnsDifferenceInDays } from '../../common/utils/utils';
import { ShowAmountCharactersPipe } from "../../common/pipes/my-short-description.pipe";
import { CardPositionChangerComponent } from "../card-position-changer/card-position-changer.component";


@Component({
    standalone: true,
    templateUrl: './accounts.component.html',
    styleUrl: './accounts.component.scss',
    imports: [CommonModule, RouterOutlet, MyCurrencyPipe, MyTimePipe, MyDatePipe, CheckboxComponent, CardIconComponent, TrashCanComponent, PlusSVG, ShowAmountCharactersPipe, CardPositionChangerComponent, OrderSVG]
})
export class AccountsComponent implements AfterViewInit {
  readonly walletStore = inject(WalletStore);
  private render = inject(Renderer2);
  private router = inject(Router);
  private toastService = inject(ToastService);
  public slider: Signal<ElementRef | undefined> = viewChild('slider');
  public selectTypeMovement: Signal<ElementRef | undefined>  = viewChild('selectTypeMovement');

  public totalAmount = signal<number>(0);
  public showMovement = signal<Movement[]>([]);
  public selectedAccount = signal<Account>({});
  public visibleModalOrder = signal<boolean>(false);
  public type: 'all' | 'account' = 'all';
  public allMovements = computed( () => this.walletStore.movement().sort() );
  public accounts: Signal<Account[]> = computed( () => this.walletStore.accounts() );
  public checked!: boolean;
  private card!: any;
  private index!: any;

  ngOnInit(): void {
    effectMoney(this.walletStore.totalMoney(), this.totalAmount);
  }

  ngAfterViewInit(): void {
    if(this.accounts())
      this.selectedAccount.set(this.accounts()[0]);
    this.render.setStyle(this.slider()?.nativeElement?.children[0], 'opacity', '1');
    this.render.addClass(this.selectTypeMovement()?.nativeElement?.children[0], 'type__movement__selected');
    this.setTypeMovement('account');
  }

  private setMovementsAccount(): void {
    const movement = this.allMovements()?.filter( movement => movement.accountId === this.selectedAccount().id);
    this.sortByDate(movement);
    this.showMovement.set(movement);
  }

  public accountClickHandle(): void {
    this.card && this.render.removeStyle(this.card, 'opacity');
    this.index = this.slider()?.nativeElement?.children[0]?.parentElement?.scrollLeft! / 349;
    this.selectedAccount.set(this.accounts()[ Math.round(this.index) ]);
    this.card = this.slider()?.nativeElement?.children[ Math.round(this.index) ];
    this.card && this.render.setStyle(this.card, 'opacity', '1');
    this.setTypeMovement();
  }

  public setTypeMovement(type?: 'all' | 'account'): void {
    if(type)
      this.type = type;

    if(this.type === 'all') {
      this.render.addClass(this.selectTypeMovement()?.nativeElement?.children[0], 'type__movement__selected');
      this.render.removeClass(this.selectTypeMovement()?.nativeElement?.children[1], 'type__movement__selected');
      this.sortByDate(this.allMovements());
      this.showMovement.set(this.allMovements());
    } else {
      this.render.addClass(this.selectTypeMovement()?.nativeElement?.children[1], 'type__movement__selected');
      this.render.removeClass(this.selectTypeMovement()?.nativeElement?.children[0], 'type__movement__selected');
      if(this.selectedAccount())
        this.setMovementsAccount();
    }
  }


  private sortByDate(arr: Movement[]): Movement[] {
    return arr.sort((a, b) => {
      const dateA = new Date(a.day);
      const dateB = new Date(b.day);

      return dateA.getTime() - dateB.getTime();
    });
  }


  public clickCheckbox(): void {
    let total = this.totalAmount();
    this.selectedAccount().debit = !this.selectedAccount().debit;

    const newAccountsArray = this.walletStore.accounts();
    if(this.selectedAccount().debit)
      this.walletStore.debitCreditCard(
        (total - Math.abs(this.selectedAccount().amount!)),
        [...newAccountsArray]
      );
    else
      this.walletStore.debitCreditCard(
        (total + Math.abs(this.selectedAccount().amount!)),
        [...newAccountsArray]
      );

    const days: number = returnsDifferenceInDays(this.walletStore.startSelectedDay(), this.walletStore.endSelectedDay());
    days && this.walletStore.setMoneyPerDay(this.walletStore.totalMoney() / days);

    effectMoney(this.walletStore.totalMoney(), this.totalAmount);
  }

  public formattedDate(value: Date): string {
    const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado","Domingo"];
    const date  = new Date(value);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const monthDayNumber = date.getUTCDate();
    let weekDayNumber = date.getDay() === 0 ? 6 : (date.getDay() -1)

    return days[weekDayNumber] + " " + monthDayNumber;
  }

  public addAccount(): void {
    this.router.navigateByUrl( PATH.ADD_ACCOUNT );
  }

  public async removeAccount(): Promise<void> {
    const result = await this.toastService.confirm('¿Estas seguro de querer eliminar esta cuenta?');
    if (!result)
      return;

    const newAccountsArray = this.walletStore.accounts().filter( account => account.id !== this.selectedAccount().id );
    let totalMoney = this.walletStore.totalMoney();

    if( this.selectedAccount().type !== 'Tarjeta de Credito' )
      totalMoney -= this.selectedAccount().amount!;

    this.walletStore.removeAccount( newAccountsArray, totalMoney );
    this.toastService.show('SUCCESS', 'Cuenta eliminada con exito');
  }

  public showModal(): void {
    this.router.navigateByUrl(PATH.ORDER_ACCOUNTS);
  }

}
