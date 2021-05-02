<template>
  <md-menu md-size="medium" md-align-trigger>
    <md-button md-menu-trigger>
      <md-icon>build_circle</md-icon>
      <span>Administration</span></md-button>
    <md-menu-content>
      <md-menu-item>
        <md-icon>text_snippet</md-icon>
        <span>Constants</span></md-menu-item>
      <md-menu-item>
        <md-icon>supervisor_account</md-icon>
        <span>User Management</span></md-menu-item>
      <md-menu-item>
        <md-icon>analytics</md-icon>
        <span>Metrics</span></md-menu-item>
      <md-menu-item>
        <md-icon>local_hospital</md-icon>
        <span>Health</span></md-menu-item>
      <md-menu-item>
        <md-icon>miscellaneous_services</md-icon>
        <span>Configuration</span></md-menu-item>
      <md-menu-item>
        <md-icon>notification_important</md-icon>
        <span>Audits</span></md-menu-item>
      <md-menu-item>
        <md-icon>receipt</md-icon>
        <span>Logs</span></md-menu-item>
    </md-menu-content>
  </md-menu>
</template>

<script>
export default {
  name: "AdminMenu"
}
</script>

<style scoped>

</style>