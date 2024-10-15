import { WritableSignal } from "@angular/core";
import { STORAGE } from "../enums/enum";
import moment from "moment";


export const getDateFormatt = (date: string) => {
  let dateFormatt: string[];

  if(date.includes('/'))
    dateFormatt = date.split('/');
  else
    dateFormatt = date.split('-');


  if(dateFormatt[1].length < 2)
    dateFormatt[1] = `0${dateFormatt[1]}`;

    if(dateFormatt[2].length < 2)
    dateFormatt[2] = `0${dateFormatt[2]}`;

  let x = dateFormatt.join('/');

  return x;

}



export const formatDate = (date: Date): string => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const day = newDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export const utilsMonthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];



export const UtilsDaysShort = [ 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do' ];



export const returnsDifferenceInDays = (startDay: string | Date, endDay: string | Date): number => {
  if(startDay === "" || endDay === "")
    return 0;

  const start = moment(startDay, 'YYYY/MM/DD');
  const end = moment(endDay, 'YYYY/MM/DD');
  const result = Math.abs(start.diff(end, 'days')) +1;
  return result;
}



export const effectMoney = (totalAmount: number, amount: WritableSignal<number>, perDay?: boolean): void => {
  let digit = totalAmount.toString().length;
  let increment: number;

  if(digit <= 3) increment = 12;
  else if(digit === 4) increment = 102;
  else if(digit === 5) increment = 1032;
  else if(digit === 6) increment = 5012;
  else increment = 15033;

  let time = setInterval(() => {
    amount.set( amount() + increment);

    if(amount() >=  totalAmount) {
      amount.set(totalAmount);
      clearInterval(time);
    }
  }, 1);
}



export const saveAmountPerDay = (): void => {
  const date = new Date().toLocaleDateString('es-AR');
  localStorage.setItem(STORAGE.AMOUNT_PER_DAY, JSON.stringify({ date }));
}
