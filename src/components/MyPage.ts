import { Component } from './base/Component';
import { IEvents } from './base/events';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IItem } from '../types';
import { Item } from './MyItem';
import { CDN_URL } from '../utils/constants';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
		this._catalog = ensureElement<HTMLElement>('.gallery', container);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
		this._basket = ensureElement<HTMLElement>('.header__basket', container);
		this._basket.addEventListener('click', () => {
            events.emit('basket:open');
		});
		this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
		
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
	renderCards(items: IItem[], template: HTMLTemplateElement): HTMLElement[] {
        return items.map(item => {
            const card = new Item(cloneTemplate(template), this.events);
            card.id = item.id;
            card.title = item.title;
            card.price = item.price;
            card.image = CDN_URL + item.image;
            card.category = item.category;
            return card.render();
        });
    }
}
