import Hypher from '../../custom_modules/vanilla-hypher.js';
const h = new hyphenate('p.u-hyphenate', 'en-us');

function disableMainScroll() {
  main.style.overflowX = 'hidden';
}

function enableMainScroll() {
  main.style.overflowX = 'auto';
}