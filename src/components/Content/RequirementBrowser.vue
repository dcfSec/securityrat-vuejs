<template>
  <div>
    <md-card>
      <md-card-header>
        <div class="md-title">Requirement Browser</div>
      </md-card-header>

      <md-card-content>

        <p>{{ foundRequirementCount }} Requirements found </p>

        <BrowserTable v-bind:data="data" @update-found-count="updateFound"></BrowserTable>
        <md-button class="md-fab md-mini md-fixed md-fab-bottom-right" @click.native="scrollToTop()">
          <md-icon>arrow_upward</md-icon>
        </md-button>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>

import Vue2Filters from "vue2-filters";
import BrowserTable from "@/components/Content/Browser/BrowserTable";
import {RestData} from "../Functions/Rest.mjs";

export default {
  name: "RequirementBrowser",
  components: {
    BrowserTable,
  },
  mixins: [Vue2Filters.mixin],
  props: {
    pageState: Object
  },
  data: function () {
    return {
      foundRequirementCount: 0,
      data: new RestData(this.pageState.apiURL)
    }
  },
  computed: {},
  async mounted() {
    await this.getRequirements()
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    },
    async getRequirements() {
      this.pageState.isLoading = true;
      if (!this.pageState.data.hasLoaded()) {
        await this.pageState.data.getData()
      }
      this.data = this.pageState.data
      this.foundRequirementCount = this.data.requirementSkeletons.size
      this.pageState.isLoading = false;
    },
    updateFound(i) {
      this.foundRequirementCount = i
    }

  }
}
</script>

<style scoped>

</style>