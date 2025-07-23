import { IAppState, IItem, PaymentMethod } from '../types';
import { IEvents } from './base/events';
import { Model } from './MyModel';

export class AppState extends Model<IAppState> {
	catalog: IItem[] = [];
	private _basket: IItem[] = [];
	private readonly _basketKey = 'online_store_basket';
	private _order: {
		payment: PaymentMethod | null;
		address: string;
		email: string;
		phone: string;
	} = {
		payment: null,
		address: '',
		email: '',
		phone: '',
	};
	
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
			this.events.emit('basket:changed');
		}
	}

	removeFromBasket(id: string) {
		this._basket = this._basket.filter((item) => item.id !== id);
		this._persistBasket();
		this.events.emit('basket:changed');
	}

	clearBasket() {
		this._basket = [];
		this._persistBasket();
		this.events.emit('basket:changed');
	}

	getBasketTotal() {
		return this._basket.reduce((total, item) => total + (item.price || 0), 0);
	}

	getBasketItemIds(): string[] {
		return this._basket.map((item) => item.id);
	}

	setOrderField(field: keyof typeof this._order, value: any) {
		this._order[field] = value;
		if (field === 'payment' || field === 'address') {
            const validation = this.validateOrder();
            this.events.emit('order:validation', validation);
        } else {
            const validation = this.validateContacts();
            this.events.emit('contacts:validation', validation);
        }
	}

	validateOrder() {
		const errors: Partial<Record<keyof typeof this._order, string>> = {};

		if (!this._order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this._order.address.trim()) {
			errors.address = 'Введите адрес';
		}
        return { isValid: Object.keys(errors).length === 0, errors };
	}
	validateContacts() {
		const errors: Partial<Record<keyof typeof this._order, string>> = {};

		if (!this._order.email.trim()) {
			errors.email = 'Введите email';
		} else if (!this._order.email.includes('@')) {
			errors.email = 'Некорректный email';
		}

		if (!this._order.phone.trim()) {
			errors.phone = 'Введите телефон';
		} else if (!/^[\d\+][\d\(\)\ -]{4,14}\d$/.test(this._order.phone)) {
			errors.phone = 'Некорректный телефон';
		}

		return { isValid: Object.keys(errors).length === 0, errors };
	}

	getOrderData() {
		return {
			...this._order,
			items: this.getBasketItemIds(),
			total: this.getBasketTotal(),
		};
	}

	clearOrder() {
		this._order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
		};
	}

	isItemInBasket(id: string): boolean {
		return this._basket.some(item => item.id === id);
	}
}
