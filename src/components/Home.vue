<template lang="pug">
  q-layout(ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}")
    q-toolbar(slot="header" class="glossy")
      q-btn.flat(@click="$refs.layout.toggleLeft()")
        q-icon(name="menu")
      q-toolbar-title PSI Number Estimator
        div(slot="subtitle") Adapted from McKeen et al. ESJ 2017; 24(3): 319-326
    .layout-padding
      .row.md-gutter
        .col-4
          q-list
            q-list-header Parameters
            q-item-separator

            q-collapsible(group="parameters" label="Demographics" icon="people" separator)
              q-field(label="Populations")
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
                q-slider(v-model="pNIHSS" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pNIHSS*100)}%`")

            q-collapsible(group="parameters" label="Onset Time" icon="timelapse" separator)
              q-field(label="Onset < 12h" helper="% with onset (known or last seen well) < 12h (78%)")
                q-slider(v-model="pKTO" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pKTO*100)}%`")

            q-collapsible(group="parameters" label="Early Presenters" icon="timer" separator)
              q-field(label="Onset < 4h" helper="% onset to door < 4h (74%)")
                q-slider(v-model="pLT4h" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pLT4h*100)}%`")
              q-field(label="No Exclusions" helper="% with mRS<2 and ASPECTS>6 (66%)")
                q-slider(v-model="pInclusion" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pInclusion*100)}%`")
              q-field(label="Recannalized with IVT" helper="% with resolution of deficit following IVT (5%)")
                q-slider(v-model="pRecannalized" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pRecannalized*100)}%`")       
            
            q-collapsible(group="parameters" label="Late Presenters" icon="timer_off" separator)
              q-field(label="Onset unknown" helper="% with unknown onset and LSW > 12h (15%)")
                q-slider(v-model="pSUTO" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pSUTO*100)}%`")
              q-field(label="Onset > 12h" helper="% with known onset > 12h ago (7%)")
                q-input(v-model="pGT12h" :max-decimals="2")
              q-field(label="Favourable CTP" helper="% with favourable CTP (57%)")
                q-slider(v-model="pCTPGood" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pCTPGood*100)}%`")
          
          q-list
            q-list-header Settings
            q-item-separator
            q-collapsible(group="settings" label="View" icon="view_quilt" separator)
              .row
                q-checkbox(v-model="showTable" label="Show Table")
              .row
            q-collapsible(group="settings" label="Populations" icon="local_hospital" separator)
              q-field(:label="dhb.label" v-for="dhb in DHBs" :key="dhb.label")
                q-input(v-model="dhb.n" type="number")

        .col-8
          q-list
            q-item(v-if="showTable")
              q-item-main
                h6 Summary
                table.q-table
                  thead
                    tr
                      th
                      th 2018
                      th 2019
                      th 2020
                      th 2021
                      th 2022
                  tbody
                    tr
                      td Total PSI
                      td {{ getTotalPSI(sPopulations, 2018) }}
                      td {{ getTotalPSI(sPopulations, 2019) }}
                      td {{ getTotalPSI(sPopulations, 2020) }}
                      td {{ getTotalPSI(sPopulations, 2021) }}
                      td {{ getTotalPSI(sPopulations, 2022) }}
            q-item-separator(v-if="showTable")
            q-item
              q-item-main
                mermaid-viewer(:source="mermaidCode")
                  q-btn(@click="showTable = !showTable" flat icon="list" color="faded")

</template>

<script>
import { QLayout, QToolbar, QToolbarTitle, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QCard, QCollapsible, QBtn, QInput, QSlider, QField, QSelect, QRadio, QCheckbox } from 'quasar'
import MermaidViewer from './MermaidViewer'

export default {
  name: 'home',
  components: {
    MermaidViewer, QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCard, QCollapsible, QSelect, QRadio, QCheckbox
  },
  data () {
    return {
      showTable: false,
      nPopulation: 10000,
      nYear: 2018,
      pPopulationGrowth: 2.5,
      sPopulations: ['ADHB', 'CMDHB', 'WDHB'],
      pAdults: 0.8,
      pIncidence: 147,
      pIschemic: 0.81,
      pLVO: 0.40,
      pNIHSS: 0.8,
      pKTO: 0.78,
      pSUTO: 0.15,
      pLT4h: 0.74,
      pInclusion: 0.66,
      pLateInclusion: 0.25,
      pCTPGood: 0.57,
      pRecannalized: 0.05,
      DHBs: [
        { label: 'ADHB', value: 'ADHB', n: 510450 },
        { label: 'CMDHB', value: 'CMDHB', n: 541080 },
        { label: 'WDHB', value: 'WDHB', n: 597510 },
        { label: 'Midland', value: 'Midland', n: 853725 },
        { label: 'Northland', value: 'Northland', n: 170560 }]
    }
  },
  watch: {
    nCalculatedPopulation: function (newPop) {
      this.nPopulation = newPop
    }
  },
  computed: {
    nCalculatedPopulation: function () { return this.getCalculatedPopulation(this.sPopulations, this.nYear) },
    nAdults: function () { return Math.round(this.nPopulation * this.pAdults) },
    nStrokes: function () { return Math.round(this.nAdults * (this.pIncidence / 100000)) },
    nIschemic: function () { return Math.round(this.nStrokes * this.pIschemic) },
    nLVO: function () { return Math.round(this.nIschemic * this.pLVO) },
    nModerate: function () { return Math.round(this.nLVO * this.pNIHSS) },
    nKTO: function () { return Math.round(this.nModerate * this.pKTO) },
    nSUTO: function () { return Math.round(this.nModerate * this.pSUTO) },
    pGT12h: function () { return Number(1.0 - this.pKTO - this.pSUTO).toFixed(2) },
    nLT4h: function () { return Math.round(this.nKTO * this.pLT4h) },
    nGT4h: function () { return Math.round(this.nKTO * (1.0 - this.pLT4h)) },
    nLate: function () { return (this.nGT4h + this.nSUTO) },
    nInclusion: function () { return Math.round(this.nLT4h * this.pInclusion) },
    nLateInclusion: function () { return Math.round(this.nLate * this.pLateInclusion) },
    nCTPGood: function () { return Math.round(this.nLateInclusion * this.pCTPGood) },
    nPSIReqd: function () { return Math.round(this.nInclusion * (1.0 - this.pRecannalized)) },
    nTotalPSI: function () { return (this.nPSIReqd + this.nCTPGood) },
    mermaidCode: function () {
      return (`
