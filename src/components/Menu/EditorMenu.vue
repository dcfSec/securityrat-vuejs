<template>
  <md-menu md-size="medium" md-align-trigger>
    <md-button md-menu-trigger v-on:click="goTo('editor')">
      <md-icon>fact_check</md-icon>
      <span>Editor</span></md-button>
  </md-menu>
</template>

<script>

export default {
  name: "EditorMenu",
  props: {
    pageState: Object
  },
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

</style>