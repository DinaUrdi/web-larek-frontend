import { Component } from "./base/Component";

export class Item extends Component<HTMLElement>{
    protected category: HTMLElement;
    protected title: HTMLElement;
    protected image: HTMLImageElement;
    protected price: HTMLElement;
    protected button?: HTMLButtonElement;

    constructor(container: HTMLElement){
        super(container);
        this.category = container.querySelector('.card__category')!;
        this.title = container.querySelector('.card__title')!;
        this.image = container.querySelector('.card__image')!;
        this.price = container.querySelector('.card__price')!;
        this.button = container.querySelector('.card') as HTMLButtonElement;
    }
    set data(itemData: {
        category: string;
        title: string;
        image: string;
        price: string | number;
    }){
        this.title.textContent = itemData.title;
        this.price.textContent = typeof itemData.price === 'number' 
            ? `${itemData.price} синапсов` 
            : itemData.price;
        this.image.src = itemData.image;
        this.image.alt = itemData.title;
        this.category.className = 'card__category';
        this.category.textContent = itemData.category;
    }
   

}