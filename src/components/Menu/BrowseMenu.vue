<template>
  <md-menu md-size="medium" md-align-trigger>
    <md-button md-menu-trigger>
      <md-icon>find_in_page</md-icon>
      <span>Browse</span></md-button>
    <md-menu-content>
      <md-button :md-ripple="false" v-on:click="goTo('requirementsBrowser')">
        <md-menu-item>Requirements</md-menu-item>
      </md-button>
    </md-menu-content>
  </md-menu>
</template>

<script>
export default {
  name: "BrowseMenu",
  methods: {
    goTo(target) {
      if (this.$route.path !== '/' + target) {
        this.$router.push(target);
      }
      return true;
    }
  }
}
</script>

<style scoped>

</style>