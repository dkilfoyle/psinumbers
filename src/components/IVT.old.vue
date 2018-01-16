<template lang="pug">
  my-layout
    div(slot="settings")
      q-list
        q-list-header IVT Parameters
        q-item-separator

        q-collapsible(group="parameters" label="Demographics" icon="people" separator)
          population-selector(v-model="population")
          q-field(label="Adults %" helper="Proportion of population >= 15y")
            q-slider(v-model="pAdults" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pAdults*100)}%`")
          q-field(label="Stroke Incidence" helper="Number of strokes/100,000 adults /yr")
            q-input(v-model="pIncidence")

        q-collapsible(group="parameters" label="Radiology" icon="scanner" separator)
          q-field(label="Ischemic %" helper="% of all strokes that are ischemic (81%)")
            q-slider(v-model="pIschemic" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pIschemic*100)}%`")
          q-field(label="IVT %" helper="% of ischemic stroke suitable for IVT")
            q-slider(v-model="pIVT" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pIVT*100)}%`")
      
        q-collapsible(group="parameters" label="Defaults" icon="settings" separator)
          q-btn(@click="resetDefaults()" color="secondary" class="full-width") Reset All
      
      q-list
        q-list-header Settings
        q-item-separator
        q-collapsible(group="settings" label="Table" icon="view_quilt" separator)
          q-field(label="Show Custom Parameters" helper="Show parameters that vary from defaults")
            q-checkbox(v-model="bShowCustomParams")
          q-field(label="IVT per 24h day" helper="PSI cases per 24h day")
            q-checkbox(v-model="bIVTperDay")
          q-field(label="IVT per Night" helper="PSI cases per overnight")
            q-checkbox(v-model="bIVTperNight")
        q-collapsible(group="settings" label="Populations" icon="local_hospital" separator)
          q-field(:label="dhb.label" v-for="dhb in DHBs" :key="dhb.label")
            q-input(v-model="dhb.n" type="number")

    div(slot="table")
      table.q-table.horizonal-separator(v-if="bShowCustomParams")
        thead
          tr
            th Parameter
            th Setting
        tbody
          tr(v-for="param in params" v-if="param.val != param.default")
            td {{ param.label }}
            td {{ param.val }}
      table.q-table.horizontal-separator
        thead
          tr
            th
            th(v-for="year in tableYears") {{ year }}
        tbody
          tr
            th IVT
          tr(v-for="dhb in population.dhbs")
            td {{ dhb }}
            td(v-for="year in tableYears") {{ getTotalIVT([dhb], year) }}
          tr
            td Total
            td(v-for="year in tableYears") {{ getTotalIVT(population.dhbs, year) }}
          
          tr(v-if="bIVTperDay")
            th PSI/Day
          tr(v-if="bIVTperDay" v-for="dhb in population.dhbs")
            td {{ dhb }}
            td(v-for="year in tableYears") {{ getIVTperDay([dhb], year) }}
          tr(v-if="bIVTperDay")
            td Total
            td(v-for="year in tableYears") {{ getIVTperDay(population.dhbs, year) }}
          
          tr(v-if="bIVTperNight")
            th PSI/Night
          tr(v-if="bIVTperNight" v-for="dhb in population.dhbs")
            td {{ dhb }}
            td(v-for="year in tableYears") {{ getIVTperNight([dhb], year) }}
          tr(v-if="bIVTperNight")
            td Total
            td(v-for="year in tableYears") {{ getIVTperNight(population.dhbs, year) }}

    div(slot="graph")
      flow-chart-viewer(title="PSI" :flowchartData="flowchartData" :presets=`[]`)

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
    FlowChartViewer, MyLayout, PopulationSelector, QTooltip, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCollapsible, QSelect, QRadio, QCheckbox
  },
  data () {
    return {
      numeral: numeral,
      bIVTperDay: false,
      bIVTperNight: false,
      bShowCustomParams: false,
      tableYears: [2018, 2019, 2020, 2021, 2022],
      population: { regions: ['Metro'], dhbs: ['Auckland', 'Counties Manukau', 'Waitemata'], year: '2018' },
      pAdults: 0.8,
      pIncidence: 192,
      pIschemic: 0.81,
      pIVT: 0.15,
      pOvernight: 0.18,
      pAfterhours: 0.61,
      DHBs: DHBs
    }
  },
  computed: {
    nPopulation: function () { return this.getCalculatedPopulation(this.population.dhbs, this.population.growth, this.population.year) },
    nAdults: function () { return Math.round(this.nPopulation * this.pAdults) },
    nStrokes: function () { return Math.round(this.nAdults * (this.pIncidence / 100000)) },

    nIschemic: function () { return Math.round(this.nStrokes * this.pIschemic) },
    pHemorrhagic: function () { return (1.0 - this.pIschemic) },
    nHemorrhagic: function () { return Math.round(this.nStrokes * this.pHemorrhagic) },

    nIVT: function () { return Math.round(this.nIschemic * this.pIVT) },
    flowchartData: function () {
      return {
        nodes: [
          {id: 'Population', label: '*Population*\nN=' + n(this.nPopulation), level: 0, shape: 'ellipse', font: {multi: 'md'}, group: 'end'},
          {id: 'Adults', label: '*Adults*\nN=' + n(this.nAdults), level: 1, group: 0},
          {id: 'Strokes', label: '*Strokes*\nN=' + n(this.nStrokes), level: 2, group: 0},
          {id: 'Ischemic', label: '*Ischemic\nN=' + n(this.nIschemic), level: 3, group: 0},
          {id: 'Hemorrhagic', label: '*Hemorrhagic*\nN=' + n(this.nHemorrhagic), level: 2, group: 'out'},
          {id: 'IVT', label: '*IVT*\nN=' + n(this.nIVT), level: 3, group: 'end'}
        ],
        edges: [
          {id: 'pAdults', from: 'Population', to: 'Adults', label: 'Adults ' + p(this.pAdults), value: 1.0},
          {id: 'pStrokes', from: 'Adults', to: 'Strokes', label: 'Incidence\n' + this.pIncidence + '/100,000', value: 1.0},
          {id: 'pIschemic', from: 'Strokes', to: 'Ischemic', label: p(this.pIschemic), value: this.pIschemic},
          {id: 'pHemorrhagic', from: 'Strokes', to: 'Hemorrhagic', label: p(this.pHemorrhagic), value: this.pHemorrhagic},
          {id: 'pIVT', from: 'Ischemic', to: 'IVT', label: p(this.pIVT), value: this.pIVT}
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
      this.pIschemic = 0.81
      this.pIVT = 0.15
      this.pOvernight = 0.18
      this.pAfterhours = 0.61
    },
    getCalculatedPopulation: function (dhbs, growth, year) {
      var x = 0
      dhbs.forEach(o1 => {
        x = x + this.DHBs.find(o2 => o2.value === o1).n
      })
      x = x * Math.pow(1.0 + (growth / 100), year - 2017)
      return Math.round(x)
    },
    getTotalIVT: function (sPopulations, year) {
      var x = this.getCalculatedPopulation(sPopulations, this.population.growth, year)
      x = x * this.pAdults * (this.pIncidence / 100000) * this.pIschemic * this.pIVT
      return Math.round(x)
    },
    getIVTperDay: function (sPopulations, year) {
      return this.numeral(this.getTotalIVT(sPopulations, this.population.growth, year) / 365.0).format('0.0')
    },
    getIVTperNight: function (sPopulations, year) {
      return this.numeral(this.getTotalIVT(sPopulations, this.population.growth, year) / 365.0 * this.pOvernight).format('0.0')
    }
  }
}
</script>

<style>
</style>
