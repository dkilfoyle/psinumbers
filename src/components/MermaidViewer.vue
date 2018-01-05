<template lang="pug">
  div#mermaid-viewer
    q-btn(color="tertiary" small)
      q-icon(name="zoom_in") 
      q-popover(ref="zoomPopover")
        .div
          q-btn(flat @click="fit(), $refs.zoomPopover.close()")
            q-icon(name="zoom_out_map")
            q-tooltip(anchor="center right" self="center left" :offset="[10, 10]") Zoom out full
          div(v-for="(item, index) in presets")
            q-btn(@click="presetZoomPan(index), $refs.zoomPopover.close()" flat color="faded")
              q-icon(:name="item.icon")
              q-tooltip(anchor="center right" self="center left" :offset="[10, 10]") {{ item.label }}
    .mermaid(:id="'mermaid'+title")
    q-resize-observable(@resize="onResize")
          //- q-toggle(v-model="wheelZoom" icon="zoom_in" color="faded")
          //-   q-tooltip Zoom: Mouse
</template>

<script>
import { animate, easing, debounce, QFixedPosition, QPopover, QResizeObservable, QToolbar, QToolbarTitle, QIcon, QBtn, QRadio, QCheckbox, QToggle, QTooltip } from 'quasar'
import mermaid from 'mermaid'
import svgPanZoom from 'svg-pan-zoom'

export default {
  name: 'mermaid-viewer',
  components: {
    QFixedPosition, QPopover, QResizeObservable, QToolbar, QToolbarTitle, QIcon, QBtn, QRadio, QCheckbox, QToggle, QTooltip
  },
  props: [ 'source', 'title', 'presets', 'maxwidth' ],
  data () {
    return {
      wheelZoom: false,
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
        htmlLabels: true,
        useMaxWidth: this.maxwidth
      }
    })
    this.renderm()
  },
  methods: {
    onResize: function () {
      console.log('resize')
      if (this.svgChart !== undefined) {
        this.svgChart.resize().fit().center()
      }
    },
    logPanZoom: function () {
      console.log(this.svgChart.getZoom())
      console.log(this.svgChart.getPan())
      console.log(this.svgChart.getSizes())
    },
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
          self.svgChart.zoom(zoomFrom + (zoomTo - zoomFrom) * pos / 100, true)
          self.svgChart.pan({
            x: panFrom.x + (panTo.x - panFrom.x) * pos / 100,
            y: panFrom.y + (panTo.y - panFrom.y) * pos / 100
          })
        }
      })
    },
    fit: function () {
      var sizes = this.svgChart.getSizes()
      var newScale = Math.min(sizes.width / sizes.viewBox.width, sizes.height / sizes.viewBox.height)
      var offsetX = (sizes.width - (sizes.viewBox.width + sizes.viewBox.x * 2) * newScale) * 0.5
      var offsetY = (sizes.height - (sizes.viewBox.height + sizes.viewBox.y * 2) * newScale) * 0.5
      this.svgAnimate(1, {x: offsetX, y: offsetY})
    },
    presetZoomPan: function (i) {
      var x = this.presets[i]
      this.svgAnimate(x.zoom, {x: x.x, y: x.y})
    },
    renderm: debounce(function () {
      console.log('renderm')
      var mermaidNode = document.getElementById('mermaid' + this.title)
      this.graphCounter = this.graphCounter + 1
      mermaid.render('mermaid' + this.title + this.graphCounter, this.source, (svgCode, bindFunctions) => {
        mermaidNode.innerHTML = svgCode
      })
      var svgNode = document.getElementById('mermaid' + this.title + this.graphCounter)
      svgNode.setAttribute('width', '100%')
      svgNode.setAttribute('height', '100%')

      if (this.svgChart) { // save zoom and pan states
        this.zoom = this.svgChart.getZoom()
        this.pan = this.svgChart.getPan()
      }

      var self = this

      this.svgChart = svgPanZoom('#mermaid' + this.title + this.graphCounter, {
        controlIconsEnabled: true,
        mouseWheelZoomEnabled: this.wheelZoom,
        beforePan: function (oldPan, newPan) {
          var gutterWidth = 100,
            gutterHeight = 100,
            sizes = this.getSizes(),
            leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
            rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom),
            topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
            bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)
          var customPan = {}
          customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
          customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))
          return customPan
        },
        customEventsHandler: {
          init: function (options) {
            this.listeners = {
              wheel: function (evt) {
                if (!self.wheelZoom) {
                  options.instance.panBy({x: 0, y: -20 * Math.sign(evt.deltaY)})
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
      else {
        this.svgChart.fit().center()
      }
    }, 300)
  }
}
</script>

<style>
.mermaid {
  width: 100%;
  height: 73vh; 
}

.mermaid .label {
  text-align: center;
  padding: 15px 0;
}

.mermaid em {
  font-style: normal;
  font-weight: bold;
}
</style>
