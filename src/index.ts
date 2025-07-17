import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { MyApi } from './components/Api';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Page } from './components/MyPage';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { IItem } from './types';
import { Modal } from './components/Modal';
import { CardPreview } from './components/CardPrew';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';
import { Item } from './components/MyItem';
import { BasketItem } from './components/BusketItem';

const events = new EventEmitter();
const api = new MyApi(API_URL);
const page = new Page(document.body, events);
const appData = new AppState({}, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketContainer = cloneTemplate(basketTemplate);
const basket = new Basket(basketContainer, events);
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContainer = cloneTemplate(orderTemplate);
const order = new Order(orderContainer, events);
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const successModal = new Success(cloneTemplate(successTemplate), events);
const cardClone = cloneTemplate<HTMLElement>(cardTemplate);

api
	.getItems()
	.then((data) => {
		appData.setCatalog(data);
	})
	.catch((err) => console.error(err));

events.on('card:select', (item: IItem) => {
	const preview = new CardPreview(
		cloneTemplate(cardPreviewTemplate),
		events,
		() => modal.close()
	);
	preview.data = item;
	modal.open(preview.render());
});

events.on('items:changed', () => {
	const gallery = ensureElement('.gallery');
	gallery.innerHTML = '';

	appData.catalog.forEach((item) => {
		const cardElement = cardClone.cloneNode(true) as HTMLElement;
		const card = new Item(cardElement, events);

		card.id = item.id;
		card.title = item.title;
		card.price = item.price;
		card.image = CDN_URL + item.image;
		card.category = item.category || '';

		gallery.appendChild(card.render());
	});
	events.emit('basket:changed');
});

ensureElement<HTMLButtonElement>('.header__basket').addEventListener(
	'click',
	() => {
		events.emit('basket:open');
	}
);

// Обновление корзины при изменениях
events.on('basket:changed', () => {
	const count = appData.basket.length;
	page.counter = count;
	const basketItems = appData.basket.map((item, index) => {
		const template = ensureElement<HTMLTemplateElement>('#card-basket');
		const itemElement = cloneTemplate(template);
		const basketItem = new BasketItem(itemElement, index, events);
		basketItem.data = item;
		return itemElement;
	});
	basket.items = basketItems;
	basket.total = appData.getBasketTotal();
});

// Открытие корзины
events.on('basket:open', () => {
	basket.render();
	modal.open(basketContainer);
});

events.on('basket:add', (item: IItem) => {
	const catalogItem = appData.catalog.find(
		(catalogItem) => catalogItem.id === item.id
	);
	if (catalogItem) {
		appData.addToBasket(catalogItem);
	} else {
		appData.addToBasket(item);
	}
});

events.on('basket:remove', ({ id }: { id: string }) => {
	appData.removeFromBasket(id);
});

// Обработчик открытия оформления заказа
events.on('order:open', () => {
	modal.open(orderContainer);
});

// Обработчик кнопки "Оформить" в корзине
events.on('basket:submit', () => {
	events.emit('order:open');
});

events.on(
	'order:change',
	({
		field,
		value,
	}: {
		field: 'payment' | 'address' | 'email' | 'phone';
		value: any;
	}) => {
		appData.setOrderField(field, value);
	}
);

events.on('order:submit', () => {
	if (appData.validateOrder()) {
		modal.close();
		modal.open(contactsForm.getContainer());
	}
});

events.on('contacts:submit', () => {
	if (appData.validateContacts()) {
		api
			.createOrder(appData.getOrderData())
			.then(() => {
				successModal.total = appData.getBasketTotal();
				modal.close();
				modal.open(successModal.getContainer());
				appData.clearBasket();
				appData.clearOrder();
				order.clear();
				contactsForm.clear();
			})
			.catch((err) => console.error('Order error:', err));
	}
});

events.on('order:errors', (errors: Record<string, string>) => {
	order.setErrors(errors);
	contactsForm.setErrors(errors);
});

events.on('success:close', () => {
	modal.close();
	appData.clearBasket();
	events.emit('basket:changed');
});

events.on(
	'contacts:change',
	({ field, value }: { field: 'email' | 'phone'; value: string }) => {
		appData.setOrderField(field, value);
	}
);
