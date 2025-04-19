import { IEvents } from './base/events';
import { ensureElement, ensureAllElements } from '../utils/utils';
import { BaseForm } from './common/BaseForm';
import { IOrderForm } from '../types';

export class OrderForm extends BaseForm<IOrderForm> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentCard = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			this.container
		);

		this._paymentCash = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			this.container
		);

		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name=address]',
			this.container
		);

		this._paymentCard.addEventListener('click', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = 'payment';
			const value = target.name;
			this.onInputChange(field, value);
		});

		this._paymentCash.addEventListener('click', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = 'payment';
			const value = target.name;
			this.onInputChange(field, value);
		});

		this._paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				events.emit('payment:changed', button);
			});
		});
	}

	set payment(name: string) {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this._submitButton, !value);
	}

	clearAddress() {
		this._addressInput.value = '';
	}
}
