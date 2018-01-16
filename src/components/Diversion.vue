<template lang="pug">
  my-layout
    div(slot="settings")
      q-list
        q-list-header Diversion Parameters
        q-item-separator

        q-collapsible(group="parameters" label="Demographics" icon="people" separator)
          population-selector(v-model="population")
          q-field(label="Adults %" helper="Proportion of population >= 15y")
            q-slider(v-model="pAdults" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pAdults*100)}%`")
          q-field(label="Stroke Incidence" helper="Number of strokes/100,000 adults /yr")
            q-input(v-model="pIncidence")

        q-collapsible(group="parameters" label="Clinical" icon="favorite" separator)
          q-field(label="Hyper-acute %" helper="% of all strokes that are hyperacute")
            q-slider(v-model="pHyperacute" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pHyperacute*100)}%`")
          q-field(label="After-hours %" helper="% of hyperacute stroke that present after-hours")
            q-slider(v-model="pAfterhours" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pAfterhours*100)}%`")
          q-field(label="PASTA Positive %" helper="% of hyperacute stroke that pass the PASTA screen")
            q-slider(v-model="pPASTAPos" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pPASTAPos*100)}%`")
          q-field(label="Mimics %" helper="Ratio as % of hyperacute stroke that are mimics")
            q-slider(v-model="pMimics" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pMimics*100)}%`")
        q-collapsible(group="parameters" label="Defaults" icon="settings" separator)
          q-btn(@click="resetDefaults()" color="secondary" class="full-width") Reset All

      q-list
        q-list-header Settings
        q-item-separator
        q-collapsible(group="settings" label="Table" icon="view_quilt" separator)
          q-field(label="Divert per 24h day" helper="PSI cases per 24h day")
            q-checkbox(v-model="bDivertperDay")
        q-collapsible(group="settings" label="Populations" icon="local_hospital" separator)
          q-field(:label="dhb.label" v-for="dhb in DHBs" :key="dhb.label")
            q-input(v-model="dhb.n" type="number")

    div(slot="table")
      table.q-table.horizontal-separator
        thead
          tr
            th
            th(v-for="year in tableYears") {{ year }}
        tbody
          tr
            th Diversions
          tr(v-for="dhb in population.dhbs")
            td {{ dhb }}
            td(v-for="year in tableYears") {{ getTotalDivert([dhb], year) }}
          tr
            td Total
            td(v-for="year in tableYears") {{ getTotalDivert(population.dhbs, year) }}
          
          tr(v-if="bDivertperDay")
            th Diversions/Day
          tr(v-if="bDivertperDay" v-for="dhb in population.dhbs")
            td {{ dhb }}
            td(v-for="year in tableYears") {{ getDivertperDay([dhb], year) }}
          tr(v-if="bDivertperDay")
            td Total
            td(v-for="year in tableYears") {{ getDivertperDay(population.dhbs, year) }}
          
    div(slot="graph")
      flow-chart-viewer(title="PSI" :flowchartData="flowchartData" :presets=`[
        { label: 'Zoom: Demographics', icon: 'people', nodes: ['Population', 'Adults', 'Strokes'] },
        { label: 'Zoom: Hyperacute', icon: 'timer', nodes: ['Hyperacute', 'Divert'] },
      ]`)

</template>

<script>
import { Toast, QTooltip, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QCollapsible, QBtn, QInput, QSlider, QField, QSelect, QRadio, QCheckbox } from 'quasar'
import MyLayout from './MyLayout'
import PopulationSelector from './PopulationSelector'
import FlowChartViewer from './FlowChartViewer'
import numeral from 'numeral'
import DHBs from './dhbs.js'

var n = function (mynum) { return numeral(mynum).format('0,0') }
var p = function (mynum) { return numeral(mynum).format('0%') }

export default {
  name: 'ivt',
  components: {
    MyLayout, PopulationSelector, QTooltip, FlowChartViewer, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCollapsible, QSelect, QRadio, QCheckbox
  },
  data () {
    return {
      numeral: numeral,
      bDivertperDay: false,
      bDivertperNight: false,
      tableYears: [2018, 2019, 2020, 2021, 2022],
      population: { regions: ['Metro'], dhbs: ['Auckland', 'Counties Manukau', 'Waitemata'], year: '2018' },
      pAdults: 0.8,
      pIncidence: 192,
      pHyperacute: 0.55,
      pAfterhours: 0.61,
      pPASTAPos: 0.65,
      pMimics: 0.37,
      DHBs: DHBs
    }
  },
  computed: {
    nPopulation: function () { return this.getCalculatedPopulation(this.population.dhbs, this.population.growth, this.population.year) },
    nAdults: function () { return Math.round(this.nPopulation * this.pAdults) },
    nStrokes: function () { return Math.round(this.nAdults * (this.pIncidence / 100000)) },

    nHyperacute: function () { return Math.round(this.nStrokes * this.pHyperacute) },
    pNonacute: function () { return (1.0 - this.pHyperacute) },
    nNonacute: function () { return Math.round(this.nStrokes * this.pNonacute) },

    nAfterhours: function () { return Math.round(this.nHyperacute * this.pAfterhours) },
    pInhours: function () { return (1.0 - this.pAfterhours) },
    nInhours: function () { return Math.round(this.nHyperacute * this.pInhours) },

    nPASTAPos: function () { return Math.round(this.nAfterhours * this.pPASTAPos) },
    pPASTANeg: function () { return (1.0 - this.pPASTAPos) },
    nPASTANeg: function () { return Math.round(this.nAfterhours * this.pPASTANeg) },

    nMimics: function () { return Math.round(this.nPASTAPos * this.pMimics) },
    nDivert: function () { return Math.round(this.nPASTAPos + this.nMimics) },

    flowchartData: function () {
      return {
        nodes: [
          {id: 'Population', label: '*Population*\nN=' + n(this.nPopulation), level: 0, shape: 'ellipse', font: {multi: 'md'}, group: 'end'},
          {id: 'Adults', label: '*Adults*\nN=' + n(this.nAdults), level: 1, group: 0},
          {id: 'Strokes', label: '*Strokes*\nN=' + n(this.nStrokes), level: 2, group: 0},
          {id: 'Hyperacute', label: '*Hyperacute\nN=' + n(this.nHyperacute), level: 3, group: 0},
          {id: 'Nonacute', label: '*Non Acute*\nN=' + n(this.nNonacute), level: 2, group: 'out'},
          {id: 'Afterhours', label: '*Afterhours*\nN=' + n(this.nAfterhours), level: 4},
          {id: 'Inhours', label: '*In hours*\nN=' + n(this.nInhours), level: 3, group: 'out'},
          {id: 'PASTAPos', label: '*PASTA Positive\nN=' + n(this.nPASTAPos), level: 5},
          {id: 'PASTANeg', label: '*PASTA Negative\nN=' + n(this.nPASTANeg), level: 4, group: 'out'},

          {id: 'Mimics', label: '*Mimics*\nN=' + n(this.nMimics), level: 6, x: -50},
          {id: 'Divert', label: '*Divert*\nN=' + n(this.nDivert), level: 6, group: 'end'}
        ],
        edges: [
          {id: 'pAdults', from: 'Population', to: 'Adults', label: 'Adults ' + p(this.pAdults), value: 1.0},
          {id: 'pStrokes', from: 'Adults', to: 'Strokes', label: 'Incidence\n' + this.pIncidence + '/100,000', value: 1.0},
          {id: 'pHyperacute', from: 'Strokes', to: 'Hyperacute', label: p(this.pHyperacute), value: this.pHyperacute},
          {id: 'pNonacute', from: 'Strokes', to: 'Nonacute', label: p(this.pNonacute), value: this.pNonacute},
          {id: 'pAfterhours', from: 'Hyperacute', to: 'Afterhours', label: p(this.pAfterhours), value: this.pAfterhours},
          {id: 'pInhours', from: 'Hyperacute', to: 'Inhours', label: p(this.pInhours), value: this.pInhours},
          {id: 'pPASTAPos', from: 'Afterhours', to: 'PASTAPos', label: p(this.pPASTAPos), value: this.pPASTAPos},
          {id: 'pPASTANeg', from: 'Afterhours', to: 'PASTANeg', label: p(this.pPASTANeg), value: this.pPASTANeg},
          {id: 'pMimics', from: 'PASTAPos', to: 'Mimics', label: p(this.pMimics), value: this.pMimics},
          {id: 'pDivert1', from: 'PASTAPos', to: 'Divert'},
          {id: 'pDivert2', from: 'Mimics', to: 'Divert'}
        ]
      }
    }
  },
  mounted () {
    Toast.create({
      html: 'Click the menu icon in the top left of the toolbar to display the menu',
      icon: 'menu',
      timeout: 5000
    })
  },
  methods: {
    resetDefaults: function () {
      this.population.regions = ['Metro']
      this.population.dhbs = ['Auckland', 'Counties Manukau', 'Waitemata']
      this.population.year = '2018'
      this.pAdults = 0.8
      this.pIncidence = 192
      this.pHyperacute = 0.55
      this.pAfterhours = 0.61
      this.pPASTAPos = 0.65
      this.pMimics = 0.37
    },
    getCalculatedPopulation: function (dhbs, growth, year) {
      var x = 0
      dhbs.forEach(o1 => {
        x = x + this.DHBs.find(o2 => o2.value === o1).n
      })
      x = x * Math.pow(1.0 + (growth / 100), year - 2017)
      return Math.round(x)
    },
    getTotalDivert: function (sPopulations, year) {
      var x = this.getCalculatedPopulation(sPopulations, this.population.growth, year)
      x = x * this.pAdults * (this.pIncidence / 100000) * this.pHyperacute * this.pAfterhours * this.pPASTAPos
      x = x + (x * this.pMimics)
      return Math.round(x)
    },
    getDivertperDay: function (sPopulations, year) {
      return this.numeral(this.getTotalDivert(sPopulations, this.population.growth, year) / 365.0).format('0.0')
    },
    getDivertperNight: function (sPopulations, year) {
      return this.numeral(this.getTotalDivert(sPopulations, this.population.growth, year) / 365.0 * this.pOvernight).format('0.0')
    }
  }
}
</script>

<style>
</style>
