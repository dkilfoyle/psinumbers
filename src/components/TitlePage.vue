<template lang="pug">
  .layout-padding
    .row.md-gutter
      .col-12
        q-list
          q-slide-transition
              q-item
                q-item-main
                  h1 Hyperacute Stroke Intervention Estimator
</template>

<script>
import { QSlideTransition, QLayout, QToolbar, QToolbarTitle, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QCard, QCollapsible, QBtn, QInput, QSlider, QField, QSelect, QRadio, QCheckbox } from 'quasar'

export default {
  name: 'title-page',
  components: {
    QSlideTransition, QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCard, QCollapsible, QSelect, QRadio, QCheckbox
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
