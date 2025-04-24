<template>
    <div id="order-history">
        <h3>Order History</h3>
        <b-container fluid id="new-order-container">
            <div v-for="order in orders" :key="order.orderId">
                <div v-if="!ordersPresent">
                    <h3>No orders for user.</h3>
                </div>
                <b-row v-if="ordersPresent" id="order" class="full-height-row">
                    <b-col cols="6">
                        <p>Order Id: {{order.orderId}}</p>
                        <p>Order Taker: {{loggedInUser.firstName}} {{loggedInUser.lastName}}</p>
                        <p>Date Taken: {{order.orderDate}}</p>
                        <p>Order Sub Total: {{order.orderSubTotal}}</p>
                        <p>Order Discount Amount: {{order.orderDiscountAmount}}</p>
                        <p>Order Pre Tax: {{order.orderPreTaxTotal}}</p>
                        <p>Order Tax Amount: {{order.orderTaxAmount}}</p>
                        <p>Order Total: {{order.orderTotal}}</p>
                    </b-col>
                    <b-col cols="6" v-for="(items, index) in order.orderItems" :key="index">
                        <div v-for="item in items" :key="item.orderItemId">
                            <p>{{item.orderItemName}} x {{item.orderItemQuan}}</p>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </b-container>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, defineProps } from 'vue';
    import { DataService } from '../data/DataService';
    import { UserInfo } from '../models/UserInfo';
    import { Order } from '../models/Order';


    const dataService = new DataService();

    let orders = ref<Order[]>([]);
    let ordersPresent = ref<boolean>(false);
    let loggedInUser = ref<UserInfo>({ userId: 0, userName: "", firstName: "", lastName: "" });
    const props = defineProps({
        user: UserInfo
    });

    onMounted(async () => {
        loggedInUser.value = props.user;
        await dataService.getOrdersByUserId(props.user).then(response => {
            if (response != null) {
                ordersPresent.value = true;
                response.forEach(r => {
                    r.orderItems = [];
                });
                orders.value = response;
                orders.value.forEach(o => {
                    dataService.getItemsByOrder(o.orderId).then(response => {
                        orders.value.find(order => order.orderId == o.orderId)?.orderItems.push(response);
                    });
                });
            }
        });
    })
</script>

<style>
    #order {
        border-bottom: 1px solid black;
        margin-top: 8px;
        margin-bottom: 8px;
    }

    #order-history {
        margin: 0;
        height: 100%;
        width: 100%;
    }
</style>