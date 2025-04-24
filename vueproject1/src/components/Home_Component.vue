<template>
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
                    <p v-if="selectedItems.length == 0">No items selected</p>
                    <div v-for="item in selectedItems" :key="item.itemId">
                        {{item.itemName}}
                        ${{item.itemPrice}}
                        <b-button @click="removeItem(item)" class="nav-button food-item" variant="danger">Remove</b-button>
                    </div>
                </div>
                <div>
                    <b-dropdown id="discount-dropdown" text="Discount" class="m-md-2">
                        <b-dropdown-item @click="discountSelected(null)">None</b-dropdown-item>
                        <b-dropdown-item @click="discountSelected(discount)" v-for="discount in discounts" :key="discount.discountId">{{discount.discountName}}</b-dropdown-item>
                    </b-dropdown>
                </div>
                <div id="money-details">
                    <p>Sub Total: ${{subTotal}}</p>
                    <div>
                        Discount: {{selectedDiscountName}}
                    </div>
                    <p>Discount Amount: ${{discountAmount}}</p>
                    <p>Pre Tax: ${{preTax}}</p>
                    <p>Tax Amount: ${{taxAmount}}</p>
                    <p>Total: ${{total}}</p>
                    <b-button @click="placeOrder" class="nav-button" variant="primary">Place Order</b-button>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script setup lang="ts">
    import { onMounted, ref, defineProps } from 'vue';
    import { DataService } from '../data/DataService';
    import { Pair } from '../data/Pair';
    import { Discount } from '../models/Discount';
    import { Item } from '../models/Item';
    import { ItemTypes } from '../models/ItemTypes';
    import { TaxType } from '../models/TaxType';
    import { UserInfo } from '../models/UserInfo';

    const dataService = new DataService();

    let itemData: Item[] = [];
    let itemTypes: ItemTypes[] = [];

    //Refs
    let discounts = ref<Discount[]>([]);
    let taxTypes = ref<TaxType[]>([]);
    let sortedItems = ref<Pair<string, Item[]>[]>([]);
    let selectedItems = ref<Item[]>([]);
    let selectedDiscount = ref<Discount>(null);
    let selectedDiscountName = ref<string>("No discount selected");

    let subTotal = ref<number>(0);

    let discountAmount = ref<number>(0);

    let preTax = ref<number>(0);

    let taxAmount = ref<number>(0);

    let total = ref<number>(0);

    const props = defineProps({
        user: UserInfo,
    });

    onMounted(async () => {
        //Get item data
        await dataService.getItems().then(response => {
            if (response != null) {
                itemData = response;
            }
        });

        //Get item types
        await dataService.getItemTypes().then(response => {
            if (response != null) {
                itemTypes = response;

                let sorted = sortItemsByType(itemTypes, itemData);
                sorted.forEach(item => {
                    sortedItems.value.push(item);
                });
            }
        });

        await dataService.getDiscounts().then(response => {
            if (response != null) {
                response.forEach(d => {
                    discounts.value.push(d);
                });
            }
        });

        await dataService.getTaxTypes().then(response => {
            if (response != null) {
                response.forEach(t => {
                    taxTypes.value.push(t);
                });
            }
        });
    });

    const addItemToOrder = (item: Item) => {
        selectedItems.value.push(item);
        calcAddSubTotal(item.itemPrice);
        grandCalc(true);
    }

    const calcAddSubTotal = (price: number) => {
        subTotal.value += price;
        subTotal.value = roundMoney(subTotal.value);
    }

    const calcSubtract = (price: number) => {
        subTotal.value -= price;
        subTotal.value = roundMoney(subTotal.value);
        grandCalc(false);
    }

    const grandCalc = (add: boolean) => {
        calcDiscount();
        calcPreTax();
        taxTypes.value.find(t => {
            t.taxId == "State";
            calcStateTaxes(t, add);
        });
        calcFinalTotal();
    }

    const calcDiscount = () => {
        if (selectedDiscount.value != null) {
            discountAmount.value = subTotal.value * selectedDiscount.value.discountPercentage;
            discountAmount.value = roundMoney(discountAmount.value);
            calcPreTax();
        } else {
            discountAmount.value = 0;
            preTax.value = subTotal.value;
        }
    }

    const calcPreTax = () => {
        preTax.value = subTotal.value - discountAmount.value;
        preTax.value = roundMoney(preTax.value)
    }

    const calcStateTaxes = (tax: TaxType) => {
        taxAmount.value = (preTax.value * tax.taxPercentage);
        taxAmount.value = roundMoney(taxAmount.value);   
    }

    const calcFinalTotal = () => {
        total.value = taxAmount.value + preTax.value;
        total.value = roundMoney(total.value);
    }

    const removeItem = (item: Item) => {
        const index = selectedItems.value.indexOf(item);
        selectedItems.value.splice(index, 1);
        calcSubtract(item.itemPrice);
    }

    const sortItemsByType = (itemTypes: ItemTypes[], itemData: Item[]): Pair<String, Item[]>[] => {
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
            sortedItemsAndTypes.push(newPair);
        });
        return sortedItemsAndTypes;
    }

    const discountSelected = (discount: Discount) => {
        if (discount != null) {
            selectedDiscount.value = discount;
            selectedDiscountName.value = discount.discountName;
        } else {
            selectedDiscount.value = null;
            selectedDiscountName.value = "No discount selected";
        }
        calcDiscount();
        calcFinalTotal();
    }

    const placeOrder = () => {
        dataService.createOrder(total.value, preTax.value, subTotal.value, taxAmount.value, discountAmount.value, props.user, selectedItems.value).then(response => {
            if (response != null) {
                selectedItems.value = [];
                selectedDiscount.value = null;
                selectedDiscountName.value = "No discount selected";

                subTotal.value = 0;
                discountAmount.value = 0;
                preTax.value = 0;
                taxAmount.value = 0;
                total.value = 0;
            }
        });
    }

    const roundMoney = (amount) => {
        return (Math.round(amount * 100) / 100);
    }
</script>

<style>
    h3 {
        margin: 0 !important;
    }

    #item-view {
        height: 100%;
    }

    #order-items {
        background-color: white;
        height: 100%;
        width: 100%;
        margin-bottom: 8px;
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
        height: 100%;
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
