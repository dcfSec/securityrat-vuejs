<template>
  <div>
    <md-table v-if="requirements.length > 0">
      <md-table-toolbar>

      </md-table-toolbar>

      <md-table-row>
        <md-table-head>Properties</md-table-head>
        <md-table-head>Short Name</md-table-head>
        <md-table-head>Description</md-table-head>
        <md-table-head v-for="item in orderBy(projectType['optionColumns'], 'showOrder')"
                       v-bind:key="'headOpt'+item.id">{{ item.name }}
        </md-table-head>
        <md-table-head v-for="item in orderBy(projectType['statusColumns'], 'showOrder')"
                       v-bind:key="'headStatus'+item.id">{{ item.name }}
        </md-table-head>
        <md-table-head>
          <md-checkbox v-model="allSelected" class="marginZero" @change="allSelect()"></md-checkbox>
        </md-table-head>

      </md-table-row>

      <template v-for="(requirementCategory) in requirements">
        <template
            v-if="requirementCategory.requirements.length > 0 && (requirementCategoryFilter.length === 0 || (requirementCategoryFilter.length > 0 && requirementCategoryFilter.includes(requirementCategory.id)))">
          <md-table-row v-bind:key="'reqH'+requirementCategory.id">
            <md-table-head
                class="centered"
                v-bind:colspan="3+projectType.optionColumns.length+projectType.statusColumns.length">
              {{ requirementCategory.name }}
            </md-table-head>
          </md-table-row>
          <RequirementsRow v-for="(i) in requirementCategory.requirements" v-bind:key="'req'+i.id"
                           v-bind:project-type="projectType" v-bind:requirement="i"
                           v-bind:selectedCollections="selection.collections" v-bind:status="status"
                           @update-selected-count="updateCheckbox"
                           @update-req-status="updateReqStatus">
          </RequirementsRow>
        </template>
      </template>

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
import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
import RequirementsRow from "@/components/Content/Requirements/RequirementsRow";

Vue.use(Vue2Filters)
export default {
  name: "RequirementsTable",
  components: {
    RequirementsRow,
  },
  mixins: [Vue2Filters.mixin],
  props: {
    name: String,
    projectType: Object,
    requirements: Array,
    requirementCategoryFilter: Array,
    selection: Object,
  },
  data: function () {
    return {
      selected: {},
      selectedCount: 0,
      status: {},
      allSelected: false
    }
  },
  computed: {},
  created() {
    let selected = {};
    let status = {};
    let statusColumns = this.projectType.statusColumns
    this.requirements.forEach(function (item) {
      item['requirements'].forEach(function (i) {
        status[i.id] = {}
        selected[i.id] = false
        statusColumns.forEach(function (item) {
          status[i.id][item.id] = ""
        });
      });
    });
    this.status = status
    this.selected = selected
  },
  methods: {
    allSelect() {
      let requirements = this.requirements
      let selected = this.selected
      let allSelected = this.allSelected
      let reqCount = this.selectedCount
      this.requirements.forEach(function (item, index) {
        item['requirements'].forEach(function (i, iindex) {
          if (requirements[index]['requirements'][iindex].selected !== allSelected) {
            reqCount = allSelected ? reqCount + 1 : reqCount - 1
          }
          requirements[index]['requirements'][iindex].selected = allSelected
          selected[i.id] = allSelected
        });
      });
      this.selectedCount = reqCount
      this.$emit('update-selected-count', this.selectedCount);
    },
    updateCheckbox(i) {
      this.selectedCount = i ? this.selectedCount + 1 : this.selectedCount - 1
      this.$emit('update-selected-count', this.selectedCount);
    },
    updateReqStatus(data) {
      this.$emit('update-req-status', {
        'reqId': data['reqId'],
        'statusId': data['statusId'],
        'value': this.status[data['reqId']][data['statusId']]
      });

    },
    findContent(item, index) {
      let found = ""
      item["optionColumnContents"].forEach(function (item) {
        if (item["optionColumnId"] === index['id']) {
          found = item["content"]
        }
      });
      return found
    }
  }
}
</script>

<style scoped>
.centered {
  text-align: center;
}

.marginZero {
  margin: 0px;
}
</style>