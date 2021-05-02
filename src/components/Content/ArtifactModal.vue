<template>
  <md-dialog :md-active.sync="show">
    <md-dialog-title>Artifact Settings</md-dialog-title>
    <form novalidate @submit.prevent="submitArtifact">
      <md-dialog-content class="minWidth">

        <md-field md-clearable :class="nameErrorClass">
          <label>Name of the artifact</label>
          <md-input v-model="selection.name" required></md-input>
          <span class="md-error" v-if="formError.name === true">Insert a valid name</span>
        </md-field>

        <h5 class="md-headline">Artifact Properties:</h5>
        <md-field v-for="item in collections" v-bind:key="item.id">
          <label>{{ item.name }}</label>
          <md-select v-model="selection.collections" name="collections" id="collections" multiple>
            <md-option v-for="i in orderBy(item.collectionInstances, 'showOrder')" :value="i.id" v-bind:key="i.id">
              {{ i.name }}
            </md-option>
          </md-select>
        </md-field>

        <h5 class="md-headline">Implementation:</h5>
        <md-field :class="projectTypeErrorClass">
          <label>Implementation Type</label>
          <md-select v-model="selection.projectType" name="projectTypes" id="projectTypes"
                     @md-selected="validateProjectType" required>
            <md-option v-for="item in projectTypes" v-bind:key="'p'+item.id" v-bind:value="item.id">{{ item.name }}
            </md-option>
          </md-select>
          <span class="md-error" v-if="formError.projectType === true">Select a project type</span>
        </md-field>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="close()">Close</md-button>
        <md-button type="submit" class="md-primary">Generate</md-button>
      </md-dialog-actions>
    </form>
  </md-dialog>
</template>

<script>
import Vue from 'vue'
import Vue2Filters from 'vue2-filters'

Vue.use(Vue2Filters)
export default {
  name: "ArtifactModal",
  props: {
    show: Boolean,
    collections: Array,
    projectTypes: Array,
    selection: Object
  },
  mixins: [Vue2Filters.mixin],
  data: function () {
    return {
      formError: {
        projectType: false,
        name: false
      }
    }
  },
  computed: {
    projectTypeErrorClass() {
      return {
        'md-invalid': this.formError.projectType
      }
    },
    nameErrorClass() {
      return {
        'md-invalid': this.formError.name
      }
    }
  },
  methods: {
    submitArtifact() {
      this.validateProjectType();
      this.validateName();
      if (this.formError.projectType || this.formError.name) {
        return false;
      }
      const today = new Date();
      this.selection.date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

      this.$emit('update-show-define-dialog', false);
      this.$emit('confirm-form', true);
    },
    validateProjectType() {
      let inProjectTypes = false;
      let selected = this.selection.projectType
      if (this.selection.projectType === undefined) {
        this.formError.projectType = true;
      }
      this.projectTypes.forEach(function (item) {
        if (selected === item.id) {
          inProjectTypes = true;
        }
      });
      this.formError.projectType = inProjectTypes !== true;
    },
    validateName() {
      this.formError.name = (this.selection.name === undefined || this.selection.name.length < 3);
    },
    close() {
      this.$emit('close-modal', true)
    }
  },
}
</script>

<style scoped>
.minWidth {
  min-width: 50em;
}
</style>