import { IAppState, IItem } from '../types';
import { IEvents } from './base/events';
import { Model } from './MyModel';

export class AppState extends Model<IAppState> {
	catalog: IItem[] = [];
	private _basket: IItem[] = [];
	private readonly _basketKey = 'online_store_basket';

	constructor(data: Partial<IAppState>, protected events: IEvents) {
		super(data, events);
		this._restoreBasket();
	}

	private _restoreBasket() {
		try {
			const saved = localStorage.getItem(this._basketKey);
			if (saved) {
				this._basket = JSON.parse(saved);
			}
		} catch (err) {
			console.error('Basket restore error:', err);
		}
	}

	private _persistBasket() {
		localStorage.setItem(this._basketKey, JSON.stringify(this._basket));
		this.events.emit('basket:changed');
	}

	setCatalog(items: IItem[]) {
		this.catalog = items;
		this._basket = this._basket.map((basketItem) => {
			const catalogItem = this.catalog.find(
				(item) => item.id === basketItem.id
			);
			return catalogItem ? { ...catalogItem } : basketItem;
		});

		this._persistBasket();
		this.emitChanges('items:changed');
	}

	get basket(): IItem[] {
		return this._basket;
	}

	addToBasket(item: IItem) {
		if (!this._basket.some((i) => i.id === item.id)) {
			this._basket.push(item);
			this._persistBasket();
		}
	}

	removeFromBasket(id: string) {
		this._basket = this._basket.filter((item) => item.id !== id);
		this._persistBasket();
	}

	clearBasket() {
		this._basket = [];
		this._persistBasket();
	}

	getBasketTotal() {
		return this._basket.reduce((total, item) => total + (item.price || 0), 0);
	}

	getBasketItemIds(): string[] {
  		return this._basket.map(item => item.id);
}
}
