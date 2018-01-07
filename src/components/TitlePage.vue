<template lang="pug">
  .layout-padding
    .row.lg-gutter.items-center.justify-center
      .col-3
        img(src="../assets/nz-dhbs.jpg" class="responsive")
      .col-3(style="text-align: center")
        h3 Hyperacute Stroke
        h4 Intervention Estimator
    .row.lg-gutter.items-center.justify-center
      .col-8
        q-card.full-width(color="secondary")
          q-card-main(style="text-align: center;")
            h6 Select the intervention of interest from the menu at left.
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
