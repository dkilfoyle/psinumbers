<template lang="pug">
  my-layout
    div(slot="settings")
      q-list
        q-list-header PSI Parameters
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
          q-field(label="Remoteness Adjuster" helper="Adjust parameters for remote populations. Decrease hyperacute % and increase time delays")
            q-checkbox(v-model="bRemoteness")
          q-field(label="Availability Filter" helper="Reduce availability to in-hours only")
            q-checkbox(v-model="bAvailability")
          q-btn(@click="resetDefaults()" color="secondary" class="full-width") Reset All

      q-list
        q-list-header Settings
        q-item-separator
        q-collapsible(group="settings" label="Table" icon="view_quilt" separator)
          q-field(label="Show Custom Parameters" helper="Show parameters that vary from defaults")
            q-checkbox(v-model="bShowCustomParams")
          q-field(label="IVT and PSI" helper="Patients treated with both IVT and PSI")
            q-checkbox(v-model="bIVTandPSI")
          q-field(label="PSI per 24h day" helper="PSI cases per 24h day")
            q-checkbox(v-model="bPSIperDay")
          q-field(label="PSI per Night" helper="PSI cases per overnight")
            q-checkbox(v-model="bPSIperNight")
        q-collapsible(group="settings" label="Populations" icon="local_hospital" separator)
          q-field(:label="dhb.label" v-for="dhb in DHBs" :key="dhb.label")
            q-input(v-model="dhb.n" type="number")

    div(slot="table")
      custom-param-table(v-if="bShowCustomParams" :params="params" :population="population")
      table.q-table.horizontal-separator
        thead
          tr
            th
            th(v-for="year in tableYears") {{ year }}
        tbody
          tr(v-if="bIVTandPSI")
            th IVT and PSI
          tr(v-if="bIVTandPSI" v-for="dhb in population.dhbs")
            td {{ dhb }}
            td.text-right(v-for="year in tableYears") {{ getIVTPSI([dhb], year) }}
          tr(v-if="bIVTandPSI")
            td Total
            td.text-right(v-for="year in tableYears") {{ getIVTPSI(population.dhbs, year) }}
          
          tr
            th PSI (+/- IVT)
          tr(v-for="dhb in population.dhbs")
            td {{ dhb }}
            td.text-right(v-for="year in tableYears") {{ getTotalPSI([dhb], year) }}
          tr
            td Total
            td.text-right(v-for="year in tableYears") {{ getTotalPSI(population.dhbs, year) }}
          
          tr(v-if="bPSIperDay")
            th PSI/Day
          tr(v-if="bPSIperDay" v-for="dhb in population.dhbs")
            td {{ dhb }}
            td.text-right(v-for="year in tableYears") {{ getPSIperDay([dhb], year) }}
          tr(v-if="bPSIperDay")
            td Total
            td.text-right(v-for="year in tableYears") {{ getPSIperDay(population.dhbs, year) }}
          
          tr(v-if="bPSIperNight")
            th PSI/Night
          tr(v-if="bPSIperNight" v-for="dhb in population.dhbs")
            td {{ dhb }}
            td.text-right(v-for="year in tableYears") {{ getPSIperNight([dhb], year) }}
          tr(v-if="bPSIperNight")
            td Total
            td.text-right(v-for="year in tableYears") {{ getPSIperNight(population.dhbs, year) }}

    div(slot="graph")         
      flow-chart-viewer(title="PSI" :flowchartData="flowchartData" :presets=`[
        { label: 'Zoom: Demographics', icon: 'people', nodes: ['Population', 'Adults', 'Strokes', 'Ischemic', 'LVO'] },
        { label: 'Zoom: Early presenters', icon: 'timer', nodes: ['KTO', 'LT4h', 'GT4h', 'EarlyInclusion', 'EarlyExclusion', 'PSIReqd', 'PSINotReqd', 'TotalPSI']},
        { label: 'Zoom: Late presenters', icon: 'timer_off', nodes: ['SUTO', 'TooLate', 'CTPBad', 'TotalPSI'] }
      ]`)

</template>

