import mobileDetect from './mobileDetect';

module.exports = function(element) {
  /**
  * constraint to jumping to the next snap-point.
  * when scrolling further than SNAP_CONSTRAINT snap-points,
  * but the current distance is less than 1-0.18 (read: 18 percent),
  * the snap-will go back to the closer snap-point.
  */
  const CONSTRAINT = 1 - 0.18;

  // if scrolling for one snap-point only, the scroll distance must be at least 5% of the scroll-width.
  const FIRST_CONSTRAINT = 1 - 0.05;

  // minimum scroll distance in pixel
  const MIN_PX_CONSTRAINT = 5;

  /** when scrolling for more than SNAP_CONSTRAINT snap points,
  * a constraint is applied for scrolling to snap points in the distance.
  */
  const SNAP_CONSTRAINT = 2;

  const mobile = mobileDetect();

  let SCROLL_TIMEOUT;
  let SCROLL_TIME;
  let SCROLL_SNAP_DESTINATION;
  let onAnimationEnd;
  let timeOutId = null;
  let scrollStart = null;
  let animating = false;
  let lastObj;
  let lastScrollObj;
  let lastPos = null;
  let timer = 0;
  let scrollDirection;
  let newPos;
  let speedDelta;
  let absSpeed;
  let shouldSnap;
  let target;
  let deceleration = false;
  let previousDelta = 0;

  function checkScrollSpeed(pos) {
    function clear() {
      lastPos = null;
    }

    newPos = pos;
    let delta;
    if (lastPos !== null) {
      delta = newPos - lastPos;
    } else {
      delta = 0;
    }
    lastPos = newPos;
    timer && clearTimeout(timer);
    timer = setTimeout(clear, 50);
    return delta;
  }

  function saveDeclaration(obj) {
    obj.snapLengthUnit = parseSnapCoordValue(SCROLL_SNAP_DESTINATION);
    scrollDirection = +obj.snapLengthUnit.x.value ? 'scrollLeft' : 'scrollTop';
  }

  function setUpElement(element) {
    target = element === document ? document.body : element;

    element.addEventListener('scroll', startAnimation, false);
    saveDeclaration(target);
  }

  function startAnimation() {
    speedDelta = checkScrollSpeed(target[scrollDirection]);
    if (animating || speedDelta === 0) {
      return;
    }

    absSpeed = Math.abs(speedDelta);
    deceleration = absSpeed < previousDelta;

    if (deceleration && (absSpeed <= 5)) {
      shouldSnap = true;
    } else if (absSpeed > 5) {
      previousDelta = absSpeed;
      shouldSnap = false;
    } else if (absSpeed <= 5) {
      shouldSnap = false;
    }

    handler(target);
  }

  /**
  * scroll handler
  * this is the callback for scroll events.
  */
  function handler(target) {
    // use evt.target as target-element
    lastObj = target;

    lastScrollObj = getScrollObj(lastObj);

    // if currently animating, stop it. this prevents flickering.
    if (animationFrame) {
      // cross browser
      if (!cancelAnimationFrame(animationFrame)) {
        clearTimeout(animationFrame);
      }
    }

    // if a previous timeout exists, clear it.
    if (timeOutId) {
      // we only want to call a timeout once after scrolling..
      clearTimeout(timeOutId);
    } else {
      scrollStart = {
        y: lastScrollObj.scrollTop,
        x: lastScrollObj.scrollLeft,
      };
    }

    if ((mobile && absSpeed < 2 && shouldSnap) ||
            (!mobile && absSpeed < 5 && shouldSnap)) {
      animationHandler();
    } else if (absSpeed < 5) {
      timeOutId = setTimeout(animationHandler, SCROLL_TIMEOUT);
    } else if (lastScrollObj.scrollLeft === 0
        || lastScrollObj.scrollLeft === getWidth(lastScrollObj) * 5 * 0.9) {
      // custom check, should come from outside scrollsnap module
      onAnimationEnd();
    }

  }

  function animationHandler() {
    // detect direction of scroll. negative is up, positive is down.
    const direction = {
      y: (speedDelta > 0) ? 1 : -1,
      x: (speedDelta > 0) ? 1 : -1,
    };
    let snapPoint;

    // get the next snap-point to snap-to
    snapPoint = getNextSnapPoint(lastScrollObj, lastObj, direction);

    element.removeEventListener('scroll', startAnimation, false);

    animating = true;
    if (mobile) {
      if (scrollDirection === 'scrollLeft') {
        lastScrollObj.style.overflowX = 'hidden';
      } else {
        lastScrollObj.style.overflowY = 'hidden';
      }
    }

    // smoothly move to the snap point
    smoothScroll(lastScrollObj, snapPoint, function() {
      // after moving to the snap point, rebind the scroll event handler
      animating = false;
      previousDelta = 0;
      element.addEventListener('scroll', startAnimation, false);
      if (mobile) {
        lastScrollObj.style.overflowX = 'auto';
        lastScrollObj.style.overflowY = 'auto';
      }
      onAnimationEnd();
    });

    // we just jumped to the snapPoint, so this will be our next scrollStart
    if (!isNaN(snapPoint.x || !isNaN(snapPoint.y))) {
      scrollStart = snapPoint;
    }
  }

  /**
  * calculator for next snap-point
  * @param  {Object} scrollObj - DOM element
  * @param  {Object} obj - DOM element
  * @param  {integer} direction - signed integer indicating the scroll direction
  * @return {Object}
  */
  function getNextSnapPoint(scrollObj, obj, direction) {
    // get snap length
    const snapLength = {
      y: getYSnapLength(obj, obj.snapLengthUnit.y),
      x: getXSnapLength(obj, obj.snapLengthUnit.x),
    };
    const top = scrollObj.scrollTop;
    const left = scrollObj.scrollLeft;

    // calc current and initial snappoint
    const currentPoint = {
      y: top / snapLength.y,
      x: left / snapLength.x,
    };
    const initialPoint = {
      y: scrollStart.y / snapLength.y,
      x: scrollStart.x / snapLength.x,
    };
    const nextPoint = {
      y: 0,
      x: 0,
    };

    // set target and bounds by direction
    nextPoint.y = roundByDirection(direction.y, currentPoint.y);
    nextPoint.x = roundByDirection(direction.x, currentPoint.x);

    // constrain by distance
    nextPoint.y = constrainByDistance(initialPoint.y, currentPoint.y, nextPoint.y, scrollStart.y, top);
    nextPoint.x = constrainByDistance(initialPoint.x, currentPoint.x, nextPoint.x, scrollStart.x, left);

    // calculate where to scroll
    const scrollTo = {
      y: nextPoint.y * snapLength.y,
      x: nextPoint.x * snapLength.x,
    };

    // stay in bounds (minimum: 0, maxmimum: absolute height)
    scrollTo.y = stayInBounds(0, getScrollHeight(scrollObj), scrollTo.y);
    scrollTo.x = stayInBounds(0, getScrollWidth(scrollObj), scrollTo.x);

    return scrollTo;
  }

  /**
  * ceil or floor a number based on direction
  * @param  {Number} direction
  * @param  {Number} currentPoint
  * @return {Number}
  */
  function roundByDirection(direction, currentPoint) {
    if (direction === -1) {
      // when we go up, we floor the number to jump to the next snap-point in scroll direction
      return Math.floor(currentPoint);
    }
    // go down, we ceil the number to jump to the next in view.
    return Math.ceil(currentPoint);
  }

  /**
  * constrain jumping
  * @param  {Number} initialPoint
  * @param  {Number} currentPoint
  * @param  {Number} nextPoint
  * @return {Number}
  */
  function constrainByDistance(initialPoint, currentPoint, nextPoint, scrollStart, currentScrollValue) {
    if ((Math.abs(initialPoint - currentPoint) >= SNAP_CONSTRAINT) && Math.abs(nextPoint - currentPoint) > CONSTRAINT) {
// constrain jumping to a point too high/low when scrolling for more than SNAP_CONSTRAINT points.
      // (if the point is 85% further than we are, don't jump..)
      return Math.round(currentPoint);
    }
    if ((Math.abs(scrollStart - currentScrollValue) < MIN_PX_CONSTRAINT) && (Math.abs(initialPoint - currentPoint) < SNAP_CONSTRAINT) && (Math.abs(nextPoint - currentPoint) > FIRST_CONSTRAINT)) {
      // constrain jumping to a point too high/low when scrolling just for a few pixels (less than 10 pixels) and (5% of scrollable length)
      return Math.round(currentPoint);
    }
    return nextPoint;
  }

  /**
  * keep scrolling in bounds
  * @param  {Number} min
  * @param  {Number} max
  * @param  {Number} destined
  * @return {Number}
  */
  function stayInBounds(min, max, destined) {
    return Math.max(Math.min(destined, max), min);
  }

  /**
  * parse snap destination/coordinate values.
  * @param  {Object} declaration
  * @return {Object}
  */
  function parseSnapCoordValue(declaration) {
    // regex to parse lengths
    const regex = /(\d+)(px|%) (\d+)(px|%)/g;
      // defaults
    const parsed = {
      y: {
        value: 0,
        unit: 'px',
      },
      x: {
        value: 0,
        unit: 'px',
      },
    };
    let parsable;
    let result;

    // parse value and unit
    if (parsable !== null) {
      result = regex.exec(declaration);
      // if regexp fails, value is null
      if (result !== null) {
        parsed.y = {
          value: result[1],
          unit: result[2],
        };
        parsed.x = {
          value: result[3],
          unit: result[4],
        };
      }
    }
    return parsed;
  }

  /**
  * calc length of one snap on y-axis
  * @param  {Object} declaration the parsed declaration
  * @return {Number}
  */
  function getYSnapLength(obj, declaration) {
    if (declaration.unit === 'vh') {
      // when using vh, one snap is the length of vh / 100 * value
      return Math.max(document.documentElement.clientHeight, window.innerHeight || 1) / 100 * declaration.value;
    } else if (declaration.unit === '%') {
      // when using %, one snap is the length of element height / 100 * value
      return getHeight(obj) / 100 * declaration.value;
    } else {
      // when using px, one snap is the length of element height / value
      return getHeight(obj) / declaration.value;
    }
  }

  /**
  * calc length of one snap on x-axis
  * @param  {Object} declaration the parsed declaration
  * @return {Number}
  */
  function getXSnapLength(obj, declaration) {
    if (declaration.unit === 'vw') {
      // when using vw, one snap is the length of vw / 100 * value
      return Math.max(document.documentElement.clientWidth, window.innerWidth || 1) / 100 * declaration.value;
    } else if (declaration.unit === '%') {
      // when using %, one snap is the length of element width / 100 * value
      return getWidth(obj) / 100 * declaration.value;
    } else {
      // when using px, one snap is the length of element width / value
      return getWidth(obj) / declaration.value;
    }
  }

  /**
  * get an elements scrollable height
  * @param  {Object} obj - DOM element
  * @return {Number}
  */
  function getScrollHeight(obj) {
    return obj.scrollHeight;
  }

  /**
  * get an elements scrollable width
  * @param  {Object} obj - DOM element
  * @return {Number}
  */
  function getScrollWidth(obj) {
    return obj.scrollWidth;
  }

  /**
  * get an elements height
  * @param  {Object} obj - DOM element
  * @return {Number}
  */
  function getHeight(obj) {
    return obj.offsetHeight;
  }

  /**
  * get an elements width
  * @param  {Object} obj - DOM element
  * @return {Number}
  */
  function getWidth(obj) {
    return obj.offsetWidth;
  }

  /**
  * return the element scrolling values are applied to.
  * when receiving window.onscroll events, the actual scrolling is on the body.
  * @param  {Object} obj - DOM element
  * @return {Object}
  */
  function getScrollObj(obj) {
    // if the scroll container is body, the scrolling is invoked on window/document.
    if (obj === document || obj === window) {
      // firefox scrolls on document.documentElement
      if (document.documentElement.scrollTop > 0 || document.documentElement.scrollLeft > 0) {
        return document.documentElement;
      }
      // chrome scrolls on body
      return document.querySelector('body');
    }

    return obj;
  }

  /**
  * calc the duration of the animation proportional to the distance travelled
  * @param  {Number} start
  * @param  {Number} end
  * @return {Number}       scroll time in ms
  */
  function getDuration(start, end) {
    const distance = Math.abs(start - end);
    const procDist = 100 / Math.max(document.documentElement.clientHeight, window.innerHeight || 1) * distance;
    const duration = 100 / SCROLL_TIME * procDist;

    if (isNaN(duration)) {
      return 0;
    }

    return Math.max(SCROLL_TIME / 1.5, Math.min(duration, SCROLL_TIME));
  }

  /**
  * ease in out function thanks to:
  * http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
  * @param  {Number} t timing
  * @return {Number}   easing factor
  */
  function easeInCubic(t, b, c, d) {
    return c * (t = t / d) * t * t + b;
  }

  /**
  * calculate the scroll position we should be in
  * @param  {Number} start    the start point of the scroll
  * @param  {Number} end      the end point of the scroll
  * @param  {Number} elapsed  the time elapsed from the beginning of the scroll
  * @param  {Number} duration the total duration of the scroll (default 500ms)
  * @return {Number}          the next position
  */
  function position(start, end, elapsed, duration) {
    if (elapsed > duration) {
      return end;
    }
    return easeInCubic(elapsed, start, (end - start), duration);
  }

  // a current animation frame
  let animationFrame = null;

  /**
  * smoothScroll function by Alice Lietieur.
  * @see https://github.com/alicelieutier/smoothScroll
  * we use requestAnimationFrame to be called by the browser before every repaint
  * @param  {Object}   obj      the scroll context
  * @param  {Number}  end      where to scroll to
  * @param  {Function} callback called when the scrolling is finished
  */
  function smoothScroll(obj, end, callback) {
    const start = {
      y: obj.scrollTop,
      x: obj.scrollLeft,
    };

      // get animation frame or a fallback
    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) {
      window.setTimeout(fn, 15);
    };
      // duration = Math.max(getDuration(start.y, end.y), getDuration(start.x, end.x))
    const duration = SCROLL_TIME;

    let startTime = null;

    // setup the stepping function
    function step(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;

      // change position on y-axis if result is a number.
      if (!isNaN(end.y)) {
        obj.scrollTop = position(start.y, end.y, elapsed, duration);
      }

      // change position on x-axis if result is a number.
      if (!isNaN(end.x)) {
        obj.scrollLeft = position(start.x, end.x, elapsed, duration);
      }

      // check if we are over due;
      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        // is there a callback?
        if (typeof callback === 'function') {
          // stop execution and run the callback
          return callback(end);
        }

        // stop execution
        return;
      }
    }
    animationFrame = requestAnimationFrame(step);
  }

  this.init = function(config, callback) {
    SCROLL_TIMEOUT = config.scrollTimeout;
    SCROLL_TIME = config.scrollTime;
    SCROLL_SNAP_DESTINATION = config.scrollSnapDestination;

    onAnimationEnd = callback;

    setUpElement(element);
  };

  this.unbind = function() {
    element.removeEventListener('scroll', startAnimation, false);
  };

  return this;
};
