<template lang="pug">
  .customParamTable
    h6(style="color:#757575") Custom Parameters
    table.q-table.horizonal-separator.bordered(style="margin-bottom: 20px")
      thead
        tr
          th Parameter
          th Setting
      tbody
        tr
          td DHBs
          td {{ population.dhbs.join(', ') }}
        tr(v-for="param in params" v-if="param.val !== param.default")
          td {{ param.label }}
          td {{ param.val }}
        tr(v-if="Object.values(params).find(x => x.val === x.default) === undefined")
          td No custom parameters
</template>

<script>

export default {
  name: 'custom-param-table',
  components: {
  },
  props: ['params', 'population'],
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
