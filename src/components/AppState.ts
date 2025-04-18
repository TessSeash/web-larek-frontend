import { FormErrors, IAppState, IProduct, IOrderForm, IOrder } from '../types';
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
		valid: false,
		errors: [],
	};
	orderForm: IOrderForm = {
		payment: 'cash', // способ оплаты
		address: '', // адрес доставки
		email: '', // элетронная почта
		phone: '', // номер телефона
		valid: false,
		errors: [],
	};
	formsErrors: FormErrors = {};

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
		let allPricesArr = this.cart.map((product) => product.price); // Берем все цены в корзине
		return allPricesArr.reduce((sum, nextPrice) => sum + nextPrice, 0); // складываем все цены
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
		if (!this.orderForm.address && form === 'address') {
			this.formsErrors.address = 'Укажите адрес доставки';
		} else {
			this.formsErrors.address = '';
		}

		if (!this.orderForm.email && form === 'email') {
			this.formsErrors.email = 'Необходимо указать электронную почту';
		} else {
			this.formsErrors.email = '';
		}

		if (!this.orderForm.phone && form === 'phone') {
			this.formsErrors.phone = 'Необходимо указать телефон';
		} else {
			this.formsErrors.phone = '';
		}
		this.emitChanges('formErrors:changed', this.formsErrors);
	}

	getPreviewButton(product: HTMLButtonElement) {
		return product.onclick;
	}

	clearAppData() {
		this.preview = null;
		this.orderForm = {
			payment: 'cash',
			address: '',
			email: '',
			phone: '',
			valid: false,
			errors: [],
		};
		this.order = {
			payment: 'cash',
			items: [],
			total: 0,
			address: '',
			email: '',
			phone: '',
			valid: false,
			errors: [],
		};

		this.cart = [];
		this.emitChanges('counter:changed', this.cart);
		this.emitChanges('cart:changed', this.cart);
	}
}
