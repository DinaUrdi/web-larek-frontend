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

api.getItems()
    .then(data => {
        appData.setCatalog(data)
    })
    .catch(err => console.error(err))

events.on('card:select', (item: IItem) => {
    const preview = new CardPreview(cloneTemplate(cardPreviewTemplate));
    preview.data = item;
    preview['_button'].addEventListener('click', () => {
        events.emit('basket:add', item);
        modal.close();
    });
    const rendered = preview.render();
    
    modal.open(rendered);
});

events.on('items:changed', () => {
    const cards = appData.catalog.map(item => {
        const card = cloneTemplate<HTMLElement>(cardTemplate);
        
        ensureElement('.card__title', card).textContent = item.title;
        ensureElement('.card__price', card).textContent = 
            item.price ? `${item.price} синапсов` : 'Бесценно';
        
        const image = ensureElement<HTMLImageElement>('.card__image', card);
        image.src = CDN_URL + item.image;
        image.alt = item.title;

         card.addEventListener('click', () => {
            events.emit('card:select', item);
        });
        
        return card;
    });
    const gallery = ensureElement('.gallery');
    gallery.innerHTML = '';
    gallery.append(...cards);
});

ensureElement<HTMLButtonElement>('.header__basket').addEventListener('click', () => {
    events.emit('basket:open');
});

// Обновление корзины при изменениях
events.on('basket:changed', () => {
    const count = appData.basket.length;
    page.counter = count;
    basket.items = appData.basket;
    basket.total = appData.getBasketTotal();
});

// Открытие корзины
events.on('basket:open', () => {
    basket.render();
    modal.open(basketContainer);
});

events.on('basket:add', (item: IItem) => {
    appData.addToBasket(item);
});

events.on('basket:remove', ({id} : {id: string}) => {
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


// Обработчик перехода от Order к ContactsForm
events.on('order:submit', () => {
    modal.close();
    modal.open(contactsForm.getContainer());
});

// Обработчик успешного оформления
events.on('contacts:submit', () => {
    successModal.total = appData.getBasketTotal();
    modal.close();
    modal.open(successModal.getContainer());
});

events.on('success:close', () => {
    modal.close();
    appData.clearBasket();
    events.emit('basket:changed');
});




