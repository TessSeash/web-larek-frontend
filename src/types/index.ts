export interface IProduct {
    id: string; // уникальный идентификатор товара
	title: string; // название 
    category: string; // категория, тип товара
    image?: string; // картинка опционально
	description?: string; // описание товара опционально
	price: number | null; // цена товара или без неё(бесценно)
}

export interface IAppState {
    catalog:IProduct[]; // Храним товары в ассортименте на странице
    cart: string[]; // Храним ID товаров, добавленных в корзину
    preview: string | null; // ID товара который, просматривают
    order: IOrder; // Текущий заказ
}

export interface IOrderForm {
    payment: string; // способ оплаты
    address: string; // адрес доставки
    email: string; // элетронная почта
    phone: string; // номер телефона
}

export interface IOrder extends IOrderForm {
    items: string[]; // товары в заказе
    total: number; // стоимость заказа
}

export interface IOrderResult { // тип для возврата данных с сервера в случае успешно оформленного заказа
    id: string;
    total: number;
}

export interface ICart {
	products: IProduct[]; // Массив товаров в корзине
	totalPrice: number; // Итоговая цена
 }

export type FormErrors = Partial<Record<keyof IOrder, string>>; // ошибки валидации формы оформления заказа

export type TPayment = 'card' | 'cash'; // способ оплаты

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
