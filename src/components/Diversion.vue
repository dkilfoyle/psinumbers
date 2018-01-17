<template lang="pug">
  my-layout
    div(slot="settings")
      q-list
        q-list-header Diversion Parameters
        q-item-separator

        q-collapsible(group="parameters" label="Demographics" icon="people" separator)
          population-selector(v-model="population")
          q-field(v-for="param in Object.values(params).filter(p => p.group === 'Demographics')" :key="param.name" :label="param.label" :helper="param.helper")
            q-slider(v-if="param.type===undefined" v-model="param.val" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(param.val*100)}%`")
            q-input(v-if="param.type==='number'" v-model="param.val")

        q-collapsible(v-for="paramGroup in paramGroups" :key="paramGroup.label" group="parameters" :label="paramGroup.label" :icon="paramGroup.icon" separator)
          q-field(v-for="param in Object.values(params).filter(p => p.group === paramGroup.label)" :key="param.name" :label="param.label" :helper="param | getHelper")
            q-slider(v-if="param.type===undefined" v-model="param.val" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(param.val*100)}%`")
            q-input(v-if="param.type==='number'" v-model="param.val")

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
import Params from './DiversionParams'
import paramFilters from './paramFilters'

var n = function (mynum) { return numeral(mynum).format('0,0') }
var p = function (mynum) { return numeral(mynum).format('0%') }

export default {
  name: 'ivt',
  components: {
    MyLayout, PopulationSelector, QTooltip, FlowChartViewer, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCollapsible, QSelect, QRadio, QCheckbox
  },
  mixins: [ paramFilters ],
  data () {
    return {
      numeral: numeral,
      bDivertperDay: false,
      bDivertperNight: false,
      tableYears: [2018, 2019, 2020, 2021, 2022],
      paramGroups: [
        { label: 'Radiology', icon: 'scanner' },
        { label: 'Clinical', icon: 'favorite' },
        { label: 'Onset Time', icon: 'timelapse' }],
      population: { regions: ['Metro'], dhbs: ['Auckland', 'Counties Manukau', 'Waitemata'], year: '2018' },
      params: Params,
      DHBs: DHBs
    }
  },
  computed: {
    nPopulation: function () { return this.getCalculatedPopulation(this.population.dhbs, this.population.growth, this.population.year) },
    nAdults: function () { return Math.round(this.nPopulation * this.params.pAdults.val) },
    nStrokes: function () { return Math.round(this.nAdults * (this.params.pIncidence.val / 100000)) },

    nHyperacute: function () { return Math.round(this.nStrokes * this.params.pHyperacute.val) },
    pNonacute: function () { return (1.0 - this.params.pHyperacute.val) },
    nNonacute: function () { return Math.round(this.nStrokes * this.pNonacute) },

    nAfterhours: function () { return Math.round(this.nHyperacute * this.params.pAfterhours.val) },
    pInhours: function () { return (1.0 - this.params.pAfterhours.val) },
    nInhours: function () { return Math.round(this.nHyperacute * this.pInhours) },

    nPASTAPos: function () { return Math.round(this.nAfterhours * this.params.pPASTAPos.val) },
    pPASTANeg: function () { return (1.0 - this.params.pPASTAPos.val) },
    nPASTANeg: function () { return Math.round(this.nAfterhours * this.pPASTANeg) },

    nMimics: function () { return Math.round(this.nPASTAPos * this.params.pMimics.val) },
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
          {id: 'pAdults', from: 'Population', to: 'Adults', label: 'Adults ' + p(this.params.pAdults.val), value: 1.0},
          {id: 'pStrokes', from: 'Adults', to: 'Strokes', label: 'Incidence\n' + this.params.pIncidence.val + '/100,000', value: 1.0},
          {id: 'pHyperacute', from: 'Strokes', to: 'Hyperacute', label: p(this.params.pHyperacute.val), value: this.params.pHyperacute.val},
          {id: 'pNonacute', from: 'Strokes', to: 'Nonacute', label: p(this.pNonacute), value: this.pNonacute},
          {id: 'pAfterhours', from: 'Hyperacute', to: 'Afterhours', label: p(this.params.pAfterhours.val), value: this.params.pAfterhours.val},
          {id: 'pInhours', from: 'Hyperacute', to: 'Inhours', label: p(this.pInhours), value: this.pInhours},
          {id: 'pPASTAPos', from: 'Afterhours', to: 'PASTAPos', label: p(this.params.pPASTAPos.val), value: this.params.pPASTAPos.val},
          {id: 'pPASTANeg', from: 'Afterhours', to: 'PASTANeg', label: p(this.pPASTANeg), value: this.pPASTANeg},
          {id: 'pMimics', from: 'PASTAPos', to: 'Mimics', label: p(this.params.pMimics.val), value: this.params.pMimics.val},
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
      this.params.pAdults.val = 0.8
      this.params.pIncidence.val = 192
      this.params.pHyperacute.val = 0.55
      this.params.pAfterhours.val = 0.61
      this.params.pPASTAPos.val = 0.65
      this.params.pMimics.val = 0.37
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
      x = x * this.params.pAdults.val * (this.params.pIncidence.val / 100000) * this.params.pHyperacute.val * this.params.pAfterhours.val * this.params.pPASTAPos.val
      x = x + (x * this.params.pMimics.val)
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
