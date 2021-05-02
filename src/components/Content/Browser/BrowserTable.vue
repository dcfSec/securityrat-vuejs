<template>
  <div>
    <md-table v-if="data.hasLoaded() && data.requirementSkeletons.size > 0">
      <md-table-toolbar>
        <md-field>
          <md-input v-model="search" placeholder="Search requirement"></md-input>
        </md-field>
      </md-table-toolbar>

      <md-table-row>
        <md-table-head>Category</md-table-head>
        <md-table-head>Short Name</md-table-head>
        <md-table-head>Description</md-table-head>
        <md-table-head>Tags</md-table-head>
        <md-table-head>Collections</md-table-head>
        <md-table-head>Implementation Types</md-table-head>
        <md-table-head></md-table-head>
      </md-table-row>

      <BrowserRow v-for="requirement in filteredItems" v-bind:data="data" v-bind:requirement="requirement"
                  v-bind:key="'req'+requirement[0]"></BrowserRow>

    </md-table>
    <md-empty-state v-else
                    md-description="There are no requirements available with your selection"
                    md-icon="highlight_off"
                    md-label="No requirements available"
                    md-rounded>
    </md-empty-state>

  </div>
</template>

<script>

import BrowserRow from "./BrowserRow";

export default {
  name: "BrowserTable",
  components: {
    BrowserRow
  },
  props: {
    data: Object
  },
  data: function () {
    return {
      requirementCategoryFilter: [],
      search: ''
    }
  },
  computed: {
    filteredItems() {
      let r = new Map()
      for (let [key, value] of this.data.requirementSkeletons) {
        if (this.search === '' || value.description.includes(this.search.toLowerCase())) {
          r.set(key, value);
        }
      }
      this.$emit('update-found-count', r.size);
      return r;
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>