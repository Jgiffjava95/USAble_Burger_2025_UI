import axios from 'axios';
import { Discount } from '../models/Discount';
import { Item } from '../models/Item';
import { ItemTypes } from '../models/ItemTypes';
import { Order } from '../models/Order';
import { User } from '../models/User';

export class DataService {

    //Change the port here
    baseUrl = "https://localhost:44374/api/"

    getItems = async (): Promise<Item[]> => {
        try {
            const response = await axios.get<Item[]>(this.baseUrl + 'items');
            return response.data;
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    getItemTypes = async (): Promise<ItemTypes[]> => {
        try {
            const response = await axios.get<ItemTypes[]>(this.baseUrl + 'itemTypes');
            return response.data;
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    getDiscounts = async (): Promise<Discount[]> => {
        try {
            const response = await axios.get<Discount[]>(this.baseUrl + 'discounts');
            return response.data;
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    getOrdersByUserId = async (user: User): Promise<Order[]> => {
        try {
            const response = await axios.get<Order[]>(this.baseUrl + `orders/${user.userId}`);
            return response.data;
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    createOrderDiscounts = async (order: Order): Promise<any> => {
        try {
            const response = await axios.post<any>(this.baseUrl + 'create_order', order);
            return response.data;
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

}