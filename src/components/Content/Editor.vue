<template>
  <div>
    <div v-if="$route.path === '/editor'" class="md-layout md-alignment-top-center">
      <div class="md-layout-item md-size-25 md-xsmall-hide md-small-hide"></div>
      <div class="md-layout-item md-size-50">
        <md-card class="md-layout-item md-size-50 md-small-size-100">
          <md-card-header>
            <div class="md-title">Welcome to SecurityRAT</div>
          </md-card-header>

          <md-card-content>
            <div class="center">
              <p>Please select what you want to do:</p>
              <div>
                <md-button @click="loadShowDefineDialog" class="md-raised md-primary">Define a new artifact</md-button>
              </div>
              <div>
                <md-button class="md-raised md-primary">Import an artifact</md-button>
              </div>
            </div>
          </md-card-content>
        </md-card>

      </div>
    </div>
    <Requirements v-else-if="$route.path === '/requirements'" v-bind:projectType="selectedProjectType"
                  v-bind:requirements="filteredRequirements" v-bind:general="general"
                  v-bind:collections="selectedCollections" v-bind:selection="selection"></Requirements>

    <ArtifactModal v-bind:show="showDefineDialog" v-bind:collections="collections" v-bind:projectTypes="projectTypes"
                   v-bind:selection="selection" @update-show-define-dialog="updateShowDefineDialog"
                   @close-modal="closeDefineDialog"
                   @confirm-form="confirmDefineForm"></ArtifactModal>
  </div>
</template>

<script>
import ArtifactModal from "@/components/Content/ArtifactModal";
import Requirements from "@/components/Content/Requirements";
import {Requirement, RequirementCategory, CollectionInstance, OptionColumnContents} from "@/components/Data/objects.mjs"

export default {
  name: "Editor",
  components: {Requirements, ArtifactModal},
  props: {
    pageState: Object
  },
  data: function () {
    return {
      showDefineDialog: false,
      collections: [],
      projectTypes: [],
      selection: {
        collections: null,
        name: null,
        projectType: null
      },
      selectedProjectType: {},
      selectedCollections: [],
      filteredRequirements: []
    }
  },
  computed: {
    general() {
      return {
        name: this.selection.name,
        date: this.selection.date,
      }
    }
  },
  created() {
  },
  methods: {
    updateShowDefineDialog(val) {
      this.showDefineDialog = val
    },
    loadShowDefineDialog() {
      this.selection = {}
      this.selectedProjectType = {}
      this.filteredRequirements = []
      this.getCollections()
      this.getProjectTypes()
      this.showDefineDialog = true
    },
    closeDefineDialog() {
      this.showDefineDialog = false
    },
    confirmDefineForm() {
      this.getArtifacts()
    },
    async getArtifacts() {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        const {data} = await this.$http.get(
            this.pageState.apiURL + 'frontend-api/categoriesWithRequirements/filter',
            {
              params: {'collections': this.selection.collections.join(","), 'projectTypes': this.selection.projectType},
              withCredentials: true
            }
        );

        let searchProjectType = this.selection.projectType
        let projectType = {}

        this.projectTypes.forEach(function (item) {
          if (item.id === searchProjectType) {
            projectType = item;
          }
        });

        let searchCollections = this.selection.collections
        let collectionsSelected = []
        this.collections.forEach(function (item) {
          let ii = []
          item.collectionInstances.forEach(function (i) {
            if (searchCollections.includes(i.id)) {
              ii.push(i)
            }
          });
          if (ii.length > 0) {
            item['collectionInstances'] = ii
            collectionsSelected.push(item);
          }
        });

        let filteredRequirements = []

        data.forEach(function (item) {

          let requirements = []
          item['requirements'].forEach(function (iItem) {
            let collectionInstances = []
            iItem['collectionInstances'].forEach(function (iiItem) {
              collectionInstances.push(new CollectionInstance(iiItem['id'], iiItem['name'], iiItem['description'], iiItem['showOrder']))
            });
            let optionColumnContents = []
            iItem['optionColumnContents'].forEach(function (iiItem) {
              optionColumnContents.push(new OptionColumnContents(iiItem['id'], iiItem['optionColumnId'], iiItem['content'], iiItem['optionColumnName']))
            });
            requirements.push(new Requirement(iItem['id'], iItem['shortName'], iItem['universalId'], iItem['description'], iItem['showOrder'], optionColumnContents, iItem['tagInstanceIds'], collectionInstances))
          });
          let list = new RequirementCategory(item['id'], item['name'], item['description'], item['shortcut'], item['showOrder'], true, requirements)
          list.requirements.sort((a, b) => a.showOrder - b.showOrder)
          filteredRequirements.push(list)
        });

        filteredRequirements.sort((a, b) => a.showOrder - b.showOrder)

        this.selectedCollections = collectionsSelected
        this.selectedProjectType = projectType;
        this.filteredRequirements = filteredRequirements
        await this.$router.push({path: 'requirements'})

      } catch (err) {
        console.log(err)
        if ("error" in err.response.data && "message" in err.response.data) {
          this.pageState.snackBarMessage = "Failed to load collections: \n" + err.response.data.error + ": " + err.response.data.message
        } else {
          this.pageState.snackBarMessage = "Failed to load collections: " + err
        }
        this.pageState.hasError = true;
        this.pageState.openSnackbar = true;
      } finally {
        this.pageState.isLoading = false;
      }
    },
    async getCollections() {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        const {data} = await this.$http.get(
            this.pageState.apiURL + 'frontend-api/collections',
            {withCredentials: true,}
        );
        this.collections = data

      } catch (err) {
        this.pageState.isError = true;
        this.pageState.snackBarMessage = "Failed to load collections: " + err
      } finally {
        this.pageState.isLoading = false;
      }
      //TODO: Add initial call to account to check if user is already logged in
    },
    async getProjectTypes() {
      try {
        this.pageState.isLoading = true; //TODO: Add loading spinner
        const {data} = await this.$http.get(
            this.pageState.apiURL + 'frontend-api/projectTypes',
            {withCredentials: true,}
        );
        this.projectTypes = data
        if (data.length === 0) {
          this.selection.projectType = data[0].id
        }
      } catch (err) {
        this.pageState.isError = true;
        this.pageState.snackBarMessage = "Failed to load projectTypes: " + err
      } finally {
        this.pageState.isLoading = false;
      }
      //TODO: Add initial call to account to check if user is already logged in
    },
  }

}
</script>

<style scoped>
.center {
  text-align: center;
}

</style>