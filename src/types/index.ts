interface IProduct {
    id: string;
	title: string;
    category: string;
    image?: string;
	description?: string;
	price: number | null;
}

interface IAppState {
    catalog:IProduct[];
    cart: string[];
    previw: string | null;
    order: IOrder;
}

interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: string | number;
}

interface IOrder extends IOrderForm {
    items: string[];
}

interface IOrderResult {
    id: string;
    total: number;
}

type FormErrors = Partial<Record<keyof IOrder, string>>;