<template>
  <md-table-row>
    <md-table-cell>
      <template class="md-dense md-raised md-primary marginLeftZero"
                v-for="collectionInstance in orderBy(requirement.collectionInstances, 'showOrder')">
        <md-button
            v-if="selectedCollections.length === 0 || (selectedCollections.length !== 0 && selectedCollections.includes(collectionInstance.id))"
            class="md-dense md-raised md-primary marginLeftZero"
            v-bind:key="'req'+requirement.id+'col'+collectionInstance.id">
          {{ collectionInstance.name }}
        </md-button>
      </template>
    </md-table-cell>
    <md-table-cell> {{ requirement.shortName }}</md-table-cell>
    <md-table-cell>
      <vue-markdown :source="requirement.description"></vue-markdown>
    </md-table-cell>
    <md-table-cell v-for="optionColumn in orderBy(projectType.optionColumns, 'showOrder')"
                   v-bind:key="'req'+requirement.id+'headOpt'+optionColumn.id">{{
        findContent(requirement, optionColumn)
      }}
    </md-table-cell>
    <md-table-cell v-for="statusColumn in orderBy(projectType.statusColumns, 'showOrder')"
                   v-bind:key="'req'+requirement.id+'headStatus'+statusColumn.id"
                   v-model="status[requirement.id][statusColumn.id]">
      <template v-if="statusColumn.isEnum === true">
        <md-field>
          <label>{{ statusColumn.name }}</label>
          <md-select v-bind:key="'req'+requirement.id+'headStatus'+statusColumn.id"
                     v-model="status[requirement.id][statusColumn.id]"
                     v-bind:name="'req'+requirement.id+'headStatus'+statusColumn.id"
                     v-bind:id="'req'+requirement.id+'headStatus'+statusColumn.id"
                     @md-selected="statusChanged(requirement.id, statusColumn.id)">
            <md-option v-for="statusColumnValue in statusColumn.values" v-bind:value="statusColumnValue.name"
                       v-bind:key="'req'+requirement.id+'headStatus'+statusColumn.id+'o'+statusColumnValue.id">
              {{ statusColumnValue.name }}
            </md-option>
          </md-select>
        </md-field>
      </template>
      <template v-else>
        <md-field>
          <label>{{ statusColumn.name }}</label>
          <md-textarea v-bind:key="'status'+requirement.id+'-'+statusColumn.id"
                       v-model.lazy="status[requirement.id][statusColumn.id]"
                       @change="statusChanged(requirement.id, statusColumn.id)"></md-textarea>
        </md-field>
      </template>
    </md-table-cell>
    <md-table-cell>
      <md-checkbox v-bind:key="'reqCheck'+requirement.id" v-model="requirement.selected"
                   @change="updateCheckbox(requirement.selected)"></md-checkbox>
    </md-table-cell>
  </md-table-row>
</template>

<script>
import VueMarkdown from "vue-markdown-render";
import Vue2Filters from 'vue2-filters'

export default {
  name: "RequirementsRow",
  components: {
    VueMarkdown
  },
  mixins: [Vue2Filters.mixin],
  props: {
    requirement: Object,
    selectedCollections: Array,
    projectType: Object,
    status: Object,

  },
  methods: {
    updateCheckbox(status) {
      this.$emit('update-selected-count', status);
    },
    findContent(item, index) {
      let found = ""
      item.optionColumnContents.forEach(function (item) {
        if (item["optionColumnId"] === index['id']) {
          found = item["content"]
        }
      });
      return found
    },
    statusChanged(requirementId, statusColumnId) {
      this.$emit('update-req-status', {'reqId': requirementId, 'statusId': statusColumnId});
    }
  }
}
</script>

<style scoped>

.marginLeftZero {
  margin-left: 0px;
}

</style>