import { FormErrors, IAppState, IProduct, IOrderForm, IOrder, errText } from '../types';
import { Model } from './base/Model';

export type CatalogChanged = {
	catalog: IProduct[];
};

export class AppState extends Model<IAppState> {
	catalog: IProduct[] = [];
	cart: IProduct[] = [];
	preview: string | null;
	order: IOrder = {
		payment: 'cash',
		items: [],
		total: 0,
		address: '',
		email: '',
		phone: '',
	};
	formsErrors: FormErrors = {};

	get orderForm(): IOrderForm {
		return {
			payment: this.order.payment,
			address: this.order.address,
			email: this.order.email,
			phone: this.order.phone,
		};
	}

	set orderForm(value: IOrderForm) {
		this.order.payment = value.payment;
		this.order.address = value.address;
		this.order.email = value.email;
		this.order.phone = value.phone;
	}

	setCatalog(products: IProduct[]) {
		this.catalog = products;
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	setPreview(product: IProduct) {
		this.preview = product.id;
		this.emitChanges('preview:changed', product);
	}

	addProductToCart(product: IProduct) {
		this.cart.push(product);
		this.emitChanges('cart:changed', this.cart);
	}

	removeProductFromCart(removedProduct: IProduct) {
		this.cart = this.cart.filter((product) => product.id !== removedProduct.id); // с помощью filter создаем массив продуктов исключая удаляемый продукт
		this.emitChanges('cart:changed', this.cart);
	}

	productInCart(searchProduct: IProduct) {
		return this.cart.some((product) => product.id === searchProduct.id); // Проверить наличие товара
	}

	getOrder() {
		return this.orderForm;
	}

	getProducts() {
		return this.cart.map((product) => product.id);
	}

	getTotal(): number {
		return this.cart.reduce((total, product) => total + (product.price || 0), 0); 
	}
	

	setOrderAddress(value: string) {
		this.orderForm.address = value;
		this.order.address = value;
		this.checkValidity('address');
	}

	setOrderEmail(value: string) {
		this.orderForm.email = value;
		this.order.email = value;
		this.checkValidity('email');
	}

	setOrderPhone(value: string) {
		this.orderForm.phone = value;
		this.order.phone = value;
		this.checkValidity('phone');
	}

	checkValidity(form: string): void {
		const errors: FormErrors = {};
		// Используем константы из errText для ошибок валидации
		if (!this.orderForm.address && form === 'address') { //валидация адресса доставки
			this.formsErrors.address = errText.address;  
			errors.address = errText.address;
		} else {
			this.formsErrors.address = '';
			errors.address = '';
		}
	
		if (!this.orderForm.email && form === 'email') { //валидация почты
			this.formsErrors.email = errText.email;  
			errors.email = errText.email;
		} else {
			this.formsErrors.email = '';
			errors.email = '';
		}
		
		if (!this.orderForm.phone && form === 'phone') { //валидация номера телефона
			this.formsErrors.phone = errText.phone;  
			errors.phone = errText.phone;
		} else {
			this.formsErrors.phone = '';
			errors.phone = '';
		}
	
		this.emitChanges('formErrors:changed', this.formsErrors);
	}

	clearAppData(): void {
		this.preview = null;
		this.orderForm = {
			payment: 'cash',
			address: '',
			email: '',
			phone: '',
		};
		this.order = {
			payment: 'cash',
			items: [],
			total: 0,
			address: '',
			email: '',
			phone: '',
		};

		this.cart = [];
		this.emitChanges('counter:changed', this.cart);
		this.emitChanges('cart:changed', this.cart);
	}
}
