import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2, Signal, ViewChild, computed, inject, signal } from '@angular/core';

import { PATH } from '../../common/enums/enum';
import { MyTimePipe } from '../../common/pipes/my-time.pipe';
import { MyDatePipe } from '../../common/pipes/my-date.pipe';
import { WalletStore } from '../../store/wallet-store.service';
import { PlusComponent } from '../../common/icons/plus.component';
import { MyCurrencyPipe } from '../../common/pipes/my-currency.pipe';
import { Account, Movement } from '../../common/interfaces/interface';
import { CardIconComponent } from '../../common/icons/card.component';
import { CheckboxComponent } from '../../common/icons/checkbox.component';
import { TrashCanComponent } from '../../common/icons/trash-can.component';
import { ToastService } from '../../common/components/toast/toast.service';


@Component({
    standalone: true,
    templateUrl: './accounts.component.html',
    styleUrl: './accounts.component.scss',
    imports: [CommonModule, MyCurrencyPipe, MyTimePipe, MyDatePipe, CheckboxComponent, CardIconComponent, TrashCanComponent, PlusComponent]
})
export class AccountsComponent implements AfterViewInit {
  private walletStore = inject(WalletStore);
  private render = inject(Renderer2);
  private router = inject(Router);
  private toastService = inject(ToastService);

  @ViewChild('slider') public slider?: ElementRef<HTMLElement>;
  @ViewChild('selectTypeMovement') public selectTypeMovement?: ElementRef<HTMLElement>;

  readonly wallet = this.walletStore.getSignal();
  public totalAmount: Signal<number> = computed( () => this.wallet().total_money );
  public showMovement = signal<Movement[]>([]);
  public selectedAccount = signal<Account>({});
  public type: 'all' | 'account' = 'all';
  public allMovements: Movement[] = [];
  public accounts: Signal<Account[]> = computed( () => this.wallet().accounts );
  public checked: boolean = false;
  private card!: any;
  private index!: any;


  ngAfterViewInit(): void {
    if(this.accounts()) this.selectedAccount.set(this.accounts()[0]);
    this.render.setStyle(this.slider?.nativeElement?.children[0], 'opacity', '1');
    this.render.addClass(this.selectTypeMovement?.nativeElement?.children[0], 'type__movement__selected');
    this.setAllMovements();
    this.setTypeMovement('account');
  }

  private setAllMovements(): void {
    this.accounts()?.forEach( account => {
      this.allMovements = [...this.allMovements, ...account?.movements!]
    });

    this.allMovements.sort();
    this.wallet().movement = this.allMovements;
  }

  public accountClickHandle(): void {
    this.card && this.render.removeStyle(this.card, 'opacity');
    this.index = this.slider?.nativeElement?.children[0]?.parentElement?.scrollLeft! / 349;
    this.selectedAccount.set(this.accounts()[ Math.round(this.index) ]);
    this.card = this.slider?.nativeElement?.children[ Math.round(this.index) ];
    this.card && this.render.setStyle(this.card, 'opacity', '1');
    this.setTypeMovement();
  }

  public setTypeMovement(type?: 'all' | 'account'): void {
    if(type) this.type = type;

    if(this.type === 'all') {
      this.render.addClass(this.selectTypeMovement?.nativeElement?.children[0], 'type__movement__selected');
      this.render.removeClass(this.selectTypeMovement?.nativeElement?.children[1], 'type__movement__selected');
      this.showMovement.set(this.allMovements);
    } else {
      this.render.addClass(this.selectTypeMovement?.nativeElement?.children[1], 'type__movement__selected');
      this.render.removeClass(this.selectTypeMovement?.nativeElement?.children[0], 'type__movement__selected');
      if(this.selectedAccount()) this.showMovement.set(this.selectedAccount().movements!);
    }
  }

  public clickCheckbox(): void {
    let total = this.totalAmount();
    this.checked = !this.checked;
    if(this.checked)
      this.walletStore.setPartialState({ total_money: (total - Math.abs(this.selectedAccount().amount!)) });
    else
      this.walletStore.setPartialState({ total_money: (total + Math.abs(this.selectedAccount().amount!)) });
  }

  public formattedDate(value: Date): string {
    const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado","Domingo"];
    const date  = new Date(value);
    const monthDayNumber = date.getUTCDate();
    let weekDayNumber = date.getDay() === 0 ? 6 : (date.getDay() -1)

    return days[weekDayNumber] + " " + monthDayNumber;
  }

  public addAccount(): void {
    this.router.navigateByUrl( PATH.ADD_ACCOUNT );
  }

  public removeAccount(): void {
    if(!confirm('¿Realmente deseas eliminar la cuenta?'))
      return

    const newAccountsArray = this.wallet().accounts.filter( account => account.id !== this.selectedAccount().id );
    let totalMoney = this.wallet().total_money;

    if( this.selectedAccount().type !== 'Tarjeta de Credito' )
      totalMoney -= this.selectedAccount().amount!;

    this.walletStore.setPartialState({ accounts: newAccountsArray, total_money: totalMoney });
    this.toastService.show('SUCCESS', 'Perfecto', 'Cuenta eliminada con exito');
  }

}