graph TD
  Population(Population<br>N=${this.nPopulation}) -- ${this.pAdults * 100}% Adult --> Adults[Adults<br>N=${this.nAdults}]
  Adults -- Stroke Incidence<br>${this.pIncidence}/100,000 --> Strokes[Strokes<br>N=${this.nStrokes}]

  Strokes -- Ischemic ${this.pIschemic * 100}% --> Ischemic[Ischemic<br>N=${this.nIschemic}]
  Strokes -- Hemorrhagic ${Math.round((1.0 - this.pIschemic) * 100)}% --> ICH(Hemorrhage<br>N=${this.nStrokes - this.nIschemic})

  Ischemic -- LVO ${this.pLVO * 100}% --> LVO[LVO<br>N=${this.nLVO}]
  Ischemic -- SVO ${Math.round((1.0 - this.pLVO) * 100)}% --> SVO(SVO<br>N=${this.nIschemic - this.nLVO})

  LVO -- NIHSS>=6 ${this.pNIHSS * 100}% --> Moderate[Moderate-Severe<br>N=${this.nModerate}]
  LVO -- NIHSS< 6 ${Math.round((1.0 - this.pNIHSS) * 100)}% --> Mild(Mild<br>N=${this.nLVO - this.nModerate})

  Moderate -- Onset/LSW <12h<br>${this.pKTO * 100}% --> KTO[KTO<br>${this.nKTO}]
  Moderate -- Unknown Onset<br>${this.pSUTO * 100}% --> SUTO[SUTO<br>${this.nSUTO}]
  Moderate -- Known Onset > 12h<br>${Math.round(this.pGT12h * 100)}% --> TooLate(Too Late<br>${this.nModerate - this.nKTO - this.nSUTO})

  subgraph Early
  KTO -- <4h ${this.pLT4h}% --> LT4h[0-4h<br>${this.nLT4h}]
  LT4h -- No Exclusions<br>${this.pInclusion * 100}% --> Inclusion[IVT and PSI Eligible<br>${this.nInclusion}]
  LT4h -- mRS>2, ASPECTS<6<br>${Math.round((1.0 - this.pInclusion) * 100)}% --> Ineligible[Ineligible<br>${this.nLT4h - this.nInclusion}]
  Inclusion -- Lysis recanalized ${this.pRecannalized * 100}% --> Lysed[PSI not required<br>${this.nInclusion - this.nPSIReqd}]
  Inclusion -- No recannalization ${Math.round((1.0 - this.pRecannalized) * 100)}% --> PSIReqd[PSI required<br>${this.nPSIReqd}]
  end

  subgraph Late
  KTO -- >4h ${Math.round((1.0 - this.pLT4h) * 100)}% --> GT4h[4-12h <br>${this.nGT4h}]
  GT4h-->Late[Late<br>${this.nLate}]
  SUTO-->Late
  Late -- No Exclusions<br>${this.pLateInclusion * 100}% --> LateInclusion[No Exclusions<br>${this.nLateInclusion}]
  Late -- mRS>2, ASPECTS<6<br>${Math.round((1.0 - this.pLateInclusion) * 100)}% --> Exclusion[Ineligible<br>${this.nLate - this.nLateInclusion}]
  LateInclusion -- Favourable CTP ${Math.round(this.pCTPGood * 100)}% --> CTPGood[Favourable CTP<br>${this.nCTPGood}]
  LateInclusion -- Unfavourable CTP ${Math.round((1.0 - this.pCTPGood) * 100)}% --> CTPBad[Unfavourable CTP<br>${this.nLateInclusion - this.nCTPGood}]
  end

  CTPGood-->TotalPSI[Total PSI<br>N=${this.nTotalPSI}]
  PSIReqd-->TotalPSI

  style SVO fill:#d3d3d3,stroke:#808080
  style Ineligible fill:#d3d3d3,stroke:#808080
  style ICH fill:#d3d3d3,stroke:#808080
  style CTPBad fill:#d3d3d3,stroke:#808080
  style Exclusion fill:#d3d3d3,stroke:#808080
  style TooLate fill:#d3d3d3,stroke:#808080
  style Mild fill:#d3d3d3,stroke:#808080

      `)
    }
  },
  mounted () {
    this.nPopulation = this.nCalculatedPopulation
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
      x = x * this.pAdults * (this.pIncidence / 100000) * this.pIschemic * this.pLVO * this.pNIHSS

      var early = x * this.pKTO * this.pLT4h * this.pInclusion * (1.0 - this.pRecannalized)
      var gt4h = x * this.pKTO * (1.0 - this.pLT4h)
      var suto = x * this.pSUTO
      var late = (suto + gt4h) * this.pLateInclusion * this.pCTPGood

      return Math.round(early + late)
    }
  }
}
</script>

<style>
</style>
