<template>
  <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="pageState.openSnackbar" md-persistent>
    <span><md-icon class="md-primary" v-if="pageState.hasError === true">error</md-icon>
      <md-icon class="md-primary" v-else>done</md-icon> {{ message }}</span>
    <md-button class="md-primary" @click="pageState.openSnackbar = false">Close</md-button>
  </md-snackbar>
</template>

<script>
export default {
  name: "Snackbar",
  props: {
    pageState: Object,
    message: String
  },
  data: () => ({
    position: 'center',
    duration: 4000,
    requestClose: false,
  }),
}
</script>

<style scoped>

</style>