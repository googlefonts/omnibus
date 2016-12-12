import scrollSnap from '../../custom_modules/scrollsnap-polyfill.js';
import scrollMonitor from '../../custom_modules/scrollMonitor.js';
import gfBadge from '../../custom_modules/googlefontsbadge.js';

const containerElement = document.getElementsByClassName('js-main');
const containerMonitor = scrollMonitor.createContainer(containerElement);
const arrowIntro = document.getElementsByClassName('js-arrow-intro');
const arrowAsap = document.getElementsByClassName('js-arrow-asap');
const arrowFaustina = document.getElementsByClassName('js-arrow-faustina');
const arrowManuale = document.getElementsByClassName('js-arrow-manuale');
const arrowArchivo = document.getElementsByClassName('js-arrow-archivo');
const arrowSaira = document.getElementsByClassName('js-arrow-saira');

function checkArrowClass(arrowClass) {
  for(var i = 0; i < arrowClass.length; i++) {
    if (arrowClass[i].classList.contains('js-arrow-right')) {
      arrowClass[i].classList.remove('js-arrow-right');
      arrowClass[i].classList.add('js-arrow-left');
    }
    else {
      arrowClass[i].classList.remove('js-arrow-left');
      arrowClass[i].classList.add('js-arrow-right');
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

function clickArrow(arrowClass) {
  for(var i = 0; i < arrowClass.length; i++) {
    arrowClass[i].onclick = function() {
      console.log('Arrow Intro Clicked!');
    };
  }
}

checkClassInViewport(arrowAsap, arrowIntro);
checkClassInViewport(arrowFaustina, arrowAsap);
checkClassInViewport(arrowManuale, arrowFaustina);
checkClassInViewport(arrowArchivo, arrowManuale);
checkClassInViewport(arrowSaira, arrowArchivo);

clickArrow(arrowIntro);

gfBadge();
