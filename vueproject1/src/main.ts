import { createApp } from 'vue'
import App from './App.vue'
import { BootstrapVue3 } from 'bootstrap-vue-3'
import "bootstrap/dist/css/bootstrap.min.css"; 
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import router from './router';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

createApp(App).use(router).use(BootstrapVue3).use(ToastPlugin).mount('#app');
