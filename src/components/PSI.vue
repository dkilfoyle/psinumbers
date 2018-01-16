<template lang="pug">
  my-layout
    div(slot="settings")
      q-list
        q-list-header PSI Parameters
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
          q-field(label="LVO %" helper="% of ischemic stroke with LVO (40%)")
            q-slider(v-model="pLVO" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pLVO*100)}%`")

        q-collapsible(group="parameters" label="Clinical" icon="favorite" separator)
          q-field(label="Moderate+ Deficit" helper="% of LVO with NIHSS >= 6 (80%)")
            q-slider(v-model="pModerate" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pModerate*100)}%`")

        q-collapsible(group="parameters" label="Onset Time" icon="timelapse" separator)
          q-field(label="Onset < 12h" helper="% with onset (known or last seen well) < 12h (78%)")
            q-slider(v-model="pKTO" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pKTO*100)}%`")

        q-collapsible(group="parameters" label="Early Presenters" icon="timer" separator)
          q-field(label="Onset < 4h" helper="% onset to door < 4h (74%)")
            q-slider(v-model="pLT4h" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pLT4h*100)}%`")
          q-field(label="No Exclusions" helper="% with mRS<2 and ASPECTS>6 (66%)")
            q-slider(v-model="pEarlyInclusion" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pEarlyInclusion*100)}%`")
          q-field(label="Recannalized with IVT" helper="% with resolution of deficit following IVT (5%)")
            q-slider(v-model="pRecannalized" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pRecannalized*100)}%`")       
        
        q-collapsible(group="parameters" label="Late Presenters" icon="timer_off" separator)
          q-field(label="Onset unknown" helper="% with unknown onset and LSW > 12h (15%)")
            q-slider(v-model="pSUTO" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pSUTO*100)}%`")
          q-field(label="Onset > 12h" helper="% with known onset > 12h ago (7%)")
            q-slider(v-model="pGT12h" :min="0.00" :max="1.0" :step="0.01" :decimals="2" readonly label-always :label-value="`${Math.round(pGT12h*100)}%`")
          q-field(label="No Exclusions" helper="% with mRS<2 and ASPECTS>6 (25%)")
            q-slider(v-model="pLateInclusion" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pLateInclusion*100)}%`")
          q-field(label="Favourable CTP" helper="% with favourable CTP (57%)")
            q-slider(v-model="pCTPGood" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pCTPGood*100)}%`")
      
        q-collapsible(group="parameters" label="Time of Day" icon="access_time" separator)
          q-field(label="Overnight" helper="% presenting overnight")
            q-slider(v-model="pOvernight" :min="0.00" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pOvernight*100)}%`")
        q-collapsible(group="parameters" label="Defaults" icon="settings" separator)
          q-btn(@click="resetDefaults()" color="secondary" class="full-width") Reset All

      q-list
        q-list-header Settings
        q-item-separator
        q-collapsible(group="settings" label="Table" icon="view_quilt" separator)
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
            td(v-for="year in tableYears") {{ getIVTPSI([dhb], year) }}
          tr(v-if="bIVTandPSI")
            td Total
            td(v-for="year in tableYears") {{ getIVTPSI(population.dhbs, year) }}
          
          tr
            th PSI (+/- IVT)
          tr(v-for="dhb in population.dhbs")
            td {{ dhb }}
            td(v-for="year in tableYears") {{ getTotalPSI([dhb], year) }}
          tr
            td Total
            td(v-for="year in tableYears") {{ getTotalPSI(population.dhbs, year) }}
          
          tr(v-if="bPSIperDay")
            th PSI/Day
          tr(v-if="bPSIperDay" v-for="dhb in population.dhbs")
            td {{ dhb }}
            td(v-for="year in tableYears") {{ getPSIperDay([dhb], year) }}
          tr(v-if="bPSIperDay")
            td Total
            td(v-for="year in tableYears") {{ getPSIperDay(population.dhbs, year) }}
          
          tr(v-if="bPSIperNight")
            th PSI/Night
          tr(v-if="bPSIperNight" v-for="dhb in population.dhbs")
            td {{ dhb }}
            td(v-for="year in tableYears") {{ getPSIperNight([dhb], year) }}
          tr(v-if="bPSIperNight")
            td Total
            td(v-for="year in tableYears") {{ getPSIperNight(population.dhbs, year) }}

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
import numeral from 'numeral'
import DHBs from './dhbs.js'

