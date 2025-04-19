import { IProduct, categoryClasses, Category } from '../types';
import { Component } from './base/Components';
import { ensureElement } from '../utils/utils';

interface IProductClickEvent {
	onClick: (event: MouseEvent) => void;
}

export class Product extends Component<IProduct> {
	_id: HTMLElement; // уникальный идентификатор товара
	_title: HTMLElement; // название
	_category: HTMLElement; // категория, тип товара
	_image?: HTMLImageElement; // картинка опционально
	_description?: HTMLElement; // описание товара опционально
	_price: HTMLElement; // цена товара
	_button: HTMLButtonElement; // кнопка для добавления карточки в превью
	_index: HTMLElement; //номер товара в корзине

	constructor(container: HTMLElement, actions?: IProductClickEvent) {
		super(container);

		this._id = container.querySelector('.basket__item-index');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._price = container.querySelector('.card__price');
		this._button = container.querySelector('.card__button');
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				this.container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		// Удалить старый класcc категории, чтобы не было наложения стилей
		this._category.classList.forEach((categoryClass) => {
			if (categoryClass.startsWith('card__category_')) {
				this._category.classList.remove(categoryClass);
			}
		});

		// Приводим строку категории к enum, приводя регистр маленьких букв
		const categoryEnum = Object.values(Category).find(
			(category) => category.toLowerCase() === value.toLowerCase()
		);
		// Если категория в enum, то добавлю класс
		if (categoryEnum) {
			const categoryClass = categoryClasses[categoryEnum];
			this._category.classList.add(`card__category_${categoryClass}`);
		} 
		// Если нет нужного варианта то будем передавать значение и свойства категории other, она будет по-умолчанию
		else {
			const categoryClass = 'other';
			this._category.classList.add(`card__category_${categoryClass}`);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}

	set description(value: string) {
		if (Array.isArray(value)) {
			// Если пришёл массив, то создаём копию элемента для каждой строки и вставляем их вместо описания
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			// если обычная строка
			this.setText(this._description, value);
		}
	}

	set price(value: string) {
		this.setText(this._price, value ? `${value} синапсов` : `Бесценно`);
	}

	// использую метод setText вместо прямой установки textContent
	set button(value: string) {
		this.setText(this._button, value);
	}

	set index(value: number) {
		this.setText(this._index, value)
	}
}
