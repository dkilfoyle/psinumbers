<template lang="pug">
  .layout-padding
    .row.md-gutter
      .col-sm-4
        q-list
          q-list-header IVT Parameters
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
            q-field(label="IVT %" helper="% of ischemic stroke suitable for IVT")
              q-slider(v-model="pIVT" :min="0.01" :max="1.0" :step="0.01" :decimals="2" label-always :label-value="`${Math.round(pIVT*100)}%`")

        q-list
          q-list-header Settings
          q-item-separator
          q-collapsible(group="settings" label="View" icon="view_quilt" separator)
            q-field(label="Show Table" helper="Show summary table")
              q-checkbox(v-model="showTable")
            .row
          q-collapsible(group="settings" label="Populations" icon="local_hospital" separator)
            q-field(:label="dhb.label" v-for="dhb in DHBs" :key="dhb.label")
              q-input(v-model="dhb.n" type="number")

      .col-sm-8
        q-list
          q-slide-transition
            div(v-show="showTable")
              q-list-header Summary Table
              q-item-separator
              q-item( key="tableItem")
                q-item-main
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
                        td IVT
                        td {{ getTotalIVT(sPopulations, 2018) }}
                        td {{ getTotalIVT(sPopulations, 2019) }}
                        td {{ getTotalIVT(sPopulations, 2020) }}
                        td {{ getTotalIVT(sPopulations, 2021) }}
                        td {{ getTotalIVT(sPopulations, 2022) }}    
          q-item-separator(v-show="showTable")
          q-item
            q-item-main
              mermaid-viewer(:source="mmdTemplate(this)" title="IVT" :maxwidth="false" :presets=`[
                { label: 'Full', icon: 'zoom_out_map', zoom: 0.614, x: 257, y: 21 }
              ]`)
                q-btn(@click="showTable = !showTable" flat icon="list" color="faded")
                  q-tooltip Show Table

</template>

<script>
import { Toast, QTooltip, QSlideTransition, QLayout, QToolbar, QToolbarTitle, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QCard, QCollapsible, QBtn, QInput, QSlider, QField, QSelect, QRadio, QCheckbox } from 'quasar'
import MermaidViewer from './MermaidViewer'
import 'quasar-extras/animate/fadeOutUp.css'
import 'quasar-extras/animate/fadeInDown.css'
import graphSource from './ivt.hbs'
import numeral from 'numeral'

export default {
  name: 'ivt',
  components: {
    QTooltip, MermaidViewer, QSlideTransition, QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QItem, QItemMain, QListHeader, QItemSeparator, QInput, QSlider, QField, QCard, QCollapsible, QSelect, QRadio, QCheckbox
  },
  data () {
    return {
      mmdTemplate: graphSource,
      numeral: numeral,
      showTable: false,
      nPopulation: 10000,
      nYear: 2018,
      pPopulationGrowth: 2.5,
      sPopulations: ['ADHB', 'CMDHB', 'WDHB'],
      pAdults: 0.8,
      pIncidence: 147,
      pIschemic: 0.81,
      pIVT: 0.15,
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
    },
    sides: function () {
      console.log('side change')
    }
  },
  computed: {
    nCalculatedPopulation: function () { return this.getCalculatedPopulation(this.sPopulations, this.nYear) },
    nAdults: function () { return Math.round(this.nPopulation * this.pAdults) },
    nStrokes: function () { return Math.round(this.nAdults * (this.pIncidence / 100000)) },

    nIschemic: function () { return Math.round(this.nStrokes * this.pIschemic) },
    pHemorrhagic: function () { return (1.0 - this.pIschemic) },
    nHemorrhagic: function () { return Math.round(this.nStrokes * this.pHemorrhagic) },

    nIVT: function () { return Math.round(this.nIschemic * this.pIVT) }
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
    getTotalIVT: function (sPopulations, year) {
      var x = this.getCalculatedPopulation(sPopulations, year)
      x = x * this.pAdults * (this.pIncidence / 100000) * this.pIschemic * this.pIVT
      return Math.round(x)
    }
  }
}
</script>

<style>
</style>
