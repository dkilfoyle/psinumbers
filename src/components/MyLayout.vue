<template lang="pug">
  .layout-padding
    .row.md-gutter
      .col-sm-4
        q-scroll-area(style="height: calc(100vh - 114px);"  :thumb-style="{ left: '0px', width: '5px' }")
          slot(name="settings")
      .col-sm-8
        q-tabs(color="secondary" style="height: calc(100vh - 114px);")
          q-tab(default name="graph" slot="title" label="Flowchart")
          q-tab(name="table" slot="title" label="Table")
          q-tab-pane(name="table")
            q-scroll-area(style="height: 73vh; padding:10px;"  :thumb-style="{ left: '0px', width: '5px' }")
              .row.justify-center
                slot(name="table")
          q-tab-pane(name="graph")
            slot(name="graph")
</template>

<script>
import { QTabs, QTabPane, QTab, QScrollArea, QTooltip, QToolbar, QToolbarTitle, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QCard, QCollapsible, QBtn, QInput, QSlider, QField, QSelect, QRadio, QCheckbox } from 'quasar'

export default {
  name: 'my-layout',
  components: {
    QTabs, QTabPane, QTab, QScrollArea, QTooltip, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCard, QCollapsible, QSelect, QRadio, QCheckbox
  },
  data () {
    return {
    }
  }
}
</script>

<style>
.layout-padding {
  padding: 2em 2em;
}
</style>
