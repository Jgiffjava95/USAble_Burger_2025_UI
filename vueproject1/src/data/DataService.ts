import axios from 'axios';
import { Discount } from '../models/Discount';
import { Item } from '../models/Item';
import { ItemTypes } from '../models/ItemTypes';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { TaxType } from '../models/TaxType';
import { User } from '../models/User';
import { UserInfo } from '../models/UserInfo';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { BurgerResponse } from '../models/BurgerResponse';

export class DataService {

    //Change the port here
    baseUrl = "https://localhost:44374/api/"
    toast = useToast();

    getItems = async (): Promise<Item[] | null> => {
        try {
            const response = await axios.get<BurgerResponse>(this.baseUrl + 'items');
            if (response.data.success) {
                return response.data.data;
            } else {
                this.toast.error(response.data.message);
                return null;
            }
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    getItemsByOrder = async (orderId: number): Promise<OrderItem[] | null> => {
        try {
            const response = await axios.get<BurgerResponse>(this.baseUrl + 'items_by_order', {
                params: {
                    orderId: orderId
                }
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                this.toast.error(response.data.message);
                return null;
            }
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    getItemTypes = async (): Promise<ItemTypes[] | null> => {
        try {
            const response = await axios.get<BurgerResponse>(this.baseUrl + 'itemTypes');
            if (response.data.success) {
                return response.data.data;
            } else {
                this.toast.error(response.data.message);
                return null;
            }
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    getDiscounts = async (): Promise<Discount[] | null> => {
        try {
            const response = await axios.get<BurgerResponse>(this.baseUrl + 'discounts');
            if (response.data.success) {
                return response.data.data;
            } else {
                this.toast.error(response.data.message);
                return null;
            }
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    getTaxTypes = async (): Promise<TaxType[] | null> => {
        try {
            const response = await axios.get<BurgerResponse>(this.baseUrl + 'tax_types');
            if (response.data.success) {
                return response.data.data;
            } else {
                this.toast.error(response.data.message);
                return null;
            }
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    getOrdersByUserId = async (user: User): Promise<Order[] | null> => {
        try {
            const response = await axios.get<BurgerResponse>(this.baseUrl + `orders`, {
                params: {
                    userId: user.userId
                }
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                this.toast.error(response.data.message);
                return null;
            }
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    login = async (username: string, password: string): Promise<UserInfo | null> => {
        if (username == "" || password == "") {
            this.toast.error("Username or password cannot be blank");
            return null
        } else {
            try {
                const response = await axios.get<BurgerResponse>(this.baseUrl + 'login', {
                    params: {
                        userName: username,
                        userPassword: password
                    }
                });
                if (response.data.success) {
                    this.toast.success(response.data.message);
                    return response.data.data;
                } else {
                    this.toast.error(response.data.message);
                    return null;
                }
            } catch (error: any) {
                console.error(error);
                throw error;
            }
        }
    };

    createOrder = async (
        orderTotal: number,
        orderPreTaxTotal: number,
        orderSubTotal: number,
        orderTaxAmount: number,
        orderDiscountAmount: number,
        orderTaker: UserInfo,
        orderItems: Item[]
    ): Promise<any> => {
        const order: Order = {
            orderId: 0,
            orderTotal: orderTotal,
            orderDiscountAmount: orderDiscountAmount,
            orderPreTaxTotal: orderPreTaxTotal,
            orderSubTotal: orderSubTotal,
            orderTaxAmount: orderTaxAmount,
            orderDate: Date.now(),
            orderTaker: orderTaker.userId,
            orderItems: orderItems
        }

        try {
            const response = await axios.post<BurgerResponse>(this.baseUrl + 'create_order', order);
            if (response.data.success) {
                this.toast.success(response.data.message);
                return response.data.data;
            } else {
                this.toast.error(response.data.message);
                return null;
            }
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

}