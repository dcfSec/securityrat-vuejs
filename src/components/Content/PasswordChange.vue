<template>
  <div>
    <PasswordConfirmation v-if="confirmed === false" v-bind:pageState="pageState"
                          v-on:confirmation="confirmed = true"></PasswordConfirmation>
    <div v-else-if="confirmed === true">
      <div class="md-layout md-alignment-top-center">
        <div class="md-layout-item md-size-25 md-xsmall-hide md-small-hide"></div>
        <div class="md-layout-item md-size-50">
          <form novalidate class="md-layout" @submit.prevent="updatePassword">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
              <md-card-header>
                <div class="md-title">User settings for [{{ this.pageState.account.login }}]</div>
              </md-card-header>

              <md-card-content>


                <md-field :class="newPasswordCheckClass">
                  <label>Password</label>
                  <md-input v-model="newPassword" type="password"></md-input>
                  <span class="md-error">Password strength too low</span>
                </md-field>
                <p v-if="newPassword.length > 0">
                  <password v-model="newPassword" :strength-meter-only="true" @score="getScore"
                            @feedback="showFeedback"/>
                  <span class="md-error" v-for="(line, key) in suggestions" v-bind:key="key">{{ line }}<br></span>
                  <span class="md-error">{{ warning }}</span>
                </p>
                <md-field :class="newPasswordConfirmCheckClass">
                  <label>Password</label>
                  <md-input v-model="newPasswordConfirm" type="password"></md-input>
                  <span class="md-error">Passwords do not match</span>
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
import Password from 'vue-password-strength-meter'
import PasswordConfirmation from "@/components/PasswordConfirmation";
import Vue from "vue";

export default {
  name: "PasswordChange",
  components: {Password, PasswordConfirmation},
  props: {
    pageState: Object
  },
  data: function () {
    return {
      confirmed: false,
      newPassword: "",
      newPasswordConfirm: "",
      score: 0,
      suggestions: [],
      warning: "",
    }
  },
  computed: {
    newPasswordConfirmCheckClass() {
      return {
        'md-invalid': this.newPassword !== this.newPasswordConfirm
      }
    },
    newPasswordCheckClass() {
      return {
        'md-invalid': this.newPassword.length > 0 && this.score < 3
      }
    },
  },
  methods: {
    showFeedback({suggestions, warning}) {
      this.suggestions = suggestions;
      this.warning = warning;
    },
    getScore(score) {
      this.score = score
    },
    async updatePassword() {
      if (this.newPassword.length > 0 && this.score >= 3 && this.newPassword === this.newPasswordConfirm) {
        try {
          this.pageState.isLoading = true; //TODO: Add loading spinner
          await this.$http.post(
              this.pageState.apiURL + 'api/account/change_password',
              this.newPassword,
              {
                withCredentials: true, headers: {
                  "X-CSRF-TOKEN": Vue.$cookies.get("CSRF-TOKEN"),
                  "Content-Type": "application/json;charset=utf-8"
                }
              }
          )
          this.pageState.hasError = false;
          this.pageState.snackBarMessage = "Updated password successfully"
          this.pageState.openSnackbar = true;

          this.pageState.globalFunction['getAccount']()
          await this.$router.push('editor')
        } catch (err) {
          if ("error" in err.response.data && "message" in err.response.data) {
            this.pageState.snackBarMessage = err.response.data.error + ": " + err.response.data.message
          } else {
            this.pageState.snackBarMessage = "Error: " + err
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