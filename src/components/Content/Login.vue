<template>
  <div class="md-layout md-alignment-top-center">
    <div class="md-layout-item md-size-25 md-xsmall-hide md-small-hide"></div>
    <div class="md-layout-item md-size-50">
      <form novalidate class="md-layout" @submit.prevent="authenticateUser">
        <md-card class="md-layout-item md-size-50 md-small-size-100">
          <md-card-header>
            <div class="md-title">Authenticate</div>
          </md-card-header>

          <md-card-content>

            <md-field md-clearable>
              <label>Login</label>
              <md-input v-model="user"></md-input>
            </md-field>

            <md-field>
              <label>Password</label>
              <md-input v-model="password" type="password"></md-input>
            </md-field>

            <md-checkbox v-model="autoLogin">Automatic Login</md-checkbox>

            <div>
              <a>Did you forget your password?</a>
              <p>You don't have an account yet? <a>Register a new account</a></p>
            </div>


          </md-card-content>
          <md-card-actions>
            <md-button type="submit" class="md-primary">Login</md-button>
          </md-card-actions>
        </md-card>

      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'

export default {
  name: "Login",
  props: {
    'pageState': Object
  },
  data: () => ({
    autoLogin: false,
    user: "",
    password: ""
  }),
  methods: {
    authenticateUser() {
      this.doAuthentication(this.user, this.password)
    },
    async doAuthentication(user, password) {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        await this.$http.post(
            this.pageState.apiURL + 'api/authentication',
            qs.stringify({
              "j_username": user,
              "j_password": password,
              "remember-me": this.autoLogin.toString(),
              "submit": "Login"
            }),
            {
              withCredentials: true, headers: {
                "X-CSRF-TOKEN": Vue.$cookies.get("CSRF-TOKEN"),
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
        )
        await this.pageState.globalFunction['getAccount']()
        if (this.pageState.authentication === true) {
          await this.$router.push({path: this.pageState.pageBeforeLogin})
        }
      } catch (err) {
        this.pageState.globalFunction["handleAPIError"](err)
      } finally {
        this.pageState.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.loginCard {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>