export interface User {
  _id: string
  mail: string
  password: string
  name: string
  photo?: string
}

export interface Wallet {
  userId: string
  total_money: number
  money_saved: ForeignCurrency[]
  money_per_day: number
  start_selected_day: Date | string
  end_selected_day: Date | string
  movement: Movement[]
  day: Date
  accounts: Account[]
}


export interface Account {
  id?: string;
  type?: 'Cuenta Bancaria' | 'Cuenta App' | 'Tarjeta de Credito' | 'Fondo de Inversion' | 'Dinero en Efectivo' | 'Otro';
  name?: string;
  amount?: number;
  movements?: Movement[];
  close?: string;
  debit?: boolean;
}

export interface Movement {
  id: string
  accountId: Account["id"]
  day: Date
  description: string
  amount: number
  character: 'expense' | 'income'
}

export interface ForeignCurrency {
  name: string
  amount: number
}

export interface DescriptionDay {
  day: Date
  movement_day: Movement[]
  total_amount_day: number
  money_per_day?: number
}