<script>
import { Toast, QTooltip, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QCollapsible, QBtn, QInput, QSlider, QField, QSelect, QRadio, QCheckbox } from 'quasar'
import MyLayout from './MyLayout'
import PopulationSelector from './PopulationSelector'
import FlowChartViewer from './FlowChartViewer'
import CustomParamTable from './CustomParamTable'
import numeral from 'numeral'
import DHBs from './dhbs.js'
import Params from './PSIParams'
import paramFilters from './paramFilters'

var n = function (mynum) { return numeral(mynum).format('0,0') }
var p = function (mynum) { return numeral(mynum).format('0%') }

export default {
  name: 'psi',
  components: {
    CustomParamTable, FlowChartViewer, MyLayout, PopulationSelector, QTooltip, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCollapsible, QSelect, QRadio, QCheckbox
  },
  mixins: [ paramFilters ],
  data () {
    return {
      numeral: numeral,
      bIVTandPSI: false,
      bPSIperDay: true,
      bPSIperNight: true,
      bShowCustomParams: true,
      bRemoteness: false,
      bAvailability: false,
      tableYears: [2018, 2019, 2020, 2021, 2022],
      paramGroups: [
        { label: 'Radiology', icon: 'scanner' },
        { label: 'Clinical', icon: 'favorite' },
        { label: 'Onset Time', icon: 'timelapse' },
        { label: 'Early Presenters', icon: 'timer' },
        { label: 'Late Presenters', icon: 'timer_off' },
        { label: 'Time of Day', icon: 'access_time' } ],
      population: { regions: ['Metro'], dhbs: ['Auckland', 'Counties Manukau', 'Waitemata'], year: 2018 },
      params: Params,
      DHBs: DHBs
    }
  },
  computed: {
    nPopulation: function () { return this.getCalculatedPopulation(this.population.dhbs, this.population.growth, this.population.year) },
    nAdults: function () { return (this.nPopulation * this.params.pAdults.val) },
    nStrokes: function () { return (this.nAdults * (this.params.pIncidence.val / 100000)) },

    nAvailability: function () { return (this.nStrokes * this.getAvailability(this.population.year)) },
    pNoAvailability: function () { return (1.0 - this.getAvailability(this.population.year)) },
    nNoAvailability: function () { return (this.nStrokes * this.pNoAvailability) },

    nIschemic: function () { return (this.nAvailability * this.params.pIschemic.val) },
    pHemorrhagic: function () { return (1.0 - this.params.pIschemic.val) },
    nHemorrhagic: function () { return (this.nAvailability * this.pHemorrhagic) },

    nLVO: function () { return (this.nIschemic * this.params.pLVO.val) },
    pSVO: function () { return (1.0 - this.params.pLVO.val) },
    nSVO: function () { return (this.nIschemic * this.pSVO) },

    nModerate: function () { return (this.nLVO * this.params.pModerate.val) },
    pMild: function () { return (1.0 - this.params.pModerate.val) },
    nMild: function () { return (this.nLVO * this.pMild) },

    nKTO: function () { return (this.nModerate * this.params.pKTO.val) },
    nLT4h: function () { return (this.nKTO * this.params.pLT4h.val) },
    nEarlyInclusion: function () { return (this.nLT4h * this.params.pEarlyInclusion.val) },
    pEarlyExclusion: function () { return (1.0 - this.params.pEarlyInclusion.val) },
    nEarlyExclusion: function () { return (this.nLT4h * this.pEarlyExclusion.val) },
    nPSIReqd: function () { return (this.nEarlyInclusion * this.pNotRecannalized) },
    pNotRecannalized: function () { return (1.0 - this.params.pRecannalized.val) },
    nPSINotReqd: function () { return (this.nEarlyInclusion * this.params.pRecannalized.val) },

    pGT4h: function () { return (1.0 - this.params.pLT4h.val) },
    nGT4h: function () { return (this.nKTO * this.pGT4h) },
    nSUTO: function () { return (this.nModerate * this.params.pSUTO.val) },
    nLate: function () { return (this.nGT4h + this.nSUTO) },
    pGT12h: function () { return (1.0 - this.params.pKTO.val - this.params.pSUTO.val) },
    nTooLate: function () { return (this.nModerate - this.params.pGT12h.val) },

    nLateInclusion: function () { return (this.nLate * this.params.pLateInclusion.val) },
    pLateExclusion: function () { return (1.0 - this.params.pLateInclusion.val) },
    nLateExclusion: function () { return (this.nLate * this.pLateExclusion) },
    nCTPGood: function () { return (this.nLateInclusion * this.params.pCTPGood.val) },
    pCTPBad: function () { return (1.0 - this.params.pCTPGood.val) },
    nCTPBad: function () { return (this.nLateInclusion * this.pCTPBad) },

    nTotalPSI: function () { return (this.nPSIReqd + this.nCTPGood) },

    flowchartData: function () {
      return {
        nodes: [
          {id: 'Population', label: '*Population*\nN=' + n(this.nPopulation), level: 0, shape: 'ellipse', font: {multi: 'md'}, group: 'end'},
          {id: 'Adults', label: '*Adults*\nN=' + n(this.nAdults), level: 1, group: 0},
          {id: 'Strokes', label: '*Strokes*\nN=' + n(this.nStrokes), level: 2, group: 0},
          {id: 'Availability', label: '*Resources*\nAvailable\nN=' + n(this.nAvailability), level: 3, group: 0},
          {id: 'NoAvailability', label: '*Resources*\nNot Available\nN=' + n(this.nNoAvailability), level: 2, group: 'out'},
          {id: 'Ischemic', label: '*Ischemic\nN=' + n(this.nIschemic), level: 4, group: 0},
          {id: 'Hemorrhagic', label: '*Hemorrhagic*\nN=' + n(this.nHemorrhagic), level: 3, group: 'out'},
          {id: 'LVO', label: '*LVO*\nN=' + n(this.nLVO), level: 5},
          {id: 'SVO', label: '*SVO*\nN=' + n(this.nSVO), level: 4, group: 'out'},
          {id: 'Moderate', label: '*NIHSS > 6*\nN=' + n(this.nModerate), level: 6},
          {id: 'Mild', label: '*NIHSS <= 6\nN=' + n(this.nMild), level: 5, group: 'out'},

          {id: 'KTO', label: '*Onset or LSW < 12h*\nN=' + n(this.nKTO), level: 7},
          {id: 'LT4h', label: '*Onset < 4h*\nN=' + n(this.nLT4h), level: 8},
          {id: 'GT4h', label: '*Onset > 4h\nN=' + n(this.nGT4h), level: 8, group: 'late'},
          {id: 'EarlyInclusion', label: '*mRS/ASPECTS*\nInclusion\nN=' + n(this.nEarlyExclusion), level: 9},
          {id: 'EarlyExclusion', label: '*mRS/ASPECTS*\nExclusion\nN=' + n(this.nEarlyInclusion), level: 9, group: 'out'},
          {id: 'PSIReqd', label: '*PSI Required*\nN=' + n(this.nPSIReqd), level: 10},
          {id: 'PSINotReqd', label: '*Recannalized*\nN=' + n(this.nPSINotReqd), level: 10, group: 'out'},

          {id: 'SUTO', label: '*Onset Unknown*\nN=' + n(this.nSUTO), level: 7, group: 'late'},
          {id: 'TooLate', label: '*Too Late*\nN=' + n(this.nTotalPSI), level: 7, group: 'out'},
          {id: 'Late', label: '*Late\nN=' + n(this.nLate), level: 8, group: 'late'},
          {id: 'LateInclusion', label: '*mRS/ASPECTS*\nInclusion\nN=' + n(this.nLateInclusion), level: 9, group: 'late'},
          {id: 'LateExclusion', label: '*mRS/ASPECTS*\nExclusion\nN=' + n(this.nLateExclusion), level: 9, group: 'out'},
          {id: 'CTPGood', label: '*CTP Acceptable*\nN=' + n(this.nCTPGood), level: 10, group: 'late'},
          {id: 'CTPBad', label: '*CTP Unfavourable*\nN=' + n(this.nCTPBad), level: 10, group: 'out'},

          {id: 'TotalPSI', label: '*Total PSI*\nN=' + n(this.nTotalPSI), level: 11, group: 'end'}
        ],
        edges: [
          {id: 'pAdults', from: 'Population', to: 'Adults', label: 'Adults ' + p(this.params.pAdults.val), value: 1.0},
          {id: 'pStrokes', from: 'Adults', to: 'Strokes', label: 'Incidence\n' + this.params.pIncidence.val + '/100,000', value: 1.0},
          {id: 'pAvailability', from: 'Strokes', to: 'Availability', label: p(this.getAvailability(this.population.year)), value: this.getAvailability(this.population.year)},
          {id: 'pNoAvailability', from: 'Strokes', to: 'NoAvailability', label: p(this.pNoAvailability), value: this.pNoAvailability},
          {id: 'pIschemic', from: 'Availability', to: 'Ischemic', label: p(this.params.pIschemic.val), value: this.params.pIschemic.val},
          {id: 'pHemorrhagic', from: 'Availability', to: 'Hemorrhagic', label: p(this.pHemorrhagic), value: this.pHemorrhagic},
          {id: 'pAvailability2', from: 'Availability', to: 'LVO'},
          {id: 'pLVO', from: 'Ischemic', to: 'LVO', label: p(this.params.pLVO.val), value: this.params.pLVO.val},
          {id: 'pSVO', from: 'Ischemic', to: 'SVO', label: p(this.pSVO), value: this.pSVO},
          {id: 'pModerate', from: 'LVO', to: 'Moderate', label: p(this.params.pModerate.val), value: this.params.pModerate.val},
          {id: 'pMild', from: 'LVO', to: 'Mild', label: p(this.pMild), value: this.pMild},
          {id: 'pKTO', from: 'Moderate', to: 'KTO', label: p(this.params.pKTO.val), value: this.params.pKTO.val},
          {id: 'pSUTO', from: 'Moderate', to: 'SUTO', label: p(this.params.pSUTO.val), value: this.params.pSUTO.val},
          {id: 'pGT12h', from: 'Moderate', to: 'TooLate', label: p(this.pGT12h), value: this.pGT12h},

          {id: 'pLT4h', from: 'KTO', to: 'LT4h', label: p(this.params.pLT4h.val), value: this.params.pLT4h.val},
          {id: 'pEarlyInclusion', from: 'LT4h', to: 'EarlyInclusion', label: p(this.params.pEarlyInclusion.val), value: this.params.pEarlyInclusion.val},
          {id: 'pEarlyExclusion', from: 'LT4h', to: 'EarlyExclusion', label: p(this.pEarlyExclusion), value: this.pEarlyExclusion},
          {id: 'pRecannalized', from: 'EarlyInclusion', to: 'PSINotReqd', label: p(this.params.pRecannalized.val), value: this.params.pRecannalized.val},
          {id: 'pNotRecannalized', from: 'EarlyInclusion', to: 'PSIReqd', label: p(this.pNotRecannalized), value: this.pNotRecannalized},

          {id: 'pGT4h', from: 'KTO', to: 'GT4h', label: p(this.pGT4h), value: this.pGT4h},
          {id: 'late1', from: 'GT4h', to: 'Late', value: this.nGT4h / (this.nGT4h + this.nSUTO)},
          {id: 'late2', from: 'SUTO', to: 'Late', value: this.nSUTO / (this.nGT4h + this.nSUTO)},
          {id: 'pLateInclusion', from: 'Late', to: 'LateInclusion', label: p(this.params.pLateInclusion.val), value: this.params.pLateInclusion.val},
          {id: 'pLateExclusion', from: 'Late', to: 'LateExclusion', label: p(this.pLateExclusion), value: this.pLateExclusion},
          {id: 'pCTPBad', from: 'LateInclusion', to: 'CTPBad', label: p(this.pCTPBad), value: this.pCTPBad},
          {id: 'pCTPGood', from: 'LateInclusion', to: 'CTPGood', label: p(this.params.pCTPGood.val), value: this.params.pCTPGood.val},

          {id: 'Total1', from: 'PSIReqd', to: 'TotalPSI', value: this.nPSIReqd / (this.nPSIReqd + this.nCTPGood)},
          {id: 'Total2', from: 'CTPGood', to: 'TotalPSI', value: this.nCTPGood / (this.nPSIReqd + this.nCTPGood)}
        ]
      }
    }
  },
  watch: {
    bRemoteness: function (bNewRemoteness) {
      if (bNewRemoteness) {
        this.params.pKTO.val = this.params.pKTO.default - 0.15 // pGT12h will be automatically adjusted via computed reactivity
        this.params.pLT4h.val = this.params.pLT4h.default / 2 // pGT4h will be automatically adjusted
      }
      else {
        this.params.pKTO.val = this.params.pKTO.default
        this.params.pLT4h.val = this.params.pLT4h.default
      }
    },
    bAvailability: function (bNewAvailability) {
      if (bNewAvailability) {
        this.params.pAvailability2018.val = 0.37 // Waikato 2017 vs 0.38 for afterhours
        this.params.pAvailability2022.val = 0.85
      }
      else {
        this.params.pAvailability2018.val = this.params.pAvailability2018.default
        this.params.pAvailability2022.val = this.params.pAvailability2022.default
      }
    }
  },
  mounted () {
    Toast.create({
      html: 'Click the menu icon in the top left of the toolbar to redisplay the menu',
      icon: 'menu',
      timeout: 5000
    })
  },
  methods: {
    resetDefaults: function () {
      this.population.regions = ['Metro']
      this.population.dhbs = ['Auckland', 'Counties Manukau', 'Waitemata']
      this.population.year = 2018
      var self = this
      Object.keys(this.params).forEach(function (paramName) {
        self.params[paramName].val = self.params[paramName].default
      })
    },
    getAvailability: function (year) {
      return (this.params.pAvailability2018.val + (this.params.pAvailability2022.val - this.params.pAvailability2018.val) / (2022 - year + 1))
    },
    getCalculatedPopulation: function (dhbs, growth, year) {
      var x = 0
      dhbs.forEach(o1 => {
        x = x + this.DHBs.find(o2 => o2.value === o1).n
      })
      x = x * Math.pow(1.0 + (growth / 100), year - 2017)
      return Math.round(x)
    },
    getTotalPSI: function (sPopulations, year) {
      var x = this.getCalculatedPopulation(sPopulations, this.population.growth, year)
      x = x * this.params.pAdults.val * (this.params.pIncidence.val / 100000) * this.params.pIschemic.val * this.params.pLVO.val * this.params.pModerate.val

      var early = x * this.params.pKTO.val * this.params.pLT4h.val * this.params.pEarlyInclusion.val * (1.0 - this.params.pRecannalized.val)
      var gt4h = x * this.params.pKTO.val * (1.0 - this.params.pLT4h.val)
      var suto = x * this.params.pSUTO.val
      var late = (suto + gt4h) * this.params.pLateInclusion.val * this.params.pCTPGood.val

      return Math.round(early + late)
    },
    getPSIperDay: function (sPopulations, year) {
      return this.numeral(this.getTotalPSI(sPopulations, year) / 365.0).format('0.0')
    },
    getPSIperNight: function (sPopulations, year) {
      return this.numeral(this.getTotalPSI(sPopulations, year) / 365.0 * this.params.pOvernight.val).format('0.0')
    },
    getIVTPSI: function (sPopulations, year) {
      var x = this.getCalculatedPopulation(sPopulations, year)
      x = x * this.params.pAdults.val * (this.params.pIncidence.val / 100000) * this.params.pIschemic.val * this.params.pLVO.val * this.params.pModerate.val

      var early = x * this.params.pKTO.val * this.params.pLT4h.val * this.params.pEarlyInclusion.val * (1.0 - this.params.pRecannalized.val)
      return Math.round(early)
    }
  }
}
</script>

<style>
.layout-padding {
  padding: 2em 2em;
}
</style>
