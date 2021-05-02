<template>
  <md-table-row>
    <md-table-cell> {{ data.requirementCategories.get(requirement[1].category).name }}</md-table-cell>
    <md-table-cell> {{ requirement[1].shortName }}</md-table-cell>
    <md-table-cell>
      <vue-markdown :source="requirement[1].description"></vue-markdown>
    </md-table-cell>
    <md-table-cell><p v-for="[i, k, v]  in getMergedTagInstances(requirement[1].tagInstances)"
                      v-bind:key="'req'+requirement[0]+'t'+i"><span class="b">{{ k }}</span>: {{ v }} </p>
    </md-table-cell>
    <md-table-cell><p v-for="[i, k, v]  in getMergedCollectionInstances(requirement[1].collectionInstances)"
                      v-bind:key="'req'+requirement[0]+'i'+i"><span class="b">{{ k }}</span>: {{ v }} </p>
    </md-table-cell>
    <md-table-cell><p v-for="projectTypeId in requirement[1].projectTypes" v-bind:key="projectTypeId">
      {{ data.projectTypes.get(projectTypeId).name }} </p></md-table-cell>
  </md-table-row>
</template>

<script>
import VueMarkdown from "vue-markdown-render";

export default {
  name: "BrowserRow",
  components: {
    VueMarkdown
  },
  props: {
    data: Object,
    requirement: Array
  },
  data: function () {
    return {}
  },
  methods: {
    getMergedCollectionInstances(collectionInstanceIDs) {
      let collections = new Map()
      const data = this.data
      collectionInstanceIDs.forEach(function (id) {
        let collection = data.collectionInstances.get(id)
        if (collections.has(collection.category)) {
          let l = collections.get(collection.category)
          l.push(collection.name)
          collections.set(collection.category, l)
        } else {
          collections.set(collection.category, [collection.name])
        }
      })
      let r = []
      collections.forEach(function (value, key) {
        r.push([key, data.collectionCategories.get(key).name, value.join(', ')])
      })
      return r
    },
    getMergedTagInstances(tagInstanceIDs) {
      let tags = new Map()
      const data = this.data
      tagInstanceIDs.forEach(function (id) {
        let tag = data.tagInstances.get(id)
        if (tags.has(tag.category)) {
          let l = tags.get(tag.category)
          l.push(tag.name)
          tags.set(tag.category, l)
        } else {
          tags.set(tag.category, [tag.name])
        }
      })
      let r = []
      tags.forEach(function (value, key) {
        r.push([key, data.tagCategories.get(key).name, value.join(', ')])
      })
      return r
    },
  }
}
</script>

<style scoped>
.b {
  font-weight: bold;
}
</style>