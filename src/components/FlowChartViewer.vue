<template lang="pug">
  div.flowchartviewer
    .row
      .col-1.justify-center
        q-btn(@click="fit()" flat color="faded")
          q-icon(name="zoom_out_map")
          q-tooltip(anchor="center right" self="center left" :offset="[10, 10]") Zoom out full
        div(v-for="(item, index) in presets")
          q-btn(@click="presetZoomPan(index)" flat color="faded")
            q-icon(:name="item.icon")
            q-tooltip(anchor="center right" self="center left" :offset="[10, 10]") {{ item.label }}
      .col
        .flowchart(:id="flowchartId")
    q-resize-observable(@resize="onResize")
</template>

<script>
import { QPopover, QResizeObservable, QToolbar, QToolbarTitle, QIcon, QBtn, QRadio, QCheckbox, QToggle, QTooltip } from 'quasar'
import vis from 'vis'

export default {
  name: 'flow-chart',
  components: {
    QPopover, QResizeObservable, QToolbar, QToolbarTitle, QIcon, QBtn, QRadio, QCheckbox, QToggle, QTooltip
  },
  props: [ 'title', 'flowchartData', 'presets' ],
  data () {
    return {
      flowchartObject: undefined
    }
  },
  computed: {
    flowchartId: function () { return 'flowchart' + this.title }
  },
  mounted () {
    this.renderFlowchart(false)
  },
  watch: {
    flowchartData: function () { this.renderFlowchart(true) }
  },
  methods: {
    onResize: function () {
      this.renderFlowchart(false)
    },
    renderFlowchart: function (bPreservePanZoom) {
      var container = document.getElementById(this.flowchartId)
      if (container === null) return // catch resize events when the tab is changed to table
      var nodes = new vis.DataSet(this.flowchartData.nodes)
      var edges = new vis.DataSet(this.flowchartData.edges)

      var data = {
        nodes: nodes,
        edges: edges
      }
      var options = {
        layout: {
          hierarchical: {
            enabled: true,
            levelSeparation: 100,
            nodeSpacing: 175
          }
        },
        nodes: {
          font: { multi: 'md' },
          shape: 'box'
        },
        edges: {
          scaling: {
            label: false,
            min: 1,
            max: 10
          },
          font: {
            background: '#eeeeee'
          },
          arrows: {
            to: {enabled: true, scaleFactor: 0.5, type: 'arrow'}
          }
        },
        groups: {
          norm: {
            color: {
              border: '#5d99c6',
              background: '#90caf9',
              highlight: {
                background: '#c3fdff',
                border: '#90caf9'
              }
            }
          },
          out: {
            color: {
              border: '#ba6b6c',
              background: '#ef9a9a',
              highlight: {
                background: '#ffcccb',
                border: '#ef9a9a'
              }
            }
          },
          end: {
            color: {
              background: '#c5e1a5',
              border: '#94af76',
              highlight: {
                border: '#c5e1a5',
                background: '#d7ffd9'
              }
            },
            shape: 'ellipse'
          },
          late: {
            color: {
              background: '#ffcc80',
              border: '#ca9b52',
              highlight: {
                border: '#ffcc80',
                background: '#ffffb0'
              }
            }
          }
        },
        interaction: {
          dragNodes: false,
          navigationButtons: true
        },
        manipulation: { enabled: false },
        physics: {
          enabled: false
        }
      }

      var viewportPosition
      var scale
      if (bPreservePanZoom) {
        viewportPosition = this.flowchartObject.getViewPosition()
        scale = this.flowchartObject.getScale()
      }

      this.flowchartObject = new vis.Network(container, data, options)

      if (bPreservePanZoom) {
        this.flowchartObject.moveTo({
          position: viewportPosition,
          scale: scale,
          animation: false
        })
      }
    },
    fit: function () {
      this.flowchartObject.fit({animation: true})
    },
    presetZoomPan: function (i) {
      this.flowchartObject.fit({nodes: this.presets[i].nodes, animation: true})
      // var x = this.presets[i]
      // this.svgAnimate(x.zoom, {x: x.x, y: x.y})
    }
  }
}
</script>

<style>
.flowchart {
  width: 100%;
  height: calc(100vh - 215px);
}

</style>
