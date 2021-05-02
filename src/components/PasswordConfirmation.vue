<template>
  <div>
    <div class="md-layout md-alignment-top-center">
      <div class="md-layout-item md-size-25 md-xsmall-hide md-small-hide"></div>
      <div class="md-layout-item md-size-50">
        <form novalidate class="md-layout" @submit.prevent="confirmPassword">
          <md-card class="md-layout-item md-size-50 md-small-size-100">
            <md-card-header>
              <div class="md-title">Confirm password</div>
            </md-card-header>

            <md-card-content>

              <md-field>
                <label>Password</label>
                <md-input v-model="password" type="password"></md-input>
              </md-field>

            </md-card-content>
            <md-card-actions>
              <md-button type="submit" class="md-primary">Confirm</md-button>
            </md-card-actions>
          </md-card>

        </form>
      </div>
    </div>
  </div>

</template>

<script>
import Vue from "vue";

export default {
  name: "PasswordConfirmation",
  props: {
    pageState: Object,
  },
  data: function () {
    return {
      password: null
    }
  },
  methods: {
    async confirmPassword() {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        await this.$http.post(
            this.pageState.apiURL + 'api/account/confirm_password',
            this.password,
            {
              withCredentials: true, headers: {
                "X-CSRF-TOKEN": Vue.$cookies.get("CSRF-TOKEN"),
                "Content-Type": "application/json;charset=utf-8" // TODO: This is broken
              }
            }
        )
        await this.getAccount()
        this.$emit('confirmation')
      } catch (err) {
        this.pageState.hasError = true;
        this.pageState.openSnackbar = true;
        if ("error" in err.response.data && "message" in err.response.data) {
          this.pageState.snackBarMessage = err.response.data.error + ": " + err.response.data.message
        } else {
          this.pageState.snackBarMessage = "Authentication: " + err
        }
      } finally {
        this.pageState.isLoading = false;
      }
    },
    async getAccount() {
      if (this.pageState.authentication === true) {
        try {
          this.pageState.isLoading = true; //TODO: Add loading spinner
          let {data} = await this.$http.get(
              this.pageState.apiURL + 'api/account',
              {
                withCredentials: true, headers: {
                  "X-CSRF-TOKEN": Vue.$cookies.get("CSRF-TOKEN"),
                }
              }
          )
          this.pageState.account = data
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
}
</script>

<style scoped>

</style>