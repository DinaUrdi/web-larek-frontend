import { IItem } from '../types';
import { Api, ApiListResponse } from './base/api';

export class MyApi extends Api {
	async getItems(): Promise<IItem[]> {
		const data = await this.get<ApiListResponse<IItem>>('/product');
		return data.items;
	}

	async createOrder(order: {
		payment: string;
		email: string;
		phone: string;
		address: string;
		items: string[];
		total: number;
	}): Promise<{ id: string }> {
		return await this.post('/order', order);
	}
}
