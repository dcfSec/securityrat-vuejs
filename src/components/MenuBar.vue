<template>
  <md-toolbar>
    <h3 class="md-title" style="flex: 1">SecurityRAT<span class="md-subheading">v1.8.0-vue</span>
    </h3>
    <EditorMenu v-if="checkMenu('editor')" v-bind:pageState="pageState"></EditorMenu>
    <BrowseMenu v-if="checkMenu('browse')" v-bind:pageState="pageState"></BrowseMenu>
    <TrainingsMenu v-if="checkMenu('training')" v-bind:pageState="pageState"></TrainingsMenu>
    <EntitiesMenu v-if="checkMenu('entities')" v-bind:pageState="pageState"></EntitiesMenu>
    <AdminMenu v-if="checkMenu('admin')" v-bind:pageState="pageState"></AdminMenu>
    <AccountMenu v-if="checkMenu('account')" v-bind:pageState="pageState"></AccountMenu>
    <AccountLoggedOutMenu v-if="checkMenu('loggedOut')" v-bind:pageState="pageState"></AccountLoggedOutMenu>
  </md-toolbar>
</template>

<script>

import AdminMenu from "@/components/Menu/AdminMenu";
import AccountMenu from "@/components/Menu/AccountMenu";
import EntitiesMenu from "@/components/Menu/EntitiesMenu";
import TrainingsMenu from "@/components/Menu/TrainingsMenu";
import EditorMenu from "@/components/Menu/EditorMenu";
import AccountLoggedOutMenu from "@/components/Menu/AccountLoggedOutMenu";
import BrowseMenu from "@/components/Menu/BrowseMenu";


// TODO: Check roles not only in printing the menu
export default {
  name: "MenuBar",
  components: {BrowseMenu, AccountLoggedOutMenu, EditorMenu, TrainingsMenu, EntitiesMenu, AccountMenu, AdminMenu},
  props: {
    pageState: Object
  },
  methods: {
    checkMenu(item) {
      switch (item) {
        case 'training':
          return this.pageState.authentication === true && (this.pageState.account.roles.includes("ROLE_ADMIN") || this.pageState.account.roles.includes("ROLE_TRAINER"));
        case 'admin':
        case 'entities':
          return this.pageState.authentication === true && this.pageState.account.roles.includes("ROLE_ADMIN");
        case 'editor':
        case 'browse':
        case 'account':
          return this.pageState.authentication === true && this.pageState.account.roles.includes("ROLE_USER");
        case 'loggedOut':
          return this.pageState.authentication === false;

      }
    }
  }

}
</script>

<style scoped>

</style>