<template lang="pug">
  .layout-padding
    .row.lg-gutter.items-center.justify-end
      .col-4
        img(src="../assets/nz-dhbs.jpg" class="responsive")
      .col-8
        h3 Hyperacute Stroke Intervention Estimator
    .row
      q-card.full-width
        q-card-main
          | Select the intervention of interest from the menu at left.
</template>

<script>
import { QSlideTransition, QCard, QLayout, QToolbar, QToolbarTitle, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QCardMain, QCollapsible, QBtn, QInput, QSlider, QField, QSelect, QRadio, QCheckbox } from 'quasar'

export default {
  name: 'title-page',
  components: {
    QSlideTransition, QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCard, QCardMain, QCollapsible, QSelect, QRadio, QCheckbox
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
