<template>
  <div>
    <PasswordConfirmation v-if="confirmed === false" v-bind:pageState="pageState"
                          v-on:confirmation="confirmed = true"></PasswordConfirmation>
    <div v-else-if="confirmed === true">
      <div class="md-layout md-alignment-top-center">
        <div class="md-layout-item md-size-25 md-xsmall-hide md-small-hide"></div>
        <div class="md-layout-item md-size-50">
          <form novalidate class="md-layout" @submit.prevent="updateUser">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
              <md-card-header>
                <div class="md-title">User settings for [{{ this.pageState.account.login }}]</div>
              </md-card-header>

              <md-card-content>

                <md-field md-clearable>
                  <label>First Name</label>
                  <md-input v-model="newFirstName" required></md-input>
                  <span class="md-error">There is an error</span>
                </md-field>

                <md-field md-clearable>
                  <label>Last Name</label>
                  <md-input v-model="newLastName" required></md-input>
                  <span class="md-error">There is an error</span>
                </md-field>

                <md-field md-clearable>
                  <label>E-mail</label>
                  <md-input type="email" v-model="newEmail" required></md-input>
                  <span class="md-error">There is an error</span>
                </md-field>

              </md-card-content>
              <md-card-actions>
                <md-button type="submit" class="md-primary">Save</md-button>
              </md-card-actions>
            </md-card>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordConfirmation from "@/components/PasswordConfirmation";
import Vue from "vue";

// TODO: Add check for input

export default {
  name: "Settings",
  props: {
    pageState: Object
  },
  data: function () {
    return {
      confirmed: false,
      newFirstName: this.pageState.account.firstName,
      newLastName: this.pageState.account.lastName,
      newEmail: this.pageState.account.email

    }
  },
  components: {PasswordConfirmation},
  methods: {
    async updateUser() {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        await this.$http.post(
            this.pageState.apiURL + 'api/account',
            {
              "login": this.pageState.account.login,
              "password": null,
              "firstName": this.newFirstName,
              "lastName": this.newLastName,
              "email": this.newEmail,
              "langKey": this.pageState.account.langKey,
              "roles": this.pageState.account.roles
            },
            {
              withCredentials: true, headers: {
                "X-CSRF-TOKEN": Vue.$cookies.get("CSRF-TOKEN"),
                "Content-Type": "application/json;charset=utf-8"
              }
            }
        )
        this.pageState.hasError = false;
        this.pageState.snackBarMessage = "Updated user successfully"
        this.pageState.openSnackbar = true;

        this.pageState.globalFunction['getAccount']()
      } catch (err) {
        if ("error" in err.response.data && "message" in err.response.data) {
          this.pageState.snackBarMessage = err.response.data.error + ": " + err.response.data.message
        } else {
          this.pageState.snackBarMessage = "Authentication: " + err
        }
        this.pageState.hasError = true;
        this.pageState.openSnackbar = true;
      } finally {
        this.pageState.isLoading = false;
      }

    }
  }
}
</script>

<style scoped>

</style>