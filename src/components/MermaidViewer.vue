<template lang="pug">
  div#mermaid-viewer
    .row
      q-toolbar(color="light")
        q-toolbar-title(style="color: #777777") Flowchart
        slot
        q-btn(@click="zoomFull" flat icon="zoom_out_map" color="faded")
        q-btn(@click="zoomDemographics" flat icon="people" color="faded")
        q-btn(@click="zoomKnownOnset" flat icon="timer" color="faded")
        q-btn(@click="zoomLate" flat icon="timer_off" color="faded")
        q-toggle(v-model="wheelZoom" icon="zoom_in")
    .row
      .mermaid#mermaid
</template>

<script>
import { animate, easing, debounce, QToolbar, QToolbarTitle, QIcon, QBtn, QRadio, QCheckbox, QToggle } from 'quasar'
import mermaid from 'mermaid'
import svgPanZoom from 'svg-pan-zoom'

export default {
  name: 'mermaid-viewer',
  components: {
    QToolbar, QToolbarTitle, QIcon, QBtn, QRadio, QCheckbox, QToggle
  },
  props: [ 'source' ],
  data () {
    return {
      wheelZoom: false,
      // svgActive: false,
      // svgHovered: false,
      graphCounter: 0,
      pan: {x: 0, y: 0},
      zoom: 0,
      svgChart: undefined
    }
  },
  watch: {
    source: function () {
      this.renderm()
    },
    wheelZoom: function () {
      this.wheelZoom ? this.svgChart.enableMouseWheelZoom() : this.svgChart.disableMouseWheelZoom()
    }
  },
  mounted () {
    mermaid.initialize({
      startOnLoad: false,
      flowchart: {
        htmlLabels: true
      }
    })
  },
  methods: {
    svgAnimate: function (zoomTo, panTo) {
      var zoomFrom = this.svgChart.getZoom()
      var panFrom = this.svgChart.getPan()
      var self = this
      animate.start({
        from: 1,
        to: 100,
        easing: easing.standard,
        duration: 500,
        apply (pos) {
          self.svgChart.zoom(zoomFrom + (zoomTo - zoomFrom) * pos / 100)
          self.svgChart.pan({
            x: panFrom.x + (panTo.x - panFrom.x) * pos / 100,
            y: panFrom.y + (panTo.y - panFrom.y) * pos / 100
          })
        }
      })
    },
    zoomFull: function () {
      this.svgAnimate(1, {x: -5, y: 8})
    },
    zoomDemographics: function () {
      this.svgAnimate(2.6, {x: -1321, y: 13})
    },
    zoomKnownOnset: function () {
      this.svgAnimate(1.56, {x: 122, y: -607})
    },
    zoomLate: function () {
      this.svgAnimate(1.35997, {x: -173, y: -595})
    },
    renderm: debounce(function () {
      var mermaidNode = document.getElementById('mermaid')
      this.graphCounter = this.graphCounter + 1
      mermaid.render('mermaid' + this.graphCounter, this.source, (svgCode, bindFunctions) => {
        mermaidNode.innerHTML = svgCode
      })
      var svgNode = document.getElementById('mermaid' + this.graphCounter)
      svgNode.setAttribute('width', '100%')

      if (this.svgChart) { // save zoom and pan states
        this.zoom = this.svgChart.getZoom()
        this.pan = this.svgChart.getPan()
      }

      var self = this

      this.svgChart = svgPanZoom('#mermaid' + this.graphCounter, {
        controlIconsEnabled: true,
        mouseWheelZoomEnabled: this.wheelZoom,
        customEventsHandler: {
          init: function (options) {
            this.listeners = {
              // click: function () {
              //   if (this.svgActive) {
              //     options.instance.disableMouseWheelZoom()
              //     self.svgActive = false
              //   }
              //   else {
              //     options.instance.enableMouseWheelZoom()
              //     self.svgActive = true
              //   }
              //   updateSvgClassName()
              // },
              // mouseenter: function () {
              //   self.svgHovered = true
              //   updateSvgClassName()
              // },
              // mouseleave: function () {
              //   self.svgActive = false
              //   self.svgHovered = false
              //   options.instance.disableMouseWheelZoom()
              //   updateSvgClassName()
              // },
              wheel: function (evt) {
                if (!self.wheelZoom) {
                  if (evt.deltaY > 0) {
                    if (options.instance.getPan().y > -500) {
                      options.instance.panBy({x: 0, y: -20})
                    }
                  }
                  else if (evt.deltaY < 0) {
                    if (options.instance.getPan().y < 500) {
                      options.instance.panBy({x: 0, y: 20})
                    }
                  }
                  evt.preventDefault()
                }
              }
            }
            // this.listeners.mousemove = this.listeners.mouseenter
            for (var eventName in this.listeners) {
              options.svgElement.addEventListener(eventName, this.listeners[eventName])
            }
          }, // init
          destroy: function (options) {
            for (var eventName in this.listeners) {
              options.svgElement.removeEventListener(eventName, this.listeners[eventName])
            }
          } // destroy
        } // custom events handler
      }) // svgPanZoom init

      if (this.graphCounter > 1) {
        this.svgChart.zoom(this.zoom)
        this.svgChart.pan(this.pan)
      }
    }, 300)
  }
}
</script>

<style>
.mermaid {
  width: 100%;
  height: 900px;
}
</style>
