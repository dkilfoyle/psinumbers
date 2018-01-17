module.exports = {
  pAdults: { name: 'pAdults', val: 0.8, default: 0.8, group: 'Demographics', label: 'Adults', helper: '% of population that are aged >= 15y' },
  pIncidence: { name: 'pIncidence', val: 192, default: 192, type: 'number', group: 'Demographics', label: 'Stroke Incidence', helper: 'Number of strokes/100,000 adults /yr' },
  pIschemic: { name: 'pIschemic', val: 0.81, default: 0.81, group: 'Radiology', label: 'Ischemic', helper: '% of all strokes that are ischemic' },
  pIVT: { name: 'pIVT', val: 0.15, default: 0.15, group: 'Clinical', label: 'IVT', helper: '% of ischemic stroke suitable for IVT' },
  pOvernight: { name: 'pOvernight', val: 0.18, default: 0.18, group: 'Time of Day', label: 'Overnight', helper: '% of IVT presenting overnight' },
  pAfterhours: { name: 'pAfterhours', val: 0.61, default: 0.61, group: 'Time of Day', label: 'After hours', helper: '% of IVT presenting after hours' }
}
