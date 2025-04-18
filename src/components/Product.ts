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
	_button: HTMLButtonElement; // кнопка добавления или удаления в превью

	constructor(container: HTMLElement, actions?: IProductClickEvent) {
		super(container);

		this._id = container.querySelector('.basket__item-index');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._price = container.querySelector('.card__price');
		this._button = container.querySelector('.card__button');

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

	get id(): string {
		return this.container.dataset.id || '';
	}

	get title(): string {
		return this._title.textContent || '';
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set button(value: string) {
		this._button.textContent = value;
	}
}
