import { Component } from '../base/Components';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { ICart } from '../../types/index';

export class Cart extends Component<ICart> {
	protected _products: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._products = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._products.replaceChildren(...items);
		} else {
			this._products.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set totalInfinite(state: boolean) {
		if (state) {
			this.setDisabled(this._button, true);
		} else {
			this.setDisabled(this._button, false);
		}
	}

	set total(total: number | 'infinite') {
		this.setText(this._total, `${total} синапсов`);
		if (total === 'infinite') {
			// если в корзине бесценный товар, итоговая сумма бесценна
			this.setText(this._total, `Бесценно`);
		}
	}
}
