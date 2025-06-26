interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

interface IItemList {
    items: IItem[];
}

interface IBasketItem {
    id: string;
    name: string;
    price: number | null;
}

interface IBasket {
    items: IBasketItem[];
    totalPrice: number;
    totalItems: number;
}

interface IUserInfo {
    email: string;
    phone: string;
    payment: 'cash' | 'card';
    address: string;
}