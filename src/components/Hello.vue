<template lang="pug">
  q-layout(ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}")
    q-toolbar(slot="header" class="glossy")
      q-btn.flat(@click="$refs.layout.toggleLeft()")
        q-icon(name="menu")
      q-toolbar-title PSI
        div(slot="subtitle") Running on Quasar v{{$q.version}}
    q-btn(@click="renderm") render
    .mermaid#mermaid {{ graph }}

</template>

<script>
import { QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QListHeader, QItem, QItemSide, QItemMain, QSideLink } from 'quasar'
import mermaid from 'mermaid'
import graphsrc from './graph.mmd'

export default {
  name: 'index',
  components: {
    QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QListHeader, QItem, QItemSide, QItemMain, QSideLink
  },
  data () {
    return {
      graph: graphsrc
    }
  },
  mounted () {
    mermaid.initialize({
      startOnLoad: true
    })
  },
  methods: {
    renderm: function (e) {
      var mermaidNode = document.getElementById('mermaid')
      // prevent mermaid skip rendering
      mermaidNode.removeAttribute('data-processed')
      mermaidNode.replaceChild(document.createTextNode(this.graph + '\nB-->C'), mermaidNode.firstChild)
      mermaid.init(undefined, mermaidNode)
    }
  }
}
</script>

<style lang="stylus">

</style>
