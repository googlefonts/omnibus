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
const arrowIndex = document.getElementsByClassName('js-arrow-index')[0];
const arrowAsap = document.getElementsByClassName('js-arrow-asap')[0];
const arrowFaustina = document.getElementsByClassName('js-arrow-faustina')[0];
const arrowManuale = document.getElementsByClassName('js-arrow-manuale')[0];
const arrowArchivo = document.getElementsByClassName('js-arrow-archivo')[0];
const arrowSaira = document.getElementsByClassName('js-arrow-saira')[0];

const mobile = mobileDetect();

function getScrollPositions(colWidth) {
  return {
    index: 0,
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
    snapObject.unbind();
    unbindEndOfPageListener();
    location.hash = '#index';
  };
}

function bindKeyPress() {
  document.addEventListener('keydown', throttle(function(e) {
    snapObject.unbind();

    colWidth = Math.round(window.innerWidth * 0.9);
    scrollPos = containerElement.scrollLeft;
    length = colWidth;
    duration = 300;
    start = null;

    if (e.keyCode === 39) {
      direction = 'right';
      if (isEnd()) {
        location.hash = '#index';
      } else {
        requestAnimationFrame(animate);
      }
    } else if (e.keyCode === 37) {
      direction = 'left';
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
  duration = 300;
  start = null;

  const scrollPositions = getScrollPositions(colWidth);

  switch (location.hash) {
  case '#faustina':
    direction = getDirection(scrollPos, scrollPositions.faustina);
    length = (direction === 'left')
      ? scrollPos - scrollPositions.faustina
      : scrollPos + (scrollPositions.faustina - scrollPos);
    break;
  case '#manuale':
    direction = getDirection(scrollPos, scrollPositions.manuale);
    length = (direction === 'left')
      ? scrollPos - scrollPositions.manuale
      : scrollPos + (scrollPositions.manuale - scrollPos);
    break;
  case '#archivo':
    direction = getDirection(scrollPos, scrollPositions.archivo);
    length = (direction === 'left')
      ? scrollPos - scrollPositions.archivo
      : scrollPos + (scrollPositions.archivo - scrollPos);
    break;
  case '#asap-condensed':
    direction = getDirection(scrollPos, scrollPositions.asapCondensed);
    length = (direction === 'left')
      ? scrollPos - scrollPositions.asapCondensed
      : scrollPos + (scrollPositions.asapCondensed - scrollPos);
    break;
  case '#saira':
    direction = getDirection(scrollPos, scrollPositions.saira);
    length = (direction === 'left')
      ? scrollPos - scrollPositions.saira
      : scrollPos + (scrollPositions.saira - scrollPos);
    break;
  case '#index':
    direction = getDirection(scrollPos, scrollPositions.index);
    length = (direction === 'left')
      ? scrollPos - scrollPositions.index
      : scrollPos + (scrollPositions.index - scrollPos);
    break;
  }

  requestAnimationFrame(animate);
}

function updateHash() {
  window.removeEventListener('hashchange', scrollToColumn, false);
  const scrollPosition = containerElement.scrollLeft;
  colWidth = Math.round(window.innerWidth * 0.9);
  const scrollPositions = getScrollPositions(colWidth);

  if (scrollPosition === scrollPositions.index) {
    location.hash = '#index';
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
      location.hash = '#index';
    }, 700);
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
      location.hash = '#index';
    }, 700);
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

checkClassInViewport(arrowAsap, arrowIndex);
checkClassInViewport(arrowFaustina, arrowAsap);
checkClassInViewport(arrowManuale, arrowFaustina);
checkClassInViewport(arrowArchivo, arrowManuale);
checkClassInViewport(arrowSaira, arrowArchivo);

bindArrowClick(arrowIndex);
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
