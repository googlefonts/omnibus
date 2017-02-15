import ScrollSnap from '../../custom_modules/scrollsnap.js';
import scrollMonitor from '../../custom_modules/scrollMonitor.js';
import gfBadge from '../../custom_modules/googlefontsbadge.js';
import widowFix from '../../custom_modules/widowFix.js';
import fitText from '../../custom_modules/fittext.js';
import mobileDetect from '../../custom_modules/mobileDetect.js';
import throttle from 'lodash/throttle';

const containerElement = document.getElementsByClassName('js-main')[0];
const containerMonitor = scrollMonitor.createContainer(containerElement);
const columnElements = document.getElementsByClassName('l-section');
const arrowIntro = document.getElementsByClassName('js-arrow-intro')[0];
const arrowAsap = document.getElementsByClassName('js-arrow-asap')[0];
const arrowFaustina = document.getElementsByClassName('js-arrow-faustina')[0];
const arrowManuale = document.getElementsByClassName('js-arrow-manuale')[0];
const arrowArchivo = document.getElementsByClassName('js-arrow-archivo')[0];
const arrowSaira = document.getElementsByClassName('js-arrow-saira')[0];

const mobile = mobileDetect();

function getScrollPositions(colWidth) {
  return {
    intro: 0,
    faustina: colWidth,
    manuale: colWidth * 2,
    archivo: colWidth * 3,
    asapCondensed: colWidth * 4,
    saira: colWidth * 5,
  };
}

const snapConfig = {
  scrollTimeout: 50, // time in ms after which scrolling is considered finished.
  scrollTime: 300, // time for the smooth snap
  scrollSnapDestination: '0% 90%', // scroll-snap-destination css value
};

const snapObject = new ScrollSnap(containerElement);

$(document).ready(function() {
  $('.js-widowfix').widowFix({ linkFix: true });

  // init scrollSnap
  snapObject.init(snapConfig, updateHash);

  // scroll to relative column if there's a hash tag in the url
  if (location.hash !== '') {
    setTimeout(scrollToColumn, 300);
  }
});

