<template>
    <div id="burger-nav">
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="#">USAble Burger</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown right>
                        <template #button-content>
                            <em>User</em>
                        </template>
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-button class="nav-button" pill variant="primary">New Order</b-button>
                    <b-button class="nav-button" pill variant="primary">Order Logs</b-button>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
    <Home_Component />
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Home_Component from './components/Home_Component.vue';

    export default defineComponent({
        name: 'App',
        components: {
            Home_Component
        }
    });
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        height: 100%;
    }

    html, body {
        height: 100%;
        width: 100%;
    }
    #burger-nav {
        width: 100%;
    }

    .nav-button {
        margin-left: 10px;
    }
</style>
