<template>
  <div>
    <md-card>
      <md-card-header>
        <div class="md-title">Requirements for {{ general.name }}</div>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-alignment-center-left">
          <div class="md-layout-item flexNoGrow">
            <md-button class="md-raised" @click="showSettings = true">Artifact Settings</md-button>
          </div>
          <div class="md-layout-item flexNoGrow">
            <md-menu md-size="medium" md-align-trigger v-if="selectedRequirementsCount > 0">
              <md-button md-menu-trigger class="md-raised">Action with selected</md-button>

              <md-menu-content>
                <md-menu-item>
                  <md-button :md-ripple="false" v-on:click="buildXLSXExportData()">
                    <md-icon>table_chart</md-icon>
                    <span class="spaceLeft">Create XLSX file</span></md-button>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </div>
        <p>{{ foundRequirementCount }} Requirements found <span
            v-if="selectedRequirementsCount > 0">and {{ selectedRequirementsCount }} selected</span></p>


        <div class="md-layout md-alignment-center-left">
          <div class="md-layout-item flexNoGrow">
            <md-field>
              <label>Category Filter</label>
              <md-select v-model="requirementCategoryFilter" name="requirementCategoryFilter"
                         id="requirementCategoryFilter" multiple>
                <md-option v-for="requirementCategory in orderBy(requirements, 'showOrder')"
                           :value="requirementCategory.id" v-bind:key="requirementCategory.id">
                  {{ requirementCategory.name }}
                </md-option>
              </md-select>
            </md-field>
          </div>
          <div class="md-layout-item flexNoGrow">
          </div>
        </div>

        <RequirementsTable v-bind:projectType="projectType" v-bind:requirements="requirements"
                           v-bind:name="general.name" v-bind:selection="selection"
                           v-bind:requirementCategoryFilter="requirementCategoryFilter"
                           @update-selected-count="updateSelectedCount"
                           @update-req-status="updateReqStatus"></RequirementsTable>
        <md-button class="md-fab md-mini md-fixed md-fab-bottom-right" @click.native="scrollToTop()">
          <md-icon>arrow_upward</md-icon>
        </md-button>
      </md-card-content>
    </md-card>

    <md-drawer :md-active.sync="showSettings" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Artifact Settings</span>
      </md-toolbar>

      <md-list class="spacer">
        <md-list-item>
          <span class="md-subheading">Created on:</span> {{ general.date }}
        </md-list-item>
        <md-list-item>
          <span class="md-subheading">Implementation Type:</span> {{ projectType.name }}
        </md-list-item>
      </md-list>

      <md-list>
        <md-list-item v-for="item in orderBy(collections, 'showOrder')" v-bind:key="item.id" md-expand
                      :md-expanded.sync="expand[item.id]">
          <span class="md-subheading lineWrap">{{ item.name }}:</span>
          <md-list slot="md-expand">
            <md-list-item v-for="i in orderBy(item.collectionInstances, 'showOrder')" v-bind:key="i.id">
              {{ i.name }}
            </md-list-item>
          </md-list>
        </md-list-item>
      </md-list>

    </md-drawer>

    <ExcelExport v-bind:show="exportRequirements.xlsx" @close-modal="closeXLSXDialog" ref="excelExport"
                 v-bind:export-data="exportData"></ExcelExport>
  </div>
</template>

<script>
import Vue from 'vue'
import RequirementsTable from "@/components/Content/Requirements/RequirementsTable";
import Vue2Filters from 'vue2-filters'
import ExcelExport from "@/components/Exporter/ExcelExport";

Vue.use(Vue2Filters)

export default {
  name: "Requirements",
  mixins: [Vue2Filters.mixin],
  props: {
    general: Object,
    selection: Object,
    projectType: Object,
    collections: Array,
    requirements: Array
  },
  data: function () {
    return {
      showSettings: false,
      expand: {},
      selectedRequirementsCount: 0,
      requirementStatus: {},
      requirementCategoryFilter: [],
      exportRequirements: {
        xlsx: false
      },
      exportData: {name: ""}
    }
  },
  computed: {
    foundRequirementCount: function () {
      return this.computeFoundRequirements()
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    },
    updateSelectedCount(v) {
      this.selectedRequirementsCount = v;
    },
    updateReqStatus(data) {
      if (!(data['reqId'] in this.requirementStatus)) {
        this.requirementStatus[data['reqId']] = {}
      }
      this.requirementStatus[data['reqId']][data['statusId']] = data['value']
    },
    computeFoundRequirements() {
      let foundRequirementCount = 0
      let requirements = this.requirements
      this.requirements.forEach(function (item, index) {
        if (item.requirements.length > 0) {
          item.requirements.forEach(function (i, iindex) {
            foundRequirementCount++;
            requirements[index].requirements[iindex]["selected"] = false
          });
        }
      });
      this.requirements = requirements
      return foundRequirementCount
    },
    buildXLSXExportData() {
      this.exportData["name"] = this.general.name;
      let headers = [
        "Properties",
        "Short Name",
        "Description",
      ];
      let optionColumnsOrder = [];
      let statusColumnsOrder = [];
      let validators = [];
      this.projectType['optionColumns'].sort((a, b) => a.showOrder - b.showOrder).forEach(function (item) {
        headers.push(item.name);
        optionColumnsOrder.push(item.id);
      });
      this.projectType['statusColumns'].sort((a, b) => a.showOrder - b.showOrder).forEach(function (item) {
        headers.push(item.name);
        statusColumnsOrder.push(item.id);
        validators.push(item);
      });

      let requirements = [];

      this.requirements.forEach(function (item) {
        item.requirements.forEach(function (i) {
          if (i.selected === true) {
            requirements.push(i);
          }
        });
      });

      this.exportData["header"] = headers;
      this.exportData["statusData"] = this.requirementStatus;
      this.exportData["requirements"] = requirements;
      this.exportData["optionColumnsOrder"] = optionColumnsOrder;
      this.exportData["statusColumnsOrder"] = statusColumnsOrder;
      this.exportData["validators"] = validators;
      this.exportRequirements.xlsx = true;
      this.$refs.excelExport.show();
    },
    closeXLSXDialog() {
      this.exportData = {};
      this.exportRequirements.xlsx = false;
    }
  },
  components: {ExcelExport, RequirementsTable}
}
</script>

<style scoped>
.lineWrap {
  white-space: pre-wrap;
}

.spaceLeft {
  margin-left: 1em;
}

.spacer {
  margin-bottom: 3em;
}

.flexNoGrow {
  flex: 0 0;
}
</style>