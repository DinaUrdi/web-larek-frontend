export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IItemList {
    items: IItem[];
}

export interface IBasketItem {
    id: string;
    name: string;
    price: number | null;
}

export interface IBasket {
    items: IBasketItem[];
    totalPrice: number;
    totalItems: number;
}

export interface IUserInfo {
    email: string;
    phone: string;
    payment: 'cash' | 'card';
    address: string;
}

export interface IAppState {
    catalog: IItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[]
}

export type PaymentMethod = 'card' | 'cash';

export type Category = 'soft' | 'hard' | 'other' | 'additional' | 'button';

export interface ICardPreviewData extends IItem {
    isInBasket?: boolean;
}