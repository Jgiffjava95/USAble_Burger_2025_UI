import { Item } from "./Item";
import { User } from "./User";

export interface Order {
    orderId: number,
    orderTotal: number,
    orderTaker: User,
    orderItems: Item[]
}