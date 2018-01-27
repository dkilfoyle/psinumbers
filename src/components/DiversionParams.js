module.exports = {
  pAdults: { name: 'pAdults', val: 0.8, default: 0.8, group: 'Demographics', label: 'Adults', helper: '% of population that are aged >= 15y' },
  pIncidence: { name: 'pIncidence', val: 192, default: 192, type: 'number', group: 'Demographics', label: 'Stroke Incidence', helper: 'Number of strokes/100,000 adults /yr' },
  pHyperacute: { name: 'pHyperacute', val: 0.55, default: 0.55, group: 'Onset Time', label: 'Hyper-acute', helper: '% of all strokes that are hyperacute' },
  pAfterhours: { name: 'pAfterhours', val: 0.61, default: 0.61, group: 'Onset Time', label: 'After-hours', helper: '% of hyperacute stroke that present after-hours' },
  pPASTAPos: { name: 'pPASTAPos', val: 0.50, default: 0.50, group: 'Clinical', label: 'PASTA Positive', helper: '% of hyperacute stroke that pass the PASTA screen' },
  pMimics: { name: 'pMimics', val: 0.37, default: 0.37, group: 'Clinical', label: 'Mimics', helper: 'Additional % of PASTA that are mimics' }
}
