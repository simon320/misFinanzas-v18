import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, Renderer2, Signal, signal, viewChild } from '@angular/core';

import { DayService } from '../store/day.service';
import { DayComponent } from "./day/day.component";
import { WalletStore } from '../store/wallet.store';
import { CrossSVG } from '../common/icons/cross.svg';
import { CheckSVG } from '../common/icons/check.svg';
import { RefreshSVG } from "../common/icons/refresh.svg";
import { MyDatePipe } from '../common/pipes/my-date.pipe';
import { ArrowLeftSVG } from "../common/icons/arrow-left.svg";
import { ArrowRightSVG } from "../common/icons/arrow-right.svg";
import { MyCurrencyPipe } from '../common/pipes/my-currency.pipe';
import { ShowAmountCharactersPipe } from "../common/pipes/my-short-description.pipe";
import { UtilsDaysShort, effectMoney, getDateFormatt, returnsDifferenceInDays, saveAmountPerDay, utilsMonthNames } from '../common/utils/utils';

enum TextInstructions {
  step1 = 'Presiona en el calendario el dia de incio',
  step2 = 'Ahora elige hasta cuando debe rendirte este dinero',
  step3 = '¿Quieres confirmar tu eleccion?',
}

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [CommonModule, MyCurrencyPipe, MyDatePipe, CrossSVG, CheckSVG, DayComponent, ArrowLeftSVG, ArrowRightSVG, ShowAmountCharactersPipe, RefreshSVG],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private render = inject(Renderer2);
  readonly walletStore = inject(WalletStore);
  readonly dayService = inject(DayService);

  public day: Signal<ElementRef<HTMLElement> | undefined> = viewChild('day');

  public amount = signal(0);
  public calendarRows: any;
  public selectedDate!: Date;
  public todayFormatted!: string;
  public daysShort = UtilsDaysShort;
  public monthNames = utilsMonthNames;
  public buttonnConfig = true;
  public buttonnAccept = false;
  public textInstructions = signal<string>(TextInstructions.step1);


  ngOnInit(): void {
    this.selectedDate = new Date();
    this.calendar();
    this.getAmountPerDay();
  }


  private getAmountPerDay(): void {
    if(this.walletStore.startSelectedDay() !== "" && this.walletStore.endSelectedDay() !== "") {
      effectMoney(this.walletStore.moneyPerDay(), this.amount, true);
    }
  }

  public refreshAmountPerDay(): void {
    this.dayService.updateAmountPerDay();
  }


  public configAmountPerDay(): void {
    this.buttonnConfig = false;
  }


  public dateClickHandle(date: Date): void {
    if(!this.buttonnConfig)
      this.setStepInstruction(date);

    else
      this.openDaySelect(date);
  }

  private openDaySelect(date: Date): void {
    this.walletStore.setDaySelect(date);
  }

  private setStepInstruction(date: Date): void {
    switch (this.textInstructions()) {
      case TextInstructions.step1:
        this.textInstructions.set(TextInstructions.step2);
        this.walletStore.setStartDay( date );
        break;
      case TextInstructions.step2:
        this.textInstructions.set(TextInstructions.step3);
        this.walletStore.setEndDay( date );
        this.buttonnAccept = true;
        break;
    }
  }


  public confirmConfig(): void {
    this.textInstructions.set(TextInstructions.step1);
    this.buttonnAccept = false;
    this.buttonnConfig = true;
    const days: number = returnsDifferenceInDays(this.walletStore.startSelectedDay(), this.walletStore.endSelectedDay());
    days && this.walletStore.setMoneyPerDay( this.walletStore.totalMoney() / days )
    saveAmountPerDay();
    effectMoney(this.walletStore.moneyPerDay(), this.amount, true);
  }


  public closeConfig(): void {
    this.textInstructions.set(TextInstructions.step1);
    this.render.removeClass(this.day()?.nativeElement, 'in-selected');
    this.buttonnAccept = false;
    this.buttonnConfig = true;
    this.walletStore.resetSelectedDays();
  }


  public getPrevMonth(): void {
    this.selectedDate = (new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() - 1, 1));
    this.calendar();
  }


  public getNextMonth(): void {
    this.selectedDate = (new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 1));
    this.calendar();
  }


  private calendar(): void {
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    const daysInWeek = [1, 2, 3, 4, 5, 6, 0];
    const selectedMonthLastDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0);
    const prevMonthLastDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 0);
    const daysInMonth = selectedMonthLastDate.getDate();
    const firstDayInMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1).getDay();
    const startingPoint = daysInWeek.indexOf(firstDayInMonth) + 1;
    let prevMonthStartingPoint = prevMonthLastDate.getDate() - daysInWeek.indexOf(firstDayInMonth) + 1;
    let currentMonthCounter = 1;
    let nextMonthCounter = 1;
    const rows = 6;
    const cols = 7;
    const calendarRows = [];

    for(let i = 1; i < rows + 1; i++){
        for(let j = 1; j < cols + 1; j++){
            if(!calendarRows[i]){
                calendarRows[i] = [];
            }

            if(i === 1){
                if(j < startingPoint){
                    const date = this.getDate('prevMonthStartingPoint', prevMonthStartingPoint, this.selectedDate);
                    calendarRows[i] = [...calendarRows[i],{
                      date,
                      value: `${prevMonthStartingPoint}`,
                      classes: this.getStylesClass(date, 'in-prev-month')
                    }];
                    prevMonthStartingPoint++;
                } else {
                    const date = this.getDate('currentMonthCounter', currentMonthCounter, this.selectedDate);
                    calendarRows[i] = [...calendarRows[i],{
                        date,
                        value: currentMonthCounter,
                        classes: this.getStylesClass(date, 'in-month')
                    }];
                    currentMonthCounter++;
                }
            } else if(i > 1 && currentMonthCounter < daysInMonth + 1){
                const date = this.getDate('currentMonthCounter', currentMonthCounter, this.selectedDate);
                calendarRows[i] = [...calendarRows[i],{
                    date,
                    value: currentMonthCounter,
                    classes: this.getStylesClass(date, 'in-month')
                  }];
                currentMonthCounter++;
            } else {
              const date = this.getDate('nextMonthCounter', nextMonthCounter, this.selectedDate);
              calendarRows[i] = [...calendarRows[i],{
                date,
                value: nextMonthCounter,
                classes: this.getStylesClass(date, 'in-next-month')
              }];
              nextMonthCounter++;
            }
        }
    }
    this.calendarRows = calendarRows;
    this.todayFormatted = getDateFormatt(todayFormatted);;
  }


  private getDate(configMonth: string, numberMonth: number, selectedDate: Date): string {
    let dateFormatt: string;
    if(configMonth === 'prevMonthStartingPoint') {
      dateFormatt = `${selectedDate.getMonth() === 0 ? selectedDate.getFullYear() - 1 : selectedDate.getFullYear()}/${selectedDate.getMonth() === 0 ? 12 : selectedDate.getMonth()}/${numberMonth}`;
      return getDateFormatt(dateFormatt)
    }

    else if(configMonth === 'currentMonthCounter') {
      dateFormatt = `${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}/${numberMonth}`;
      return getDateFormatt(dateFormatt);
    }

    else {
      dateFormatt = `${this.selectedDate.getMonth() + 2 === 13 ? selectedDate.getFullYear() + 1 : selectedDate.getFullYear()}/${selectedDate.getMonth() + 2 === 13 ? 1 : selectedDate.getMonth() + 2}/${numberMonth}`;
      return getDateFormatt(dateFormatt);
    }
  }


  private getStylesClass(date: string, monthPosition: string): string {
    if(date === this.walletStore.startSelectedDay()) return 'in-start-day'
    if(date === this.walletStore.endSelectedDay()) return 'in-end-day'
    return ((date >= this.walletStore.startSelectedDay()) && (date <= this.walletStore.endSelectedDay())) ? 'in-selected' : monthPosition
  }

  public formattedDate(value: Date): string {
    const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado","Domingo"];
    const date  = new Date(value);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const monthDayNumber = date.getUTCDate();
    let weekDayNumber = date.getDay() === 0 ? 6 : (date.getDay() -1)

    return days[weekDayNumber] + " " + monthDayNumber;
  }

}
