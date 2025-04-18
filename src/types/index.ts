export interface IProduct {
	id: string; // уникальный идентификатор товара
	title: string; // название
	category: string; // категория, тип товара
	image?: string; // картинка опционально
	description?: string; // описание товара опционально
	price: number | null; // цена товара или без неё(бесценно)
	button?: HTMLElement;
}

export interface IAppState {
	catalog: IProduct[]; // Храним товары в ассортименте на странице
	cart: string[]; // Храним ID товаров, добавленных в корзину
	preview: string | null; // ID товара который, просматривают
	order: IOrder; // Текущий заказ
}

export interface IOrderForm {
	payment: 'cash' | 'card'; // способ оплаты
	address: string; // адрес доставки
	email: string; // элетронная почта
	phone: string; // номер телефона
	valid: boolean;
	errors: string[];
}

export interface IOrder extends IOrderForm {
	items: string[]; // товары в заказе
	total: number; // стоимость заказа
}

export interface IOrderResult {
	// тип для возврата данных с сервера в случае успешно оформленного заказа
	id: string;
	total: number;
}

export interface ICart {
	products: HTMLElement[]; // Массив товаров в корзине
	totalPrice: number; // Итоговая цена
	selected: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>; // ошибки валидации формы оформления заказа

export type TPayment = 'card' | 'cash'; // способ оплаты

export enum AppEvents { //все события
    CatalogChanged = 'catalog:changed',
    ProductSelect = 'product:select',
    ProductAdd = 'product:add',
    ProductRemove = 'product:remove',
    ModalOpen = 'modal:open',
    ModalClose = 'modal:close',
    PreviewChanged = 'preview:changed',
    CartOpen = 'cart:open',
    CartChanged = 'cart:changed',
    CounterChanged = 'counter:changed',
    OrderOpen = 'order:open',
    PaymentChanged = 'payment:changed',
    OrderAddressChanged = 'order.address:changed',
    ContactsEmailChanged = 'contacts.email:changed',
    ContactsPhoneChanged = 'contacts.phone:changed',
    FormErrorsChanged = 'formErrors:changed',
    OrderSubmit = 'order:submit',
    ContactsSubmit = 'contacts:submit',
  }

export enum Category { // категория товаров
	SoftSkill = 'софт-скил',
	HardSkill = 'хард-скил',
	Additional = 'дополнительное',
	Other = 'другое',
	Button = 'кнопка',
}

export const categoryClasses: Record<Category, string> = {
	[Category.SoftSkill]: 'soft',
	[Category.HardSkill]: 'hard',
	[Category.Additional]: 'additional',
	[Category.Other]: 'other',
	[Category.Button]: 'button',
};
