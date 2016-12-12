import gfBadge from '../../custom_modules/googlefontsbadge.js';
import Hypher from '../../custom_modules/vanilla-hypher.js';
import scrollSnap from '../../custom_modules/scrollsnap-polyfill.js';
import scrollMonitor from '../../custom_modules/scrollMonitor.js';

const h = new hyphenate('p.u-hyphenate', 'en-us');
gfBadge();

const containerElement = document.getElementsByClassName('js-main');
const containerMonitor = scrollMonitor.createContainer(containerElement);

const arrowIntro = document.getElementsByClassName('js-arrow-intro');
const arrowAsap = document.getElementsByClassName('js-arrow-asap');
const arrowFaustina = document.getElementsByClassName('js-arrow-faustina');
const arrowManuale = document.getElementsByClassName('js-arrow-manuale');
const arrowArchivo = document.getElementsByClassName('js-arrow-archivo');
const arrowSaira = document.getElementsByClassName('js-arrow-saira');

function checkArrowClass(arrowClass) {
  for(var i = 0; i < arrowClass.length; i++)
  {
    if (arrowClass[i].classList.contains('js-right')) {
      arrowClass[i].classList.remove('js-right');
      arrowClass[i].classList.add('js-left');
    }
    else {
      arrowClass[i].classList.remove('js-left');
      arrowClass[i].classList.add('js-right');
    }
  }
}

function checkClassInViewport(monitorClass, arrowClass) {
  containerMonitor.create(monitorClass).enterViewport(function() {
    checkArrowClass(arrowClass);
  });
  containerMonitor.create(monitorClass).exitViewport(function() {
    checkArrowClass(arrowClass);
  });
}

checkClassInViewport(arrowAsap, arrowIntro);
checkClassInViewport(arrowFaustina, arrowAsap);
checkClassInViewport(arrowManuale, arrowFaustina);
checkClassInViewport(arrowArchivo, arrowManuale);
checkClassInViewport(arrowSaira, arrowArchivo);

// document.addEventListener('DOMContentLoaded', function eventListener() {
//   button.onclick = function buttonOnClick() {
//     if (button.classList.contains('js-right')) {
//       document.getElementById('main').scrollLeft += 100;
//       button.classList.remove('js-right');
//       button.classList.add('js-left');
//     }
//     else {
//       document.getElementById('main').scrollLeft -= 100;
//       button.classList.remove('js-left');
//       button.classList.add('js-right');
//     }
//   };
// }, false);
