import { IItem } from '../types';
import {
	cloneTemplate,
	createElement,
	ensureElement,
	formatNumber,
} from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { BasketItem } from './BusketItem';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
	buttonDisabled: boolean;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this._button.addEventListener('click', () => {
            events.emit('basket:submit');
            events.emit('order:open');
        });

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
		}
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set buttonDisabled(value: boolean) {
		this._button.disabled = value;
	}

	set total(total: number) {
		this._total.textContent = `${total} синапсов`;
	}
}
