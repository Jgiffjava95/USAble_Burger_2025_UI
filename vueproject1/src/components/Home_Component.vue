<template>
    <!--<div id="item-selection">
        <div v-for="(item, index) in itemData" v-bind:key="index">
            <b-button pill variant="outline-secondary">{{item.itemName}}</b-button>
        </div>
    </div>-->
    <b-container fluid id="new-order-container">
        <b-row class="full-height-row">
            <b-col cols="9" id="item-view" class="overflow-auto">
                <h3 id="select-items">Select Items</h3>
                <div v-for="sorted in sortedItems" :key="sorted.first">
                    <div id="category-title">
                        <h3>
                            {{sorted.first}}
                        </h3>
                    </div>
                    <div id="items" v-for="item in sorted.second" :key="item.itemId">
                        <b-button @click="addItemToOrder(item)" class="nav-button food-item" pill variant="primary">{{item.itemName}}</b-button>
                    </div>
                </div>
            </b-col>
            <b-col cols="3" id="details-view">
                <h3>Order Details</h3>
                <div id="order-items" class="overflow-auto">
                    <div v-for="item in selectedItems" :key="item.itemId">
                        {{item.itemName}}
                        ${{item.itemPrice}}
                        <b-button @click="removeItem(item)" class="nav-button food-item" variant="danger">Remove</b-button>
                    </div>
                </div>
                <div id="money-details">
                    <p>Sub Total: ${{subTotal}}</p>
                    <p>Discount Amount: ${{0}}</p>
                    <p>Pre Tax: ${{0}}</p>
                    <p>Tax Amount: ${{0}}</p>
                    <p>Total: ${{0}}</p>
                    <b-button @click="placeOrder" class="nav-button" variant="primary">Place Order</b-button>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { DataService } from '../data/DataService';
    import { Pair } from '../data/Pair';
    import { Item } from '../models/Item';
    import { ItemTypes } from '../models/ItemTypes';

    const dataService = new DataService();

    let itemData: Item[] = [];
    let itemTypes: ItemTypes[] = [];

    //Refs
    let sortedItems = ref<Pair<string, Item[]>[]>([]);
    let selectedItems = ref<Item[]>([]);
    let subTotal = ref<number>(0);

    onMounted(async () => {
        //Get item data
        await dataService.getItems().then(response => {
            itemData = response;
        });

        //Get item types
        await dataService.getItemTypes().then(response => {
            itemTypes = response;
            let sorted = sortItemsByType(itemTypes, itemData);
            sorted.forEach(item => {
                sortedItems.value.push(item);
            });
        });
    });

    const addItemToOrder = (item: Item) => {
        selectedItems.value.push(item);
        subTotal.value += item.itemPrice;
    }

    const removeItem = (item: Item) => {
        const index = selectedItems.value.indexOf(item);
        selectedItems.value.splice(index, 1);
        subTotal.value -= item.itemPrice;
    }

    const sortItemsByType = (itemTypes: ItemTypes[], itemData: Item[]): Pair<String, Item[]> [] => {
        const sortedItemsAndTypes: Pair<string, Item[]>[] = [];
        itemTypes.forEach(t => {
            const newPair: Pair<string, Item[]> = { first: "", second: [] };
            newPair.first = t.typeName;
            newPair.second = [];
            itemData.forEach(i => {
                if (i.itemType == t.typeId) {
                    newPair.second.push(i);
                }
            })
            console.log(newPair)
            sortedItemsAndTypes.push(newPair);
        });
        return sortedItemsAndTypes;
    }

    const placeOrder = () => {
        return null;
    }

    console.log(sortedItems.value)
</script>

<style>
    h3 {
        margin: 0 !important;
    }

    #item-view {
        height: 100%;
    }

    #order-items {
    }

    #items {
        display: inline-block;
    }

    #details-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: lightblue;
        height: 100%;
    }

    #money-details {
        margin-top: auto;
        width: 100%;
    }

    #category-title {
        border-top: 1px solid black;
        margin-top: 8px;
        margin-bottom: 8px;
    }

    #new-order-container {
        margin: 0;
        height: calc(100% - 56px); /*This compensates for the nav space*/
        width: 100%;
    }

    .full-height-row {
        height: 100%;
    }

    .food-item {
        margin-top: 8px;
        min-width: 100px;
    }

    b-col {
        margin: 0;
        padding: 0;
    }
</style>