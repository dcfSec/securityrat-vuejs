<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Active sessions for [{{ pageState.account.login }}]</h1>
      </md-table-toolbar>

      <md-table-row>
        <md-table-head>IP Address</md-table-head>
        <md-table-head>User Agent</md-table-head>
        <md-table-head>Date</md-table-head>
        <md-table-head></md-table-head>
      </md-table-row>
      <md-table-row v-for="item in sessions" v-bind:key="'session'+item.id">
        <md-table-cell> {{ item.ipAddress }}</md-table-cell>
        <md-table-cell> {{ item.userAgent }}</md-table-cell>
        <md-table-cell> {{ item.formattedTokenDate }}</md-table-cell>
        <md-table-cell>
          <md-button class="md-raised md-primary" @click="invalidateSession(item['series'])">Invalidate</md-button>
        </md-table-cell>

      </md-table-row>

    </md-table>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "Session",
  props: {
    pageState: Object
  },
  data: function () {
    return {
      sessions: []
    }
  },
  created() {
    this.getSessions()
  },
  methods: {
    async getSessions() {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        let {data} = await this.$http.get(
            this.pageState.apiURL + 'api/account/sessions',
            {
              withCredentials: true, headers: {
                "X-CSRF-TOKEN": Vue.$cookies.get("CSRF-TOKEN"),
              }
            }
        )
        this.sessions = data
      } catch (err) {
        this.pageState.hasError = true;
        this.pageState.openSnackbar = true;
        if ("error" in err.response.data && "message" in err.response.data) {
          this.pageState.snackBarMessage = err.response.data.error + ": " + err.response.data.message
        } else {
          this.pageState.snackBarMessage = "Error getting sessions: " + err
        }
        this.sessions = []
      } finally {
        this.pageState.isLoading = false;
      }
    },
    async invalidateSession(series) {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        await this.$http.delete(
            this.pageState.apiURL + 'api/account/sessions/' + encodeURIComponent(this.hexEncode(series)),
            {
              withCredentials: true, headers: {
                "X-CSRF-TOKEN": Vue.$cookies.get("CSRF-TOKEN"),
              }
            }
        )

        this.pageState.hasError = false;
        this.pageState.snackBarMessage = "Updated user successfully"
        this.pageState.openSnackbar = true;
        await this.getSessions()
      } catch (err) {

        if ("error" in err.response.data && "message" in err.response.data) {
          this.pageState.snackBarMessage = err.response.data.error + ": " + err.response.data.message
        } else {
          this.pageState.snackBarMessage = "Error deleting sessions: " + err
        }
        this.pageState.hasError = true;
        this.pageState.openSnackbar = true;
        this.sessions = []
      } finally {
        this.pageState.isLoading = false;
      }
    },
    hexEncode(src) {
      // (ノ ゜Д゜)ノ ︵ ┻━┻
      //
      // NOTE: We need to encode the "series" value in a format that can
      //       pass Spring's firewall. Thus, the parameter is not allowed
      //       to contain hexadecimal numbers with a percent sign as
      //       prefix (like '%2F').
      //
      // Fix is based on: https://stackoverflow.com/a/21648161 and
      //                  https://stackoverflow.com/a/13691499
      //
      // NOTE: The fix uses UTF-8 instead of UTF-16 because UTF-16 is a
      //       multibyte character set and we would have to mess around
      //       with the endianness (because JavaScript has no defined
      //       default endianness).
      let hex, i, result = "";

      // utf16 -> utf8

      src = unescape(encodeURIComponent(src));

      // utf8 -> hex

      for (i = 0; i < src.length; i++) {
        hex = src.charCodeAt(i).toString(16);
        result += ("0" + hex).slice(-2);
      }

      return result;
    }
  }
}
</script>

<style scoped>

</style>