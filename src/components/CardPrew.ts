import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ICardPreviewData, IItem } from '../types';
import { CDN_URL } from '../utils/constants';
import { EventEmitter } from './base/events';

export class CardPreview extends Component<IItem> {
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _item: ICardPreviewData | null = null;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter,
		protected onClose?: () => void
	) {
		super(container);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._title = ensureElement('.card__title', container);
		this._description = ensureElement('.card__text', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._price = ensureElement('.card__price', container);
		this._category = ensureElement('.card__category', container);
		this._button.addEventListener('click', (e) => {
			e.preventDefault();
			if (this._item) {
				if (this._item.isInBasket) {
                    events.emit('basket:remove', { id: this._item.id });
                } else {
                    events.emit('basket:add', this._item);
                }
				if (this.onClose) this.onClose();
			}
		});
	}

	set data(item: ICardPreviewData) {
		this._item = item;
		this.render(item);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
	}

	set image(value: { src: string; alt: string }) {
		this.setImage(this._image, value.src, value.alt);
	}

	set category(value: string) {
		const categoryMap: Record<string, string> = {
        "софт-скил": "soft",
        "хард-скил": "hard",
        "другое": "other",
        "дополнительное": "additional",
        "кнопка": "button"
    };
		const englishCategory = categoryMap[value.toLowerCase()] || "other";
		this.setText(this._category, value);
        this._category.className = 'card__category';
        this.toggleClass(this._category, `card__category_${englishCategory}`, true);
	}
	render(data?: Partial<ICardPreviewData>): HTMLElement {
		if (data) {
			if (data.title) this.title = data.title;
			if (data.description) this.description = data.description;
			if (typeof data.price === 'number') {
				this.price = data.price;
				this.setDisabled(this._button, false);
				if (data.isInBasket) {
                    this.setText(this._button, 'Убрать из корзины');
                } else {
                    this.setText(this._button, 'В корзину');
                }
			} else {
				this.price = data.price;
				this.setDisabled(this._button, true);
			}
			if (data.image)
				this.image = { src: CDN_URL + data.image, alt: data.title };
			if (data.category) this.category = data.category;
		}
		return this.container;
	}
}
