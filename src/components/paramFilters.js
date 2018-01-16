export default {
  filters: {
    getHelper: function (param) {
      var x = ''
      if (param.type === undefined) {
        x = param.helper + ' (' + this.numeral(param.default).format('0%') + ')'
      }
      else {
        x = param.helper + ' (' + param.default + ')'
      }
      return (x)
    }
  }
}
