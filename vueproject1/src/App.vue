<template>
  <div id="burger-nav">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">USAble Burger</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-button @click="startLogin" class="nav-button" pill variant="primary">{{loginLabelState}}</b-button>
          <b-button v-if="loggedInUser != null" @click="navigateNewOrder" class="nav-button" pill variant="primary">New Order</b-button>
          <b-button v-if="loggedInUser != null" @click="navigateOrderHistory" class="nav-button" pill variant="primary">Order Logs</b-button>
          <b-navbar-brand id="login-account-name-display">{{userNameLabelState}}</b-navbar-brand>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
  <div id="router-wrapper" v-if="loggedInUser != null">
    <router-view :user="loggedInUser" />
  </div>
  <div v-if="loggedInUser == null">
    <h3>Please login.</h3>
  </div>
  <div id="login-card" v-if="isLoggingIn">
    <b-card title="Login">
      <b-form-input class="login-input" v-model="username" placeholder="Username"></b-form-input>
      <b-form-input class="login-input" v-model="password" placeholder="Password" type="password"></b-form-input>
      <b-button class="login-button" @click="loginLogout" variant="primary">Login</b-button>
      <b-button class="login-button" @click="close()" variant="primary">Close</b-button>
    </b-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent, Ref } from 'vue';
  import { ref } from 'vue';
  import { DataService } from './data/DataService';
  import { UserInfo } from './models/UserInfo';
  import { useRoute, useRouter } from 'vue-router';

  interface AppData {
    loginLabelState: Ref<string>,
    userNameLabelState: Ref<string>,
    isLoggingIn: boolean,
    username: string,
    password: string,
    loggedInUser: UserInfo | null,
    dataService: DataService
  }

  export default defineComponent({
    name: 'App',
    setup() {
      const route = useRoute();
      const router = useRouter();

      const navigateNewOrder = () => {
        router.push('/');
      }

      const navigateOrderHistory = () => {
        router.push('/order_history');
      }

      const currentRouteName = route.name;
      const currentRouteParams = route.params;

      return {
        navigateNewOrder,
        navigateOrderHistory,
        currentRouteName,
        currentRouteParams
      };
    },
    data(): AppData {
      return {
        loginLabelState: ref<string>("Login"),
        userNameLabelState: ref<string>("Not logged in"),
        isLoggingIn: false,
        username: "",
        password: "",
        loggedInUser: null,
        dataService: new DataService()
      };
    },
    methods: {
      startLogin() {
        if (this.loginLabelState == "Login") {
          this.isLoggingIn = true;
        } else {
          this.loginLogout(); //The else will be hit in LoginLogout() logging the user out.
        }
      },

      loginLogout() {
        if (this.loggedInUser == null) {
          if (this.username != null && this.password != null) {
            this.dataService.login(this.username, this.password).then(response => {
              if (response != null) {
                  this.loggedInUser = response;
                  this.isLoggingIn = false;
                  this.userNameLabelState = "Logged in as: " + this.loggedInUser.userName;
                  this.loginLabelState = "Logout";
                  this.username = "";
                  this.password = "";
              }
            });
          }
        } else {
          this.loggedInUser = null;
          this.userNameLabelState = "Not logged in";
          this.loginLabelState = "Login";
          this.isLoggingIn = false;
        }

      },

      close() {
        this.isLoggingIn = false;
      }
    },
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

  #router-wrapper {
    height: calc(100% - 56px);
  }

  #login-account-name-display {
    font-size: 20px;
    margin-bottom: 0;
    margin-left: 8px;
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

  .login-input {
    margin-bottom: 6px;
  }

  .login-button {
    margin: 6px;
  }

  #login-card {
    top: 56px;
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
  }
</style>
