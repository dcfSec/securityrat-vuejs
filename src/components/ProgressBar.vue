<template>
  <md-dialog :md-active.sync="showDialog" :md-close-on-esc="false" :md-click-outside-to-close="false">
    <md-dialog-title>
      <div class="md-title">{{ title }}</div>
    </md-dialog-title>
    <md-progress-bar md-mode="query"></md-progress-bar>
  </md-dialog>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    title: String,
    showDialog: Boolean
  }
}
</script>

<style scoped>

</style>