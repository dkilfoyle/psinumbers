module.exports = {
  pAdults: { name: 'pAdults', val: 0.8, default: 0.8, group: 'Demographics', label: 'Adults %', helper: '% of population that are aged >= 15y' },
  pIncidence: { name: 'pIncidence', val: 192, default: 192, type: 'number', group: 'Demographics', label: 'Stroke Incidence', helper: 'Number of strokes/100,000 adults /yr' },

  pIschemic: { name: 'pIschemic', val: 0.81, default: 0.81, group: 'Radiology', label: 'Ischemic %', helper: '% of all strokes that are ischemic' },
  pLVO: { name: 'pLVO', val: 0.40, default: 0.40, group: 'Radiology', label: 'LVO %', helper: '% of all strokes that are ischemic' },

  pModerate: { name: 'pModerate', val: 0.8, default: 0.8, group: 'Clinical', label: 'Moderate+ Deficit', helper: '% of LVO with NIHSS >= 6' },

  pKTO: { name: 'pKTO', val: 0.78, default: 0.78, group: 'Onset Time', label: 'Onset < 12h', helper: '% with onset (known or last seen well) < 12h' },

  pLT4h: { name: 'pLT4h', val: 0.74, default: 0.74, group: 'Early Presenters', label: 'Onset < 4h', helper: '% onset to door < 4h' },
  pEarlyInclusion: { name: 'pEarlyInclusion', val: 0.66, default: 0.66, group: 'Early Presenters', label: 'No Exclusions', helper: '% with mRS<2 and ASPECTS>6' },
  pRecannalized: { name: 'pEarlyRecannalized', val: 0.05, default: 0.05, group: 'Early Presenters', label: 'Recannalized with IVT', helper: '% with resolution of deficit following IVT' },

  pSUTO: { name: 'pSUTO', val: 0.15, default: 0.15, group: 'Late Presenters', label: 'Onset unknown', helper: '% with unknown onset and LSW > 12h' },
  pGT12h: { name: 'pGT12h', val: 0.07, default: 0.07, group: 'Late Presenters', label: 'Onset > 12h', helper: '% with known onset > 12h ago' },
  pLateInclusion: { name: 'pLateInclusion', val: 0.25, default: 0.25, group: 'Late Presenters', label: 'No Exclusions', helper: '% with mRS<2 and ASPECTS>6' },
  pCTPGood: { name: 'pCTPGood', val: 0.57, default: 0.57, group: 'Late Presenters', label: 'Favourable CTP', helper: '% with favourable CTP' },

  pOvernight: { name: 'pOvernight', val: 0.10, default: 0.10, group: 'Time of Day', label: 'Overnight', helper: '% presenting overnight' }
}
