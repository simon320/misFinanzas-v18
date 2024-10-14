import { BellSVG } from "../common/icons/bell.svg";
import { UserStore } from '../store/user.store';
import { Component, inject } from '@angular/core';
import { BellPlusSVG } from "../common/icons/bell-plus.svg";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ BellSVG, BellPlusSVG ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly userStore = inject(UserStore);
}
