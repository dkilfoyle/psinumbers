<template lang="pug">
  q-layout(ref="layout" v-model="sides" view="hHh Lpr fff" :left-class="{'bg-grey-2': true}")
    q-toolbar(slot="header" class="glossy")
      q-btn.flat(@click="$refs.layout.toggleLeft()")
        q-icon(name="menu")
      q-toolbar-title Hyperacute Stroke Treatment Estimator
        div(slot="subtitle") Adapted from McMeekin et al. ESJ 2017; 24(3): 319-326

    div(slot="left")
      q-list(no-border link)
        q-list-header Menu
        q-side-link(item to="/PSI")
          q-item-side(icon="local_parking")
          q-item-main(label="PSI" sublabel="Percutaneous Clot Retrieval")
          q-item-side(right icon="chevron_right")
        q-side-link(item to="/IVT")
          q-item-side(icon="info")
          q-item-main(label="IVT" sublabel="Intravenous Thrombolysis")
          q-item-side(right icon="chevron_right")
        q-side-link(item to="/Diversion")
          q-item-side(icon="local_hospital")
          q-item-main(label="Diversion" sublabel="Ambulance Diversion")
          q-item-side(right icon="chevron_right")

    router-view.layout-view
</template>

<script>
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QSideLink
} from 'quasar'

export default {
  name: 'home',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QSideLink
  },
  data () {
    return {
      sides: {
        left: true,
        right: false
      }
    }
  }
}
</script>

<style lang="stylus">

</style>