import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { EventEmitter } from './components/base/events';

import { ApiService } from './components/ApiService';
import { AppState, CatalogChanged } from './components/AppState';
import { Page } from './components/Page';
import { Product } from './components/Product';

import { Modal } from './components/common/Modal';
import { Cart } from './components/common/Cart';
import { OrderResult } from './components/common/OrderResult';
import { ContactsForm } from './components/Contacts';

import { IProduct, TPayment, AppEvents } from './types';
import { OrderForm } from './components/Order';

const events = new EventEmitter();
const api = new ApiService(CDN_URL, API_URL);

const productsCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog'); // каталог товаров
const productPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview'); // близкий осмотр товара
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket'); // корзина
const cartProductsTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); // товары в корзине
const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); // форма оформления адресс, способ оплаты
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // форма оформления почта, телефон
const orderResultTemplate = ensureElement<HTMLTemplateElement>('#success'); // Успешный заказ

const appData = new AppState({}, events); //объявление модели данных

const cart = new Cart(cloneTemplate(cartTemplate), events);
const page = new Page(document.body, events); // контейнер для страницы
const modal = new Modal(ensureElement('#modal-container'), events); // контейнер модального окна

const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

const orderFormValid = appData.formsErrors.address;

api
	.getProducts() // Загружаем товары с сервера и добавляем в каталог
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
/*
// отслеживаем все события выводим в консоль
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});
*/

// Изменения каталога продуктов
events.on<CatalogChanged>(AppEvents.CatalogChanged, () => {
	page.catalog = appData.catalog.map((item) => {
		const product = new Product(cloneTemplate(productsCatalogTemplate), {
			onClick: () => events.emit(AppEvents.ProductSelect, item),
		});

		return product.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
	events.emit(AppEvents.CartChanged);
});

events.on(AppEvents.ProductSelect, (product: IProduct) => {
	appData.setPreview(product);
});

events.on(AppEvents.ProductAdd, (product: IProduct) => {
	appData.addProductToCart(product);
	appData.order.items.push(product.id);
	events.emit(AppEvents.CartChanged);
});

events.on(AppEvents.ProductRemove, (product: IProduct) => {
	appData.removeProductFromCart(product);
	appData.order.items = appData.order.items.filter((id) => id !== product.id);
	events.emit(AppEvents.CartChanged);
});

events.on(AppEvents.ModalOpen, () => {
	// блокировка страницы
	page.locked = true;
});

events.on(AppEvents.ModalClose, () => {
	// разблокировка страницы
	page.locked = false;
});

// открытие превью для выбранного товара с добавлением или удалением товара в корзину
events.on(AppEvents.PreviewChanged, (product: IProduct) => {
	const previewProduct = new Product(cloneTemplate(productPreviewTemplate), {
		onClick: () => {
			if (!appData.productInCart(product)) {
				// если товар в корзине
				events.emit(AppEvents.ProductAdd, product);
				previewProduct.button = 'Убрать из корзины';
			} else {
				// если товар не в корзине
				events.emit(AppEvents.ProductRemove, product);
				previewProduct.button = 'В корзину';
			}
		},
	});

	if (appData.productInCart(product)) {
		// изменение кнопки в превью в зависимости от наличия товара в корзине
		previewProduct.button = 'Убрать из корзины';
	} else {
		previewProduct.button = 'В корзину';
	}

	modal.render({
		// подставляем информацию о товаре в превью
		content: previewProduct.render({
			title: product.title,
			description: product.description,
			image: product.image,
			price: product.price,
			category: product.category,
		}),
	});
});

events.on(AppEvents.CartOpen, () => {
	modal.render({
		content: cart.render({}),
	});
});

events.on(AppEvents.CartChanged, () => {
	events.emit(AppEvents.CounterChanged);

	cart.items = appData.cart.map((product) => {
		const cartProduct = new Product(cloneTemplate(cartProductsTemplate), {
			onClick: () => {
				events.emit(AppEvents.ProductRemove, product);
			},
		});
		return cartProduct.render({
			title: product.title,
			price: product.price,
		});
	});

	cart.total = appData.getTotal();
	appData.order.total = appData.getTotal();

	// Обновляем состояние активности кнопки
	cart.selected = appData.cart.map((p) => p.id);
	const hasNullPrice = appData.cart.some((product) => product.price === null); // если товар бесценный

	if (hasNullPrice) {
		cart.totalInfinite = true;
		cart.total = 'infinite';
	}
});

events.on(AppEvents.CounterChanged, () => {
	page.counter = appData.cart.length; // счетчик равен кол-ву товаров в корзине
});

events.on(AppEvents.OrderOpen, () => {
	modal.render({
		content: order.render({
			payment: 'cash',
			address: '',
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
	// если адресс на первой форме не пуст и нет ошибок, кнопка "далее" работает
	const formOrder = !orderFormValid && appData.orderForm.address !== '';
	if (formOrder) {
		order.valid = formOrder;
	}
});

events.on(AppEvents.PaymentChanged, (paymentButton: HTMLButtonElement) => {
	appData.orderForm.payment = paymentButton.name as TPayment;
});

events.on(AppEvents.OrderAddressChanged, (data: { value: string }) => {
	appData.setOrderAddress(data.value);
});

events.on(AppEvents.ContactsEmailChanged, (data: { value: string }) => {
	appData.setOrderEmail(data.value);
});

events.on(AppEvents.ContactsPhoneChanged, (data: { value: string }) => {
	appData.setOrderPhone(data.value);
});

events.on(AppEvents.FormErrorsChanged, () => {
	const errors = appData.formsErrors; // контейнер ошибок валидации
	const form = appData.orderForm; // контейнер значений вводимых в форме оформления

	// проверка на ошибки валидации и наличие значений в инпутах
	order.valid = !errors.address && !!form.address; // кнопка "далее"
	contacts.valid =
		!errors.email && !!form.email && !errors.phone && !!form.phone; // кнопка "оплатить"
});

events.on(AppEvents.OrderSubmit, () => {
	modal.render({
		content: contacts.render({
			payment: appData.orderForm.payment,
			address: appData.orderForm.address,
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
	const err = appData.formsErrors;
	const form = appData.orderForm;
	const contactsValid = (contacts.valid =
		!err.email && form.email != '' && !err.phone && form.phone != '');
	order.valid = contactsValid;
});

events.on(AppEvents.ContactsSubmit, () => {
	api
		.sendProducts(appData.order)
		.then((result) => {
			appData.clearAppData();
			contacts.clearContacts(); // Очистить контакты заказа
			order.clearAddress(); // Очистить адресс заказа

			const orderResult = new OrderResult(cloneTemplate(orderResultTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: orderResult.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});
