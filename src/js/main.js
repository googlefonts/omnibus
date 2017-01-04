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

const snapConfig = {
  scrollTimeout: 100, // time in ms after which scrolling is considered finished.
  scrollTime: 300, // time for the smooth snap
  scrollSnapDestination: '0% 90%' // scroll-snap-destination css value
}

$(document).ready(function() {
  $('.js-widowfix').widowFix({linkFix: true});

  //init scrollSnap
  scrollSnap(containerElement).init(snapConfig)

  //scroll to relative column if there's a hash tag in the url
  if (location.hash !== '') {
    setTimeout(scrollToColumn, 500);
  }
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

function easeOutCubic(t, b, c, d){
  return c * ((t = t / d-1) * t * t + 1) + b;
}

function easeOutCirc(t, b, c, d) {
	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
}

function clickArrow(arrowClass) {
  arrowClass.onclick = function() {
    const colWidth = window.innerWidth * 0.9;
    const scrollPos = containerElement.scrollLeft
    const direction = arrowClass.classList.contains('js-arrow-right') ? 'right' : 'left';
    const length = colWidth / 1.5
    const duration = 500
    let start = null

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (direction === 'right') {
        if (elapsed > duration) {
          containerElement.scrollLeft = scrollPos + length;
        } else {
          containerElement.scrollLeft = easeOutCubic(elapsed, scrollPos, length, duration);
        }
      } else {
        if (elapsed > duration) {
          containerElement.scrollLeft = scrollPos - length;
        } else {
          containerElement.scrollLeft = easeOutCubic(elapsed, scrollPos, -length, duration);
        }
      }

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate)
  };
}


function scrollToColumn() {
  colWidth = window.innerWidth * 0.9;
  scrollPos = containerElement.scrollLeft
  direction = 'right';
  duration = 1000
  start = null
  offset = colWidth * 0.3

  switch (location.hash) {
    case '#asap':
      length = colWidth - offset
      break;
    case '#faustina':
      length = (colWidth * 2) - offset
      break;
    case '#manuale':
      length = (colWidth * 3) - offset
      break;
    case '#archivo':
      length = (colWidth * 4) - offset
      break;
    case '#saira':
      length = (colWidth * 5) - offset
      break;
  }

  requestAnimationFrame(animate)
}

// $(function() {
//   $('#asap').bind('click',function(event){
//     var $anchor = $(this);
//     $('#main').stop().animate({
//       scrollTop: $($anchor.attr('href')).offset().left
//     }, 1500, 'easeInOutExpo');
//     event.preventDefault();
//   });
// });

window.addEventListener("hashchange", scrollToColumn, false);

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