function checkArrowClass(arrowClass) {
  if (arrowClass.classList.contains('js-arrow-right')) {
    arrowClass.classList.remove('js-arrow-right');
    arrowClass.classList.add('js-arrow-left');
  } else {
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

function easeInCubic(t, b, c, d) {
  return c * (t = t / d) * t * t + b;
}

function easeInOutCubic(t, b, c, d) {
  if ((t = t / d / 2) < 1) {return c / 2 * t * t * t + b;}
  return c / 2 * ((t = t - 2) * t * t + 2) + b;
}

let start;
let duration;
let direction;
let length;
let scrollPos;
let colWidth;
let timeOutId;

function animate(timestamp) {
  if (!start) {start = timestamp;}
  const elapsed = timestamp - start;

  if (direction === 'right') {
    if (elapsed > duration) {
      containerElement.scrollLeft = scrollPos + length;
    } else {
      containerElement.scrollLeft = easeInCubic(elapsed, scrollPos, length, duration);
    }
  } else if (elapsed > duration) {
    containerElement.scrollLeft = scrollPos - length;
  } else {
    containerElement.scrollLeft = easeInCubic(elapsed, scrollPos, -length, duration);
  }

  if (elapsed < duration) {
    requestAnimationFrame(animate);
  } else {
    // end animation
    updateHash();
    snapObject.init(snapConfig, updateHash);
  }
}

function bindArrowClick(arrowClass) {
  arrowClass.onclick = function() {
    snapObject.unbind();

    colWidth = Math.round(window.innerWidth * 0.9);
    scrollPos = containerElement.scrollLeft;
    direction = arrowClass.classList.contains('js-arrow-right') ? 'right' : 'left';
    length = colWidth;
    duration = 300;
    start = null;

    requestAnimationFrame(animate);
  };
}

function bindHomeClick(arrowClass) {
  arrowClass.onclick = function() {
    location.hash = '#intro';
  };
}

function bindKeyPress() {
  document.addEventListener('keydown', throttle(function(e) {

    colWidth = Math.round(window.innerWidth * 0.9);
    scrollPos = containerElement.scrollLeft;
    length = colWidth;
    duration = 300;
    start = null;

    if (e.keyCode === 39) {
      direction = 'right';
      if (isEnd()) {
        location.hash = '#intro';
      } else {
        snapObject.unbind();
        requestAnimationFrame(animate);
      }
    } else if (e.keyCode === 37) {
      direction = 'left';
      snapObject.unbind();
      requestAnimationFrame(animate);
    }
  }, 500));
}


function scrollToColumn() {
  snapObject.unbind();

  function getDirection(x, x2) {
    return x < x2 ? 'right' : 'left';
  }

  colWidth = Math.round(window.innerWidth * 0.9);
  scrollPos = containerElement.scrollLeft;
  start = null;

  const scrollPositions = getScrollPositions(colWidth);
  const sectionName = location.hash.substring(1).replace(/-([a-z])/g, g => g[1].toUpperCase());

  direction = getDirection(scrollPos, scrollPositions[sectionName]);
  length = (direction === 'left')
    ? scrollPos - scrollPositions[sectionName]
    : scrollPos + (scrollPositions[sectionName] - scrollPos);

  const distanceInColumns = length / colWidth;
  duration = 200 + distanceInColumns * 100;

  requestAnimationFrame(animate);
}

function updateHash() {
  window.removeEventListener('hashchange', scrollToColumn, false);
  unbindEndOfPageListener();

  const scrollPosition = containerElement.scrollLeft;
  colWidth = Math.round(window.innerWidth * 0.9);
  const scrollPositions = getScrollPositions(colWidth);

  if (scrollPosition === scrollPositions.intro) {
    location.hash = '#intro';
  } else if ((scrollPosition - colWidth / 2) < scrollPositions.faustina) {
    location.hash = '#faustina';
  } else if ((scrollPosition - colWidth / 2) < scrollPositions.manuale) {
    location.hash = '#manuale';
  } else if ((scrollPosition - colWidth / 2) < scrollPositions.archivo) {
    location.hash = '#archivo';
  } else if ((scrollPosition - colWidth / 2) < scrollPositions.asapCondensed) {
    location.hash = '#asap-condensed';
  } else if ((scrollPosition - colWidth / 2) < scrollPositions.saira) {
    location.hash = '#saira';
    bindEndOfPageListener();
  }
  if (timeOutId) {
    clearTimeout(timeOutId);
  }
  timeOutId = setTimeout(() => {
    window.addEventListener('hashchange', scrollToColumn, false);
  }, 50);
}

function wheelHandler(evt) {
  const delta = evt.deltaX;
  if (delta <= 0) {
    unbindEndOfPageListener();
  } else if (delta > 1) {
    unbindEndOfPageListener();
    setTimeout(function() {
      location.hash = '#intro';
    }, 400);
  }
}

let touchStart = 0;

function touchStartHandler(evt) {
  touchStart = evt.touches[0].clientX;
}

function touchMoveHandler(evt) {
  const touchDelta = evt.changedTouches[0].clientX - touchStart;
  if (touchDelta > 0) {
    unbindEndOfPageListener();
  } else {
    unbindEndOfPageListener();
    setTimeout(function() {
      location.hash = '#intro';
    }, 400);
  }
}

function isEnd() {
  return location.hash === '#saira';
}

function bindEndOfPageListener() {
  if (mobile) {
    containerElement.addEventListener('touchstart', touchStartHandler);
    containerElement.addEventListener('touchmove', touchMoveHandler);
  } else {
    containerElement.addEventListener('wheel', wheelHandler);
  }
}

function unbindEndOfPageListener() {
  if (mobile) {
    containerElement.removeEventListener('touchstart', touchStartHandler);
    containerElement.removeEventListener('touchmove', touchMoveHandler);
  } else {
    containerElement.removeEventListener('wheel', wheelHandler);
  }
}

window.addEventListener('hashchange', scrollToColumn, false);

checkClassInViewport(arrowAsap, arrowIntro);
checkClassInViewport(arrowFaustina, arrowAsap);
checkClassInViewport(arrowManuale, arrowFaustina);
checkClassInViewport(arrowArchivo, arrowManuale);
checkClassInViewport(arrowSaira, arrowArchivo);

bindArrowClick(arrowIntro);
bindArrowClick(arrowAsap);
bindArrowClick(arrowFaustina);
bindArrowClick(arrowManuale);
bindArrowClick(arrowArchivo);
bindHomeClick(arrowSaira);

bindKeyPress();

for (let i = 0; i < columnElements.length; i++) {
  gfBadge(columnElements[i]);
}

window.fitText(document.getElementsByClassName('js-asap-headline'), 1.28);
window.fitText(document.getElementsByClassName('js-saira-headline'), 0.57);
window.fitText(document.getElementsByClassName('js-archivo-headline'), 0.152);
window.fitText(document.getElementsByClassName('js-manuale-headline'));
