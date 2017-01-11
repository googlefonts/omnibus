! (function(t, e) {
  typeof exports === 'object' && typeof module === 'object' ? module.exports = e() : typeof define === 'function' && define.amd ? define('scrollMonitor', [], e) : typeof exports === 'object' ? exports.scrollMonitor = e() : t.scrollMonitor = e();
})(this, function() {
  return (function(t) {
    function e(o) {
      if (i[o]) {return i[o].exports;}
      const s = i[o] = {
        exports: {},
        id: o,
        loaded: !1,
      };
      return t[o].call(s.exports, s, s.exports, e), s.loaded = !0, s.exports;
    }
    const i = {};
    return e.m = t, e.c = i, e.p = '', e(0);
  })([function(t, e, i) {

    let o = i(1),
      s = o.isInBrowser,
      n = i(2),
      r = new n(s ? document.body : null);
    r.setStateFromDOM(null), r.listenToDOM(), s && (window.scrollMonitor = r), t.exports = r;
  }, function(t, e) {

    e.VISIBILITYCHANGE = 'visibilityChange', e.ENTERVIEWPORT = 'enterViewport', e.FULLYENTERVIEWPORT = 'fullyEnterViewport', e.EXITVIEWPORT = 'exitViewport', e.PARTIALLYEXITVIEWPORT = 'partiallyExitViewport', e.LOCATIONCHANGE = 'locationChange', e.STATECHANGE = 'stateChange', e.eventTypes = [e.VISIBILITYCHANGE, e.ENTERVIEWPORT, e.FULLYENTERVIEWPORT, e.EXITVIEWPORT, e.PARTIALLYEXITVIEWPORT, e.LOCATIONCHANGE, e.STATECHANGE], e.isOnServer = typeof window === 'undefined', e.isInBrowser = !e.isOnServer, e.defaultOffsets = {
      left: 0,
      right: 0,
    };
  }, function(t, e, i) {


    function o(t, e) {
      if (!(t instanceof e)) {throw new TypeError('Cannot call a class as a function');}
    }

    function s(t) {
      return c ? 0 : t === document.body ? window.innerWidth || document.documentElement.clientWidth : t.clientWidth;
    }

    function n(t) {
      return c ? 0 : t === document.body ? Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth) : t.scrollWidth;
    }

    function r(t) {
      return c ? 0 : t === document.body ? window.pageYOffset || document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft : t.scrollLeft;
    }
    let h = i(1),
      c = h.isOnServer,
      a = h.isInBrowser,
      l = h.eventTypes,
      p = i(3),
      u = (function() {
        function t(e, i) {
          function h() {
            if (a.viewportleft = r(e), a.viewportRight = a.viewportleft + a.viewportWidth, a.documentWidth = n(e), a.documentWidth !== p) {
              for (u = a.watchers.length; u--;) {a.watchers[u].recalculateLocation();}
              p = a.documentWidth;
            }
          }

          function c() {
            for (w = a.watchers.length; w--;) {a.watchers[w].update();}
            for (w = a.watchers.length; w--;) {a.watchers[w].triggerCallbacks();}
          }
          o(this, t);
          const a = this;
          this.item = e, this.watchers = [], this.viewportleft = null, this.viewportRight = null, this.documentWidth = n(e), this.viewportWidth = s(e), this.DOMListener = function() {
            t.prototype.DOMListener.apply(a, arguments);
          }, this.eventTypes = l, i && (this.containerWatcher = i.create(e));
          let p, u, w;
          this.update = function() {
            h(), c();
          }, this.recalculateLocations = function() {
            this.documentWidth = 0, this.update();
          };
        }
        return t.prototype.listenToDOM = function() {
          a && (window.addEventListener ? (this.item === document.body ? window.addEventListener('scroll', this.DOMListener) : this.item.addEventListener('scroll', this.DOMListener), window.addEventListener('resize', this.DOMListener)) : (this.item === document.body ? window.attachEvent('onscroll', this.DOMListener) : this.item.attachEvent('onscroll', this.DOMListener), window.attachEvent('onresize', this.DOMListener)), this.destroy = function() {
            window.addEventListener ? (this.item === document.body ? (window.removeEventListener('scroll', this.DOMListener), this.containerWatcher.destroy()) : this.item.removeEventListener('scroll', this.DOMListener), window.removeEventListener('resize', this.DOMListener)) : (this.item === document.body ? (window.detachEvent('onscroll', this.DOMListener), this.containerWatcher.destroy()) : this.item.detachEvent('onscroll', this.DOMListener), window.detachEvent('onresize', this.DOMListener));
          });
        }, t.prototype.destroy = function() {}, t.prototype.DOMListener = function(t) {
          this.setStateFromDOM(t), this.updateAndTriggerWatchers(t);
        }, t.prototype.setStateFromDOM = function(t) {
          let e = r(this.item),
              i = s(this.item),
              o = n(this.item);
          this.setState(e, i, o, t);
        }, t.prototype.setState = function(t, e, i, o) {
            const s = e !== this.viewportWidth || i !== this.contentWidth;
            if (this.latestEvent = o, this.viewportleft = t, this.viewportWidth = e, this.viewportRight = t + e, this.contentWidth = i, s) {
              for (let n = this.watchers.length; n--;) {this.watchers[n].recalculateLocation();}
            }
            this.updateAndTriggerWatchers(o);
          }, t.prototype.updateAndTriggerWatchers = function(t) {
            for (var e = this.watchers.length; e--;) {this.watchers[e].update();}
            for (e = this.watchers.length; e--;) {this.watchers[e].triggerCallbacks(t);}
          }, t.prototype.createCustomContainer = function() {
            return new t();
          }, t.prototype.createContainer = function(e) {
              typeof e === 'string' ? e = document.querySelector(e) : e && e.length > 0 && (e = e[0]);
              const i = new t(e, this);
              return i.setStateFromDOM(), i.listenToDOM(), i;
            }, t.prototype.create = function(t, e) {
              typeof t === 'string' ? t = document.querySelector(t) : t && t.length > 0 && (t = t[0]);
              const i = new p(this, t, e);
              return this.watchers.push(i), i;
            }, t.prototype.beget = function(t, e) {
                  return this.create(t, e);
                }, t;
      })();
    t.exports = u;
  }, function(t, e, i) {


    function o(t, e, i) {
      function o(t, e) {
        if (t.length !== 0) {
          for (E = t.length; E--;) {T = t[E], T.callback.call(s, e, s), T.isOne && t.splice(E, 1);}
        }
      }
      const s = this;
      this.watchItem = e, this.container = t, i ? i === +i ? this.offsets = {
        left: i,
        right: i,
      } : this.offsets = {
        left: i.left || w.left,
        right: i.right || w.right,
      } : this.offsets = w, this.callbacks = {};
      for (let d = 0, f = u.length; d < f; d++) {s.callbacks[u[d]] = [];}
      this.locked = !1;
      let m, v, b, I, E, T;
      this.triggerCallbacks = function(t) {
        switch (this.isInViewport && !m && o(this.callbacks[r], t), this.isFullyInViewport && !v && o(this.callbacks[h], t), this.isAboveViewport !== b && this.isBelowViewport !== I && (o(this.callbacks[n], t), v || this.isFullyInViewport || (o(this.callbacks[h], t), o(this.callbacks[a], t)), m || this.isInViewport || (o(this.callbacks[r], t), o(this.callbacks[c], t))), !this.isFullyInViewport && v && o(this.callbacks[a], t), !this.isInViewport && m && o(this.callbacks[c], t), this.isInViewport !== m && o(this.callbacks[n], t), !0) {
        case m !== this.isInViewport:
        case v !== this.isFullyInViewport:
        case b !== this.isAboveViewport:
        case I !== this.isBelowViewport:
          o(this.callbacks[p], t);
        }
        m = this.isInViewport, v = this.isFullyInViewport, b = this.isAboveViewport, I = this.isBelowViewport;
      }, this.recalculateLocation = function() {
        if (!this.locked) {
          let t = this.left,
              e = this.right;
          if (this.watchItem.nodeName) {
              const i = this.watchItem.style.display;
              i === 'none' && (this.watchItem.style.display = '');
              for (var s = 0, n = this.container; n.containerWatcher;) {s = s + n.containerWatcher.left - n.containerWatcher.container.viewportleft, n = n.containerWatcher.container;}
              const r = this.watchItem.getBoundingClientRect();
              this.left = r.left + this.container.viewportleft - s, this.right = r.right + this.container.viewportleft - s, i === 'none' && (this.watchItem.style.display = i);
            } else {this.watchItem === +this.watchItem ? this.watchItem > 0 ? this.left = this.right = this.watchItem : this.left = this.right = this.container.documentWidth - this.watchItem : (this.left = this.watchItem.left, this.right = this.watchItem.right);}
          this.left -= this.offsets.left, this.right += this.offsets.right, this.width = this.right - this.left, void 0 === t && void 0 === e || this.left === t && this.right === e || o(this.callbacks[l], null);
        }
      }, this.recalculateLocation(), this.update(), m = this.isInViewport, v = this.isFullyInViewport, b = this.isAboveViewport, I = this.isBelowViewport;
    }
    let s = i(1),
      n = s.VISIBILITYCHANGE,
      r = s.ENTERVIEWPORT,
      h = s.FULLYENTERVIEWPORT,
      c = s.EXITVIEWPORT,
      a = s.PARTIALLYEXITVIEWPORT,
      l = s.LOCATIONCHANGE,
      p = s.STATECHANGE,
      u = s.eventTypes,
      w = s.defaultOffsets;
    o.prototype = {
      on: function(t, e, i) {
        switch (!0) {
        case t === n && !this.isInViewport && this.isAboveViewport:
        case t === r && this.isInViewport:
        case t === h && this.isFullyInViewport:
        case t === c && this.isAboveViewport && !this.isInViewport:
        case t === a && this.isAboveViewport:
          if (e.call(this, this.container.latestEvent, this), i) {return;}
        }
        if (!this.callbacks[t]) {throw new Error('Tried to add a scroll monitor listener of type ' + t + '. Your options are: ' + u.join(', '));}
        this.callbacks[t].push({
          callback: e,
          isOne: i || !1,
        });
      },
      off: function(t, e) {
        if (!this.callbacks[t]) {throw new Error('Tried to remove a scroll monitor listener of type ' + t + '. Your options are: ' + u.join(', '));}
        for (var i, o = 0; i = this.callbacks[t][o]; o++) {
          if (i.callback === e) {
            this.callbacks[t].splice(o, 1);
            break;
          }
        }
      },
      one: function(t, e) {
        this.on(t, e, !0);
      },
      recalculateSize: function() {
        this.width = this.watchItem.offsetWidth + this.offsets.left + this.offsets.right, this.right = this.left + this.width;
      },
      update: function() {
        this.isAboveViewport = this.left < this.container.viewportleft, this.isBelowViewport = this.right > this.container.viewportRight, this.isInViewport = this.left < this.container.viewportRight && this.right > this.container.viewportleft, this.isFullyInViewport = this.left >= this.container.viewportleft && this.right <= this.container.viewportRight || this.isAboveViewport && this.isBelowViewport;
      },
      destroy: function() {
        let t = this.container.watchers.indexOf(this),
          e = this;
        this.container.watchers.splice(t, 1);
        for (let i = 0, o = u.length; i < o; i++) {e.callbacks[u[i]].length = 0;}
      },
      lock: function() {
        this.locked = !0;
      },
      unlock: function() {
        this.locked = !1;
      },
    };
    for (let d = function(t) {
        return function(e, i) {
          this.on.call(this, t, e, i);
        };
      }, f = 0, m = u.length; f < m; f++) {
      const v = u[f];
      o.prototype[v] = d(v);
    }
    t.exports = o;
  }]);
});
