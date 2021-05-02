<template>
  <div id="app">
    <MenuBar v-bind:pageState="pageState"></MenuBar>
    <router-view></router-view>

    <Snackbar v-bind:pageState="pageState" v-bind:message="pageState.snackBarMessage"
              @update-snackbar-status="updateSnackbarStatus"></Snackbar>
    <ProgressBar v-bind:show-dialog="pageState.isLoading" title="Loading Data from API"></ProgressBar>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
import MenuBar from "@/components/MenuBar";
import Login from "@/components/Content/Login";
import axios from 'axios'
import VueAxios from 'vue-axios'
import Snackbar from "@/components/Snackbar";
import VueCookies from 'vue-cookies'
import Editor from "@/components/Content/Editor";
//import Session from "@/components/Content/Session";
//import Settings from "@/components/Content/Settings";
import NotFound from "@/components/NotFound";
import ProgressBar from "@/components/ProgressBar";
import VueRouter from 'vue-router'
import Session from "@/components/Content/Session";
import Settings from "@/components/Content/Settings";
import PasswordChange from "@/components/Content/PasswordChange";
import RequirementBrowser from "@/components/Content/RequirementBrowser";
import {RestData} from "./components/Functions/Rest.mjs";

/*
TODO: password reset
TODO: user register
 */


Vue.use(VueCookies)
Vue.use(VueAxios, axios)
Vue.use(VueMaterial)
Vue.use(VueRouter)


let pageState = {
  apiURL: '/',
  firstCall: true,
  authenticationConfig: {},
  openSnackbar: false,
  hasError: false,
  isLoading: false,
  snackBarMessage: '',
  authentication: false,
  account: {roles: []},
  requirementsLoaded: false,
  globalFunction: {},
  pageBeforeLogin: '/editor',
  data: null
}

let router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {path: '/', redirect: '/editor'},
    {path: '/editor', component: Editor, props: {pageState: pageState}},
    {path: '/requirements', component: Editor, props: {pageState: pageState}},
    {path: '/requirementsBrowser', component: RequirementBrowser, props: {pageState: pageState}},

    {path: '/login', component: Login, props: {pageState: pageState}},
    {path: '/settings', component: Settings, props: {pageState: pageState}},
    {path: '/password', component: PasswordChange, props: {pageState: pageState}},
    {path: '/session', component: Session, props: {pageState: pageState}},
    {path: '/404', component: NotFound, props: {pageState: pageState}},
    {path: '/*', redirect: '/404'},
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !pageState.authentication) {
    console.log(to.path)
    pageState.pageBeforeLogin = to.path
    next('/login')
  } else next()
})

export default {
  name: 'App',
  router,
  data: function () {
    return {
      pageState: pageState
    }
  },
  mounted: async function () {
    await this.getAuthenticationConfig()
    await this.getAccount()
    if (this.pageState.authentication) {
      await this.$router.push(pageState.pageBeforeLogin)
    }
    this.pageState.globalFunction['resetPageState'] = this.resetPageState
    this.pageState.globalFunction['getAccount'] = this.getAccount
    this.pageState.globalFunction['handleAPIError'] = this.handleAPIError

  },
  methods: {
    async getAuthenticationConfig() {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        const {data} = await this.$http.get(
            this.pageState.apiURL + 'api/authentication_config',
            {withCredentials: true,}
        );
        this.pageState.authenticationConfig = data
      } catch (err) {
        this.pageState.hasError = true;
        this.pageState.openSnackbar = true;
        this.pageState.snackBarMessage = "api/authentication_config: " + err
      } finally {
        this.pageState.isLoading = false;
      }
      //TODO: Add initial call to account to check if user is already logged in
    },
    async getAccount() {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        let {data} = await this.$http.get(
            this.pageState.apiURL + 'api/account',
            {
              withCredentials: true, headers: {
                "X-CSRF-TOKEN": Vue.$cookies.get("CSRF-TOKEN"),
              }
            }
        )
        this.pageState.authentication = true
        this.pageState.account = data
        this.pageState.data = new RestData(this.pageState.apiURL)

      } catch (err) {
        if (this.pageState.firstCall === false) {
          this.pageState.hasError = true;
          this.pageState.openSnackbar = true;
          if ("error" in err.response.data && "message" in err.response.data) {
            this.pageState.snackBarMessage = err.response.data.error + ": " + err.response.data.message
          } else {
            this.pageState.snackBarMessage = "Authentication: " + err
          }
          this.pageState.authentication = false;
          this.pageState.account = {};
        }
      } finally {
        this.pageState.isLoading = false;
        this.pageState.firstCall = false;
      }
    },
    updateSnackbarStatus(val) {
      this.pageState.openSnackbar = val
    },
    resetPageState() {
      this.pageState = {
        apiURL: '/',
        page: 0,
        authenticationConfig: {},
        openSnackbar: this.pageState.openSnackbar,
        snackBarMessage: this.pageState.snackBarMessage,
        hasError: this.pageState.hasError,
        isLoading: false,
        authentication: false,
        account: {roles: []},
        globalFunction: this.pageState.globalFunction,
        pageBeforeLogin: '/editor'
      }
      this.getAuthenticationConfig()
    },
    handleAPIError(err) {
      if ("status" in err.response.data && "error" in err.response.data && "message" in err.response.data) {
        if (err.response.data.status === 401 && this.pageState.authentication === true) {
          this.resetPageState();
          this.pageState.snackBarMessage = "[401] Unauthorized. Please log in again."
        } else if (err.response.data.status === 403) {
          this.resetPageState();
          this.pageState.snackBarMessage = "Username or password is wrong"
        } else {
          this.pageState.snackBarMessage = err.response.data.error + ": " + err.response.data.message
        }
      } else {
        this.pageState.snackBarMessage = "Unhandled error: " + err
      }
      this.pageState.hasError = true;
      this.pageState.openSnackbar = true;

    }
  },
  components: {
    ProgressBar,
//    Settings,
//    Session,
//    Editor,
    Snackbar,
//    Login,
    MenuBar
  }
}
</script>

<style>

</style>
