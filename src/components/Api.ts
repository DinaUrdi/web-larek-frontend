import { IItem } from '../types';
import { Api, ApiListResponse } from './base/api';

export class MyApi extends Api {
	async getItems(): Promise<IItem[]> {
		const data = await this.get<ApiListResponse<IItem>>('/product');
		return data.items;
	}
}