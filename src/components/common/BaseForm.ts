import { IEvents } from '../base/events';
import { Component } from '../base/Components';
import { ensureElement } from '../../utils/utils';
import { IOrderForm } from '../../types';

interface IBaseForm {
	valid: boolean;
	errors: string[];
}

export class BaseForm<T> extends Component<IBaseForm> {
	protected _submitButton: HTMLButtonElement; // кнопка отправки формы
	protected _errors: HTMLElement; // отображение ошибок

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);

		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		// повесили обработчик событий при вводе данных
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		// повесили обработчик событий начала оформления заказа
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}
	// обработчик изменений при вводе данных пользователем
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:changed`, {
			field,
			value,
		});
	}
	// поведение кнопки в зависимости от валидности форм
	set valid(value: boolean) {
		this.setDisabled(this._submitButton, !value);
	}
	// отображение ошибок в формах
	set errors(value: string[]) {
		this.setText(this._errors, value.join('; '));
	}

	render(state: Partial<T> & IBaseForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
