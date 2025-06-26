interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

interface IItemList {
    total: number;
    items: IItem[];
}

interface IOrder {
    id: string;
    total: number;
}