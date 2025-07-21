import { Component } from './base/Component';
import { IEvents } from './base/events';
import { IItem } from '../types';
import { ensureElement } from '../utils/utils';

export class BasketItem extends Component<IItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, index: number, events: IEvents) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

		this.setText(this._index, (index + 1).toString());
		this._deleteButton.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			events.emit('basket:remove', { id: this.container.dataset.id });
		});
	}

	set data(item: IItem) {
		this.setText(this._title, item.title);
        this.setText(this._price, item.price ? `${item.price} синапсов` : 'Бесценно');
		this.container.dataset.id = item.id;
	}
}
