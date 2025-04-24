import { Item } from "./Item";

export interface Order {
    orderId: number,
    orderSubTotal: number,
    orderDiscountAmount: number,
    orderPreTaxTotal: number,
    orderTaxAmount: number,
    orderTotal: number,
    orderTaker: number,
    orderItems: Item[],
    orderDate: number
}
