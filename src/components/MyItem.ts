import { IItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

export class Item extends Component<IItem>{
     protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    id: string;

    constructor(container: HTMLElement,  protected events: EventEmitter){
        super(container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = container.querySelector('.card__button');
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('card:select', { id: this.id });
            });
        } else {
            container.addEventListener('click', () => {
                events.emit('card:select', { id: this.id });
            });
        }
    }
    
      set category(value: string) {
        this.setText(this._category, value);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    }

    set buttonText(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        }
    }
    public render(): HTMLElement {
        return this.container;
    }
    }