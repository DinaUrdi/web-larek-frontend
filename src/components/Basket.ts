import { IItem } from '../types';
import {
	cloneTemplate,
	ensureElement,
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
	protected _itemTemplate: HTMLTemplateElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

		this._button.addEventListener('click', () => {
			events.emit('basket:submit');
			events.emit('order:open');
		});

		this._itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
	}

	set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            // Если корзина пуста, показываем сообщение
            this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
            this.setDisabled(this._button, true);
        }
    }

	set buttonDisabled(value: boolean) {
		this.setDisabled(this._button, value);
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}
