<template lang="pug">
  .layout-padding
    .row.md-gutter
      .col-sm-4
        q-scroll-area(style="height: calc(100vh - 114px);"  :thumb-style="{ left: '0px', width: '5px' }")
          q-list
            q-list-header PSI Parameters
            q-item-separator

            q-collapsible(group="parameters" label="Demographics" icon="people" separator)
              q-field(label="Regions")
                q-select(multiple chips v-model="sRegions" :options="Regions")
              q-field(label="DHBs")
                q-select(multiple chips v-model="sPopulations" :options="DHBs")
              q-field(label="Population Growth" helper="Annual %")
                q-input(v-model="pPopulationGrowth")
              q-field(label="Analysis Year")
                q-select(v-model="nYear" :options=`[
                  { label: '2017', value: 2017 },
                  { label: '2018', value: 2018 },
                  { label: '2019', value: 2019 },
                  { label: '2020', value: 2020 },
                  { label: '2021', value: 2021 },
                  { label: '2022', value: 2022 },                                    
                ]`)
              q-field(label="Total Population" helper="Selected population @ selected year")
                q-input(v-model="nPopulation")
              q-field(label="Adults %" helper="Proportion of population >= 15y")
                q-slider(v-model="pAdults" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pAdults*100)}%`")
              q-field(label="Stroke Incidence" helper="Number of strokes/100,000 adults /yr")
                q-input(v-model="pIncidence")

            q-collapsible(group="parameters" label="Radiology" icon="scanner" separator)
              q-field(label="Ischemic %" helper="% of all strokes that are ischemic (81%)")
                q-slider(v-model="pIschemic" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pIschemic*100)}%`")
              q-field(label="LVO %" helper="% of ischemic stroke with LVO (40%)")
                q-slider(v-model="pLVO" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pLVO*100)}%`")

            q-collapsible(group="parameters" label="Clinical" icon="favorite" separator)
              q-field(label="Moderate+ Deficit" helper="% of LVO with NIHSS >= 6 (80%)")
                q-slider(v-model="pModerate" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pModerate*100)}%`")

            q-collapsible(group="parameters" label="Onset Time" icon="timelapse" separator)
              q-field(label="Onset < 12h" helper="% with onset (known or last seen well) < 12h (78%)")
                q-slider(v-model="pKTO" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pKTO*100)}%`")

            q-collapsible(group="parameters" label="Early Presenters" icon="timer" separator)
              q-field(label="Onset < 4h" helper="% onset to door < 4h (74%)")
                q-slider(v-model="pLT4h" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pLT4h*100)}%`")
              q-field(label="No Exclusions" helper="% with mRS<2 and ASPECTS>6 (66%)")
                q-slider(v-model="pEarlyInclusion" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pEarlyInclusion*100)}%`")
              q-field(label="Recannalized with IVT" helper="% with resolution of deficit following IVT (5%)")
                q-slider(v-model="pRecannalized" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pRecannalized*100)}%`")       
            
            q-collapsible(group="parameters" label="Late Presenters" icon="timer_off" separator)
              q-field(label="Onset unknown" helper="% with unknown onset and LSW > 12h (15%)")
                q-slider(v-model="pSUTO" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pSUTO*100)}%`")
              q-field(label="Onset > 12h" helper="% with known onset > 12h ago (7%)")
                q-slider(v-model="pGT12h" :min="0.01" :max="1.0" :step="0.01" :decimals="2" readonly label-always :label-value="`${Math.round(pGT12h*100)}%`")
              q-field(label="Favourable CTP" helper="% with favourable CTP (57%)")
                q-slider(v-model="pCTPGood" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pCTPGood*100)}%`")
          
            q-collapsible(group="parameters" label="Time of Day" icon="access_time" separator)
              q-field(label="Overnight" helper="% presenting overnight")
                q-slider(v-model="pOvernight" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pOvernight*100)}%`")
          
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

      .col-sm-8
        q-tabs(color="secondary")
          q-tab(default name="graph" slot="title" label="Flowchart")
          q-tab(name="table" slot="title" label="Table")
          q-tab-pane(name="table")
            q-scroll-area(style="height: 73vh; padding:10px;"  :thumb-style="{ left: '0px', width: '5px' }")
              .row.justify-center
                table.q-table.horizontal-separator
                  thead
                    tr
                      th
                      th(v-for="year in tableYears") {{ year }}
                  tbody
                    tr(v-if="bIVTandPSI")
                      th IVT and PSI
                    tr(v-if="bIVTandPSI" v-for="dhb in sPopulations")
                      td {{ dhb }}
                      td(v-for="year in tableYears") {{ getIVTPSI([dhb], year) }}
                    tr(v-if="bIVTandPSI")
                      td Total
                      td(v-for="year in tableYears") {{ getIVTPSI(sPopulations, year) }}
                    
                    tr
                      th PSI (+/- IVT)
                    tr(v-for="dhb in sPopulations")
                      td {{ dhb }}
                      td(v-for="year in tableYears") {{ getTotalPSI([dhb], year) }}
                    tr
                      td Total
                      td(v-for="year in tableYears") {{ getTotalPSI(sPopulations, year) }}
                    
                    tr(v-if="bPSIperDay")
                      th PSI/Day
                    tr(v-if="bPSIperDay" v-for="dhb in sPopulations")
                      td {{ dhb }}
                      td(v-for="year in tableYears") {{ getPSIperDay([dhb], year) }}
                    tr(v-if="bPSIperDay")
                      td Total
                      td(v-for="year in tableYears") {{ getPSIperDay(sPopulations, year) }}
                    
                    tr(v-if="bPSIperNight")
                      th PSI/Night
                    tr(v-if="bPSIperNight" v-for="dhb in sPopulations")
                      td {{ dhb }}
                      td(v-for="year in tableYears") {{ getPSIperNight([dhb], year) }}
                    tr(v-if="bPSIperNight")
                      td Total
                      td(v-for="year in tableYears") {{ getPSIperNight(sPopulations, year) }}          
          q-tab-pane(name="graph")
            mermaid-viewer(:source="mmdTemplate(this)" :maxwidth="true" title="PSI" :presets=`[
              { label: 'Zoom: Demographics', icon: 'people', zoom: 4.5, x: -1454, y: -3 },
              { label: 'Zoom: Early presenters', icon: 'timer', zoom: 2.5, x: 110, y: -621 },
              { label: 'Zoom: Late presenters', icon: 'timer_off', zoom: 2.5, x: -311, y: -762 }
            ]`)
</template>

<script>
import { Toast, QTabs, QTabPane, QTab, QScrollArea, QTooltip, QSlideTransition, QLayout, QToolbar, QToolbarTitle, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QCard, QCollapsible, QBtn, QInput, QSlider, QField, QSelect, QRadio, QCheckbox } from 'quasar'
import MermaidViewer from './MermaidViewer'
import 'quasar-extras/animate/fadeOutUp.css'
import 'quasar-extras/animate/fadeInDown.css'
import graphSource from './psi.hbs'
import numeral from 'numeral'
import DHBs from './dhbs.js'
import Regions from './regions.js'

export default {
  name: 'psi',
  components: {
    QTabs, QTabPane, QTab, QScrollArea, QTooltip, MermaidViewer, QSlideTransition, QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCard, QCollapsible, QSelect, QRadio, QCheckbox
  },
  data () {
    return {
      mmdTemplate: graphSource,
      numeral: numeral,
      showTable: false,
      bIVTandPSI: false,
      bPSIperDay: true,
      bPSIperNight: true,
      tableYears: [2018, 2019, 2020, 2021, 2022],
      nPopulation: 10000,
      nYear: 2018,
      pPopulationGrowth: 2.5,
      sRegions: ['Metro'],
      sPopulations: ['Auckland', 'Counties Manukau', 'Waitemata'],
      pAdults: 0.8,
      pIncidence: 147,
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
      DHBs: DHBs,
      Regions: Regions
    }
  },
  watch: {
    nCalculatedPopulation: function (newPop) {
      this.nPopulation = newPop
    },
    sRegions: function (newRegions) {
      var self = this
      var getRegionDHBs = function (regionName) {
        var region = self.Regions.find(region => region.value === regionName)
        if (region !== undefined) return region.dhbs
      }
      this.sPopulations = []
      newRegions.forEach(function (region) {
        self.sPopulations = self.sPopulations.concat(getRegionDHBs(region))
      })
    }
  },
  computed: {
    nCalculatedPopulation: function () { return this.getCalculatedPopulation(this.sPopulations, this.nYear) },
    nAdults: function () { return Math.round(this.nPopulation * this.pAdults) },
    nStrokes: function () { return Math.round(this.nAdults * (this.pIncidence / 100000)) },

    nIschemic: function () { return Math.round(this.nStrokes * this.pIschemic) },
    pHemorrhagic: function () { return (1.0 - this.pIschemic) },
    nHemorrhagic: function () { return Math.round(this.nStrokes * this.pHemorrhagic) },

    nLVO: function () { return Math.round(this.nIschemic * this.pLVO) },
    pSVO: function () { return (1.0 - this.pLVO) },
    nSVO: function () { return Math.round(this.nIschemic * this.pSVO) },

    nModerate: function () { return Math.round(this.nLVO * this.pModerate) },
    pMild: function () { return (1.0 - this.pModerate) },
    nMild: function () { return Math.round(this.nLVO * this.pMild) },

    nKTO: function () { return Math.round(this.nModerate * this.pKTO) },
    nLT4h: function () { return Math.round(this.nKTO * this.pLT4h) },
    nEarlyInclusion: function () { return Math.round(this.nLT4h * this.pEarlyInclusion) },
    pEarlyExclusion: function () { return (1.0 - this.pEarlyInclusion) },
    nEarlyExclusion: function () { return Math.round(this.nLT4h * this.pEarlyExclusion) },
    nPSIReqd: function () { return Math.round(this.nEarlyInclusion * this.pNotRecannalized) },
    pNotRecannalized: function () { return (1.0 - this.pRecannalized) },
    nPSINotReqd: function () { return Math.round(this.nEarlyInclusion * this.pRecannalized) },

    pGT4h: function () { return (1.0 - this.pLT4h) },
    nGT4h: function () { return Math.round(this.nKTO * this.pGT4h) },
    nSUTO: function () { return Math.round(this.nModerate * this.pSUTO) },
    nLate: function () { return (this.nGT4h + this.nSUTO) },
    pGT12h: function () { return (1.0 - this.pKTO - this.pSUTO) },
    nTooLate: function () { return (this.nModerate - this.pGT12h) },

    nLateInclusion: function () { return Math.round(this.nLate * this.pLateInclusion) },
    pLateExclusion: function () { return (1.0 - this.pLateInclusion) },
    nLateExclusion: function () { return Math.round(this.nLate * this.pLateExclusion) },
    nCTPGood: function () { return Math.round(this.nLateInclusion * this.pCTPGood) },
    pCTPBad: function () { return (1.0 - this.pCTPGood) },
    nCTPBad: function () { return Math.round(this.nLateInclusion * this.pCTPBad) },

    nTotalPSI: function () { return (this.nPSIReqd + this.nCTPGood) }
  },
  mounted () {
    this.nPopulation = this.nCalculatedPopulation
    Toast.create({
      html: 'Click the menu icon in the top left of the toolbar to display the menu',
      icon: 'menu',
      timeout: 5000
    })
  },
  methods: {
    getCalculatedPopulation: function (sPopulations, year) {
      var x = 0
      sPopulations.forEach(o1 => {
        x = x + this.DHBs.find(o2 => o2.value === o1).n
      })
      x = x * Math.pow(1.0 + (this.pPopulationGrowth / 100), year - 2017)
      return Math.round(x)
    },
    getTotalPSI: function (sPopulations, year) {
      var x = this.getCalculatedPopulation(sPopulations, year)
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
