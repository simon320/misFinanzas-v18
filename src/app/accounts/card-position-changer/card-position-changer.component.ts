import { Router } from "@angular/router";
import { PATH } from "../../common/enums/enum";
import { Component, inject } from "@angular/core";
import { WalletStore } from "../../store/wallet.store";
import { CrossSVG } from "../../common/icons/cross.svg";
import { Account } from "../../common/interfaces/interface";
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { HandleDragSVG } from "../../common/icons/handle-drag.svg";
import { ShowAmountCharactersPipe } from "../../common/pipes/my-short-description.pipe";


@Component({
  selector: 'card-position-changer',
  standalone: true,
  templateUrl: './card-position-changer.component.html',
  styleUrl: './card-position-charger.component.scss',
  imports: [ CrossSVG, DragDropModule, HandleDragSVG, ShowAmountCharactersPipe ],
})
export class CardPositionChangerComponent {
  readonly walletStore = inject(WalletStore);
  private router = inject(Router);

  public closeModal(): void {
    this.router.navigateByUrl(PATH.ACCOUNTS);
  }

  public moveAccounts(dropEvent: CdkDragDrop<Account[]>): void {
    const { previousIndex, currentIndex } = dropEvent;

    if(previousIndex === currentIndex)
      return;

    moveItemInArray(this.walletStore.accounts(), previousIndex, currentIndex)
    this.walletStore.setAccounts(this.walletStore.accounts());
  }
}
