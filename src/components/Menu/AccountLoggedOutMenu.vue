<template>
  <md-menu md-size="medium" md-align-trigger>
    <md-button md-menu-trigger>
      <md-icon>account_circle</md-icon>
      <span>Account</span></md-button>
    <md-menu-content>
      <md-menu-item>
        <md-button :md-ripple="false" v-on:click="goTo('login')">
          <md-icon>login</md-icon>
          <span class="spaceLeft">Authenticate</span></md-button>
      </md-menu-item>
      <md-menu-item>
        <md-button :md-ripple="false" v-on:click="/*goTo('settings')*/">
          <md-icon>person_add</md-icon>
          <span class="spaceLeft">Register</span></md-button>
      </md-menu-item>
    </md-menu-content>
  </md-menu>
</template>

<script>
export default {
  name: "AccountLoggedOutMenu",
  methods: {
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
