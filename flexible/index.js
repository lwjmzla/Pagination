const postcss = require('postcss');
const Flexible = require('./flexible');

module.exports = postcss.plugin('flexible', function (options) {
  return function (css, result) {
    const oldCssText = css.toString();
    // if (oldCssText.includes('label-msg')) {
    //   console.log(oldCssText);
    //   console.log('-----------------------------------------------------------------------------------------');
    // }
    const flexible = new Flexible(options);
    const newCssText = flexible.generateRem(oldCssText);
    // if (oldCssText.includes('label-msg')) {
    //   console.log(newCssText);
    // }
    result.root = postcss.parse(newCssText);
  };
});