var n = function (mynum) { return numeral(mynum).format('0,0') }
var p = function (mynum) { return numeral(mynum).format('0%') }

export default {
  name: 'psi',
  components: {
    FlowChartViewer, MyLayout, PopulationSelector, QTooltip, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCollapsible, QSelect, QRadio, QCheckbox
  },
  data () {
    return {
      numeral: numeral,
      bIVTandPSI: false,
      bPSIperDay: true,
      bPSIperNight: true,
      tableYears: [2018, 2019, 2020, 2021, 2022],
      population: { regions: ['Metro'], dhbs: ['Auckland', 'Counties Manukau', 'Waitemata'], year: '2018' },
      pAdults: 0.8,
      pIncidence: 192,
      pIschemic: 0.81,
      pLVO: 0.40,
      pModerate: 0.8,
      pKTO: 0.78,
      pSUTO: 0.15,
      pLT4h: 0.74,
      pEarlyInclusion: 0.66,
      pLateInclusion: 0.25,
      pCTPGood: 0.57,
      pRecannalized: 0.05,
      pOvernight: 0.10, // TODO: check this
      DHBs: DHBs
    }
  },
  computed: {
    nPopulation: function () { return this.getCalculatedPopulation(this.population.dhbs, this.population.growth, this.population.year) },
    nAdults: function () { return (this.nPopulation * this.pAdults) },
    nStrokes: function () { return (this.nAdults * (this.pIncidence / 100000)) },

    nIschemic: function () { return (this.nStrokes * this.pIschemic) },
    pHemorrhagic: function () { return (1.0 - this.pIschemic) },
    nHemorrhagic: function () { return (this.nStrokes * this.pHemorrhagic) },

    nLVO: function () { return (this.nIschemic * this.pLVO) },
    pSVO: function () { return (1.0 - this.pLVO) },
    nSVO: function () { return (this.nIschemic * this.pSVO) },

    nModerate: function () { return (this.nLVO * this.pModerate) },
    pMild: function () { return (1.0 - this.pModerate) },
    nMild: function () { return (this.nLVO * this.pMild) },

    nKTO: function () { return (this.nModerate * this.pKTO) },
    nLT4h: function () { return (this.nKTO * this.pLT4h) },
    nEarlyInclusion: function () { return (this.nLT4h * this.pEarlyInclusion) },
    pEarlyExclusion: function () { return (1.0 - this.pEarlyInclusion) },
    nEarlyExclusion: function () { return (this.nLT4h * this.pEarlyExclusion) },
    nPSIReqd: function () { return (this.nEarlyInclusion * this.pNotRecannalized) },
    pNotRecannalized: function () { return (1.0 - this.pRecannalized) },
    nPSINotReqd: function () { return (this.nEarlyInclusion * this.pRecannalized) },

    pGT4h: function () { return (1.0 - this.pLT4h) },
    nGT4h: function () { return (this.nKTO * this.pGT4h) },
    nSUTO: function () { return (this.nModerate * this.pSUTO) },
    nLate: function () { return (this.nGT4h + this.nSUTO) },
    pGT12h: function () { return (1.0 - this.pKTO - this.pSUTO) },
    nTooLate: function () { return (this.nModerate - this.pGT12h) },

    nLateInclusion: function () { return (this.nLate * this.pLateInclusion) },
    pLateExclusion: function () { return (1.0 - this.pLateInclusion) },
    nLateExclusion: function () { return (this.nLate * this.pLateExclusion) },
    nCTPGood: function () { return (this.nLateInclusion * this.pCTPGood) },
    pCTPBad: function () { return (1.0 - this.pCTPGood) },
    nCTPBad: function () { return (this.nLateInclusion * this.pCTPBad) },

    nTotalPSI: function () { return (this.nPSIReqd + this.nCTPGood) },

    flowchartData: function () {
      return {
        nodes: [
          {id: 'Population', label: '*Population*\nN=' + n(this.nPopulation), level: 0, shape: 'ellipse', font: {multi: 'md'}, group: 'end'},
          {id: 'Adults', label: '*Adults*\nN=' + n(this.nAdults), level: 1, group: 0},
          {id: 'Strokes', label: '*Strokes*\nN=' + n(this.nStrokes), level: 2, group: 0},
          {id: 'Ischemic', label: '*Ischemic\nN=' + n(this.nIschemic), level: 3, group: 0},
          {id: 'Hemorrhagic', label: '*Hemorrhagic*\nN=' + n(this.nHemorrhagic), level: 2, group: 'out'},
          {id: 'LVO', label: '*LVO*\nN=' + n(this.nLVO), level: 4},
          {id: 'SVO', label: '*SVO*\nN=' + n(this.nSVO), level: 3, group: 'out'},
          {id: 'Moderate', label: '*NIHSS > 6*\nN=' + n(this.nModerate), level: 5},
          {id: 'Mild', label: '*NIHSS <= 6\nN=' + n(this.nMild), level: 4, group: 'out'},

          {id: 'KTO', label: '*Onset or LSW < 12h*\nN=' + n(this.nKTO), level: 6},
          {id: 'LT4h', label: '*Onset < 4h*\nN=' + n(this.nLT4h), level: 7},
          {id: 'GT4h', label: '*Onset > 4h\nN=' + n(this.nGT4h), level: 7, group: 'late'},
          {id: 'EarlyInclusion', label: '*mRS/ASPECTS*\nInclusion\nN=' + n(this.nEarlyExclusion), level: 8},
          {id: 'EarlyExclusion', label: '*mRS/ASPECTS*\nExclusion\nN=' + n(this.nEarlyInclusion), level: 8, group: 'out'},
          {id: 'PSIReqd', label: '*PSI Required*\nN=' + n(this.nPSIReqd), level: 9},
          {id: 'PSINotReqd', label: '*Recannalized*\nN=' + n(this.nPSINotReqd), level: 9, group: 'out'},

          {id: 'SUTO', label: '*Onset Unknown*\nN=' + n(this.nSUTO), level: 6, group: 'late'},
          {id: 'TooLate', label: '*Too Late*\nN=' + n(this.nTotalPSI), level: 6, group: 'out'},
          {id: 'Late', label: '*Late\nN=' + n(this.nLate), level: 7, group: 'late'},
          {id: 'LateInclusion', label: '*mRS/ASPECTS*\nInclusion\nN=' + n(this.nLateInclusion), level: 8, group: 'late'},
          {id: 'LateExclusion', label: '*mRS/ASPECTS*\nExclusion\nN=' + n(this.nLateExclusion), level: 8, group: 'out'},
          {id: 'CTPGood', label: '*CTP Acceptable*\nN=' + n(this.nCTPGood), level: 9, group: 'late'},
          {id: 'CTPBad', label: '*CTP Unfavourable*\nN=' + n(this.nCTPBad), level: 9, group: 'out'},

          {id: 'TotalPSI', label: '*Total PSI*\nN=' + n(this.nTotalPSI), level: 10, group: 'end'}
        ],
        edges: [
          {id: 'pAdults', from: 'Population', to: 'Adults', label: 'Adults ' + p(this.pAdults), value: 1.0},
          {id: 'pStrokes', from: 'Adults', to: 'Strokes', label: 'Incidence\n' + this.pIncidence + '/100,000', value: 1.0},
          {id: 'pIschemic', from: 'Strokes', to: 'Ischemic', label: p(this.pIschemic), value: this.pIschemic},
          {id: 'pHemorrhagic', from: 'Strokes', to: 'Hemorrhagic', label: p(this.pHemorrhagic), value: this.pHemorrhagic},
          {id: 'pLVO', from: 'Ischemic', to: 'LVO', label: p(this.pLVO), value: this.pLVO},
          {id: 'pSVO', from: 'Ischemic', to: 'SVO', label: p(this.pSVO), value: this.pSVO},
          {id: 'pModerate', from: 'LVO', to: 'Moderate', label: p(this.pModerate), value: this.pModerate},
          {id: 'pMild', from: 'LVO', to: 'Mild', label: p(this.pMild), value: this.pMild},
          {id: 'pKTO', from: 'Moderate', to: 'KTO', label: p(this.pKTO), value: this.pKTO},
          {id: 'pSUTO', from: 'Moderate', to: 'SUTO', label: p(this.pSUTO), value: this.pSUTO},
          {id: 'pGT12h', from: 'Moderate', to: 'TooLate', label: p(this.pGT12h), value: this.pGT12h},

          {id: 'pLT4h', from: 'KTO', to: 'LT4h', label: p(this.pLT4h), value: this.pLT4h},
          {id: 'pEarlyInclusion', from: 'LT4h', to: 'EarlyInclusion', label: p(this.pEarlyInclusion), value: this.pEarlyInclusion},
          {id: 'pEarlyExclusion', from: 'LT4h', to: 'EarlyExclusion', label: p(this.pEarlyExclusion), value: this.pEarlyExclusion},
          {id: 'pRecannalized', from: 'EarlyInclusion', to: 'PSINotReqd', label: p(this.pRecannalized), value: this.pRecannalized},
          {id: 'pNotRecannalized', from: 'EarlyInclusion', to: 'PSIReqd', label: p(this.pNotRecannalized), value: this.pNotRecannalized},

          {id: 'pGT4h', from: 'KTO', to: 'GT4h', label: p(this.pGT4h), value: this.pGT4h},
          {id: 'late1', from: 'GT4h', to: 'Late', value: this.nGT4h / (this.nGT4h + this.nSUTO)},
          {id: 'late2', from: 'SUTO', to: 'Late', value: this.nSUTO / (this.nGT4h + this.nSUTO)},
          {id: 'pLateInclusion', from: 'Late', to: 'LateInclusion', label: p(this.pLateInclusion), value: this.pLateInclusion},
          {id: 'pLateExclusion', from: 'Late', to: 'LateExclusion', label: p(this.pLateExclusion), value: this.pLateExclusion},
          {id: 'pCTPBad', from: 'LateInclusion', to: 'CTPBad', label: p(this.pCTPBad), value: this.pCTPBad},
          {id: 'pCTPGood', from: 'LateInclusion', to: 'CTPGood', label: p(this.pCTPGood), value: this.pCTPGood},

          {id: 'Total1', from: 'PSIReqd', to: 'TotalPSI', value: this.nPSIReqd / (this.nPSIReqd + this.nCTPGood)},
          {id: 'Total2', from: 'CTPGood', to: 'TotalPSI', value: this.nCTPGood / (this.nPSIReqd + this.nCTPGood)}
        ]
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
      this.population.year = '2018'
      this.pAdults = 0.8
      this.pIncidence = 192
      this.pIschemic = 0.81
      this.pLVO = 0.40
      this.pModerate = 0.8
      this.pKTO = 0.78
      this.pSUTO = 0.15
      this.pLT4h = 0.74
      this.pEarlyInclusion = 0.66
      this.pLateInclusion = 0.25
      this.pCTPGood = 0.57
      this.pRecannalized = 0.05
      this.pOvernight = 0.10 // TODO = check this
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
      x = x * this.pAdults * (this.pIncidence / 100000) * this.pIschemic * this.pLVO * this.pModerate

      var early = x * this.pKTO * this.pLT4h * this.pEarlyInclusion * (1.0 - this.pRecannalized)
      var gt4h = x * this.pKTO * (1.0 - this.pLT4h)
      var suto = x * this.pSUTO
      var late = (suto + gt4h) * this.pLateInclusion * this.pCTPGood

      return Math.round(early + late)
    },
    getPSIperDay: function (sPopulations, year) {
      return this.numeral(this.getTotalPSI(sPopulations, year) / 365.0).format('0.0')
    },
    getPSIperNight: function (sPopulations, year) {
      return this.numeral(this.getTotalPSI(sPopulations, year) / 365.0 * this.pOvernight).format('0.0')
    },
    getIVTPSI: function (sPopulations, year) {
      var x = this.getCalculatedPopulation(sPopulations, year)
      x = x * this.pAdults * (this.pIncidence / 100000) * this.pIschemic * this.pLVO * this.pModerate

      var early = x * this.pKTO * this.pLT4h * this.pEarlyInclusion * (1.0 - this.pRecannalized)
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
