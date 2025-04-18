import { Component } from '../base/Components';
import { ensureElement } from '../../utils/utils';

interface IResultPrice {
	total: number;
}

interface IResultActions {
	onClick: () => void;
}

export class OrderResult extends Component<IResultPrice> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: IResultActions) {
		super(container);

		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		this.setText(this._description, `Списано ${total} синапсов`);
	}
}
