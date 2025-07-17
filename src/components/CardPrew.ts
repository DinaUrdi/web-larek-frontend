import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IItem } from '../types';
import { CDN_URL } from '../utils/constants';
import { EventEmitter } from './base/events';

export class CardPreview extends Component<IItem> {
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _item: IItem;

	constructor(container: HTMLElement, protected events: EventEmitter, protected handleAddToBasket?: (item: IItem) => void) {
		super(container);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._title = ensureElement('.card__title', container);
		this._description = ensureElement('.card__text', container);
		this._button = ensureElement<HTMLButtonElement>('.button', container);
		this._price = ensureElement('.card__price', container);
		this._category = ensureElement('.card__category', container);
		this._button.addEventListener('click', () => {
            if (this._item) {
                this.events.emit('basket:add', this._item);
				 if (this.handleAddToBasket) {
                    this.handleAddToBasket(this._item);
            }}
        });
	}

	set data(item: IItem) {
		this._item = item;
		this.setText(this._title, item.title);
		this.setText(this._description, item.description);
		this.setText(
			this._price,
			item.price ? `${item.price} синапсов` : 'Бесценно'
		);
		this.setImage(this._image, CDN_URL + item.image, item.title);
		this.setText(this._category, item.category);
		this.toggleClass(this._category, `card__category_${item.category}`, true);
	}
	render(): HTMLElement {
		return this.container;
	}
}
