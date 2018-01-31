module.exports = {
  pAdults: { name: 'pAdults', val: 0.8, default: 0.8, group: 'Demographics', label: 'Adults', helper: '% of population that are aged >= 15y' },
  pIncidence: { name: 'pIncidence', val: 192, default: 192, type: 'number', group: 'Demographics', label: 'Stroke Incidence', helper: 'Number of strokes/100,000 adults /yr' },

  pAvailability2018: { name: 'pAvailability2018', val: 1.00, default: 1.00, group: 'Radiology', label: 'Resources 2018', helper: 'Availability in 2018 of sufficient 24/7 resources for hyperacute workup' },
  pAvailability2022: { name: 'pAvailability2022', val: 1.00, default: 1.00, group: 'Radiology', label: 'Resources 2022', helper: 'Availability in 2022 of sufficient 24/7 resources for hyperacute workup' },

  pIschemic: { name: 'pIschemic', val: 0.81, default: 0.81, group: 'Radiology', label: 'Ischemic', helper: '% of all strokes that are ischemic' },
  pLVO: { name: 'pLVO', val: 0.06 / 0.15, default: 0.06 / 0.15, group: 'Radiology', label: 'LVO %', helper: '% of 6-24h NIHSS>6 that are anterior LVO' },
  pCTPGood: { name: 'pCTPGood', val: 0.023 / 0.06, default: 0.023 / 0.06, group: 'Radiology', label: 'Favourable CTP', helper: '% with late presenter LVO with favourable CTP' },

  pModerate: { name: 'pModerate', val: 0.47, default: 0.47, group: 'Clinical', label: 'Moderate+ Deficit', helper: '% of ischemic strke with NIHSS >= 6' },

  pLSW624h: { name: 'pLSW624h', val: 0.30, default: 0.30, group: 'Onset Time', label: 'Last seen well < 24h', helper: '% with onset (known or last seen well) < 24h' },

  pOvernight: { name: 'pOvernight', val: 0.20, default: 0.20, group: 'Time of Day', label: 'Overnight', helper: '% presenting overnight' }
}
