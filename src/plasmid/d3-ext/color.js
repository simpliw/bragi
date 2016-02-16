/**
 * Created by bqxu on 16/2/2.
 */
var fill = (el, color, rule)=> {
  el.attr("fill", color).attr("fill-rule", rule);
};


var COL_GE_A = 'red';
var COL_GE_C = 'blue';
var COL_GE_G = '#BFAF29';
var COL_GE_T = 'green';
var COL_GE_N = 'grey';
var COL_GE_U = 'black';

var col_ge = function (data) {
  switch (data) {
    case 'a' :
      return COL_GE_A;
      break;
    case 'c' :
      return COL_GE_C;
      break;
    case 'g' :
      return COL_GE_G;
      break;
    case 't':
      return COL_GE_T;
      break;
    case 'u':
      return COL_GE_U;
      break;
    case 'n':
      return COL_GE_N;
      break;
    default:
      return null;
  }
};

class ColorStore {

  constructor() {
    this.color = d3.scale.category20();
  }

  getColor(index) {
    return d3.rgb(this.color(index));
  }
}

export {col_ge,ColorStore}
