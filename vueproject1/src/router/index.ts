import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: { name: 'Home' }
    },
    {
        path: '/Home',
        name: 'Home',
        component: () => import('../components/Home_Component.vue'),
    },
    {
        path: '/order_history',
        name: 'Order History',
        component: () => import('../components/Order_History_Component.vue'),
    }

    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;