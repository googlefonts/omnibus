import scrollSnap from '../../custom_modules/scrollsnap.js';
import scrollMonitor from '../../custom_modules/scrollMonitor.js';
import gfBadge from '../../custom_modules/googlefontsbadge.js';
import widowFix from '../../custom_modules/widowFix.js';

const containerElement = document.getElementsByClassName('js-main')[0];
const containerMonitor = scrollMonitor.createContainer(containerElement);
const arrowIntro = document.getElementsByClassName('js-arrow-intro')[0];
const arrowAsap = document.getElementsByClassName('js-arrow-asap')[0];
const arrowFaustina = document.getElementsByClassName('js-arrow-faustina')[0];
const arrowManuale = document.getElementsByClassName('js-arrow-manuale')[0];
const arrowArchivo = document.getElementsByClassName('js-arrow-archivo')[0];
const arrowSaira = document.getElementsByClassName('js-arrow-saira')[0];

$(document).ready(function() {
  $('.js-widowfix').widowFix();
  scrollSnap.init(window, document, containerElement)
});

function checkArrowClass(arrowClass) {
  if (arrowClass.classList.contains('js-arrow-right')) {
    arrowClass.classList.remove('js-arrow-right');
    arrowClass.classList.add('js-arrow-left');
  }
  else {
    arrowClass.classList.remove('js-arrow-left');
    arrowClass.classList.add('js-arrow-right');
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

function easeInQuart(t, b, c, d) {
  return c*(t/=d)*t*t*t + b;
}

function clickArrow(arrowClass) {
  const colWidth = window.innerWidth * 0.9;
  arrowClass.onclick = function() {
    requestAnimationFrame(function animate() {
      const scrollNewCol = containerElement.scrollLeft % colWidth;
      if (arrowClass.classList.contains('js-arrow-right')) {
        containerElement.scrollLeft += easeInQuart(scrollNewCol, 1, 0.5, 10);
        if ((scrollNewCol - 50) < 0) {
          requestAnimationFrame(animate);
        }
      }
      else {
        containerElement.scrollLeft -= easeInQuart(scrollNewCol, 1, 0.5, 10);
        if ((scrollNewCol - 50) > 0) {
          requestAnimationFrame(animate);
        }
      }
    });
  };
}

$(function() {
  $('#asap').bind('click',function(event){
    var $anchor = $(this);
    $('#main').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().left
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
  });
});

checkClassInViewport(arrowAsap, arrowIntro);
checkClassInViewport(arrowFaustina, arrowAsap);
checkClassInViewport(arrowManuale, arrowFaustina);
checkClassInViewport(arrowArchivo, arrowManuale);
checkClassInViewport(arrowSaira, arrowArchivo);

clickArrow(arrowIntro);
clickArrow(arrowAsap);
clickArrow(arrowFaustina);
clickArrow(arrowManuale);
clickArrow(arrowArchivo);

gfBadge();
