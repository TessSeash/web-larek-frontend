export interface IProduct {
    id: string;
	title: string;
    category: string;
    image?: string;
	description?: string;
	price: number | null;
}

export interface IAppState {
    catalog:IProduct[];
    cart: string[];
    previw: string | null;
    order: IOrder;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: string | number;
}

export interface IOrder extends IOrderForm {
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type TPayment = 'card' | 'cash' | undefined;

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
