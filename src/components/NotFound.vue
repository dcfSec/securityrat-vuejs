<template>
  <div>
    <md-empty-state class="marginTop"
                    md-rounded
                    md-icon="search_off"
                    md-label="(ノ ゜Д゜)ノ ︵ ┻━┻"
                    md-description="That link does not exist">
    </md-empty-state>
  </div>
</template>

<script>
export default {
  name: "NotFound"
}
</script>

<style scoped>
.marginTop {
  margin-top: 1em;
}
</style>