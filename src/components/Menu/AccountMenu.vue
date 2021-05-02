<template>
  <md-menu md-size="medium" md-align-trigger>
    <md-button md-menu-trigger>
      <md-icon>account_circle</md-icon>
      <span>Account</span></md-button>
    <md-menu-content>
      <md-menu-item>
        <md-button :md-ripple="false" v-on:click="goTo('settings')">
          <md-icon>settings</md-icon>
          <span class="spaceLeft">Settings</span></md-button>
      </md-menu-item>
      <md-menu-item>
        <md-button :md-ripple="false" v-on:click="goTo('password')">
          <md-icon>lock</md-icon>
          <span class="spaceLeft">Password</span></md-button>
      </md-menu-item>
      <md-menu-item>
        <md-button :md-ripple="false" v-on:click="goTo('session')">
          <md-icon>cloud</md-icon>
          <span class="spaceLeft">Session</span></md-button>
      </md-menu-item>
      <md-menu-item>
        <md-button :md-ripple="false" v-on:click="logout()">
          <md-icon>exit_to_app</md-icon>
          <span class="spaceLeft">Log out</span></md-button>
      </md-menu-item>
    </md-menu-content>
  </md-menu>
</template>

<script>
import Vue from 'vue'

export default {
  name: "AccountMenu",
  props: {
    pageState: Object
  },
  methods: {
    async logout() {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        await this.$http.post(
            this.pageState.apiURL + 'api/logout',
            null,
            {
              withCredentials: true, headers: {
                "X-CSRF-TOKEN": Vue.$cookies.get("CSRF-TOKEN"),
              }
            }
        );
        this.pageState.hasError = false;
        this.pageState.snackBarMessage = "Logout successful"
        this.pageState.openSnackbar = true;
      } catch (err) {
        this.pageState.hasError = false;
        this.pageState.snackBarMessage = "Failed to logout: " + err
        this.pageState.openSnackbar = true;
      } finally {
        this.pageState.globalFunction['resetPageState']()
        this.pageState.isLoading = false;
        await this.$router.push({path: 'login'})
      }
    },
    goTo(target) {
      if (this.$route.path !== '/' + target) {
        this.$router.push(target)
      }
    }
  }
}
</script>

<style scoped>
.spaceLeft {
  margin-left: 1em;
}
</style>