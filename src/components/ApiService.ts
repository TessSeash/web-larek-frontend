
import { IProduct, IOrderForm, IOrderResult } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IApiService {
	getProducts: () => Promise<IProduct[]>;
	sendProducts: (order: IOrderForm) => Promise<IOrderResult>;
}

export class ApiService extends Api implements IApiService {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	sendProducts(order: IOrderForm): Promise<IOrderResult> {
		return this.post(`/order`, order).then((data: IOrderResult) => data);
	}
}