import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {
  public activeLink = signal(0);

  public listOptions = [
    { route: "dashboard/accounts" },
    { route: "dashboard/calendar" },
    { route: "dashboard/add-movement" },
    { route: "dashboard/savings" },
    { route: "dashboard/home" }
  ];

  constructor(private router: Router) {}

  public goTo(index: number) {
    this.activeLink.set(index);
    this.router.navigateByUrl( this.listOptions[index].route );
  }

}
