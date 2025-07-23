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
import { BasketItem } from './components/BusketItem';
import { Item } from './components/MyItem';

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
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

api
	.getItems()
	.then((data) => {
		appData.setCatalog(data);
	})
	.catch((err) => console.error(err));

events.on('card:select', (event: { id: string }) => {
    const item = appData.catalog.find(item => item.id === event.id);
    if (item) {
        const preview = new CardPreview(
            cloneTemplate(cardPreviewTemplate),
            events,
            () => modal.close()
        );

		const isInBasket = appData.isItemInBasket(item.id);

        preview.data = {...item, isInBasket };
        modal.open(preview.render());
    }
});

events.on('items:changed', () => {
	const cards = appData.catalog.map(item => {
        const card = new Item(cloneTemplate(cardTemplate), events);
        card.id = item.id;
        card.title = item.title;
        card.price = item.price;
        card.image = CDN_URL + item.image;
        card.category = item.category;
        return card.render();
    });
	page.catalog = cards;
	events.emit('basket:changed');
});

events.on('basket:changed', () => {
	const count = appData.basket.length;
	page.counter = count;
	basket.items = appData.basket.map((item, index) => {
        const basketItem = new BasketItem(
            cloneTemplate(basketItemTemplate),
            index,
            events
        );
        basketItem.data = item;
        return basketItem.render();
    });
	basket.total = appData.getBasketTotal();
});

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

events.on('order:open', () => {
	const validation = appData.validateOrder();
    order.setErrors(validation.errors);
    order.setDisabled(order['_submitButton'], !validation.isValid);
	modal.open(orderContainer);
});

events.on(
    'order:change',
    ({ field, value }: { field: 'payment' | 'address'; value: string }) => {
        appData.setOrderField(field, value);
        const validation = appData.validateOrder();
        order.setErrors(validation.errors);
        order.setDisabled(order['_submitButton'], !validation.isValid);
    }
);

events.on('order:submit', () => {
        modal.close();
        modal.open(contactsForm.getContainer());
	}
);

events.on('contacts:submit', () => {
        api.createOrder(appData.getOrderData())
            .then((result) => {
                successModal.total = result.total;
                modal.close();
                modal.open(successModal.getContainer());
                appData.clearBasket();
                appData.clearOrder();
				order.clear();
                contactsForm.clear();
            })
            .catch((err) => console.error('Order error:', err));
    }
);

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

	const validation = appData.validateContacts();
        contactsForm.setErrors(validation.errors);
        contactsForm.setDisabled(contactsForm['_submitButton'], !validation.isValid);
    });
