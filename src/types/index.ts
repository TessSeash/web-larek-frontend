export interface IProduct {
    id: string;
	title: string;
    category: string;
    image?: string;
	description?: string;
	price: number | null;
}

export interface IAppState {
    catalog:IProduct[]; // Храним товары в ассортименте на странице
    cart: string[]; // Храним ID товаров, добавленных в корзину
    preview: string | null; // ID товара который, просматривают
    order: IOrder; // Текущий заказ
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type TPayment = 'card' | 'cash';

export type AppEvents =
  | 'modal:open'
  | 'modal:close'
  | 'product:select'
  | 'product:add'
  | 'product:remove'
  | 'cart:submit'
  | 'orderFormData:valid'
  | 'orderFormData:submit'
  | 'orderFormData:orderCompleted';
