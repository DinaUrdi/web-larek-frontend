import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected _closeButton: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);

		this._closeButton.addEventListener('click', () => {
			events.emit('success:close');
		});
	}

	set total(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}

	public getContainer(): HTMLElement {
		return this.container;
	}
}
