(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  [10],
  {
    '+GzQ': function (e, t, n) {
      'use strict';
      n.d(t, 'b', function () {
        return s;
      }),
        n.d(t, 'a', function () {
          return u;
        }),
        n.d(t, 'c', function () {
          return p;
        }),
        n.d(t, 'd', function () {
          return h;
        }),
        n.d(t, 'e', function () {
          return g;
        }),
        n.d(t, 'f', function () {
          return y;
        });
      var r = n('WmNS'),
        i = n.n(r),
        o = n('9og8'),
        a = n('9kvl'),
        l = n('Qyje');
      function s(e, t) {
        return c.apply(this, arguments);
      }
      function c() {
        return (
          (c = Object(o['a'])(
            i.a.mark(function e(t, n) {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        'return',
                        Object(a['J'])('/api/admin/resource/app/info?aid=' + t + '&app_name=' + n),
                      );
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          c.apply(this, arguments)
        );
      }
      function u(e) {
        return f.apply(this, arguments);
      }
      function f() {
        return (
          (f = Object(o['a'])(
            i.a.mark(function e(t) {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        'return',
                        Object(a['J'])('/api/admin/resource/app_env_zone/list?app_name=' + t),
                      );
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          f.apply(this, arguments)
        );
      }
      function p() {
        return d.apply(this, arguments);
      }
      function d() {
        return (
          (d = Object(o['a'])(
            i.a.mark(function e() {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt('return', Object(a['J'])('/api/admin/resource/app/list'));
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          d.apply(this, arguments)
        );
      }
      function h(e) {
        return m.apply(this, arguments);
      }
      function m() {
        return (
          (m = Object(o['a'])(
            i.a.mark(function e(t) {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        'return',
                        Object(a['J'])(
                          '/api/admin/resource/app_node/transfer/list?'.concat(
                            Object(l['stringify'])(t),
                          ),
                        ),
                      );
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          m.apply(this, arguments)
        );
      }
      function g(e) {
        return v.apply(this, arguments);
      }
      function v() {
        return (
          (v = Object(o['a'])(
            i.a.mark(function e(t) {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (t['aid'] = parseInt(t['aid'])),
                        e.abrupt(
                          'return',
                          Object(a['J'])('/api/admin/resource/app_node/transfer/put', {
                            method: 'POST',
                            data: t,
                          }),
                        )
                      );
                    case 2:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          v.apply(this, arguments)
        );
      }
      function y(e) {
        return b.apply(this, arguments);
      }
      function b() {
        return (
          (b = Object(o['a'])(
            i.a.mark(function e(t) {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        'return',
                        Object(a['J'])(
                          '/api/admin/resource/app_node/list?'.concat(Object(l['stringify'])(t)),
                        ),
                      );
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          b.apply(this, arguments)
        );
      }
    },
    '/MfK': function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = {
          icon: {
            tag: 'svg',
            attrs: { viewBox: '64 64 896 896', focusable: 'false' },
            children: [
              {
                tag: 'path',
                attrs: {
                  d:
                    'M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z',
                },
              },
            ],
          },
          name: 'delete',
          theme: 'outlined',
        },
        o = i,
        a = n('6VBw'),
        l = function (e, t) {
          return r['createElement'](a['a'], Object.assign({}, e, { ref: t, icon: o }));
        };
      l.displayName = 'DeleteOutlined';
      t['a'] = r['forwardRef'](l);
    },
    '0T1o': function (e, t, n) {
      e.exports = { lay: 'lay___19ljV', lay_width_full: 'lay_width_full___2Xn8_' };
    },
    '0sou': function (e, t, n) {
      (function (e) {
        e(n('VrN/'));
      })(function (e) {
        'use strict';
        e.defineMode('toml', function () {
          return {
            startState: function () {
              return { inString: !1, stringType: '', lhs: !0, inArray: 0 };
            },
            token: function (e, t) {
              if (
                (t.inString ||
                  ('"' != e.peek() && "'" != e.peek()) ||
                  ((t.stringType = e.peek()), e.next(), (t.inString = !0)),
                e.sol() && 0 === t.inArray && (t.lhs = !0),
                t.inString)
              ) {
                while (t.inString && !e.eol())
                  e.peek() === t.stringType
                    ? (e.next(), (t.inString = !1))
                    : '\\' === e.peek()
                    ? (e.next(), e.next())
                    : e.match(/^.[^\\\"\']*/);
                return t.lhs ? 'property string' : 'string';
              }
              return t.inArray && ']' === e.peek()
                ? (e.next(), t.inArray--, 'bracket')
                : t.lhs && '[' === e.peek() && e.skipTo(']')
                ? (e.next(), ']' === e.peek() && e.next(), 'atom')
                : '#' === e.peek()
                ? (e.skipToEnd(), 'comment')
                : e.eatSpace()
                ? null
                : t.lhs &&
                  e.eatWhile(function (e) {
                    return '=' != e && ' ' != e;
                  })
                ? 'property'
                : t.lhs && '=' === e.peek()
                ? (e.next(), (t.lhs = !1), null)
                : !t.lhs && e.match(/^\d\d\d\d[\d\-\:\.T]*Z/)
                ? 'atom'
                : t.lhs || (!e.match('true') && !e.match('false'))
                ? t.lhs || '[' !== e.peek()
                  ? !t.lhs && e.match(/^\-?\d+(?:\.\d+)?/)
                    ? 'number'
                    : (e.eatSpace() || e.next(), null)
                  : (t.inArray++, e.next(), 'bracket')
                : 'atom';
            },
          };
        }),
          e.defineMIME('text/x-toml', 'toml');
      });
    },
    '1gqn': function (e, t) {
      e.exports = function (e) {
        return (
          e &&
          'object' === typeof e &&
          'function' === typeof e.copy &&
          'function' === typeof e.fill &&
          'function' === typeof e.readUInt8
        );
      };
    },
    '1wcP': function (e, t, n) {},
    '2BaD': function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = {
          icon: {
            tag: 'svg',
            attrs: { viewBox: '64 64 896 896', focusable: 'false' },
            children: [
              {
                tag: 'path',
                attrs: {
                  d:
                    'M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 00-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z',
                },
              },
              {
                tag: 'path',
                attrs: {
                  d:
                    'M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z',
                },
              },
            ],
          },
          name: 'close-circle',
          theme: 'outlined',
        },
        o = i,
        a = n('6VBw'),
        l = function (e, t) {
          return r['createElement'](a['a'], Object.assign({}, e, { ref: t, icon: o }));
        };
      l.displayName = 'CloseCircleOutlined';
      t['a'] = r['forwardRef'](l);
    },
    '2qtc': function (e, t, n) {
      'use strict';
      n('cIOH'), n('1wcP'), n('+L6B');
    },
    '3dVZ': function (e, t, n) {},
    '5FtT': function (e, t, n) {},
    '7Mwc': function (e, t, n) {
      e.exports = n('qVjC');
    },
    '8R5B': function (e, t, n) {
      'use strict';
      n('cIOH'),
        n('yfLh'),
        n('R9oj'),
        n('sRBo'),
        n('+L6B'),
        n('5NDa'),
        n('lUTK'),
        n('qVdP'),
        n('DjyN');
    },
    '8kvQ': function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = {
          icon: {
            tag: 'svg',
            attrs: { viewBox: '64 64 896 896', focusable: 'false' },
            children: [
              {
                tag: 'path',
                attrs: {
                  d:
                    'M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm376 116c-119.3 0-216 96.7-216 216s96.7 216 216 216 216-96.7 216-216-96.7-216-216-216zm107.5 323.5C750.8 868.2 712.6 884 672 884s-78.8-15.8-107.5-44.5C535.8 810.8 520 772.6 520 732s15.8-78.8 44.5-107.5C593.2 595.8 631.4 580 672 580s78.8 15.8 107.5 44.5C808.2 653.2 824 691.4 824 732s-15.8 78.8-44.5 107.5zM761 656h-44.3c-2.6 0-5 1.2-6.5 3.3l-63.5 87.8-23.1-31.9a7.92 7.92 0 00-6.5-3.3H573c-6.5 0-10.3 7.4-6.5 12.7l73.8 102.1c3.2 4.4 9.7 4.4 12.9 0l114.2-158c3.9-5.3.1-12.7-6.4-12.7zM440 852H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z',
                },
              },
            ],
          },
          name: 'file-done',
          theme: 'outlined',
        },
        o = i,
        a = n('6VBw'),
        l = function (e, t) {
          return r['createElement'](a['a'], Object.assign({}, e, { ref: t, icon: o }));
        };
      l.displayName = 'FileDoneOutlined';
      t['a'] = r['forwardRef'](l);
    },
    '9jjd': function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = {
          icon: {
            tag: 'svg',
            attrs: { viewBox: '64 64 896 896', focusable: 'false' },
            children: [
              {
                tag: 'path',
                attrs: {
                  d:
                    'M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z',
                },
              },
            ],
          },
          name: 'file',
          theme: 'outlined',
        },
        o = i,
        a = n('6VBw'),
        l = function (e, t) {
          return r['createElement'](a['a'], Object.assign({}, e, { ref: t, icon: o }));
        };
      l.displayName = 'FileOutlined';
      t['a'] = r['forwardRef'](l);
    },
    '9lTW': function (e, t, n) {
      'use strict';
      (function (t) {
        var r = n('MgzW');
        function i(e, t) {
          if (e === t) return 0;
          for (var n = e.length, r = t.length, i = 0, o = Math.min(n, r); i < o; ++i)
            if (e[i] !== t[i]) {
              (n = e[i]), (r = t[i]);
              break;
            }
          return n < r ? -1 : r < n ? 1 : 0;
        }
        function o(e) {
          return t.Buffer && 'function' === typeof t.Buffer.isBuffer
            ? t.Buffer.isBuffer(e)
            : !(null == e || !e._isBuffer);
        }
        var a = n('MCLT'),
          l = Object.prototype.hasOwnProperty,
          s = Array.prototype.slice,
          c = (function () {
            return 'foo' === function () {}.name;
          })();
        function u(e) {
          return Object.prototype.toString.call(e);
        }
        function f(e) {
          return (
            !o(e) &&
            'function' === typeof t.ArrayBuffer &&
            ('function' === typeof ArrayBuffer.isView
              ? ArrayBuffer.isView(e)
              : !!e && (e instanceof DataView || !!(e.buffer && e.buffer instanceof ArrayBuffer)))
          );
        }
        var p = (e.exports = b),
          d = /\s*function\s+([^\(\s]*)\s*/;
        function h(e) {
          if (a.isFunction(e)) {
            if (c) return e.name;
            var t = e.toString(),
              n = t.match(d);
            return n && n[1];
          }
        }
        function m(e, t) {
          return 'string' === typeof e ? (e.length < t ? e : e.slice(0, t)) : e;
        }
        function g(e) {
          if (c || !a.isFunction(e)) return a.inspect(e);
          var t = h(e),
            n = t ? ': ' + t : '';
          return '[Function' + n + ']';
        }
        function v(e) {
          return m(g(e.actual), 128) + ' ' + e.operator + ' ' + m(g(e.expected), 128);
        }
        function y(e, t, n, r, i) {
          throw new p.AssertionError({
            message: n,
            actual: e,
            expected: t,
            operator: r,
            stackStartFunction: i,
          });
        }
        function b(e, t) {
          e || y(e, !0, t, '==', p.ok);
        }
        function w(e, t, n, r) {
          if (e === t) return !0;
          if (o(e) && o(t)) return 0 === i(e, t);
          if (a.isDate(e) && a.isDate(t)) return e.getTime() === t.getTime();
          if (a.isRegExp(e) && a.isRegExp(t))
            return (
              e.source === t.source &&
              e.global === t.global &&
              e.multiline === t.multiline &&
              e.lastIndex === t.lastIndex &&
              e.ignoreCase === t.ignoreCase
            );
          if ((null !== e && 'object' === typeof e) || (null !== t && 'object' === typeof t)) {
            if (
              f(e) &&
              f(t) &&
              u(e) === u(t) &&
              !(e instanceof Float32Array || e instanceof Float64Array)
            )
              return 0 === i(new Uint8Array(e.buffer), new Uint8Array(t.buffer));
            if (o(e) !== o(t)) return !1;
            r = r || { actual: [], expected: [] };
            var l = r.actual.indexOf(e);
            return (
              (-1 !== l && l === r.expected.indexOf(t)) ||
              (r.actual.push(e), r.expected.push(t), C(e, t, n, r))
            );
          }
          return n ? e === t : e == t;
        }
        function x(e) {
          return '[object Arguments]' == Object.prototype.toString.call(e);
        }
        function C(e, t, n, r) {
          if (null === e || void 0 === e || null === t || void 0 === t) return !1;
          if (a.isPrimitive(e) || a.isPrimitive(t)) return e === t;
          if (n && Object.getPrototypeOf(e) !== Object.getPrototypeOf(t)) return !1;
          var i = x(e),
            o = x(t);
          if ((i && !o) || (!i && o)) return !1;
          if (i) return (e = s.call(e)), (t = s.call(t)), w(e, t, n);
          var l,
            c,
            u = T(e),
            f = T(t);
          if (u.length !== f.length) return !1;
          for (u.sort(), f.sort(), c = u.length - 1; c >= 0; c--) if (u[c] !== f[c]) return !1;
          for (c = u.length - 1; c >= 0; c--) if (((l = u[c]), !w(e[l], t[l], n, r))) return !1;
          return !0;
        }
        function S(e, t, n) {
          w(e, t, !0) && y(e, t, n, 'notDeepStrictEqual', S);
        }
        function k(e, t) {
          if (!e || !t) return !1;
          if ('[object RegExp]' == Object.prototype.toString.call(t)) return t.test(e);
          try {
            if (e instanceof t) return !0;
          } catch (n) {}
          return !Error.isPrototypeOf(t) && !0 === t.call({}, e);
        }
        function E(e) {
          var t;
          try {
            e();
          } catch (n) {
            t = n;
          }
          return t;
        }
        function O(e, t, n, r) {
          var i;
          if ('function' !== typeof t) throw new TypeError('"block" argument must be a function');
          'string' === typeof n && ((r = n), (n = null)),
            (i = E(t)),
            (r = (n && n.name ? ' (' + n.name + ').' : '.') + (r ? ' ' + r : '.')),
            e && !i && y(i, n, 'Missing expected exception' + r);
          var o = 'string' === typeof r,
            l = !e && a.isError(i),
            s = !e && i && !n;
          if (
            (((l && o && k(i, n)) || s) && y(i, n, 'Got unwanted exception' + r),
            (e && i && n && !k(i, n)) || (!e && i))
          )
            throw i;
        }
        function L(e, t) {
          e || y(e, !0, t, '==', L);
        }
        (p.AssertionError = function (e) {
          (this.name = 'AssertionError'),
            (this.actual = e.actual),
            (this.expected = e.expected),
            (this.operator = e.operator),
            e.message
              ? ((this.message = e.message), (this.generatedMessage = !1))
              : ((this.message = v(this)), (this.generatedMessage = !0));
          var t = e.stackStartFunction || y;
          if (Error.captureStackTrace) Error.captureStackTrace(this, t);
          else {
            var n = new Error();
            if (n.stack) {
              var r = n.stack,
                i = h(t),
                o = r.indexOf('\n' + i);
              if (o >= 0) {
                var a = r.indexOf('\n', o + 1);
                r = r.substring(a + 1);
              }
              this.stack = r;
            }
          }
        }),
          a.inherits(p.AssertionError, Error),
          (p.fail = y),
          (p.ok = b),
          (p.equal = function (e, t, n) {
            e != t && y(e, t, n, '==', p.equal);
          }),
          (p.notEqual = function (e, t, n) {
            e == t && y(e, t, n, '!=', p.notEqual);
          }),
          (p.deepEqual = function (e, t, n) {
            w(e, t, !1) || y(e, t, n, 'deepEqual', p.deepEqual);
          }),
          (p.deepStrictEqual = function (e, t, n) {
            w(e, t, !0) || y(e, t, n, 'deepStrictEqual', p.deepStrictEqual);
          }),
          (p.notDeepEqual = function (e, t, n) {
            w(e, t, !1) && y(e, t, n, 'notDeepEqual', p.notDeepEqual);
          }),
          (p.notDeepStrictEqual = S),
          (p.strictEqual = function (e, t, n) {
            e !== t && y(e, t, n, '===', p.strictEqual);
          }),
          (p.notStrictEqual = function (e, t, n) {
            e === t && y(e, t, n, '!==', p.notStrictEqual);
          }),
          (p.throws = function (e, t, n) {
            O(!0, e, t, n);
          }),
          (p.doesNotThrow = function (e, t, n) {
            O(!1, e, t, n);
          }),
          (p.ifError = function (e) {
            if (e) throw e;
          }),
          (p.strict = r(L, p, {
            equal: p.strictEqual,
            deepEqual: p.deepStrictEqual,
            notEqual: p.notStrictEqual,
            notDeepEqual: p.notDeepStrictEqual,
          })),
          (p.strict.strict = p.strict);
        var T =
          Object.keys ||
          function (e) {
            var t = [];
            for (var n in e) l.call(e, n) && t.push(n);
            return t;
          };
      }.call(this, n('yLpj')));
    },
    CiB2: function (e, t, n) {
      'use strict';
      function r(e) {
        if (null == e) throw new TypeError('Cannot destructure undefined');
      }
      n.d(t, 'a', function () {
        return r;
      });
    },
    CtXQ: function (e, t, n) {
      'use strict';
      var r = n('uaoM'),
        i = function () {
          return Object(r['a'])(!1, 'Icon', 'Empty Icon'), null;
        };
      t['a'] = i;
    },
    Ekho: function (e, t, n) {
      var r, i, o;
      (function () {
        var n, a, l, s, c, u, f, p, d, h, m, g, v, y, b;
        (l = Math.floor),
          (h = Math.min),
          (a = function (e, t) {
            return e < t ? -1 : e > t ? 1 : 0;
          }),
          (d = function (e, t, n, r, i) {
            var o;
            if ((null == n && (n = 0), null == i && (i = a), n < 0))
              throw new Error('lo must be non-negative');
            null == r && (r = e.length);
            while (n < r) (o = l((n + r) / 2)), i(t, e[o]) < 0 ? (r = o) : (n = o + 1);
            return [].splice.apply(e, [n, n - n].concat(t)), t;
          }),
          (u = function (e, t, n) {
            return null == n && (n = a), e.push(t), y(e, 0, e.length - 1, n);
          }),
          (c = function (e, t) {
            var n, r;
            return (
              null == t && (t = a),
              (n = e.pop()),
              e.length ? ((r = e[0]), (e[0] = n), b(e, 0, t)) : (r = n),
              r
            );
          }),
          (p = function (e, t, n) {
            var r;
            return null == n && (n = a), (r = e[0]), (e[0] = t), b(e, 0, n), r;
          }),
          (f = function (e, t, n) {
            var r;
            return (
              null == n && (n = a),
              e.length &&
                n(e[0], t) < 0 &&
                ((r = [e[0], t]), (t = r[0]), (e[0] = r[1]), b(e, 0, n)),
              t
            );
          }),
          (s = function (e, t) {
            var n, r, i, o, s, c;
            for (
              null == t && (t = a),
                o = function () {
                  c = [];
                  for (var t = 0, n = l(e.length / 2); 0 <= n ? t < n : t > n; 0 <= n ? t++ : t--)
                    c.push(t);
                  return c;
                }
                  .apply(this)
                  .reverse(),
                s = [],
                r = 0,
                i = o.length;
              r < i;
              r++
            )
              (n = o[r]), s.push(b(e, n, t));
            return s;
          }),
          (v = function (e, t, n) {
            var r;
            if ((null == n && (n = a), (r = e.indexOf(t)), -1 !== r))
              return y(e, 0, r, n), b(e, r, n);
          }),
          (m = function (e, t, n) {
            var r, i, o, l, c;
            if ((null == n && (n = a), (i = e.slice(0, t)), !i.length)) return i;
            for (s(i, n), c = e.slice(t), o = 0, l = c.length; o < l; o++) (r = c[o]), f(i, r, n);
            return i.sort(n).reverse();
          }),
          (g = function (e, t, n) {
            var r, i, o, l, u, f, p, m, g;
            if ((null == n && (n = a), 10 * t <= e.length)) {
              if (((o = e.slice(0, t).sort(n)), !o.length)) return o;
              for (i = o[o.length - 1], p = e.slice(t), l = 0, f = p.length; l < f; l++)
                (r = p[l]), n(r, i) < 0 && (d(o, r, 0, null, n), o.pop(), (i = o[o.length - 1]));
              return o;
            }
            for (
              s(e, n), g = [], u = 0, m = h(t, e.length);
              0 <= m ? u < m : u > m;
              0 <= m ? ++u : --u
            )
              g.push(c(e, n));
            return g;
          }),
          (y = function (e, t, n, r) {
            var i, o, l;
            null == r && (r = a), (i = e[n]);
            while (n > t) {
              if (((l = (n - 1) >> 1), (o = e[l]), !(r(i, o) < 0))) break;
              (e[n] = o), (n = l);
            }
            return (e[n] = i);
          }),
          (b = function (e, t, n) {
            var r, i, o, l, s;
            null == n && (n = a), (i = e.length), (s = t), (o = e[t]), (r = 2 * t + 1);
            while (r < i)
              (l = r + 1),
                l < i && !(n(e[r], e[l]) < 0) && (r = l),
                (e[t] = e[r]),
                (t = r),
                (r = 2 * t + 1);
            return (e[t] = o), y(e, s, t, n);
          }),
          (n = (function () {
            function e(e) {
              (this.cmp = null != e ? e : a), (this.nodes = []);
            }
            return (
              (e.push = u),
              (e.pop = c),
              (e.replace = p),
              (e.pushpop = f),
              (e.heapify = s),
              (e.updateItem = v),
              (e.nlargest = m),
              (e.nsmallest = g),
              (e.prototype.push = function (e) {
                return u(this.nodes, e, this.cmp);
              }),
              (e.prototype.pop = function () {
                return c(this.nodes, this.cmp);
              }),
              (e.prototype.peek = function () {
                return this.nodes[0];
              }),
              (e.prototype.contains = function (e) {
                return -1 !== this.nodes.indexOf(e);
              }),
              (e.prototype.replace = function (e) {
                return p(this.nodes, e, this.cmp);
              }),
              (e.prototype.pushpop = function (e) {
                return f(this.nodes, e, this.cmp);
              }),
              (e.prototype.heapify = function () {
                return s(this.nodes, this.cmp);
              }),
              (e.prototype.updateItem = function (e) {
                return v(this.nodes, e, this.cmp);
              }),
              (e.prototype.clear = function () {
                return (this.nodes = []);
              }),
              (e.prototype.empty = function () {
                return 0 === this.nodes.length;
              }),
              (e.prototype.size = function () {
                return this.nodes.length;
              }),
              (e.prototype.clone = function () {
                var t;
                return (t = new e()), (t.nodes = this.nodes.slice(0)), t;
              }),
              (e.prototype.toArray = function () {
                return this.nodes.slice(0);
              }),
              (e.prototype.insert = e.prototype.push),
              (e.prototype.top = e.prototype.peek),
              (e.prototype.front = e.prototype.peek),
              (e.prototype.has = e.prototype.contains),
              (e.prototype.copy = e.prototype.clone),
              e
            );
          })()),
          (function (n, a) {
            (i = []),
              (r = a),
              (o = 'function' === typeof r ? r.apply(t, i) : r),
              void 0 !== o && (e.exports = o);
          })(0, function () {
            return n;
          });
      }.call(this));
    },
    F1pL: function (e, t, n) {
      e.exports = n('Ekho');
    },
    Ge06: function (e, t, n) {
      e.exports = { cube: 'cube___1S9EQ' };
    },
    'Go+2': function (e, t, n) {
      'use strict';
      var r = {
          childContextTypes: !0,
          contextTypes: !0,
          defaultProps: !0,
          displayName: !0,
          getDefaultProps: !0,
          getDerivedStateFromProps: !0,
          mixins: !0,
          propTypes: !0,
          type: !0,
        },
        i = {
          name: !0,
          length: !0,
          prototype: !0,
          caller: !0,
          callee: !0,
          arguments: !0,
          arity: !0,
        },
        o = Object.defineProperty,
        a = Object.getOwnPropertyNames,
        l = Object.getOwnPropertySymbols,
        s = Object.getOwnPropertyDescriptor,
        c = Object.getPrototypeOf,
        u = c && c(Object);
      function f(e, t, n) {
        if ('string' !== typeof t) {
          if (u) {
            var p = c(t);
            p && p !== u && f(e, p, n);
          }
          var d = a(t);
          l && (d = d.concat(l(t)));
          for (var h = 0; h < d.length; ++h) {
            var m = d[h];
            if (!r[m] && !i[m] && (!n || !n[m])) {
              var g = s(t, m);
              try {
                o(e, m, g);
              } catch (v) {}
            }
          }
          return e;
        }
        return e;
      }
      e.exports = f;
    },
    KKCa: function (e, t) {
      'function' === typeof Object.create
        ? (e.exports = function (e, t) {
            (e.super_ = t),
              (e.prototype = Object.create(t.prototype, {
                constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
              }));
          })
        : (e.exports = function (e, t) {
            e.super_ = t;
            var n = function () {};
            (n.prototype = t.prototype), (e.prototype = new n()), (e.prototype.constructor = e);
          });
    },
    MCLT: function (e, t, n) {
      (function (e) {
        var r =
            Object.getOwnPropertyDescriptors ||
            function (e) {
              for (var t = Object.keys(e), n = {}, r = 0; r < t.length; r++)
                n[t[r]] = Object.getOwnPropertyDescriptor(e, t[r]);
              return n;
            },
          i = /%[sdj%]/g;
        (t.format = function (e) {
          if (!C(e)) {
            for (var t = [], n = 0; n < arguments.length; n++) t.push(l(arguments[n]));
            return t.join(' ');
          }
          n = 1;
          for (
            var r = arguments,
              o = r.length,
              a = String(e).replace(i, function (e) {
                if ('%%' === e) return '%';
                if (n >= o) return e;
                switch (e) {
                  case '%s':
                    return String(r[n++]);
                  case '%d':
                    return Number(r[n++]);
                  case '%j':
                    try {
                      return JSON.stringify(r[n++]);
                    } catch (t) {
                      return '[Circular]';
                    }
                  default:
                    return e;
                }
              }),
              s = r[n];
            n < o;
            s = r[++n]
          )
            b(s) || !O(s) ? (a += ' ' + s) : (a += ' ' + l(s));
          return a;
        }),
          (t.deprecate = function (n, r) {
            if ('undefined' !== typeof e && !0 === e.noDeprecation) return n;
            if ('undefined' === typeof e)
              return function () {
                return t.deprecate(n, r).apply(this, arguments);
              };
            var i = !1;
            function o() {
              if (!i) {
                if (e.throwDeprecation) throw new Error(r);
                e.traceDeprecation ? console.trace(r) : console.error(r), (i = !0);
              }
              return n.apply(this, arguments);
            }
            return o;
          });
        var o,
          a = {};
        function l(e, n) {
          var r = { seen: [], stylize: c };
          return (
            arguments.length >= 3 && (r.depth = arguments[2]),
            arguments.length >= 4 && (r.colors = arguments[3]),
            y(n) ? (r.showHidden = n) : n && t._extend(r, n),
            k(r.showHidden) && (r.showHidden = !1),
            k(r.depth) && (r.depth = 2),
            k(r.colors) && (r.colors = !1),
            k(r.customInspect) && (r.customInspect = !0),
            r.colors && (r.stylize = s),
            f(r, e, r.depth)
          );
        }
        function s(e, t) {
          var n = l.styles[t];
          return n ? '\x1b[' + l.colors[n][0] + 'm' + e + '\x1b[' + l.colors[n][1] + 'm' : e;
        }
        function c(e, t) {
          return e;
        }
        function u(e) {
          var t = {};
          return (
            e.forEach(function (e, n) {
              t[e] = !0;
            }),
            t
          );
        }
        function f(e, n, r) {
          if (
            e.customInspect &&
            n &&
            N(n.inspect) &&
            n.inspect !== t.inspect &&
            (!n.constructor || n.constructor.prototype !== n)
          ) {
            var i = n.inspect(r, e);
            return C(i) || (i = f(e, i, r)), i;
          }
          var o = p(e, n);
          if (o) return o;
          var a = Object.keys(n),
            l = u(a);
          if (
            (e.showHidden && (a = Object.getOwnPropertyNames(n)),
            T(n) && (a.indexOf('message') >= 0 || a.indexOf('description') >= 0))
          )
            return d(n);
          if (0 === a.length) {
            if (N(n)) {
              var s = n.name ? ': ' + n.name : '';
              return e.stylize('[Function' + s + ']', 'special');
            }
            if (E(n)) return e.stylize(RegExp.prototype.toString.call(n), 'regexp');
            if (L(n)) return e.stylize(Date.prototype.toString.call(n), 'date');
            if (T(n)) return d(n);
          }
          var c,
            y = '',
            b = !1,
            w = ['{', '}'];
          if ((v(n) && ((b = !0), (w = ['[', ']'])), N(n))) {
            var x = n.name ? ': ' + n.name : '';
            y = ' [Function' + x + ']';
          }
          return (
            E(n) && (y = ' ' + RegExp.prototype.toString.call(n)),
            L(n) && (y = ' ' + Date.prototype.toUTCString.call(n)),
            T(n) && (y = ' ' + d(n)),
            0 !== a.length || (b && 0 != n.length)
              ? r < 0
                ? E(n)
                  ? e.stylize(RegExp.prototype.toString.call(n), 'regexp')
                  : e.stylize('[Object]', 'special')
                : (e.seen.push(n),
                  (c = b
                    ? h(e, n, r, l, a)
                    : a.map(function (t) {
                        return m(e, n, r, l, t, b);
                      })),
                  e.seen.pop(),
                  g(c, y, w))
              : w[0] + y + w[1]
          );
        }
        function p(e, t) {
          if (k(t)) return e.stylize('undefined', 'undefined');
          if (C(t)) {
            var n =
              "'" +
              JSON.stringify(t).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') +
              "'";
            return e.stylize(n, 'string');
          }
          return x(t)
            ? e.stylize('' + t, 'number')
            : y(t)
            ? e.stylize('' + t, 'boolean')
            : b(t)
            ? e.stylize('null', 'null')
            : void 0;
        }
        function d(e) {
          return '[' + Error.prototype.toString.call(e) + ']';
        }
        function h(e, t, n, r, i) {
          for (var o = [], a = 0, l = t.length; a < l; ++a)
            D(t, String(a)) ? o.push(m(e, t, n, r, String(a), !0)) : o.push('');
          return (
            i.forEach(function (i) {
              i.match(/^\d+$/) || o.push(m(e, t, n, r, i, !0));
            }),
            o
          );
        }
        function m(e, t, n, r, i, o) {
          var a, l, s;
          if (
            ((s = Object.getOwnPropertyDescriptor(t, i) || { value: t[i] }),
            s.get
              ? (l = s.set
                  ? e.stylize('[Getter/Setter]', 'special')
                  : e.stylize('[Getter]', 'special'))
              : s.set && (l = e.stylize('[Setter]', 'special')),
            D(r, i) || (a = '[' + i + ']'),
            l ||
              (e.seen.indexOf(s.value) < 0
                ? ((l = b(n) ? f(e, s.value, null) : f(e, s.value, n - 1)),
                  l.indexOf('\n') > -1 &&
                    (l = o
                      ? l
                          .split('\n')
                          .map(function (e) {
                            return '  ' + e;
                          })
                          .join('\n')
                          .substr(2)
                      : '\n' +
                        l
                          .split('\n')
                          .map(function (e) {
                            return '   ' + e;
                          })
                          .join('\n')))
                : (l = e.stylize('[Circular]', 'special'))),
            k(a))
          ) {
            if (o && i.match(/^\d+$/)) return l;
            (a = JSON.stringify('' + i)),
              a.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)
                ? ((a = a.substr(1, a.length - 2)), (a = e.stylize(a, 'name')))
                : ((a = a
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"')
                    .replace(/(^"|"$)/g, "'")),
                  (a = e.stylize(a, 'string')));
          }
          return a + ': ' + l;
        }
        function g(e, t, n) {
          var r = e.reduce(function (e, t) {
            return t.indexOf('\n') >= 0 && 0, e + t.replace(/\u001b\[\d\d?m/g, '').length + 1;
          }, 0);
          return r > 60
            ? n[0] + ('' === t ? '' : t + '\n ') + ' ' + e.join(',\n  ') + ' ' + n[1]
            : n[0] + t + ' ' + e.join(', ') + ' ' + n[1];
        }
        function v(e) {
          return Array.isArray(e);
        }
        function y(e) {
          return 'boolean' === typeof e;
        }
        function b(e) {
          return null === e;
        }
        function w(e) {
          return null == e;
        }
        function x(e) {
          return 'number' === typeof e;
        }
        function C(e) {
          return 'string' === typeof e;
        }
        function S(e) {
          return 'symbol' === typeof e;
        }
        function k(e) {
          return void 0 === e;
        }
        function E(e) {
          return O(e) && '[object RegExp]' === A(e);
        }
        function O(e) {
          return 'object' === typeof e && null !== e;
        }
        function L(e) {
          return O(e) && '[object Date]' === A(e);
        }
        function T(e) {
          return O(e) && ('[object Error]' === A(e) || e instanceof Error);
        }
        function N(e) {
          return 'function' === typeof e;
        }
        function M(e) {
          return (
            null === e ||
            'boolean' === typeof e ||
            'number' === typeof e ||
            'string' === typeof e ||
            'symbol' === typeof e ||
            'undefined' === typeof e
          );
        }
        function A(e) {
          return Object.prototype.toString.call(e);
        }
        function j(e) {
          return e < 10 ? '0' + e.toString(10) : e.toString(10);
        }
        (t.debuglog = function (n) {
          if (
            (k(o) && (o = Object({ NODE_ENV: 'production' }).NODE_DEBUG || ''),
            (n = n.toUpperCase()),
            !a[n])
          )
            if (new RegExp('\\b' + n + '\\b', 'i').test(o)) {
              var r = e.pid;
              a[n] = function () {
                var e = t.format.apply(t, arguments);
                console.error('%s %d: %s', n, r, e);
              };
            } else a[n] = function () {};
          return a[n];
        }),
          (t.inspect = l),
          (l.colors = {
            bold: [1, 22],
            italic: [3, 23],
            underline: [4, 24],
            inverse: [7, 27],
            white: [37, 39],
            grey: [90, 39],
            black: [30, 39],
            blue: [34, 39],
            cyan: [36, 39],
            green: [32, 39],
            magenta: [35, 39],
            red: [31, 39],
            yellow: [33, 39],
          }),
          (l.styles = {
            special: 'cyan',
            number: 'yellow',
            boolean: 'yellow',
            undefined: 'grey',
            null: 'bold',
            string: 'green',
            date: 'magenta',
            regexp: 'red',
          }),
          (t.isArray = v),
          (t.isBoolean = y),
          (t.isNull = b),
          (t.isNullOrUndefined = w),
          (t.isNumber = x),
          (t.isString = C),
          (t.isSymbol = S),
          (t.isUndefined = k),
          (t.isRegExp = E),
          (t.isObject = O),
          (t.isDate = L),
          (t.isError = T),
          (t.isFunction = N),
          (t.isPrimitive = M),
          (t.isBuffer = n('1gqn'));
        var P = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        function I() {
          var e = new Date(),
            t = [j(e.getHours()), j(e.getMinutes()), j(e.getSeconds())].join(':');
          return [e.getDate(), P[e.getMonth()], t].join(' ');
        }
        function D(e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        }
        (t.log = function () {
          console.log('%s - %s', I(), t.format.apply(t, arguments));
        }),
          (t.inherits = n('KKCa')),
          (t._extend = function (e, t) {
            if (!t || !O(t)) return e;
            var n = Object.keys(t),
              r = n.length;
            while (r--) e[n[r]] = t[n[r]];
            return e;
          });
        var _ = 'undefined' !== typeof Symbol ? Symbol('util.promisify.custom') : void 0;
        function z(e, t) {
          if (!e) {
            var n = new Error('Promise was rejected with a falsy value');
            (n.reason = e), (e = n);
          }
          return t(e);
        }
        function R(t) {
          if ('function' !== typeof t)
            throw new TypeError('The "original" argument must be of type Function');
          function n() {
            for (var n = [], r = 0; r < arguments.length; r++) n.push(arguments[r]);
            var i = n.pop();
            if ('function' !== typeof i)
              throw new TypeError('The last argument must be of type Function');
            var o = this,
              a = function () {
                return i.apply(o, arguments);
              };
            t.apply(this, n).then(
              function (t) {
                e.nextTick(a, null, t);
              },
              function (t) {
                e.nextTick(z, t, a);
              },
            );
          }
          return (
            Object.setPrototypeOf(n, Object.getPrototypeOf(t)), Object.defineProperties(n, r(t)), n
          );
        }
        (t.promisify = function (e) {
          if ('function' !== typeof e)
            throw new TypeError('The "original" argument must be of type Function');
          if (_ && e[_]) {
            var t = e[_];
            if ('function' !== typeof t)
              throw new TypeError('The "util.promisify.custom" argument must be of type Function');
            return (
              Object.defineProperty(t, _, {
                value: t,
                enumerable: !1,
                writable: !1,
                configurable: !0,
              }),
              t
            );
          }
          function t() {
            for (
              var t,
                n,
                r = new Promise(function (e, r) {
                  (t = e), (n = r);
                }),
                i = [],
                o = 0;
              o < arguments.length;
              o++
            )
              i.push(arguments[o]);
            i.push(function (e, r) {
              e ? n(e) : t(r);
            });
            try {
              e.apply(this, i);
            } catch (a) {
              n(a);
            }
            return r;
          }
          return (
            Object.setPrototypeOf(t, Object.getPrototypeOf(e)),
            _ &&
              Object.defineProperty(t, _, {
                value: t,
                enumerable: !1,
                writable: !1,
                configurable: !0,
              }),
            Object.defineProperties(t, r(e))
          );
        }),
          (t.promisify.custom = _),
          (t.callbackify = R);
      }.call(this, n('Q2Ig')));
    },
    NJEC: function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = n('sKbD'),
        o = n.n(i),
        a = n('4IlW'),
        l = n('3S7+'),
        s = n('2/Rp'),
        c = n('zvFY'),
        u = n('YMnH'),
        f = n('ZvpZ'),
        p = n('H84U'),
        d = n('bogI'),
        h = n('0n0R'),
        m = void 0;
      function g() {
        return (
          (g =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          g.apply(this, arguments)
        );
      }
      function v(e, t) {
        return C(e) || x(e, t) || b(e, t) || y();
      }
      function y() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      function b(e, t) {
        if (e) {
          if ('string' === typeof e) return w(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? w(e, t)
              : void 0
          );
        }
      }
      function w(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function x(e, t) {
        if ('undefined' !== typeof Symbol && Symbol.iterator in Object(e)) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (var a, l = e[Symbol.iterator](); !(r = (a = l.next()).done); r = !0)
              if ((n.push(a.value), t && n.length === t)) break;
          } catch (s) {
            (i = !0), (o = s);
          } finally {
            try {
              r || null == l['return'] || l['return']();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        }
      }
      function C(e) {
        if (Array.isArray(e)) return e;
      }
      var S = function (e, t) {
          var n = {};
          for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
          if (null != e && 'function' === typeof Object.getOwnPropertySymbols) {
            var i = 0;
            for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
              t.indexOf(r[i]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
                (n[r[i]] = e[r[i]]);
          }
          return n;
        },
        k = r['forwardRef'](function (e, t) {
          var n = r['useState'](e.visible),
            i = v(n, 2),
            o = i[0],
            y = i[1];
          r['useEffect'](
            function () {
              'visible' in e && y(e.visible);
            },
            [e.visible],
          ),
            r['useEffect'](
              function () {
                'defaultVisible' in e && y(e.defaultVisible);
              },
              [e.defaultVisible],
            );
          var b = function (t, n) {
              'visible' in e || y(t), e.onVisibleChange && e.onVisibleChange(t, n);
            },
            w = function (t) {
              b(!1, t), e.onConfirm && e.onConfirm.call(m, t);
            },
            x = function (t) {
              b(!1, t), e.onCancel && e.onCancel.call(m, t);
            },
            C = function (e) {
              e.keyCode === a['a'].ESC && o && b(!1, e);
            },
            k = function (t) {
              var n = e.disabled;
              n || b(t);
            },
            E = function (t, n) {
              var i = e.okButtonProps,
                o = e.cancelButtonProps,
                a = e.title,
                l = e.cancelText,
                u = e.okText,
                f = e.okType,
                p = e.icon;
              return r['createElement'](
                'div',
                { className: ''.concat(t, '-inner-content') },
                r['createElement'](
                  'div',
                  { className: ''.concat(t, '-message') },
                  p,
                  r['createElement'](
                    'div',
                    { className: ''.concat(t, '-message-title') },
                    Object(d['a'])(a),
                  ),
                ),
                r['createElement'](
                  'div',
                  { className: ''.concat(t, '-buttons') },
                  r['createElement'](
                    s['default'],
                    g({ onClick: x, size: 'small' }, o),
                    l || n.cancelText,
                  ),
                  r['createElement'](
                    s['default'],
                    g({ onClick: w }, Object(c['a'])(f), { size: 'small' }, i),
                    u || n.okText,
                  ),
                ),
              );
            },
            O = r['useContext'](p['b']),
            L = O.getPrefixCls,
            T = e.prefixCls,
            N = e.placement,
            M = e.children,
            A = S(e, ['prefixCls', 'placement', 'children']),
            j = L('popover', T),
            P = r['createElement'](
              u['a'],
              { componentName: 'Popconfirm', defaultLocale: f['a'].Popconfirm },
              function (e) {
                return E(j, e);
              },
            );
          return r['createElement'](
            l['a'],
            g({}, A, {
              prefixCls: j,
              placement: N,
              onVisibleChange: k,
              visible: o,
              overlay: P,
              ref: t,
            }),
            Object(h['a'])(M, {
              onKeyDown: function (e) {
                var t, n;
                null === (n = null === M || void 0 === M ? void 0 : (t = M.props).onKeyDown) ||
                  void 0 === n ||
                  n.call(t, e),
                  C(e);
              },
            }),
          );
        });
      (k.defaultProps = {
        transitionName: 'zoom-big',
        placement: 'top',
        trigger: 'click',
        okType: 'primary',
        icon: r['createElement'](o.a, null),
        disabled: !1,
      }),
        (t['a'] = k);
    },
    P2fV: function (e, t, n) {
      'use strict';
      n('cIOH'), n('Q9mQ'), n('+L6B');
    },
    PKsF: function (e, t, n) {
      (function (e) {
        var t = /\S/,
          n = /\"/g,
          r = /\n/g,
          i = /\r/g,
          o = /\\/g,
          a = /\u2028/,
          l = /\u2029/;
        function s(e) {
          '}' === e.n.substr(e.n.length - 1) && (e.n = e.n.substring(0, e.n.length - 1));
        }
        function c(e) {
          return e.trim ? e.trim() : e.replace(/^\s*|\s*$/g, '');
        }
        function u(e, t, n) {
          if (t.charAt(n) != e.charAt(0)) return !1;
          for (var r = 1, i = e.length; r < i; r++) if (t.charAt(n + r) != e.charAt(r)) return !1;
          return !0;
        }
        (e.tags = {
          '#': 1,
          '^': 2,
          '<': 3,
          $: 4,
          '/': 5,
          '!': 6,
          '>': 7,
          '=': 8,
          _v: 9,
          '{': 10,
          '&': 11,
          _t: 12,
        }),
          (e.scan = function (n, r) {
            var i = n.length,
              o = 0,
              a = 1,
              l = 2,
              f = o,
              p = null,
              d = null,
              h = '',
              m = [],
              g = !1,
              v = 0,
              y = 0,
              b = '{{',
              w = '}}';
            function x() {
              h.length > 0 && (m.push({ tag: '_t', text: new String(h) }), (h = ''));
            }
            function C() {
              for (var n = !0, r = y; r < m.length; r++)
                if (
                  ((n =
                    e.tags[m[r].tag] < e.tags['_v'] ||
                    ('_t' == m[r].tag && null === m[r].text.match(t))),
                  !n)
                )
                  return !1;
              return n;
            }
            function S(e, t) {
              if ((x(), e && C()))
                for (var n, r = y; r < m.length; r++)
                  m[r].text &&
                    ((n = m[r + 1]) && '>' == n.tag && (n.indent = m[r].text.toString()),
                    m.splice(r, 1));
              else t || m.push({ tag: '\n' });
              (g = !1), (y = m.length);
            }
            function k(e, t) {
              var n = '=' + w,
                r = e.indexOf(n, t),
                i = c(e.substring(e.indexOf('=', t) + 1, r)).split(' ');
              return (b = i[0]), (w = i[i.length - 1]), r + n.length - 1;
            }
            for (r && ((r = r.split(' ')), (b = r[0]), (w = r[1])), v = 0; v < i; v++)
              f == o
                ? u(b, n, v)
                  ? (--v, x(), (f = a))
                  : '\n' == n.charAt(v)
                  ? S(g)
                  : (h += n.charAt(v))
                : f == a
                ? ((v += b.length - 1),
                  (d = e.tags[n.charAt(v + 1)]),
                  (p = d ? n.charAt(v + 1) : '_v'),
                  '=' == p ? ((v = k(n, v)), (f = o)) : (d && v++, (f = l)),
                  (g = v))
                : u(w, n, v)
                ? (m.push({
                    tag: p,
                    n: c(h),
                    otag: b,
                    ctag: w,
                    i: '/' == p ? g - b.length : v + w.length,
                  }),
                  (h = ''),
                  (v += w.length - 1),
                  (f = o),
                  '{' == p && ('}}' == w ? v++ : s(m[m.length - 1])))
                : (h += n.charAt(v));
            return S(g, !0), m;
          });
        var f = { _t: !0, '\n': !0, $: !0, '/': !0 };
        function p(t, n, r, i) {
          var o = [],
            a = null,
            l = null,
            s = null;
          l = r[r.length - 1];
          while (t.length > 0) {
            if (((s = t.shift()), l && '<' == l.tag && !(s.tag in f)))
              throw new Error('Illegal content in < super tag.');
            if (e.tags[s.tag] <= e.tags['$'] || d(s, i)) r.push(s), (s.nodes = p(t, s.tag, r, i));
            else {
              if ('/' == s.tag) {
                if (0 === r.length) throw new Error('Closing tag without opener: /' + s.n);
                if (((a = r.pop()), s.n != a.n && !h(s.n, a.n, i)))
                  throw new Error('Nesting error: ' + a.n + ' vs. ' + s.n);
                return (a.end = s.i), o;
              }
              '\n' == s.tag && (s.last = 0 == t.length || '\n' == t[0].tag);
            }
            o.push(s);
          }
          if (r.length > 0) throw new Error('missing closing tag: ' + r.pop().n);
          return o;
        }
        function d(e, t) {
          for (var n = 0, r = t.length; n < r; n++) if (t[n].o == e.n) return (e.tag = '#'), !0;
        }
        function h(e, t, n) {
          for (var r = 0, i = n.length; r < i; r++) if (n[r].c == e && n[r].o == t) return !0;
        }
        function m(e) {
          var t = [];
          for (var n in e) t.push('"' + y(n) + '": function(c,p,t,i) {' + e[n] + '}');
          return '{ ' + t.join(',') + ' }';
        }
        function g(e) {
          var t = [];
          for (var n in e.partials)
            t.push(
              '"' + y(n) + '":{name:"' + y(e.partials[n].name) + '", ' + g(e.partials[n]) + '}',
            );
          return 'partials: {' + t.join(',') + '}, subs: ' + m(e.subs);
        }
        e.stringify = function (t, n, r) {
          return '{code: function (c,p,i) { ' + e.wrapMain(t.code) + ' },' + g(t) + '}';
        };
        var v = 0;
        function y(e) {
          return e
            .replace(o, '\\\\')
            .replace(n, '\\"')
            .replace(r, '\\n')
            .replace(i, '\\r')
            .replace(a, '\\u2028')
            .replace(l, '\\u2029');
        }
        function b(e) {
          return ~e.indexOf('.') ? 'd' : 'f';
        }
        function w(e, t) {
          var n = '<' + (t.prefix || ''),
            r = n + e.n + v++;
          return (
            (t.partials[r] = { name: e.n, partials: {} }),
            (t.code += 't.b(t.rp("' + y(r) + '",c,p,"' + (e.indent || '') + '"));'),
            r
          );
        }
        function x(e, t) {
          t.code += 't.b(t.t(t.' + b(e.n) + '("' + y(e.n) + '",c,p,0)));';
        }
        function C(e) {
          return 't.b(' + e + ');';
        }
        (e.generate = function (t, n, r) {
          v = 0;
          var i = { code: '', subs: {}, partials: {} };
          return e.walk(t, i), r.asString ? this.stringify(i, n, r) : this.makeTemplate(i, n, r);
        }),
          (e.wrapMain = function (e) {
            return 'var t=this;t.b(i=i||"");' + e + 'return t.fl();';
          }),
          (e.template = e.Template),
          (e.makeTemplate = function (e, t, n) {
            var r = this.makePartials(e);
            return (
              (r.code = new Function('c', 'p', 'i', this.wrapMain(e.code))),
              new this.template(r, t, this, n)
            );
          }),
          (e.makePartials = function (e) {
            var t,
              n = { subs: {}, partials: e.partials, name: e.name };
            for (t in n.partials) n.partials[t] = this.makePartials(n.partials[t]);
            for (t in e.subs) n.subs[t] = new Function('c', 'p', 't', 'i', e.subs[t]);
            return n;
          }),
          (e.codegen = {
            '#': function (t, n) {
              (n.code +=
                'if(t.s(t.' +
                b(t.n) +
                '("' +
                y(t.n) +
                '",c,p,1),c,p,0,' +
                t.i +
                ',' +
                t.end +
                ',"' +
                t.otag +
                ' ' +
                t.ctag +
                '")){t.rs(c,p,function(c,p,t){'),
                e.walk(t.nodes, n),
                (n.code += '});c.pop();}');
            },
            '^': function (t, n) {
              (n.code += 'if(!t.s(t.' + b(t.n) + '("' + y(t.n) + '",c,p,1),c,p,1,0,0,"")){'),
                e.walk(t.nodes, n),
                (n.code += '};');
            },
            '>': w,
            '<': function (t, n) {
              var r = { partials: {}, code: '', subs: {}, inPartial: !0 };
              e.walk(t.nodes, r);
              var i = n.partials[w(t, n)];
              (i.subs = r.subs), (i.partials = r.partials);
            },
            $: function (t, n) {
              var r = { subs: {}, code: '', partials: n.partials, prefix: t.n };
              e.walk(t.nodes, r),
                (n.subs[t.n] = r.code),
                n.inPartial || (n.code += 't.sub("' + y(t.n) + '",c,p,i);');
            },
            '\n': function (e, t) {
              t.code += C('"\\n"' + (e.last ? '' : ' + i'));
            },
            _v: function (e, t) {
              t.code += 't.b(t.v(t.' + b(e.n) + '("' + y(e.n) + '",c,p,0)));';
            },
            _t: function (e, t) {
              t.code += C('"' + y(e.text) + '"');
            },
            '{': x,
            '&': x,
          }),
          (e.walk = function (t, n) {
            for (var r, i = 0, o = t.length; i < o; i++) (r = e.codegen[t[i].tag]), r && r(t[i], n);
            return n;
          }),
          (e.parse = function (e, t, n) {
            return (n = n || {}), p(e, '', [], n.sectionTags || []);
          }),
          (e.cache = {}),
          (e.cacheKey = function (e, t) {
            return [e, !!t.asString, !!t.disableLambda, t.delimiters, !!t.modelGet].join('||');
          }),
          (e.compile = function (t, n) {
            n = n || {};
            var r = e.cacheKey(t, n),
              i = this.cache[r];
            if (i) {
              var o = i.partials;
              for (var a in o) delete o[a].instance;
              return i;
            }
            return (
              (i = this.generate(this.parse(this.scan(t, n.delimiters), t, n), t, n)),
              (this.cache[r] = i)
            );
          });
      })(t);
    },
    PQMj: function (e, t, n) {},
    Pwec: function (e, t, n) {
      'use strict';
      n('cIOH'), n('WtSK');
    },
    Q9mQ: function (e, t, n) {
      'use strict';
      n('cIOH'), n('UADf');
    },
    RuPt: function (e, t, n) {
      'use strict';
      n.r(t),
        n.d(t, 'default', function () {
          return $r;
        });
      n('IzEo');
      var r = n('bx4M'),
        i = (n('14J3'), n('BMrR')),
        o = (n('jCWc'), n('kPKH')),
        a = (n('fOrg'), n('+KLJ')),
        l = (n('miYZ'), n('tsqr')),
        s = n('k1fw'),
        c = n('fWQN'),
        u = n('mtLc'),
        f = n('yKVA'),
        p = n('879j'),
        d = (n('Znn+'), n('ZTPi')),
        h = n('q1tI'),
        m = n.n(h),
        g = (n('cIOH'), n('PQMj'), n('MFj2')),
        v = n('TSYQ'),
        y = n.n(v),
        b = n('H84U'),
        w = n('0n0R');
      function x() {
        return (
          (x =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          x.apply(this, arguments)
        );
      }
      function C(e, t) {
        return L(e) || O(e, t) || k(e, t) || S();
      }
      function S() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      function k(e, t) {
        if (e) {
          if ('string' === typeof e) return E(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? E(e, t)
              : void 0
          );
        }
      }
      function E(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function O(e, t) {
        if ('undefined' !== typeof Symbol && Symbol.iterator in Object(e)) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (var a, l = e[Symbol.iterator](); !(r = (a = l.next()).done); r = !0)
              if ((n.push(a.value), t && n.length === t)) break;
          } catch (s) {
            (i = !0), (o = s);
          } finally {
            try {
              r || null == l['return'] || l['return']();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        }
      }
      function L(e) {
        if (Array.isArray(e)) return e;
      }
      var T = function (e, t) {
        var n = {};
        for (var r in e)
          Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
        if (null != e && 'function' === typeof Object.getOwnPropertySymbols) {
          var i = 0;
          for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
            t.indexOf(r[i]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
              (n[r[i]] = e[r[i]]);
        }
        return n;
      };
      function N(e) {
        return e
          ? e
              .toString()
              .split('')
              .reverse()
              .map(function (e) {
                var t = Number(e);
                return isNaN(t) ? e : t;
              })
          : [];
      }
      function M(e, t) {
        for (var n = [], r = 0; r < 30; r++)
          n.push(
            h['createElement'](
              'p',
              { key: r.toString(), className: y()(t, { current: e === r }) },
              r % 10,
            ),
          );
        return n;
      }
      var A = function (e) {
          var t = e.prefixCls,
            n = e.count,
            r = e.className,
            i = e.style,
            o = e.title,
            a = e.component,
            l = void 0 === a ? 'sup' : a,
            s = e.displayComponent,
            c = e.onAnimated,
            u = void 0 === c ? function () {} : c,
            f = T(e, [
              'prefixCls',
              'count',
              'className',
              'style',
              'title',
              'component',
              'displayComponent',
              'onAnimated',
            ]),
            p = h['useState'](!0),
            d = C(p, 2),
            m = d[0],
            g = d[1],
            v = h['useState'](n),
            S = C(v, 2),
            k = S[0],
            E = S[1],
            O = h['useState'](n),
            L = C(O, 2),
            A = L[0],
            j = L[1],
            P = h['useState'](n),
            I = C(P, 2),
            D = I[0],
            _ = I[1],
            z = h['useContext'](b['b']),
            R = z.getPrefixCls,
            F = R('scroll-number', t);
          A !== n && (g(!0), j(n)),
            h['useEffect'](
              function () {
                var e;
                return (
                  _(k),
                  m &&
                    (e = setTimeout(function () {
                      g(!1), E(n), u();
                    })),
                  function () {
                    e && clearTimeout(e);
                  }
                );
              },
              [m, n, u],
            );
          var H = function (e, t) {
              var n = Math.abs(Number(k)),
                r = Math.abs(Number(D)),
                i = Math.abs(N(k)[t]),
                o = Math.abs(N(r)[t]);
              return m ? 10 + e : n > r ? (i >= o ? 10 + e : 20 + e) : i <= o ? 10 + e : e;
            },
            W = function (e, t) {
              if ('number' === typeof e) {
                var n = H(e, t),
                  r = m || void 0 === N(D)[t];
                return h['createElement'](
                  'span',
                  {
                    className: ''.concat(F, '-only'),
                    style: {
                      transition: r ? 'none' : void 0,
                      msTransform: 'translateY('.concat(100 * -n, '%)'),
                      WebkitTransform: 'translateY('.concat(100 * -n, '%)'),
                      transform: 'translateY('.concat(100 * -n, '%)'),
                    },
                    key: t,
                  },
                  M(n, ''.concat(F, '-only-unit')),
                );
              }
              return h['createElement'](
                'span',
                { key: 'symbol', className: ''.concat(F, '-symbol') },
                e,
              );
            },
            B = function () {
              return k && Number(k) % 1 === 0
                ? N(k)
                    .map(function (e, t) {
                      return W(e, t);
                    })
                    .reverse()
                : k;
            },
            V = x(x({}, f), { style: i, className: y()(F, r), title: o });
          return (
            i &&
              i.borderColor &&
              (V.style = x(x({}, i), { boxShadow: '0 0 0 1px '.concat(i.borderColor, ' inset') })),
            s
              ? Object(w['a'])(s, {
                  className: y()(''.concat(F, '-custom-component'), s.props && s.props.className),
                })
              : h['createElement'](l, V, B())
          );
        },
        j = A,
        P = n('09Wf');
      function I(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function D(e) {
        return (
          (D =
            'function' === typeof Symbol && 'symbol' === typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    'function' === typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? 'symbol'
                    : typeof e;
                }),
          D(e)
        );
      }
      function _() {
        return (
          (_ =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          _.apply(this, arguments)
        );
      }
      var z = function (e, t) {
        var n = {};
        for (var r in e)
          Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
        if (null != e && 'function' === typeof Object.getOwnPropertySymbols) {
          var i = 0;
          for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
            t.indexOf(r[i]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
              (n[r[i]] = e[r[i]]);
        }
        return n;
      };
      function R(e) {
        return -1 !== P['a'].indexOf(e);
      }
      var F = function (e) {
          var t,
            n,
            r = e.prefixCls,
            i = e.scrollNumberPrefixCls,
            o = e.children,
            a = e.status,
            l = e.text,
            s = e.color,
            c = e.count,
            u = void 0 === c ? null : c,
            f = e.overflowCount,
            p = void 0 === f ? 99 : f,
            d = e.dot,
            m = void 0 !== d && d,
            v = e.title,
            x = e.offset,
            C = e.style,
            S = e.className,
            k = e.showZero,
            E = void 0 !== k && k,
            O = z(e, [
              'prefixCls',
              'scrollNumberPrefixCls',
              'children',
              'status',
              'text',
              'color',
              'count',
              'overflowCount',
              'dot',
              'title',
              'offset',
              'style',
              'className',
              'showZero',
            ]),
            L = h['useContext'](b['b']),
            T = L.getPrefixCls,
            N = L.direction,
            M = T('badge', r),
            A = function () {
              var e = u > p ? ''.concat(p, '+') : u;
              return e;
            },
            P = function () {
              return !!a || !!s;
            },
            F = function () {
              var e = A();
              return '0' === e || 0 === e;
            },
            H = function () {
              return (m && !F()) || P();
            },
            W = function () {
              return H() ? '' : A();
            },
            B = function () {
              return v || ('string' === typeof u || 'number' === typeof u ? u : void 0);
            },
            V = function () {
              return x ? _({ right: -parseInt(x[0], 10), marginTop: x[1] }, C) : C;
            },
            U = function () {
              var e = W(),
                t = null === e || void 0 === e || '' === e;
              return (t || (F() && !E)) && !H();
            },
            K = function () {
              var e = U();
              return e || !l
                ? null
                : h['createElement']('span', { className: ''.concat(M, '-status-text') }, l);
            },
            q = function () {
              var e = u;
              if (e && 'object' === D(e))
                return Object(w['a'])(e, { style: _(_({}, V()), e.props && e.props.style) });
            },
            G = function () {
              var e,
                t = T('scroll-number', i),
                n = W(),
                r = H(),
                o = U(),
                l = y()(
                  ((e = {}),
                  I(e, ''.concat(M, '-dot'), r),
                  I(e, ''.concat(M, '-count'), !r),
                  I(
                    e,
                    ''.concat(M, '-multiple-words'),
                    !r && u && u.toString && u.toString().length > 1,
                  ),
                  I(e, ''.concat(M, '-status-').concat(a), !!a),
                  I(e, ''.concat(M, '-status-').concat(s), R(s)),
                  e),
                ),
                c = V();
              return (
                s && !R(s) && ((c = c || {}), (c.background = s)),
                o
                  ? null
                  : h['createElement'](j, {
                      prefixCls: t,
                      'data-show': !o,
                      className: l,
                      count: n,
                      displayComponent: q(),
                      title: B(),
                      style: c,
                      key: 'scrollNumber',
                    })
              );
            },
            Y = y()(
              ((t = {}),
              I(t, ''.concat(M, '-status-dot'), P()),
              I(t, ''.concat(M, '-status-').concat(a), !!a),
              I(t, ''.concat(M, '-status-').concat(s), R(s)),
              t),
            ),
            Z = {};
          s && !R(s) && (Z.background = s);
          var $ = y()(
            S,
            M,
            ((n = {}),
            I(n, ''.concat(M, '-status'), P()),
            I(n, ''.concat(M, '-not-a-wrapper'), !o),
            I(n, ''.concat(M, '-rtl'), 'rtl' === N),
            n),
          );
          if (!o && P()) {
            var X = V(),
              J = X && X.color;
            return h['createElement'](
              'span',
              _({}, O, { className: $, style: X }),
              h['createElement']('span', { className: Y, style: Z }),
              h['createElement'](
                'span',
                { style: { color: J }, className: ''.concat(M, '-status-text') },
                l,
              ),
            );
          }
          return h['createElement'](
            'span',
            _({}, O, { className: $ }),
            o,
            h['createElement'](
              g['a'],
              {
                component: '',
                showProp: 'data-show',
                transitionName: o ? ''.concat(M, '-zoom') : '',
                transitionAppear: !0,
              },
              G(),
            ),
            K(),
          );
        },
        H = F,
        W = (n('T2oS'), n('W9HT')),
        B = (n('g9YV'), n('wCAj')),
        V = (n('+L6B'), n('2/Rp')),
        U = (n('Pwec'), n('CtXQ')),
        K = (n('5Dmo'), n('3S7+')),
        q = (n('P2fV'), n('NJEC')),
        G = (n('+BJd'), n('mr32')),
        Y = n('jrin'),
        Z = n('tJVT'),
        $ = n('tS8v'),
        X = (n('5NDa'), n('5rEg')),
        J = (n('3dVZ'), n('Gytx')),
        Q = n.n(J),
        ee = (function () {
          function e(e, t) {
            for (var n = 0; n < t.length; n++) {
              var r = t[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(e, r.key, r);
            }
          }
          return function (t, n, r) {
            return n && e(t.prototype, n), r && e(t, r), t;
          };
        })();
      function te(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function ne(e, t) {
        if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
      }
      function re(e, t) {
        if (!e)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || ('object' !== typeof t && 'function' !== typeof t) ? e : t;
      }
      function ie(e, t) {
        if ('function' !== typeof t && null !== t)
          throw new TypeError(
            'Super expression must either be null or a function, not ' + typeof t,
          );
        (e.prototype = Object.create(t && t.prototype, {
          constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
        })),
          t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
      }
      var oe = (function (e) {
          function t() {
            return (
              ne(this, t),
              re(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            );
          }
          return (
            ie(t, e),
            ee(t, [
              {
                key: 'shouldComponentUpdate',
                value: function (e) {
                  return this.props.forceRender || !Q()(this.props, e);
                },
              },
              {
                key: 'render',
                value: function () {
                  var e;
                  if (
                    ((this._isActived =
                      this.props.forceRender || this._isActived || this.props.isActive),
                    !this._isActived)
                  )
                    return null;
                  var t = this.props,
                    n = t.prefixCls,
                    r = t.isActive,
                    i = t.children,
                    o = t.destroyInactivePanel,
                    a = t.forceRender,
                    l = t.role,
                    s = y()(
                      n + '-content',
                      ((e = {}),
                      te(e, n + '-content-active', r),
                      te(e, n + '-content-inactive', !r),
                      e),
                    ),
                    c =
                      a || r || !o
                        ? m.a.createElement('div', { className: n + '-content-box' }, i)
                        : null;
                  return m.a.createElement('div', { className: s, role: l }, c);
                },
              },
            ]),
            t
          );
        })(h['Component']),
        ae = oe,
        le = (function () {
          function e(e, t) {
            for (var n = 0; n < t.length; n++) {
              var r = t[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(e, r.key, r);
            }
          }
          return function (t, n, r) {
            return n && e(t.prototype, n), r && e(t, r), t;
          };
        })();
      function se(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function ce(e, t) {
        if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
      }
      function ue(e, t) {
        if (!e)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || ('object' !== typeof t && 'function' !== typeof t) ? e : t;
      }
      function fe(e, t) {
        if ('function' !== typeof t && null !== t)
          throw new TypeError(
            'Super expression must either be null or a function, not ' + typeof t,
          );
        (e.prototype = Object.create(t && t.prototype, {
          constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
        })),
          t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
      }
      var pe = (function (e) {
        function t() {
          var e, n, r, i;
          ce(this, t);
          for (var o = arguments.length, a = Array(o), l = 0; l < o; l++) a[l] = arguments[l];
          return (
            (r = ue(
              this,
              (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(a)),
            )),
            (n = r),
            (r.handleItemClick = function () {
              var e = r.props,
                t = e.onItemClick,
                n = e.panelKey;
              'function' === typeof t && t(n);
            }),
            (r.handleKeyPress = function (e) {
              ('Enter' !== e.key && 13 !== e.keyCode && 13 !== e.which) || r.handleItemClick();
            }),
            (i = n),
            ue(r, i)
          );
        }
        return (
          fe(t, e),
          le(t, [
            {
              key: 'shouldComponentUpdate',
              value: function (e) {
                return !Q()(this.props, e);
              },
            },
            {
              key: 'render',
              value: function () {
                var e,
                  t = this.props,
                  n = t.className,
                  r = t.id,
                  i = t.style,
                  o = t.prefixCls,
                  a = t.header,
                  l = t.headerClass,
                  s = t.children,
                  c = t.isActive,
                  u = t.showArrow,
                  f = t.destroyInactivePanel,
                  p = t.disabled,
                  d = t.accordion,
                  h = t.forceRender,
                  v = t.expandIcon,
                  b = t.extra,
                  w = y()(o + '-header', se({}, l, l)),
                  x = y()(
                    ((e = {}),
                    se(e, o + '-item', !0),
                    se(e, o + '-item-active', c),
                    se(e, o + '-item-disabled', p),
                    e),
                    n,
                  ),
                  C = m.a.createElement('i', { className: 'arrow' });
                return (
                  u && 'function' === typeof v && (C = v(this.props)),
                  m.a.createElement(
                    'div',
                    { className: x, style: i, id: r },
                    m.a.createElement(
                      'div',
                      {
                        className: w,
                        onClick: this.handleItemClick,
                        role: d ? 'tab' : 'button',
                        tabIndex: p ? -1 : 0,
                        'aria-expanded': '' + c,
                        onKeyPress: this.handleKeyPress,
                      },
                      u && C,
                      a,
                      b && m.a.createElement('div', { className: o + '-extra' }, b),
                    ),
                    m.a.createElement(
                      g['a'],
                      {
                        showProp: 'isActive',
                        exclusive: !0,
                        component: '',
                        animation: this.props.openAnimation,
                      },
                      m.a.createElement(
                        ae,
                        {
                          prefixCls: o,
                          isActive: c,
                          destroyInactivePanel: f,
                          forceRender: h,
                          role: d ? 'tabpanel' : null,
                        },
                        s,
                      ),
                    ),
                  )
                );
              },
            },
          ]),
          t
        );
      })(h['Component']);
      pe.defaultProps = {
        showArrow: !0,
        isActive: !1,
        destroyInactivePanel: !1,
        onItemClick: function () {},
        headerClass: '',
        forceRender: !1,
      };
      var de = pe,
        he = n('UwPn');
      function me(e, t, n, r) {
        var i = void 0;
        return Object(he['a'])(e, n, {
          start: function () {
            t
              ? ((i = e.offsetHeight), (e.style.height = 0))
              : (e.style.height = e.offsetHeight + 'px');
          },
          active: function () {
            e.style.height = (t ? i : 0) + 'px';
          },
          end: function () {
            (e.style.height = ''), r();
          },
        });
      }
      function ge(e) {
        return {
          enter: function (t, n) {
            return me(t, !0, e + '-anim', n);
          },
          leave: function (t, n) {
            return me(t, !1, e + '-anim', n);
          },
        };
      }
      var ve = ge,
        ye = n('TOwV'),
        be = (function () {
          function e(e, t) {
            for (var n = 0; n < t.length; n++) {
              var r = t[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                'value' in r && (r.writable = !0),
                Object.defineProperty(e, r.key, r);
            }
          }
          return function (t, n, r) {
            return n && e(t.prototype, n), r && e(t, r), t;
          };
        })();
      function we(e) {
        if (Array.isArray(e)) {
          for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
          return n;
        }
        return Array.from(e);
      }
      function xe(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function Ce(e, t) {
        if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
      }
      function Se(e, t) {
        if (!e)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || ('object' !== typeof t && 'function' !== typeof t) ? e : t;
      }
      function ke(e, t) {
        if ('function' !== typeof t && null !== t)
          throw new TypeError(
            'Super expression must either be null or a function, not ' + typeof t,
          );
        (e.prototype = Object.create(t && t.prototype, {
          constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
        })),
          t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
      }
      function Ee(e) {
        var t = e;
        return (
          Array.isArray(t) || (t = t ? [t] : []),
          t.map(function (e) {
            return String(e);
          })
        );
      }
      var Oe = (function (e) {
          function t(e) {
            Ce(this, t);
            var n = Se(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
            Le.call(n);
            var r = e.activeKey,
              i = e.defaultActiveKey,
              o = i;
            return (
              'activeKey' in e && (o = r),
              (n.state = { openAnimation: e.openAnimation || ve(e.prefixCls), activeKey: Ee(o) }),
              n
            );
          }
          return (
            ke(t, e),
            be(
              t,
              [
                {
                  key: 'shouldComponentUpdate',
                  value: function (e, t) {
                    return !Q()(this.props, e) || !Q()(this.state, t);
                  },
                },
                {
                  key: 'render',
                  value: function () {
                    var e,
                      t = this.props,
                      n = t.prefixCls,
                      r = t.className,
                      i = t.style,
                      o = t.accordion,
                      a = y()(((e = {}), xe(e, n, !0), xe(e, r, !!r), e));
                    return m.a.createElement(
                      'div',
                      { className: a, style: i, role: o ? 'tablist' : null },
                      this.getItems(),
                    );
                  },
                },
              ],
              [
                {
                  key: 'getDerivedStateFromProps',
                  value: function (e) {
                    var t = {};
                    return (
                      'activeKey' in e && (t.activeKey = Ee(e.activeKey)),
                      'openAnimation' in e && (t.openAnimation = e.openAnimation),
                      t.activeKey || t.openAnimation ? t : null
                    );
                  },
                },
              ],
            ),
            t
          );
        })(h['Component']),
        Le = function () {
          var e = this;
          (this.onClickItem = function (t) {
            var n = e.state.activeKey;
            if (e.props.accordion) n = n[0] === t ? [] : [t];
            else {
              n = [].concat(we(n));
              var r = n.indexOf(t),
                i = r > -1;
              i ? n.splice(r, 1) : n.push(t);
            }
            e.setActiveKey(n);
          }),
            (this.getNewChild = function (t, n) {
              if (!t) return null;
              var r = e.state.activeKey,
                i = e.props,
                o = i.prefixCls,
                a = i.accordion,
                l = i.destroyInactivePanel,
                s = i.expandIcon,
                c = t.key || String(n),
                u = t.props,
                f = u.header,
                p = u.headerClass,
                d = u.disabled,
                h = !1;
              h = a ? r[0] === c : r.indexOf(c) > -1;
              var g = {
                key: c,
                panelKey: c,
                header: f,
                headerClass: p,
                isActive: h,
                prefixCls: o,
                destroyInactivePanel: l,
                openAnimation: e.state.openAnimation,
                accordion: a,
                children: t.props.children,
                onItemClick: d ? null : e.onClickItem,
                expandIcon: s,
              };
              return 'string' === typeof t.type ? t : m.a.cloneElement(t, g);
            }),
            (this.getItems = function () {
              var t = e.props.children,
                n = Object(ye['isFragment'])(t) ? t.props.children : t,
                r = h['Children'].map(n, e.getNewChild);
              return Object(ye['isFragment'])(t) ? m.a.createElement(m.a.Fragment, null, r) : r;
            }),
            (this.setActiveKey = function (t) {
              'activeKey' in e.props || e.setState({ activeKey: t }),
                e.props.onChange(e.props.accordion ? t[0] : t);
            });
        };
      (Oe.defaultProps = {
        prefixCls: 'rc-collapse',
        onChange: function () {},
        accordion: !1,
        destroyInactivePanel: !1,
      }),
        (Oe.Panel = de);
      var Te = Oe,
        Ne = Te,
        Me = (Te.Panel, n('fEPi')),
        Ae = n.n(Me);
      function je() {
        return (
          (je =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          je.apply(this, arguments)
        );
      }
      function Pe(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      var Ie = function (e) {
          var t = h['useContext'](b['b']),
            n = t.getPrefixCls,
            r = e.prefixCls,
            i = e.className,
            o = void 0 === i ? '' : i,
            a = e.showArrow,
            l = void 0 === a || a,
            s = n('collapse', r),
            c = y()(Pe({}, ''.concat(s, '-no-arrow'), !l), o);
          return h['createElement'](Ne.Panel, je({}, e, { prefixCls: s, className: c }));
        },
        De = Ie,
        _e = n('xEkU'),
        ze = n.n(_e);
      function Re(e, t, n) {
        var r, i;
        return Object(he['a'])(e, 'ant-motion-collapse-legacy', {
          start: function () {
            t
              ? ((r = e.offsetHeight), (e.style.height = '0px'), (e.style.opacity = '0'))
              : ((e.style.height = ''.concat(e.offsetHeight, 'px')), (e.style.opacity = '1'));
          },
          active: function () {
            i && ze.a.cancel(i),
              (i = ze()(function () {
                (e.style.height = ''.concat(t ? r : 0, 'px')), (e.style.opacity = t ? '1' : '0');
              }));
          },
          end: function () {
            i && ze.a.cancel(i), (e.style.height = ''), (e.style.opacity = ''), n();
          },
        });
      }
      var Fe = {
          enter: function (e, t) {
            return Re(e, !0, t);
          },
          leave: function (e, t) {
            return Re(e, !1, t);
          },
          appear: function (e, t) {
            return Re(e, !0, t);
          },
        },
        He = Fe;
      function We() {
        return (
          (We =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          We.apply(this, arguments)
        );
      }
      function Be(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      var Ve = function (e) {
        var t,
          n = h['useContext'](b['b']),
          r = n.getPrefixCls,
          i = n.direction,
          o = e.prefixCls,
          a = e.className,
          l = void 0 === a ? '' : a,
          s = e.bordered,
          c = r('collapse', o),
          u = function () {
            var t = e.expandIconPosition;
            return void 0 !== t ? t : 'rtl' === i ? 'right' : 'left';
          },
          f = function () {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
              n = e.expandIcon,
              r = n ? n(t) : h['createElement'](Ae.a, { rotate: t.isActive ? 90 : void 0 });
            return Object(w['a'])(r, function () {
              return { className: y()(r.props.className, ''.concat(c, '-arrow')) };
            });
          },
          p = u(),
          d = y()(
            ((t = {}),
            Be(t, ''.concat(c, '-borderless'), !s),
            Be(t, ''.concat(c, '-icon-position-').concat(p), !0),
            Be(t, ''.concat(c, '-rtl'), 'rtl' === i),
            t),
            l,
          ),
          m = We(We({}, He), { appear: function () {} });
        return h['createElement'](
          Ne,
          We({ openAnimation: m }, e, {
            expandIcon: function (e) {
              return f(e);
            },
            prefixCls: c,
            className: d,
          }),
        );
      };
      (Ve.Panel = De), (Ve.defaultProps = { bordered: !0 });
      var Ue = Ve,
        Ke = Ue,
        qe = (n('lUTK'), n('BvKs')),
        Ge = (n('B9cy'), n('Ol7k')),
        Ye = (n('2qtc'), n('kLXV')),
        Ze = n('/MKj'),
        $e = n('wd/R'),
        Xe = n.n($e),
        Je = n('+QRC'),
        Qe = n.n(Je);
      function et(e, t) {
        var n = {
          new: m.a.createElement(
            'span',
            {
              style: {
                backgroundColor: '#52c41a',
                marginLeft: '8px',
                color: '#fff',
                borderRadius: '5px',
                padding: '4px',
              },
            },
            t || '\u65b0',
          ),
          update: m.a.createElement(
            'span',
            {
              style: {
                backgroundColor: '#6495ED',
                marginLeft: '8px',
                color: '#fff',
                borderRadius: '5px',
                padding: '4px',
              },
            },
            t || '\u66f4',
          ),
          del: m.a.createElement(
            'span',
            {
              style: {
                backgroundColor: '#F31D28',
                marginLeft: '8px',
                color: '#fff',
                borderRadius: '5px',
                padding: '4px',
              },
            },
            t || '\u5220',
          ),
        };
        return n[e];
      }
      var tt = n('5Qi0'),
        nt = n('0Owb'),
        rt = (n('7Kak'), n('9yH6')),
        it = (n('y8nQ'), n('Vl3Y')),
        ot = n('uWVv'),
        at = n.n(ot),
        lt = (n('fidV'), n('WmNS')),
        st = n.n(lt),
        ct = n('9og8'),
        ut = n('9kvl');
      function ft(e) {
        return pt.apply(this, arguments);
      }
      function pt() {
        return (
          (pt = Object(ct['a'])(
            st.a.mark(function e(t) {
              var n, r, i, o, a, l;
              return st.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (n = t.id),
                        (r = t.caid),
                        (i = t.key),
                        (o = t.value),
                        (a = t.comment),
                        (l = t.resource_id),
                        e.abrupt(
                          'return',
                          Object(ut['J'])('/api/admin/confgo/item/check', {
                            method: 'POST',
                            data: { id: n, caid: r, key: i, value: o, comment: a, resource_id: l },
                          }),
                        )
                      );
                    case 2:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          pt.apply(this, arguments)
        );
      }
      var dt = [
          { key: 'redis', label: 'redis' },
          { key: 'mysql', label: 'mysql' },
          { key: 'grpc', label: 'grpc' },
          { key: 'rocketmq', label: 'rocketmq' },
          { key: 'etcd', label: 'etcd' },
          { key: 'crpc', label: 'crpc' },
          { key: 'mongo', label: 'mongo' },
          { key: 'key', label: 'key' },
        ],
        ht = (function (e) {
          Object(f['a'])(n, e);
          var t = Object(p['a'])(n);
          function n(e) {
            var r;
            return (
              Object(c['a'])(this, n),
              (r = t.call(this, e)),
              (r.handleSubmit = function (e) {
                !1 === r.state.is_resource
                  ? (e.value = r.configInputText)
                  : ((e.resource_id = r.state.resource_id),
                    (e.value = '"{{' + r.state.resource_name + '}}"')),
                  r.checkItem(e);
              }),
              (r.checkItem = function (e) {
                (e.value = r.configInputText),
                  (e.caid = r.props.caid),
                  ft(e).then(function (t) {
                    console.log(1111, t),
                      0 != t.code
                        ? l['a'].error('\u914d\u7f6e\u683c\u5f0f\u9519\u8bef\uff1a' + t.msg)
                        : (r.props.submit(e), r.close());
                  });
              }),
              (r.onChange = function (e) {
                var t = e.target.value;
                r.configInputText = t;
              }),
              (r.selectResource = function (e) {
                var t = r.props.item || {},
                  n = t.resourceData,
                  i = void 0 === n ? {} : n,
                  o = i.list,
                  a = void 0 === o ? [] : o,
                  s =
                    a.find(function (t) {
                      return t.id === 1 * e;
                    }) || {};
                r.setState({
                  resource_id: 1 * e,
                  resource_name: s.name,
                  resource_type: s.value_type,
                }),
                  r.props.form.setFieldsValue({ value: '"{{'.concat(s.name, '}}"') }),
                  l['a'].success('\u9009\u62e9\u6210\u529f\uff0c\u8bf7\u63d0\u4ea4');
              }),
              (r.close = function (e) {
                r.setState({ valueType: '', value: void 0 }), r.props.cancel();
              }),
              (r.configInputText = ''),
              (r.state = {
                is_resource: !1,
                resource_id: 0,
                resource_name: '',
                resource_type: '',
                type: 'redis',
                valueType: '',
                value: void 0,
                readOnly: !1,
              }),
              r
            );
          }
          return (
            Object(u['a'])(n, [
              { key: 'componentDidMount', value: function () {} },
              {
                key: 'render',
                value: function () {
                  var e = this,
                    t = this,
                    n = this.props,
                    r = n.show,
                    i = (n.prefix, n.item),
                    o = void 0 === i ? {} : i,
                    a = n.env,
                    l = n.zone_code,
                    s = o.resourceData,
                    c = void 0 === s ? {} : s,
                    u = c.list,
                    f = void 0 === u ? [] : u,
                    p = this.state.is_resource,
                    d = [
                      { title: '\u540d\u79f0', dataIndex: 'name' },
                      { title: '\u503c', dataIndex: 'value' },
                      {
                        title: '\u64cd\u4f5c',
                        dataIndex: 'op',
                        render: function (n, r) {
                          return r.id === e.state.resource_id
                            ? m.a.createElement(
                                'span',
                                null,
                                m.a.createElement(
                                  'a',
                                  { style: { color: '#52c41a' } },
                                  '\u5df2\u9009\u62e9',
                                ),
                              )
                            : m.a.createElement(
                                'span',
                                null,
                                m.a.createElement(
                                  'a',
                                  {
                                    onClick: function (e) {
                                      t.selectResource(r.id);
                                    },
                                  },
                                  '\u9009\u62e9',
                                ),
                              );
                        },
                      },
                    ],
                    h = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
                  return m.a.createElement(
                    Ye['a'],
                    {
                      title: '\u65b0\u589e\u914d\u7f6e',
                      visible: r,
                      maskClosable: !1,
                      width: 1200,
                      onCancel: this.close,
                      footer: null,
                      destroyOnClose: !0,
                    },
                    m.a.createElement(
                      it['a'],
                      Object(nt['a'])({}, h, {
                        onFinish: this.handleSubmit,
                        className: 'login-form',
                        initialValues: { is_resource: p },
                      }),
                      m.a.createElement(
                        it['a'].Item,
                        {
                          label: '\u6807\u8bc6',
                          name: 'key',
                          rules: [
                            {
                              required: !0,
                              message: '\u8bf7\u8f93\u5165\u914d\u7f6e\u9879\u7684key',
                            },
                          ],
                        },
                        m.a.createElement(X['a'], { placeholder: '' }),
                      ),
                      m.a.createElement(
                        it['a'].Item,
                        { label: '\u503c' },
                        m.a.createElement(
                          'div',
                          { className: 'configEditor' },
                          m.a.createElement(at.a, {
                            ref: 'editor',
                            value: this.state.value,
                            options: {
                              lineNumbers: !0,
                              autoMatchParens: !0,
                              lineWrapping: !0,
                              readOnly: this.state.readOnly,
                            },
                            onChange: function (t, n, r) {
                              e.configInputText = t.getValue();
                            },
                          }),
                        ),
                      ),
                      p &&
                        m.a.createElement(
                          it['a'].Item,
                          { label: '\u9009\u62e9\u914d\u7f6e\u8d44\u6e90' },
                          m.a.createElement(
                            'div',
                            null,
                            '\u73af\u5883-\u673a\u623f\uff1a',
                            m.a.createElement('span', null, a, '-', this.props.zone_codeMap[l]),
                          ),
                          m.a.createElement(
                            'div',
                            { style: { marginTop: '10px' } },
                            '\u7c7b\u578b\uff1a',
                            m.a.createElement(
                              'span',
                              null,
                              m.a.createElement(
                                rt['default'].Group,
                                {
                                  value: this.state.type,
                                  onChange: function (t) {
                                    e.setState({ type: t.target.value });
                                  },
                                },
                                dt.map(function (e) {
                                  return m.a.createElement(
                                    rt['default'],
                                    { key: e.key, value: e.key },
                                    e.label,
                                  );
                                }),
                              ),
                            ),
                          ),
                          m.a.createElement(
                            'div',
                            { style: { marginTop: '10px' } },
                            '\u8d44\u6e90\u540d\u79f0\uff1a',
                            m.a.createElement(
                              'span',
                              null,
                              m.a.createElement(X['a'], {
                                value: this.state.query,
                                onChange: function (t) {
                                  e.setState({ query: t.target.value });
                                },
                              }),
                            ),
                          ),
                          m.a.createElement(
                            'div',
                            { style: { marginTop: '10px' } },
                            m.a.createElement(B['a'], {
                              columns: d,
                              dataSource: f
                                .filter(function (t) {
                                  return t.type === e.state.type;
                                })
                                .filter(function (t) {
                                  return !e.state.query || -1 !== t.name.indexOf(e.state.query);
                                }),
                              size: 'small',
                            }),
                          ),
                        ),
                      m.a.createElement(
                        it['a'].Item,
                        null,
                        m.a.createElement(
                          'div',
                          { style: { textAlign: 'center' } },
                          m.a.createElement(
                            V['default'],
                            { onClick: this.close, style: { marginRight: '16px' } },
                            '\u53d6\u6d88',
                          ),
                          m.a.createElement(
                            V['default'],
                            { type: 'primary', htmlType: 'submit', className: 'login-form-button' },
                            '\u63d0\u4ea4',
                          ),
                        ),
                      ),
                    ),
                  );
                },
              },
            ]),
            n
          );
        })(m.a.Component),
        mt = (n('OaEy'), n('2fM7')),
        gt =
          (mt['a'],
          [
            { key: 'redis', label: 'redis' },
            { key: 'mysql', label: 'mysql' },
            { key: 'grpc', label: 'grpc' },
            { key: 'rocketmq', label: 'rocketmq' },
            { key: 'etcd', label: 'etcd' },
            { key: 'crpc', label: 'crpc' },
            { key: 'mongo', label: 'mongo' },
            { key: 'key-value', label: 'KV' },
          ]),
        vt = (function (e) {
          Object(f['a'])(n, e);
          var t = Object(p['a'])(n);
          function n(e) {
            var r;
            return (
              Object(c['a'])(this, n),
              (r = t.call(this, e)),
              (r.handleSubmit = function (e) {
                var t = r.props.item,
                  n = void 0 === t ? {} : t,
                  i = n.id,
                  o = n.is_resource;
                (e.id = 1 * i),
                  n.resource_id && (e.resource_id = n.resource_id),
                  o || delete e.resource_id,
                  r.setState({ resource_id: 0 }, function () {
                    r.checkItem(e);
                  });
              }),
              (r.checkItem = function (e) {
                (e.value = r.configInputText),
                  (e.caid = r.props.caid),
                  ft(e).then(function (t) {
                    0 != t.code
                      ? l['a'].error('\u914d\u7f6e\u683c\u5f0f\u9519\u8bef\uff1a' + t.msg)
                      : (r.props.submit(e), r.close());
                  });
              }),
              (r.chooseResource = function (e) {
                r.props.changeResource(e);
              }),
              (r.selectResource = function (e) {
                var t = r.props.item || {},
                  n = t.resourceData,
                  i = void 0 === n ? {} : n,
                  o = i.list,
                  a = void 0 === o ? [] : o,
                  s =
                    a.find(function (t) {
                      return t.id === 1 * e;
                    }) || {};
                r.props.changeResourceID(e),
                  r.props.form.setFieldsValue({ value: '"{{'.concat(s.name, '}}"') }),
                  l['a'].success('\u9009\u62e9\u6210\u529f\uff0c\u8bf7\u63d0\u4ea4');
              }),
              (r.close = function (e) {
                r.setState({ type: '' });
              }),
              (r.state = { type: '', valueType: void 0 }),
              r
            );
          }
          return (
            Object(u['a'])(n, [
              {
                key: 'render',
                value: function () {
                  var e = this,
                    t = this,
                    n = this.props,
                    r = n.show,
                    i = n.item,
                    o = void 0 === i ? {} : i,
                    a = n.env,
                    l = n.zone_code,
                    s = o.key,
                    c = o.value,
                    u = o.comment,
                    f = o.is_resource,
                    p = void 0 !== f && f,
                    d = o.resource_id,
                    h = void 0 === d ? 0 : d,
                    g = o.resourceData,
                    v = void 0 === g ? {} : g,
                    y = v.list,
                    b = void 0 === y ? [] : y,
                    w =
                      b.find(function (e) {
                        return e.id === h;
                      }) || {},
                    x = w.type,
                    C = [
                      {
                        title: '\u540d\u79f0',
                        dataIndex: 'name',
                        render: function (e, t) {
                          var n = e.split('|');
                          return n.length > 2 ? n[1] : e;
                        },
                      },
                      { title: '\u503c', dataIndex: 'value' },
                      {
                        title: '\u64cd\u4f5c',
                        dataIndex: 'op',
                        render: function (e, n) {
                          return n.id === h
                            ? m.a.createElement(
                                'span',
                                null,
                                m.a.createElement(
                                  'a',
                                  { style: { color: '#52c41a' } },
                                  '\u5df2\u9009\u62e9',
                                ),
                              )
                            : m.a.createElement(
                                'span',
                                null,
                                m.a.createElement(
                                  'a',
                                  {
                                    onClick: function (e) {
                                      t.selectResource(n.id);
                                    },
                                  },
                                  '\u9009\u62e9',
                                ),
                              );
                        },
                      },
                    ],
                    S = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
                  return m.a.createElement(
                    Ye['a'],
                    {
                      title: '\u66f4\u65b0\u914d\u7f6e',
                      visible: r,
                      maskClosable: !1,
                      width: 1200,
                      onCancel: function (t) {
                        e.close(), e.props.cancel();
                      },
                      footer: null,
                      destroyOnClose: !0,
                    },
                    m.a.createElement(
                      it['a'],
                      Object(nt['a'])({}, S, {
                        onFinish: this.handleSubmit,
                        className: 'login-form',
                        initialValues: { key: s, value: c, is_resource: p, comment: u },
                      }),
                      m.a.createElement(
                        it['a'].Item,
                        {
                          label: '\u6807\u8bc6',
                          name: 'key',
                          rules: [
                            {
                              required: !0,
                              message: '\u8bf7\u8f93\u5165\u914d\u7f6e\u9879\u7684key!',
                            },
                          ],
                        },
                        m.a.createElement(X['a'], { placeholder: '', disabled: 'disable' }),
                      ),
                      m.a.createElement(
                        it['a'].Item,
                        {
                          label: '\u503c',
                          name: 'value',
                          rules: [
                            {
                              required: !0,
                              message: '\u8bf7\u8f93\u5165\u914d\u7f6e\u9879\u7684value!',
                            },
                          ],
                        },
                        m.a.createElement(
                          'div',
                          { className: 'configEditor' },
                          m.a.createElement(at.a, {
                            ref: 'editor',
                            value: c,
                            options: {
                              lineNumbers: !0,
                              autoMatchParens: !0,
                              lineWrapping: !0,
                              readOnly: this.state.readOnly,
                            },
                            onChange: function (t, n, r) {
                              e.configInputText = t.getValue();
                            },
                          }),
                        ),
                        ' ',
                      ),
                      p &&
                        m.a.createElement(
                          it['a'].Item,
                          { label: '\u9009\u62e9\u8d44\u6e90' },
                          m.a.createElement(
                            'div',
                            null,
                            '\u73af\u5883-\u673a\u623f\uff1a',
                            m.a.createElement('span', null, a, '-', this.props.zone_codeMap[l]),
                          ),
                          m.a.createElement(
                            'div',
                            { style: { marginTop: '10px' } },
                            '\u8d44\u6e90\u7c7b\u578b\uff1a',
                            m.a.createElement(
                              'span',
                              null,
                              m.a.createElement(
                                rt['default'].Group,
                                {
                                  value: this.state.type || x,
                                  onChange: function (t) {
                                    e.setState({ type: t.target.value });
                                  },
                                },
                                gt.map(function (e) {
                                  return m.a.createElement(
                                    rt['default'],
                                    { key: e.key, value: e.key },
                                    e.label,
                                  );
                                }),
                              ),
                            ),
                          ),
                          m.a.createElement(
                            'div',
                            { style: { marginTop: '10px' } },
                            '\u8d44\u6e90\u540d\u79f0\uff1a',
                            m.a.createElement(
                              'span',
                              null,
                              m.a.createElement(X['a'], {
                                value: this.state.query,
                                onChange: function (t) {
                                  e.setState({ query: t.target.value });
                                },
                              }),
                            ),
                          ),
                          m.a.createElement(
                            'div',
                            { style: { marginTop: '10px' } },
                            m.a.createElement(B['a'], {
                              columns: C,
                              dataSource: b
                                .filter(function (t) {
                                  return e.state.type ? t.type === e.state.type : t.type === x;
                                })
                                .filter(function (t) {
                                  return !e.state.query || -1 !== t.name.indexOf(e.state.query);
                                }),
                              size: 'small',
                            }),
                          ),
                        ),
                      m.a.createElement(
                        it['a'].Item,
                        null,
                        m.a.createElement(
                          'div',
                          { style: { textAlign: 'center' } },
                          m.a.createElement(
                            V['default'],
                            { onClick: this.props.cancel, style: { marginRight: '16px' } },
                            '\u53d6\u6d88',
                          ),
                          m.a.createElement(
                            V['default'],
                            { type: 'primary', htmlType: 'submit', className: 'login-form-button' },
                            '\u63d0\u4ea4',
                          ),
                        ),
                      ),
                    ),
                  );
                },
              },
            ]),
            n
          );
        })(m.a.Component),
        yt = n('17x9'),
        bt = n.n(yt),
        wt = n('7Mwc'),
        xt = (n('wx14'), n('rzV7')),
        Ct = n.n(xt),
        St = n('dI71');
      function kt() {
        var e = this.constructor.getDerivedStateFromProps(this.props, this.state);
        null !== e && void 0 !== e && this.setState(e);
      }
      function Et(e) {
        function t(t) {
          var n = this.constructor.getDerivedStateFromProps(e, t);
          return null !== n && void 0 !== n ? n : null;
        }
        this.setState(t.bind(this));
      }
      function Ot(e, t) {
        try {
          var n = this.props,
            r = this.state;
          (this.props = e),
            (this.state = t),
            (this.__reactInternalSnapshotFlag = !0),
            (this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(n, r));
        } finally {
          (this.props = n), (this.state = r);
        }
      }
      (kt.__suppressDeprecationWarning = !0),
        (Et.__suppressDeprecationWarning = !0),
        (Ot.__suppressDeprecationWarning = !0);
      n('zLVn'), n('Go+2');
      var Lt = n('xmmm'),
        Tt = n('bCCX'),
        Nt = function (e, t) {
          return function (n) {
            return (n[e] = t), n;
          };
        },
        Mt = function (e) {
          return function (t) {
            var n = Object(h['createFactory'])(t),
              r = function (t) {
                return n(e(t));
              };
            return r;
          };
        },
        At = function (e, t) {
          for (var n = {}, r = 0; r < t.length; r++) {
            var i = t[r];
            e.hasOwnProperty(i) && (n[i] = e[i]);
          }
          return n;
        },
        jt = function (e) {
          return function (t) {
            var n = Object(h['createFactory'])(t),
              r = function (e) {
                return n(e);
              };
            return (r.defaultProps = e), r;
          };
        },
        Pt =
          (Object.keys,
          function (e) {
            return e;
          }),
        It = function (e, t, n) {
          return (
            void 0 === n && (n = Pt),
            function (r) {
              var i,
                o,
                a = function (a) {
                  return e(a)
                    ? ((i = i || Object(h['createFactory'])(t(r))), i(a))
                    : ((o = o || Object(h['createFactory'])(n(r))), o(a));
                };
              return a;
            }
          );
        },
        Dt =
          (h['Component'],
          function (e) {
            return function (t) {
              var n = Object(h['createFactory'])(t),
                r = (function (t) {
                  function r() {
                    return t.apply(this, arguments) || this;
                  }
                  Object(St['a'])(r, t);
                  var i = r.prototype;
                  return (
                    (i.shouldComponentUpdate = function (t) {
                      return e(this.props, t);
                    }),
                    (i.render = function () {
                      return n(this.props);
                    }),
                    r
                  );
                })(h['Component']);
              return r;
            };
          }),
        _t = function (e) {
          var t = Dt(function (t, n) {
            return !Ct()(At(n, e), At(t, e));
          });
          return t;
        },
        zt = function (e) {
          var t = e.propTypes;
          var n = Object.keys(t || {}),
            r = _t(n)(e);
          return r;
        };
      var Rt = function (e) {
          return Nt('propTypes', e);
        },
        Ft = function () {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          return t.reduce(
            function (e, t) {
              return function () {
                return e(t.apply(void 0, arguments));
              };
            },
            function (e) {
              return e;
            },
          );
        },
        Ht = { fromESObservable: null, toESObservable: null },
        Wt = {
          fromESObservable: function (e) {
            return 'function' === typeof Ht.fromESObservable ? Ht.fromESObservable(e) : e;
          },
          toESObservable: function (e) {
            return 'function' === typeof Ht.toESObservable ? Ht.toESObservable(e) : e;
          },
        },
        Bt = function (e) {
          return function () {
            var t,
              n = Object(Lt['createChangeEmitter'])(),
              r = e.fromESObservable(
                ((t = {
                  subscribe: function (e) {
                    var t = n.listen(function (t) {
                      return e.next(t);
                    });
                    return { unsubscribe: t };
                  },
                }),
                (t[Tt['a']] = function () {
                  return this;
                }),
                t),
              );
            return { handler: n.emit, stream: r };
          };
        },
        Vt = (Bt(Wt), /%[sdj%]/g);
      function Ut(e, t) {
        var n = { seen: [], stylize: qt };
        return (
          arguments.length >= 3 && (n.depth = arguments[2]),
          arguments.length >= 4 && (n.colors = arguments[3]),
          $t(t) ? (n.showHidden = t) : t && ln(n, t),
          Qt(n.showHidden) && (n.showHidden = !1),
          Qt(n.depth) && (n.depth = 2),
          Qt(n.colors) && (n.colors = !1),
          Qt(n.customInspect) && (n.customInspect = !0),
          n.colors && (n.stylize = Kt),
          Gt(n, e, n.depth)
        );
      }
      function Kt(e, t) {
        var n = Ut.styles[t];
        return n ? '\x1b[' + Ut.colors[n][0] + 'm' + e + '\x1b[' + Ut.colors[n][1] + 'm' : e;
      }
      function qt(e, t) {
        return e;
      }
      function Gt(e, t, n) {
        if (
          e.customInspect &&
          t &&
          on(t.inspect) &&
          t.inspect !== Ut &&
          (!t.constructor || t.constructor.prototype !== t)
        ) {
          var r = t.inspect(n, e);
          return Jt(r) || (r = Gt(e, r, n)), r;
        }
        var i = (function (e, t) {
          if (Qt(t)) return e.stylize('undefined', 'undefined');
          if (Jt(t)) {
            var n =
              "'" +
              JSON.stringify(t).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') +
              "'";
            return e.stylize(n, 'string');
          }
          return (
            (r = t),
            'number' == typeof r
              ? e.stylize('' + t, 'number')
              : $t(t)
              ? e.stylize('' + t, 'boolean')
              : Xt(t)
              ? e.stylize('null', 'null')
              : void 0
          );
          var r;
        })(e, t);
        if (i) return i;
        var o = Object.keys(t),
          a = (function (e) {
            var t = {};
            return (
              e.forEach(function (e, n) {
                t[e] = !0;
              }),
              t
            );
          })(o);
        if (
          (e.showHidden && (o = Object.getOwnPropertyNames(t)),
          rn(t) && (o.indexOf('message') >= 0 || o.indexOf('description') >= 0))
        )
          return Yt(t);
        if (0 === o.length) {
          if (on(t)) {
            var l = t.name ? ': ' + t.name : '';
            return e.stylize('[Function' + l + ']', 'special');
          }
          if (en(t)) return e.stylize(RegExp.prototype.toString.call(t), 'regexp');
          if (nn(t)) return e.stylize(Date.prototype.toString.call(t), 'date');
          if (rn(t)) return Yt(t);
        }
        var s,
          c,
          u = '',
          f = !1,
          p = ['{', '}'];
        return (
          (s = t),
          Array.isArray(s) && ((f = !0), (p = ['[', ']'])),
          on(t) && (u = ' [Function' + (t.name ? ': ' + t.name : '') + ']'),
          en(t) && (u = ' ' + RegExp.prototype.toString.call(t)),
          nn(t) && (u = ' ' + Date.prototype.toUTCString.call(t)),
          rn(t) && (u = ' ' + Yt(t)),
          0 !== o.length || (f && 0 != t.length)
            ? n < 0
              ? en(t)
                ? e.stylize(RegExp.prototype.toString.call(t), 'regexp')
                : e.stylize('[Object]', 'special')
              : (e.seen.push(t),
                (c = f
                  ? (function (e, t, n, r, i) {
                      for (var o = [], a = 0, l = t.length; a < l; ++a)
                        sn(t, String(a)) ? o.push(Zt(e, t, n, r, String(a), !0)) : o.push('');
                      return (
                        i.forEach(function (i) {
                          i.match(/^\d+$/) || o.push(Zt(e, t, n, r, i, !0));
                        }),
                        o
                      );
                    })(e, t, n, a, o)
                  : o.map(function (r) {
                      return Zt(e, t, n, a, r, f);
                    })),
                e.seen.pop(),
                (function (e, t, n) {
                  return e.reduce(function (e, t) {
                    return t.indexOf('\n'), e + t.replace(/\u001b\[\d\d?m/g, '').length + 1;
                  }, 0) > 60
                    ? n[0] + ('' === t ? '' : t + '\n ') + ' ' + e.join(',\n  ') + ' ' + n[1]
                    : n[0] + t + ' ' + e.join(', ') + ' ' + n[1];
                })(c, u, p))
            : p[0] + u + p[1]
        );
      }
      function Yt(e) {
        return '[' + Error.prototype.toString.call(e) + ']';
      }
      function Zt(e, t, n, r, i, o) {
        var a, l, s;
        if (
          ((s = Object.getOwnPropertyDescriptor(t, i) || { value: t[i] }).get
            ? (l = s.set
                ? e.stylize('[Getter/Setter]', 'special')
                : e.stylize('[Getter]', 'special'))
            : s.set && (l = e.stylize('[Setter]', 'special')),
          sn(r, i) || (a = '[' + i + ']'),
          l ||
            (e.seen.indexOf(s.value) < 0
              ? (l = Xt(n) ? Gt(e, s.value, null) : Gt(e, s.value, n - 1)).indexOf('\n') > -1 &&
                (l = o
                  ? l
                      .split('\n')
                      .map(function (e) {
                        return '  ' + e;
                      })
                      .join('\n')
                      .substr(2)
                  : '\n' +
                    l
                      .split('\n')
                      .map(function (e) {
                        return '   ' + e;
                      })
                      .join('\n'))
              : (l = e.stylize('[Circular]', 'special'))),
          Qt(a))
        ) {
          if (o && i.match(/^\d+$/)) return l;
          (a = JSON.stringify('' + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)
            ? ((a = a.substr(1, a.length - 2)), (a = e.stylize(a, 'name')))
            : ((a = a
                .replace(/'/g, "\\'")
                .replace(/\\"/g, '"')
                .replace(/(^"|"$)/g, "'")),
              (a = e.stylize(a, 'string')));
        }
        return a + ': ' + l;
      }
      function $t(e) {
        return 'boolean' == typeof e;
      }
      function Xt(e) {
        return null === e;
      }
      function Jt(e) {
        return 'string' == typeof e;
      }
      function Qt(e) {
        return void 0 === e;
      }
      function en(e) {
        return tn(e) && '[object RegExp]' === an(e);
      }
      function tn(e) {
        return 'object' == typeof e && null !== e;
      }
      function nn(e) {
        return tn(e) && '[object Date]' === an(e);
      }
      function rn(e) {
        return tn(e) && ('[object Error]' === an(e) || e instanceof Error);
      }
      function on(e) {
        return 'function' == typeof e;
      }
      function an(e) {
        return Object.prototype.toString.call(e);
      }
      function ln(e, t) {
        if (!t || !tn(t)) return e;
        for (var n = Object.keys(t), r = n.length; r--; ) e[n[r]] = t[n[r]];
        return e;
      }
      function sn(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }
      (Ut.colors = {
        bold: [1, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        white: [37, 39],
        grey: [90, 39],
        black: [30, 39],
        blue: [34, 39],
        cyan: [36, 39],
        green: [32, 39],
        magenta: [35, 39],
        red: [31, 39],
        yellow: [33, 39],
      }),
        (Ut.styles = {
          special: 'cyan',
          number: 'yellow',
          boolean: 'yellow',
          undefined: 'grey',
          null: 'bold',
          string: 'green',
          date: 'magenta',
          regexp: 'red',
        });
      var cn = {
          originalFileName: 'Unknown-File-Name',
          updatedFileName: 'Unknown-File-Name',
          inputFormat: 'diff',
          outputFormat: 'side-by-side',
          showFiles: !1,
          matching: 'none',
          matchWordsThreshold: 0.25,
          matchingMaxComparisons: 2500,
          maxLineSizeInBlockForComparison: 200,
          maxLineLengthHighlight: 1e4,
          renderNothingWhenEmpty: !1,
        },
        un = function (e) {
          var t = e.diffString,
            r = e.options;
          return n('rn2K').html(t, r);
        },
        fn = Ft(un, function (e) {
          var t = e.past,
            n = e.current,
            r = e.options,
            i = Object.assign({}, cn, r),
            o = t.split(/\r|\n|\r\n/),
            a = n.split(/\r|\n|\r\n/),
            l = Object(wt['unifiedDiff'])(o, a, {
              fromfile: i.originalFileName,
              tofile: i.updatedFileName,
            });
          return {
            diffString: (function (e) {
              if (!Jt(e)) {
                for (var t = [], n = 0; n < arguments.length; n++) t.push(Ut(arguments[n]));
                return t.join(' ');
              }
              n = 1;
              for (
                var r = arguments,
                  i = r.length,
                  o = String(e).replace(Vt, function (e) {
                    if ('%%' === e) return '%';
                    if (n >= i) return e;
                    switch (e) {
                      case '%s':
                        return String(r[n++]);
                      case '%d':
                        return Number(r[n++]);
                      case '%j':
                        try {
                          return JSON.stringify(r[n++]);
                        } catch (e) {
                          return '[Circular]';
                        }
                      default:
                        return e;
                    }
                  }),
                  a = r[n];
                n < i;
                a = r[++n]
              )
                Xt(a) || !tn(a) ? (o += ' ' + a) : (o += ' ' + Ut(a));
              return o;
            })('diff --git %s %s\n%s', i.originalFileName, i.updatedFileName, l.join('\n')),
            options: i,
          };
        }),
        pn = function (e) {
          var t = e.genDiffHTML;
          return m.a.createElement('div', { dangerouslySetInnerHTML: { __html: t } });
        },
        dn = Ft(
          jt({ diffString: '', past: '', current: '', options: cn }),
          zt,
          Rt({
            past: bt.a.string,
            current: bt.a.string,
            options: bt.a.object,
            diffString: bt.a.string,
          }),
          It(
            function (e) {
              return 0 !== e.diffString.length;
            },
            function () {
              return function (e) {
                return m.a.createElement(pn, { genDiffHTML: un(e) });
              };
            },
            Mt(function (e) {
              return { genDiffHTML: fn(e) };
            }),
          ),
        )(pn);
      pn.propTypes = { genDiffHTML: bt.a.string };
      n('nBsq'), n('5FtT');
      var hn,
        mn,
        gn,
        vn,
        yn,
        bn,
        wn,
        xn,
        Cn,
        Sn,
        kn,
        En,
        On,
        Ln,
        Tn,
        Nn = X['a'].TextArea,
        Mn = (function (e) {
          Object(f['a'])(n, e);
          var t = Object(p['a'])(n);
          function n(e) {
            var r;
            return (
              Object(c['a'])(this, n),
              (r = t.call(this, e)),
              (r.handleSubmit = function (e) {
                r.props.submit(e), r.setState({ showPreview: !0 });
              }),
              (r.getOriginChange = function (e) {
                Object(tt['p'])({ caid: e })
                  .then(function (e) {
                    if (0 === e.code) {
                      var t = e.data || {},
                        n = t.pre,
                        i = void 0 === n ? '' : n,
                        o = t.now,
                        a = void 0 === o ? '' : o;
                      r.setState({ pre: i, now: a });
                    }
                  })
                  .catch(function (e) {
                    l['a'].warn('\u67e5\u8be2\u5f02\u5e38' + e.message);
                  });
              }),
              (r.caid = 0),
              (r.state = { showPreview: !0, pre: '', now: '' }),
              r
            );
          }
          return (
            Object(u['a'])(n, [
              { key: 'componentDidMount', value: function () {} },
              {
                key: 'componentWillReceiveProps',
                value: function (e, t) {
                  var n = e.item,
                    r = void 0 === n ? {} : n,
                    i = e.show,
                    o = r.caid;
                  this.caid !== o && (this.caid = o), i && this.getOriginChange(o);
                },
              },
              {
                key: 'render',
                value: function () {
                  var e = this,
                    t = this.props,
                    n = t.show,
                    r = t.publish_loading,
                    a = t.file_name,
                    l = Xe()().format('YYYY-MM-DD HH:mm:ss'),
                    s = ''.concat(l, '-release');
                  return m.a.createElement(
                    'div',
                    null,
                    m.a.createElement(
                      Ye['a'],
                      {
                        title: m.a.createElement(
                          'div',
                          null,
                          m.a.createElement('span', null, '\u53d1\u5e03'),
                          m.a.createElement(
                            'span',
                            { style: { marginLeft: '8px', fontSize: '16px', fontWeight: 500 } },
                            a,
                          ),
                        ),
                        visible: n,
                        maskClosable: !0,
                        onCancel: function (t) {
                          e.props.cancel(t), e.setState({ showPreview: !0 });
                        },
                        width: 1200,
                        footer: null,
                        destroyOnClose: !0,
                      },
                      m.a.createElement(
                        it['a'],
                        {
                          onFinish: this.handleSubmit,
                          className: 'login-form',
                          initialValues: { message: s },
                        },
                        m.a.createElement(
                          it['a'].Item,
                          {
                            label: 'message',
                            name: 'message',
                            rules: [
                              { required: !0, message: '\u586b\u5199\u63d0\u4ea4\u8bb0\u5f55' },
                            ],
                          },
                          m.a.createElement(Nn, { placeholder: '' }),
                        ),
                        m.a.createElement(
                          it['a'].Item,
                          null,
                          m.a.createElement(
                            'div',
                            { style: { textAlign: 'center' } },
                            m.a.createElement(
                              V['default'].Group,
                              null,
                              m.a.createElement(
                                V['default'],
                                {
                                  type: 'primary',
                                  onClick: function () {
                                    var t = e.state.showPreview;
                                    e.setState({ showPreview: !t });
                                  },
                                },
                                '\u9884\u89c8\u53d8\u66f4',
                              ),
                              m.a.createElement(
                                V['default'],
                                {
                                  onClick: function (t) {
                                    e.props.cancel(t), e.setState({ showPreview: !0 });
                                  },
                                },
                                '\u53d6\u6d88',
                              ),
                              m.a.createElement(
                                V['default'],
                                {
                                  type: 'success',
                                  style: { backgroundColor: '#87d068', color: 'white' },
                                  htmlType: 'submit',
                                  className: 'login-form-button',
                                  loading: r,
                                },
                                r && '\u63d0\u4ea4\u4e2d',
                                !r && '\u63d0\u4ea4',
                              ),
                            ),
                            m.a.createElement('br', null),
                            m.a.createElement(
                              'span',
                              { style: { color: 'red' } },
                              '*: \u53d1\u5e03\u6210\u529f\u540e\u9700\u8981\u624b\u52a8\u91cd\u542f\u5e94\u7528\u751f\u6548',
                            ),
                          ),
                        ),
                      ),
                      this.state.showPreview &&
                        m.a.createElement(
                          'div',
                          { style: { overflow: 'auto' } },
                          m.a.createElement(
                            i['a'],
                            null,
                            m.a.createElement(
                              o['a'],
                              { span: 12 },
                              '\u5df2\u53d1\u5e03\u7684\u914d\u7f6e ',
                            ),
                            m.a.createElement(
                              o['a'],
                              { span: 12 },
                              '\u5f53\u524d\u7684\u914d\u7f6e',
                            ),
                          ),
                          m.a.createElement(dn, {
                            options: {
                              originalFileName: '\u539f\u59cb\u5185\u5bb9',
                              updatedFileName: '\u66f4\u65b0\u5185\u5bb9',
                            },
                            past: this.state.pre,
                            current: this.state.now,
                          }),
                        ),
                    ),
                  );
                },
              },
            ]),
            n
          );
        })(m.a.Component),
        An = (function (e) {
          Object(f['a'])(n, e);
          var t = Object(p['a'])(n);
          function n(e) {
            var r;
            return (
              Object(c['a'])(this, n),
              (r = t.call(this, e)),
              (r.onFinish = function (e) {
                var t = e.file_name;
                (e.file_name = ''.concat(t, '.') + e.file_typ), r.props.submit(e);
              }),
              (r.onFinishFailed = function (e) {
                console.log('Failed:', e);
              }),
              (r.onChangeZone = function (e) {
                r.setState({ selectZone: e.target.value });
              }),
              (r.cancel = function () {
                r.props.cancel();
              }),
              (r.state = {}),
              r
            );
          }
          return (
            Object(u['a'])(n, [
              { key: 'componentDidMount', value: function () {} },
              {
                key: 'render',
                value: function () {
                  var e = this.props,
                    t = e.show,
                    n = (e.prefix, e.zoneList),
                    r = [];
                  void 0 != n &&
                    n.forEach(function (e) {
                      r.push(m.a.createElement(rt['default'], { value: e.zone_code }, e.zone_name));
                    });
                  var i = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
                  return m.a.createElement(
                    Ye['a'],
                    {
                      title: '\u65b0\u589e\u914d\u7f6e\u6587\u4ef6',
                      visible: t,
                      maskClosable: !0,
                      onCancel: this.props.cancel,
                      footer: null,
                      destroyOnClose: !0,
                    },
                    m.a.createElement(
                      it['a'],
                      Object(nt['a'])({}, i, {
                        className: 'login-form',
                        name: 'basic',
                        onFinish: this.onFinish,
                        onFinishFailed: this.onFinishFailed,
                      }),
                      m.a.createElement(
                        it['a'].Item,
                        {
                          label: '\u673a\u623f',
                          name: 'zone_code',
                          rules: [
                            {
                              required: !0,
                              message: '\u8bf7\u9009\u62e9\u914d\u7f6e\u6587\u4ef6\u73af\u5883',
                            },
                          ],
                        },
                        m.a.createElement(rt['default'].Group, null, r),
                      ),
                      m.a.createElement(
                        it['a'].Item,
                        {
                          label: '\u914d\u7f6e\u7c7b\u578b',
                          name: 'file_typ',
                          rules: [
                            { required: !0, message: '\u8bf7\u8f93\u5165\u914d\u7f6e\u7c7b\u578b' },
                          ],
                        },
                        m.a.createElement(
                          mt['a'],
                          { placeholder: '\u9009\u62e9\u914d\u7f6e\u7c7b\u578b', allowClear: !0 },
                          m.a.createElement(Option, { value: 'toml' }, 'toml'),
                          m.a.createElement(Option, { value: 'yaml' }, 'yaml'),
                          ');',
                        ),
                      ),
                      m.a.createElement(
                        it['a'].Item,
                        {
                          label: '\u914d\u7f6e\u540d\u79f0',
                          name: 'file_name',
                          rules: [
                            {
                              required: !0,
                              message: '\u8bf7\u8f93\u5165\u914d\u7f6e\u6587\u4ef6\u540d\u79f0',
                            },
                          ],
                        },
                        m.a.createElement(X['a'], { placeholder: 'dev,live,pre,prod...' }),
                      ),
                      m.a.createElement(
                        it['a'].Item,
                        null,
                        m.a.createElement(
                          'div',
                          { style: { textAlign: 'center' } },
                          m.a.createElement(
                            V['default'],
                            { onClick: this.cancel, style: { marginRight: '16px' } },
                            '\u53d6\u6d88',
                          ),
                          m.a.createElement(
                            V['default'],
                            { type: 'primary', htmlType: 'submit', className: 'login-form-button' },
                            '\u63d0\u4ea4',
                          ),
                        ),
                      ),
                    ),
                  );
                },
              },
            ]),
            n
          );
        })(m.a.Component),
        jn =
          ((hn = Object(Ze['c'])(function (e) {
            var t = e.confuNew;
            return { publishChangeData: t.publishChangeData };
          })),
          hn(
            ((gn = (function (e) {
              Object(f['a'])(n, e);
              var t = Object(p['a'])(n);
              function n(e) {
                var r;
                return (
                  Object(c['a'])(this, n),
                  (r = t.call(this, e)),
                  (r.getChangeData = function () {
                    var e = r.state.history_id;
                    r.props.dispatch({
                      type: 'confuNew/queryPublishChange',
                      payload: { id: 1 * e },
                    });
                  }),
                  (r.state = { history_id: 0 }),
                  r
                );
              }
              return (
                Object(u['a'])(n, [
                  { key: 'componentWillMount', value: function () {} },
                  {
                    key: 'render',
                    value: function () {
                      var e = this,
                        t = this.props,
                        n = t.list,
                        r = void 0 === n ? [] : n,
                        a = t.show,
                        l = t.publishChangeData,
                        s = void 0 === l ? {} : l,
                        c = s.pre_content,
                        u = void 0 === c ? '' : c,
                        f = s.content,
                        p = void 0 === f ? '' : f,
                        d =
                          (s.diff_list,
                          [
                            {
                              key: 'message',
                              dataIndex: 'message',
                              title: '\u63d0\u4ea4\u8bb0\u5f55',
                            },
                            {
                              key: 'create_time',
                              dataIndex: 'create_time',
                              title: '\u63d0\u4ea4\u65f6\u95f4',
                              render: function (e) {
                                return Xe()(1e3 * e).format('YYYY/MM/DD HH:mm:ss');
                              },
                            },
                            { key: 'op_name', dataIndex: 'op_name', title: '\u64cd\u4f5c\u4eba' },
                            {
                              key: 'op',
                              dataIndex: 'op',
                              title: '\u64cd\u4f5c',
                              render: function (t, n) {
                                return m.a.createElement(
                                  'div',
                                  {
                                    onClick: function () {
                                      e.setState({ history_id: n.id }, function () {
                                        e.getChangeData();
                                      });
                                    },
                                  },
                                  m.a.createElement('a', null, '\u7248\u672c\u8be6\u60c5'),
                                );
                              },
                            },
                          ]);
                      return m.a.createElement(
                        Ye['a'],
                        {
                          title: '\u53d1\u5e03\u5386\u53f2',
                          visible: a,
                          maskClosable: !0,
                          onCancel: this.props.cancel,
                          footer: null,
                          destroyOnClose: !0,
                          width: 1200,
                        },
                        m.a.createElement(
                          'div',
                          null,
                          m.a.createElement(B['a'], { columns: d, dataSource: r }),
                          0 !== this.state.history_id &&
                            m.a.createElement(
                              'div',
                              { style: { overflow: 'auto' } },
                              m.a.createElement(
                                i['a'],
                                null,
                                m.a.createElement(
                                  o['a'],
                                  { span: 12 },
                                  '\u4e0a\u4e2a\u7248\u672c\u7684\u914d\u7f6e',
                                ),
                                m.a.createElement(
                                  o['a'],
                                  { span: 12 },
                                  '\u9009\u4e2d\u7684\u914d\u7f6e',
                                ),
                              ),
                              m.a.createElement(dn, {
                                options: {
                                  originalFileName: '\u539f\u59cb\u5185\u5bb9',
                                  updatedFileName: '\u66f4\u65b0\u5185\u5bb9',
                                },
                                past: u,
                                current: p,
                                splitView: !0,
                              }),
                            ),
                        ),
                      );
                    },
                  },
                ]),
                n
              );
            })(m.a.Component)),
            (mn = gn)),
          ) || mn),
        Pn = (function (e) {
          Object(f['a'])(n, e);
          var t = Object(p['a'])(n);
          function n(e) {
            var r;
            return Object(c['a'])(this, n), (r = t.call(this, e)), (r.state = {}), r;
          }
          return (
            Object(u['a'])(n, [
              { key: 'componentWillMount', value: function () {} },
              {
                key: 'render',
                value: function () {
                  var e = this.props,
                    t = e.oldCode,
                    n = void 0 === t ? '' : t,
                    r = e.newCode,
                    i = void 0 === r ? '' : r,
                    o = e.show;
                  return m.a.createElement(
                    Ye['a'],
                    {
                      title: '\u9884\u89c8\u53d8\u66f4',
                      visible: o,
                      maskClosable: !0,
                      onCancel: this.props.cancel,
                      footer: null,
                      destroyOnClose: !0,
                      width: 1400,
                    },
                    m.a.createElement(
                      'div',
                      { style: { overflow: 'auto' } },
                      m.a.createElement(dn, {
                        options: {
                          originalFileName: '\u539f\u59cb\u5185\u5bb9',
                          updatedFileName: '\u66f4\u65b0\u5185\u5bb9',
                        },
                        style: { width: '1400px', wordWrap: 'break-word', wordBreak: 'break-all' },
                        past: n,
                        current: i,
                      }),
                    ),
                  );
                },
              },
            ]),
            n
          );
        })(m.a.Component),
        In =
          ((vn = Object(Ze['c'])(function (e) {
            var t = e.confuNew;
            return {
              publishChangeData: t.publishChangeData,
              configHistoryList: t.configHistoryList,
            };
          })),
          vn(
            ((bn = (function (e) {
              Object(f['a'])(n, e);
              var t = Object(p['a'])(n);
              function n(e) {
                var r;
                return (
                  Object(c['a'])(this, n),
                  (r = t.call(this, e)),
                  (r.getHistoryList = function () {
                    var e = r.props.caid;
                    return r.props.dispatch({
                      type: 'confuNew/queryHistoryList',
                      payload: { caid: e },
                    });
                  }),
                  (r.getChangeData = function (e) {
                    r.props.dispatch({
                      type: 'confuNew/queryPublishChange',
                      payload: { id: 1 * e },
                    });
                  }),
                  (r.rollback = function () {
                    var e = r.props.caid;
                    Object(tt['i'])({ caid: 1 * e }).then(function (e) {
                      0 === e.code
                        ? (l['a'].success(
                            '\u56de\u6eda\u6210\u529f\uff0c\u8bf7\u518d\u53d1\u5e03\u4e00\u6b21',
                          ),
                          r.props.rollback && r.props.rollback())
                        : l['a'].error('\u56de\u6eda\u5931\u8d25');
                    });
                  }),
                  (r.state = { history_id: 0 }),
                  r
                );
              }
              return (
                Object(u['a'])(n, [
                  {
                    key: 'componentWillMount',
                    value: function () {
                      var e = this;
                      this.getHistoryList().then(function (t) {
                        var n = e.props.configHistoryList,
                          r = void 0 === n ? [] : n;
                        r[0] && r[0].id
                          ? e.getChangeData(r[0].id)
                          : l['a'].warn('\u6ca1\u6709\u53d1\u5e03\u5386\u53f2');
                      });
                    },
                  },
                  {
                    key: 'render',
                    value: function () {
                      var e = this,
                        t = this,
                        n = this.props,
                        r = n.show,
                        a = n.publishChangeData,
                        l = void 0 === a ? {} : a,
                        s = l.pre_content,
                        c = void 0 === s ? '' : s,
                        u = l.content,
                        f = void 0 === u ? '' : u;
                      l.diff_list;
                      return m.a.createElement(
                        Ye['a'],
                        {
                          title: '\u56de\u6eda\u5230\u4e0a\u4e2a\u7248\u672c',
                          visible: r,
                          maskClosable: !0,
                          onCancel: this.props.cancel,
                          footer: null,
                          destroyOnClose: !0,
                          width: 1200,
                        },
                        m.a.createElement(
                          'div',
                          null,
                          m.a.createElement(
                            i['a'],
                            null,
                            m.a.createElement(
                              o['a'],
                              { span: 12 },
                              '\u56de\u6eda\u524d\u7684\u914d\u7f6e',
                            ),
                            m.a.createElement(
                              o['a'],
                              { span: 12 },
                              '\u56de\u6eda\u540e\u7684\u914d\u7f6e',
                            ),
                          ),
                          m.a.createElement(
                            'div',
                            { style: { overflow: 'auto' } },
                            m.a.createElement(dn, {
                              options: {
                                originalFileName: '\u539f\u59cb\u5185\u5bb9',
                                updatedFileName: '\u66f4\u65b0\u5185\u5bb9',
                              },
                              past: f,
                              current: c,
                            }),
                          ),
                          m.a.createElement(
                            i['a'],
                            { gutter: 24 },
                            m.a.createElement(o['a'], { span: 20 }),
                            m.a.createElement(
                              o['a'],
                              { span: 4 },
                              m.a.createElement(
                                V['default'].Group,
                                null,
                                m.a.createElement(
                                  V['default'],
                                  {
                                    style: { paddingRight: '8px' },
                                    onClick: function (e) {
                                      t.props.cancel();
                                    },
                                  },
                                  '\u53d6\u6d88',
                                ),
                                m.a.createElement(
                                  V['default'],
                                  {
                                    type: 'danger',
                                    onClick: function (n) {
                                      e.rollback(), t.props.cancel();
                                    },
                                  },
                                  '\u786e\u8ba4\u56de\u6eda',
                                ),
                              ),
                            ),
                          ),
                          m.a.createElement(
                            i['a'],
                            null,
                            m.a.createElement(o['a'], { span: 20 }),
                            m.a.createElement(
                              o['a'],
                              null,
                              m.a.createElement(
                                'div',
                                { style: { color: 'red' } },
                                m.a.createElement(
                                  'span',
                                  null,
                                  '*\u56de\u6eda\u4f1a\u4e22\u5f03\u5f53\u524d\u672a\u4fdd\u5b58\u7684\u914d\u7f6e',
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  },
                ]),
                n
              );
            })(m.a.Component)),
            (yn = bn)),
          ) || yn),
        Dn = n('CiB2'),
        _n =
          ((wn = Object(Ze['c'])(function (e) {
            var t = e.confuNew;
            return { appConfigList: t.appConfigList };
          })),
          wn(
            ((Cn = (function (e) {
              Object(f['a'])(n, e);
              var t = Object(p['a'])(n);
              function n(e) {
                var r;
                return (
                  Object(c['a'])(this, n),
                  (r = t.call(this, e)),
                  (r.handleFileDel = function (e) {
                    var t = e.id,
                      n = e.aid,
                      i = e.file_name,
                      o = e.zone_code,
                      a = e.app_name;
                    Object(tt['m'])({
                      id: t,
                      aid: n,
                      zone_code: o,
                      app_name: a,
                      file_name: i,
                    }).then(function (e) {
                      0 === e.code
                        ? (l['a'].success('\u5220\u9664\u6587\u4ef6', i, '\u6210\u529f'),
                          r.updateConfigList())
                        : l['a'].error(e.msg);
                    });
                  }),
                  (r.updateConfigList = function () {
                    var e = r.props,
                      t = e.app_id,
                      n = e.app_name,
                      i = e.env;
                    e.zone_code;
                    return r.props.dispatch({
                      type: 'confuNew/queryAppConfigs',
                      payload: { aid: t, app_name: n, env: i },
                    });
                  }),
                  (r.state = {}),
                  r
                );
              }
              return (
                Object(u['a'])(n, [
                  {
                    key: 'render',
                    value: function () {
                      var e = this,
                        t = this.props,
                        n = t.show,
                        r = t.appConfigList,
                        i = void 0 === r ? [] : r,
                        o = i[0] || {},
                        a = o.configs,
                        l = void 0 === a ? [] : a;
                      Object(Dn['a'])(this.state);
                      var s = [
                        { key: 'file_name', dataIndex: 'file_name', title: '\u6587\u4ef6\u540d' },
                        { key: 'env', dataIndex: 'env', title: '\u73af\u5883' },
                        { key: 'zone_code', dataIndex: 'zone_code', title: '\u673a\u623f' },
                        {
                          key: 'op',
                          dataIndex: 'op',
                          title: '\u64cd\u4f5c',
                          render: function (t, n) {
                            return m.a.createElement(
                              'div',
                              null,
                              m.a.createElement(
                                q['a'],
                                {
                                  title: '\u786e\u5b9a\u5220\u9664\u5417\uff1f',
                                  onConfirm: function () {
                                    e.handleFileDel(n);
                                  },
                                },
                                m.a.createElement(G['a'], { color: 'red' }, '\u5220\u9664'),
                              ),
                            );
                          },
                        },
                      ];
                      return m.a.createElement(
                        Ye['a'],
                        {
                          title: '\u6587\u4ef6\u5217\u8868',
                          visible: n,
                          maskClosable: !0,
                          onCancel: this.props.cancel,
                          footer: null,
                          destroyOnClose: !0,
                        },
                        m.a.createElement(B['a'], { dataSource: l, columns: s }),
                      );
                    },
                  },
                ]),
                n
              );
            })(m.a.Component)),
            (xn = Cn)),
          ) || xn),
        zn = n('rAM+'),
        Rn = (function (e) {
          Object(f['a'])(n, e);
          var t = Object(p['a'])(n);
          function n(e) {
            var r;
            return (
              Object(c['a'])(this, n),
              (r = t.call(this, e)),
              (r.handleChange = function (e) {
                r.setState({ rafeCid: e });
                var t = r.props.originCid,
                  n = void 0 === t ? 0 : t;
                r.updateKeys(n, e);
              }),
              (r.handleCancel = function (e) {
                r.setState({ keys: [] }), r.props.cancel();
              }),
              (r.updateKeys = function (e, t) {
                Object(tt['n'])({ origin_cid: e, rafe_cid: t }).then(function (e) {
                  r.setState({ keys: e.data, rafeCid: t });
                });
              }),
              (r.state = { keys: [], rafeCid: 0 }),
              r
            );
          }
          return (
            Object(u['a'])(n, [
              {
                key: 'componentWillUpdate',
                value: function (e) {
                  if (!this.props.show && e.show) {
                    var t = this.props,
                      n = t.appConfigList,
                      r = void 0 === n ? [] : n,
                      i = t.originCid,
                      o = r[0] || {},
                      a = o.configs || [];
                    if (!(a.length < 2)) {
                      var l,
                        s = 0,
                        c = Object(zn['a'])(a);
                      try {
                        for (c.s(); !(l = c.n()).done; ) {
                          var u = l.value;
                          if ('live' == u.env && 'config-live.toml' == u.file_name) {
                            s = u.id;
                            break;
                          }
                        }
                      } catch (f) {
                        c.e(f);
                      } finally {
                        c.f();
                      }
                      0 == s && (s = i != a[0].id ? a[0].id || 0 : a[1].id || 0),
                        this.updateKeys(i, s);
                    }
                  }
                },
              },
              {
                key: 'render',
                value: function () {
                  var e = this,
                    t = this.props,
                    n = t.show,
                    r = t.appConfigList,
                    i = void 0 === r ? [] : r,
                    o = this.state.keys,
                    a = void 0 === o ? [] : o,
                    l = i[0] || {},
                    s = l.configs || [],
                    c = [
                      { key: 'key', dataIndex: 'key', title: '\u952e\u540d' },
                      {
                        key: 'status',
                        dataIndex: 'status',
                        title: '\u5dee\u5f02',
                        render: function (e, t) {
                          return 'new' === e
                            ? m.a.createElement(
                                'span',
                                {
                                  style: {
                                    backgroundColor: 'green',
                                    borderRadius: '5px',
                                    padding: '5px',
                                    color: 'white',
                                  },
                                },
                                '\u65b0\u589e',
                              )
                            : m.a.createElement(
                                'span',
                                {
                                  style: {
                                    backgroundColor: 'red',
                                    borderRadius: '5px',
                                    padding: '5px',
                                    color: 'white',
                                  },
                                },
                                '\u7f3a\u5931',
                              );
                        },
                      },
                    ];
                  return m.a.createElement(
                    Ye['a'],
                    {
                      title: '\u914d\u7f6e\u6587\u4ef6\u5bf9\u6bd4',
                      onCancel: this.handleCancel,
                      onOk: this.handleCancel,
                      destroyOnClose: !0,
                      maskClosable: !0,
                      visible: n,
                    },
                    m.a.createElement(
                      mt['a'],
                      {
                        style: { width: '100%' },
                        onChange: this.handleChange,
                        value: this.state.rafeCid,
                        notFoundContent: '\u6587\u4ef6\u5217\u8868\u4e3a\u7a7a',
                      },
                      s.map(function (t) {
                        return (
                          t.id != e.props.originCid &&
                          m.a.createElement(mt['a'].Option, { key: t.id, value: t.id }, t.file_name)
                        );
                      }),
                    ),
                    m.a.createElement(
                      'div',
                      null,
                      0 != a.length
                        ? m.a.createElement(B['a'], {
                            style: { width: '100%' },
                            dataSource: a,
                            columns: c,
                            pagination: { pageSize: 20, hideOnSinglePage: !0, size: 'small' },
                            size: 'small',
                          })
                        : m.a.createElement(
                            'p',
                            { style: { marginTop: '8px', marginLeft: '4px' } },
                            '\u672a\u9009\u62e9\u6587\u4ef6\u6216\u6587\u4ef6\u5b8c\u5168\u76f8\u540c',
                          ),
                    ),
                  );
                },
              },
            ]),
            n
          );
        })(m.a.Component),
        Fn = (n('p77/'), n('0sou'), n('q0kf')),
        Hn = n.n(Fn),
        Wn = n('Lyp1'),
        Bn = n('w5pM'),
        Vn = n('U+PY'),
        Un = n('9jjd'),
        Kn = n('8kvQ'),
        qn = n('tvlV'),
        Gn = Ye['a'].confirm,
        Yn = (Ge['a'].Header, Ge['a'].Sider),
        Zn = Ge['a'].Content,
        $n = (qe['default'].SubMenu, d['a'].TabPane),
        Xn =
          (Ke.Panel,
          X['a'].TextArea,
          (Sn = Object(Ze['c'])(function (e) {
            var t = e.confuNew;
            e.loading;
            return {
              app: t.app,
              msg: t.msg,
              apps: t.apps,
              configList: t.configList,
              file_path: t.file_path,
              configText: t.configText,
              commonText: t.commonText,
              statusList: t.statusList,
              resourceData: t.resourceData,
              appConfigList: t.appConfigList,
              configChangeList: t.configChangeList,
              configHistoryList: t.configHistoryList,
            };
          })),
          Sn(
            ((En = (function (e) {
              Object(f['a'])(n, e);
              var t = Object(p['a'])(n);
              function n(e) {
                var r;
                return (
                  Object(c['a'])(this, n),
                  (r = t.call(this, e)),
                  (r.showConfirm = function (e, t, n) {
                    var i = Object($['a'])(r),
                      o = {
                        start: {
                          title: '\u786e\u5b9a\u542f\u52a8\u5e94\u7528\u8fdb\u7a0b\u5417\uff1f',
                          content:
                            '\u5e94\u7528\u8fdb\u7a0b\u4f1a\u88ab\u6267\u884csystemd start\u547d\u4ee4',
                        },
                        restart: {
                          title: '\u786e\u5b9a\u91cd\u542f\u5e94\u7528\u8fdb\u7a0b\u5417\uff1f',
                          content:
                            '\u5e94\u7528\u8fdb\u7a0b\u4f1a\u88ab\u6267\u884csystemd restart\u547d\u4ee4',
                        },
                        stop: {
                          title: '\u786e\u5b9a\u505c\u6b62\u5e94\u7528\u8fdb\u7a0b\u5417\uff1f',
                          content:
                            '\u5e94\u7528\u8fdb\u7a0b\u4f1a\u88ab\u6267\u884csystemd stop\u547d\u4ee4',
                        },
                      },
                      a = o[e] || {};
                    Gn({
                      title: a.title,
                      content: m.a.createElement(
                        'div',
                        null,
                        m.a.createElement('p', null, a.content),
                        m.a.createElement('h4', null, '\u64cd\u4f5c\u5b9e\u4f8b\uff1a'),
                        m.a.createElement('p', null, n),
                      ),
                      onOk: function () {
                        i.doAction(e, t, n);
                      },
                      onCancel: function () {},
                      okText: '\u786e\u5b9a',
                      cancelText: '\u53d6\u6d88',
                    });
                  }),
                  (r.doAction = function (e, t, n) {
                    var i = r.props.appName,
                      o = i,
                      a = [];
                    a[0] = n;
                    var s = a.map(function (n) {
                      return Object(tt['j'])({
                        app_name: o,
                        zone_code: t,
                        host_name: n,
                        action: e,
                      });
                    });
                    r.setState({ visible: !0, loading: !0 });
                    var c = function (e) {
                      return e
                        .reduce(function (e, t) {
                          return e.concat(t);
                        })
                        .map(function (e) {
                          return Object.keys(e).map(function (t) {
                            return { name: t, content: e[t] };
                          });
                        })
                        .reduce(function (e, t) {
                          return e.concat(t);
                        });
                    };
                    Promise.all(s)
                      .then(function (e) {
                        if (0 !== e.length)
                          if (null != e[0]) {
                            var n = c(e);
                            r.setState({ result_list: n });
                            var i = a.map(function (e) {
                              return Object(tt['j'])({
                                app_name: o,
                                zone_code: t,
                                host_name: e,
                                action: 'status',
                              });
                            });
                            Promise.all(i).then(function (e) {
                              var t = c(e);
                              r.setState({ result_list: n.concat(t), loading: !1 });
                            });
                          } else
                            l['a'].error(
                              '\u6ca1\u6709\u64cd\u4f5c\u6743\u9650\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458',
                            );
                        else
                          l['a'].error(
                            '\u6ca1\u6709\u64cd\u4f5c\u6743\u9650\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458',
                          );
                      })
                      .catch(function (e) {
                        r.setState({ loading: !1, visible: !1 }), l['a'].error(e.message);
                      });
                  }),
                  (r.autoChangeConfig = function () {
                    var e = r.props.appConfigList,
                      t = void 0 === e ? [] : e,
                      n = t[0] || {},
                      i = n.configs,
                      o = void 0 === i ? [] : i;
                    if (!o[0])
                      return (
                        r.props.dispatch({ type: 'confuNew/setConfigReset' }),
                        void r.setState({
                          file_name: '',
                          caid: 0,
                          env: '',
                          zone_code: r.props.zoneCode,
                          format: '',
                          readOnly: !0,
                        })
                      );
                    var a = o[0] || {},
                      l = a.id,
                      s = a.file_name,
                      c = (a.zone_code, a.format),
                      u = a.env;
                    r.setState(
                      { file_name: s, caid: l, env: u, format: c, readOnly: !0 },
                      function () {
                        r.getConfigList();
                      },
                    );
                  }),
                  (r.getAppList = function () {
                    var e = r.props,
                      t = e.env,
                      n = e.zone_code,
                      i = e.appName;
                    return r.props.dispatch({
                      type: 'confuNew/queryAppConfigs',
                      payload: { aid: r.state.aid, env: t, zone_code: n, app_name: i },
                    });
                  }),
                  (r.getConfigList = function () {
                    var e = r.state.caid;
                    r.props.dispatch({ type: 'confuNew/queryConfig', payload: { caid: e } }),
                      r.props.dispatch({
                        type: 'confuResource/queryRelatedList',
                        payload: { caid: e },
                      }),
                      r.setState({ searchKey: '', searchValue: '' });
                  }),
                  (r.changeAppConfig = function (e) {
                    var t = e.item,
                      n = e.key,
                      i = e.keyPath,
                      o = Object(Z['a'])(i, 2),
                      a = (o[0], o[1]),
                      l = 0,
                      s = '',
                      c = '',
                      u = n.split('_');
                    3 === u.length && ((l = 1 * u[0]), (s = u[1]), (c = u[2]));
                    var f = t.props.children;
                    r.setState(
                      {
                        file_name: f,
                        caid: l,
                        zone_code: a,
                        env: s,
                        format: c,
                        readOnly: !0,
                        showStatusSync: !0,
                      },
                      function () {
                        r.getConfigList(),
                          setTimeout(function () {
                            r.getConfigChangeList(), r.getConfigStatusList(), r.getHistoryList();
                          }, 500);
                      },
                    );
                  }),
                  (r.changeTab = function (e) {
                    if ((r.setState({ tab: e }), 'history' === e)) r.getConfigChangeList();
                    else if ('table' === e || 'text' === e) r.getConfigList();
                    else if ('status' === e) {
                      var t = r.state.caid;
                      r.setState({ showStatusSync: !0 }),
                        Object(tt['k'])({ caid: t })
                          .then(function (e) {
                            r.getConfigStatusList(), r.setState({ showStatusSync: !1 });
                          })
                          .catch(function (e) {
                            l['a'].success(
                              '\u5b9e\u4f8b\u72b6\u6001\u540c\u6b65\u5931\u8d25\uff0c\u8bf7\u5237\u65b0',
                            ),
                              r.setState({ showStatusSync: !1 });
                          });
                    }
                  }),
                  (r.getHistoryList = function () {
                    var e = r.state.caid;
                    return r.props.dispatch({
                      type: 'confuNew/queryHistoryList',
                      payload: { caid: e },
                    });
                  }),
                  (r.getConfigChangeList = function () {
                    var e = r.state.caid;
                    r.props.dispatch({
                      type: 'confuNew/queryConfigChangeList',
                      payload: { caid: e, page: 1, limit: 50 },
                    });
                  }),
                  (r.getConfigStatusList = function () {
                    var e = r.state.caid;
                    r.props.dispatch({ type: 'confuNew/queryStatusList', payload: { caid: e } }),
                      r.setState({ showStatusSync: !1 });
                  }),
                  (r.checkResource = function () {
                    var e = r.state.caid;
                    checkResourceConfig({ caid: e })
                      .then(function (e) {
                        0 === e.code && r.setState({ resourceCheckList: e.data });
                      })
                      .catch(function (e) {});
                  }),
                  (r.addItem = function (e) {
                    var t = r.state.caid,
                      n = e.resource_id,
                      i = e.key,
                      o = e.value,
                      a = e.comment;
                    Object(tt['a'])({ caid: t, key: i, value: o, comment: a, resource_id: n }).then(
                      function (e) {
                        0 === e.code
                          ? (l['a'].success('\u6dfb\u52a0\u6210\u529f'),
                            r.getConfigList(),
                            r.setState({ showAddItem: !1 }))
                          : l['a'].error('\u6dfb\u52a0\u5931\u8d25');
                      },
                    );
                  }),
                  (r.updateItem = function (e) {
                    var t = r.state.caid,
                      n = e.id,
                      i = e.key,
                      o = e.value,
                      a = e.comment,
                      s = e.resource_id;
                    Object(tt['g'])({
                      id: n,
                      caid: t,
                      key: i,
                      value: o,
                      comment: a,
                      resource_id: s,
                    }).then(function (e) {
                      0 === e.code
                        ? (l['a'].success('\u66f4\u65b0\u6210\u529f'),
                          r.setState({ showUpdateItem: !1 }),
                          r.getConfigList())
                        : l['a'].success('\u66f4\u65b0\u5931\u8d25' + e.msg);
                    });
                  }),
                  (r.delItem = function (e) {
                    var t = e.id;
                    Object(tt['e'])({ id: t }).then(function (e) {
                      0 === e.code
                        ? (l['a'].success('\u5220\u9664\u6210\u529f'), r.getConfigList())
                        : l['a'].success('\u5220\u9664\u5931\u8d25');
                    });
                  }),
                  (r.publishItem = function (e) {
                    r.setState({ publish_loading: !0 });
                    var t = r.state.caid,
                      n = e.message;
                    Object(tt['s'])({ caid: t, message: n }).then(function (e) {
                      0 === e.code
                        ? (l['a'].success('\u53d1\u5e03\u6210\u529f'),
                          r.setState({ showPublish: !1 }),
                          r.getConfigList())
                        : l['a'].error('\u53d1\u5e03\u5931\u8d25:' + e.msg),
                        r.setState({ publish_loading: !1 });
                    });
                  }),
                  (r.AddConfigFile = function (e) {
                    var t = r.props,
                      n = t.aid,
                      i = t.appName,
                      o = t.env,
                      a = e.file_name,
                      s = e.zone_code,
                      c = e.file_typ;
                    Object(tt['b'])({
                      aid: parseInt(n),
                      appName: i,
                      env: o,
                      zone_code: s,
                      file_name: a,
                      file_typ: c,
                    }).then(function (e) {
                      0 === e.code
                        ? (l['a'].success('\u6dfb\u52a0'.concat(a, '\u6210\u529f')),
                          r.setState({ showConfigFile: !1 }),
                          r.getAppList())
                        : l['a'].error('\u6dfb\u52a0\u5931\u8d25:' + e.msg);
                    });
                  }),
                  (r.saveText = function (e) {
                    var t = r.state,
                      n = t.caid,
                      i = t.format,
                      o = r.configInputText;
                    if ('toml' === i)
                      try {
                        Hn.a.parse(o);
                      } catch (s) {
                        return l['a'].error(
                          'toml\u6587\u4ef6\u5b58\u5728\u8bed\u6cd5\u9519\u8bef\uff1a' + s.message,
                        );
                      }
                    else if ('yml' === i || 'yaml' === i)
                      try {
                        var a = yaml.parse(o);
                        if ('string' === typeof a || Array.isArray(a))
                          return l['a'].error(
                            'yaml\u6587\u4ef6\u5b58\u5728\u8bed\u6cd5\u9519\u8bef\uff1a\u9876\u5c42\u5143\u7d20\u9700\u8981\u4e3a\u5bf9\u8c61',
                          );
                      } catch (s) {
                        return l['a'].error(
                          'yaml\u6587\u4ef6\u5b58\u5728\u8bed\u6cd5\u9519\u8bef\uff1a' + s.message,
                        );
                      }
                    else if ('json' === i)
                      try {
                        JSON.parse(o);
                      } catch (s) {
                        return l['a'].error(
                          'json\u6587\u4ef6\u5b58\u5728\u8bed\u6cd5\u9519\u8bef\uff1a' + s.message,
                        );
                      }
                    r.setState({ loading: !0 }),
                      Object(tt['h'])({ caid: n, config_text: o })
                        .then(function (e) {
                          0 === e.code
                            ? (l['a'].success('\u4fdd\u5b58\u6210\u529f'),
                              r.setState({ readOnly: !0 }),
                              r.getConfigList())
                            : l['a'].error('\u4fdd\u5b58\u5931\u8d25'),
                            r.setState({ loading: !1 });
                        })
                        .catch(function (e) {
                          r.setState({ loading: !1 });
                        });
                  }),
                  (r.filterByKey = function (e) {
                    return !(r.state.searchKey && !e.key.includes(r.state.searchKey));
                  }),
                  (r.filterByValue = function (e) {
                    return !(r.state.searchValue && !e.value.includes(r.state.searchValue));
                  }),
                  (r.sortObj = function (e, t) {
                    var n = {};
                    t.map(function (t) {
                      var n = e[t];
                      if (n) return Object(Y['a'])({}, t, n);
                    })
                      .filter(function (e) {
                        return e;
                      })
                      .forEach(function (e) {
                        Object.keys(e).forEach(function (t) {
                          n[t] = e[t];
                        });
                      });
                    return n;
                  }),
                  (r.handleFileManage = function () {
                    r.setState({ showFileManage: !0 });
                  }),
                  (r.handleFileDiff = function () {
                    r.setState({ showFileDiff: !0 });
                  }),
                  (r.getEnvResource = function () {
                    var e = r.state,
                      t = (e.file_name, e.env),
                      n = e.zone_code,
                      i = r.props.appId;
                    r.props.dispatch({
                      type: 'confuNew/queryList',
                      payload: { env: t, zone_code: n, page: 1, limit: 1e3, app_id: i },
                    });
                  }),
                  (r.configInputText = ''),
                  (r.state = {
                    caid: 0,
                    aid: parseInt(r.props.aid),
                    appName: r.props.appName,
                    file_name: '',
                    filterKey: '',
                    tab: 'table',
                    searchKey: '',
                    showKeyFilter: !1,
                    searchValue: '',
                    showValueFilter: !1,
                    selectItemID: 0,
                    selectKey: '',
                    selectValue: '',
                    selectComment: '',
                    selectIsResource: !1,
                    selectResourceID: 0,
                    showAddItem: !1,
                    showUpdateItem: !1,
                    showPublish: !1,
                    publish_loading: !1,
                    showConfigFile: !1,
                    showHistory: !1,
                    showPreview: !1,
                    showRollback: !1,
                    showFileManage: !1,
                    showFileDiff: !1,
                    readOnly: !0,
                    loading: !1,
                    instance_load: !1,
                    showStatusSync: !1,
                    env: r.props.env,
                    zone_code: r.props.zoneCode,
                    idcList: r.props.idcList,
                  }),
                  r
                );
              }
              return (
                Object(u['a'])(n, [
                  {
                    key: 'componentDidMount',
                    value: function () {
                      var e = this,
                        t = this.props.aid;
                      void 0 != t &&
                        ((t *= 1),
                        this.setState({ aid: t }, function () {
                          e.getAppList().then(function (t) {
                            e.autoChangeConfig();
                          });
                        }));
                    },
                  },
                  {
                    key: 'componentWillReceiveProps',
                    value: function (e) {
                      var t = this,
                        n = parseInt(e.aid);
                      if (
                        (n === this.state.aid ||
                          isNaN(n) ||
                          void 0 === n ||
                          0 === n ||
                          this.setState({ aid: n, tab: 'text' }, function () {
                            t.getAppList().then(function (e) {
                              t.autoChangeConfig();
                            });
                          }),
                        e.env !== this.state.env && void 0 !== e.env && '' !== e.env)
                      ) {
                        if (isNaN(this.state.aid)) return;
                        this.setState({ env: e.env, tab: 'text' }, function () {
                          t.getAppList().then(function (e) {
                            t.autoChangeConfig();
                          });
                        });
                      }
                    },
                  },
                  {
                    key: 'refreshState',
                    value: function () {
                      var e = this;
                      this.setState({ showStatusSync: !0 }),
                        Object(tt['k'])({ caid: this.state.caid })
                          .then(function (t) {
                            e.getConfigStatusList(),
                              l['a'].success('\u540c\u6b65\u6210\u529f'),
                              e.setState({ showStatusSync: !1 });
                          })
                          .catch(function (t) {
                            e.setState({ showStatusSync: !1 });
                          });
                    },
                  },
                  {
                    key: 'render',
                    value: function () {
                      var e = this,
                        t = this,
                        n = this.props,
                        s = (n.appId, n.app),
                        c = void 0 === s ? {} : s,
                        u = (n.apps, n.configList),
                        f = void 0 === u ? [] : u,
                        p = n.configText,
                        h = (n.commonText, n.appConfigList),
                        g = void 0 === h ? [] : h,
                        v = n.configChangeList,
                        y = void 0 === v ? [] : v,
                        b = n.statusList,
                        w = void 0 === b ? [] : b,
                        x = n.configHistoryList,
                        C = void 0 === x ? [] : x,
                        S = n.resourceData,
                        k = void 0 === S ? {} : S,
                        E = n.appInfo,
                        O = E.aid,
                        L = E.appName,
                        T = n.msg,
                        N = n.idcList,
                        M = n.file_path,
                        A = void 0 === M ? '' : M,
                        j = n.zoneCode;
                      console.log('zoneCode', j);
                      c.users;
                      var P = g[0] || {},
                        I = this.state,
                        D = I.caid,
                        _ = I.file_name,
                        z = I.format,
                        R = I.env,
                        F = I.filterKey,
                        Y = I.selectItemID,
                        Z = I.selectKey,
                        $ = I.selectValue,
                        J = I.selectComment,
                        Q = I.selectIsResource,
                        ee = I.selectResourceID,
                        te = (I.fileDelModalVisible, I.fileDelConfirmLoading, I.result_list),
                        ne = void 0 === te ? [] : te,
                        re = f.filter(function (e) {
                          return 1 * e.status !== 1;
                        }).length,
                        ie = { borderRadius: '4px', marginTop: '4px', marginLeft: '4px' },
                        oe = function (e, t) {
                          var n = {
                            1: m.a.createElement('span', null, e),
                            2: m.a.createElement('span', null, e, et('new')),
                            3: m.a.createElement('span', null, e, et('update')),
                            4: m.a.createElement('span', null, e, et('del')),
                          };
                          return n[t];
                        },
                        ae = [
                          {
                            key: 'key',
                            dataIndex: 'key',
                            title: '\u6807\u8bc6',
                            width: 120,
                            filterDropdown: m.a.createElement(
                              'div',
                              { className: 'custom-filter-dropdown' },
                              m.a.createElement(X['a'], {
                                ref: function (t) {
                                  return (e.searchInputKey = t);
                                },
                                placeholder: '\u67e5\u8be2\u6807\u8bc6',
                                value: this.state.searchKey,
                                onChange: function (e) {
                                  t.setState({ searchKey: e.target.value });
                                },
                              }),
                            ),
                            filterDropdownVisible: this.state.showKeyFilter,
                            onFilterDropdownVisibleChange: function (t) {
                              e.setState({ showKeyFilter: t }, function () {
                                return e.searchInputKey && e.searchInputKey.focus();
                              });
                            },
                            render: function (e, t) {
                              var n = t.status;
                              return 5 === n ? e : oe(e, n);
                            },
                          },
                          {
                            key: 'value',
                            dataIndex: 'value',
                            title: '\u503c',
                            filterDropdown: m.a.createElement(
                              'div',
                              { className: 'custom-filter-dropdown' },
                              m.a.createElement(X['a'], {
                                ref: function (t) {
                                  return (e.searchInputValue = t);
                                },
                                placeholder: '\u67e5\u8be2\u503c',
                                value: this.state.searchValue,
                                onChange: function (e) {
                                  t.setState({ searchValue: e.target.value });
                                },
                              }),
                            ),
                            filterDropdownVisible: this.state.showValueFilter,
                            onFilterDropdownVisibleChange: function (t) {
                              e.setState({ showValueFilter: t }, function () {
                                return e.searchInputValue && e.searchInputValue.focus();
                              });
                            },
                            render: function (e, n) {
                              if (!n.is_resource) {
                                var r = e;
                                return (
                                  e.length > 400 && (r = r.substring(0, 400) + '...'),
                                  m.a.createElement(
                                    'span',
                                    { style: { wordBreak: 'break-word' } },
                                    r,
                                  )
                                );
                              }
                              var i = t.props.relatedList,
                                o = void 0 === i ? [] : i,
                                a = e.split(''),
                                l = a.slice(2, a.length - 2).join(''),
                                s =
                                  o.find(function (e) {
                                    return e.name === l;
                                  }) || {},
                                c = s.value,
                                u = void 0 === c ? '' : c;
                              return m.a.createElement(
                                'div',
                                null,
                                m.a.createElement(
                                  'span',
                                  { style: { marginRight: '6px', wordBreak: 'break-word' } },
                                  u,
                                ),
                                m.a.createElement(
                                  'span',
                                  {
                                    style: {
                                      backgroundColor: '#52c47f',
                                      color: 'white',
                                      borderRadius: '5px',
                                      padding: '3px',
                                      wordBreak: 'break-word',
                                    },
                                  },
                                  ''.concat(e),
                                ),
                              );
                            },
                          },
                          {
                            key: 'op',
                            dataIndex: 'op',
                            title: '\u64cd\u4f5c',
                            width: 120,
                            render: function (e, n) {
                              var r = n.id,
                                i = n.key,
                                o = n.value,
                                a = n.comment,
                                l = n.is_resource,
                                s = n.resource_id,
                                c = null;
                              return (
                                i.startsWith('jupiter.worker') &&
                                  -1 !== i.indexOf('pause') &&
                                  (c =
                                    'true' === o
                                      ? m.a.createElement(
                                          G['a'],
                                          {
                                            color: 'green',
                                            onClick: function (e) {
                                              t.updateItem({
                                                id: r,
                                                key: i,
                                                value: 'false',
                                                comment: a,
                                                is_resource: l,
                                                resource_id: s,
                                              }),
                                                t.getConfigList();
                                            },
                                          },
                                          '\u542f\u52a8',
                                        )
                                      : m.a.createElement(
                                          G['a'],
                                          {
                                            color: 'orange',
                                            onClick: function (e) {
                                              t.updateItem({
                                                id: r,
                                                key: i,
                                                value: 'true',
                                                comment: a,
                                                is_resource: l,
                                                resource_id: s,
                                              }),
                                                t.getConfigList();
                                            },
                                          },
                                          '\u6682\u505c',
                                        )),
                                m.a.createElement(
                                  'div',
                                  null,
                                  c,
                                  null === c &&
                                    m.a.createElement(
                                      G['a'],
                                      {
                                        color: 'blue',
                                        onClick: function () {
                                          t.setState({
                                            selectItemID: r,
                                            selectKey: i,
                                            selectValue: o,
                                            selectComment: a,
                                            selectIsResource: l,
                                            selectResourceID: s,
                                            showUpdateItem: !0,
                                          }),
                                            t.getEnvResource();
                                        },
                                      },
                                      '\u7f16\u8f91',
                                    ),
                                  '\xa0',
                                  m.a.createElement(
                                    q['a'],
                                    {
                                      title: '\u786e\u5b9a\u5220\u9664\u5417\uff1f',
                                      onConfirm: function () {
                                        t.delItem({ id: r });
                                      },
                                    },
                                    m.a.createElement(G['a'], { color: 'red' }, '\u5220\u9664'),
                                  ),
                                )
                              );
                            },
                          },
                        ],
                        le = [
                          {
                            key: 'key',
                            dataIndex: 'key',
                            title: '\u6807\u8bc6',
                            width: 120,
                            render: function (e, t) {
                              return m.a.createElement(
                                'span',
                                { style: { wordBreak: 'break-word' } },
                                e,
                              );
                            },
                          },
                          {
                            key: 'op_type',
                            dataIndex: 'op_type',
                            title: '\u64cd\u4f5c',
                            width: 80,
                            render: function (e) {
                              var t = {
                                1: et('new', '\u65b0\u589e'),
                                2: et('update', '\u66f4\u65b0'),
                                3: et('del', '\u5220\u9664'),
                              };
                              return m.a.createElement('span', null, t[e]);
                            },
                          },
                          {
                            key: 'old_value',
                            dataIndex: 'old_value',
                            title: '\u65e7\u503c',
                            render: function (e) {
                              var t = e;
                              return (
                                e.length > 200 && (t = t.substring(0, 200) + '...'),
                                m.a.createElement('span', { style: { wordBreak: 'break-word' } }, t)
                              );
                            },
                          },
                          {
                            key: 'new_value',
                            dataIndex: 'new_value',
                            title: '\u65b0\u503c',
                            render: function (e) {
                              var t = e;
                              return (
                                e.length > 200 && (t = t.substring(0, 200) + '...'),
                                m.a.createElement('span', { style: { wordBreak: 'break-word' } }, t)
                              );
                            },
                          },
                          {
                            key: 'update_time',
                            dataIndex: 'update_time',
                            title: '\u65f6\u95f4',
                            width: 180,
                            render: function (e) {
                              return Xe()(1e3 * e).format('YYYY-MM-DD HH:mm:ss');
                            },
                          },
                          {
                            key: 'op_name',
                            dataIndex: 'op_name',
                            width: 180,
                            title: '\u64cd\u4f5c\u4eba',
                          },
                        ],
                        se = [
                          {
                            key: 'is_use',
                            dataIndex: 'is_use',
                            title: m.a.createElement(
                              'span',
                              null,
                              '\u914d\u7f6e\u72b6\u6001',
                              m.a.createElement(
                                K['a'],
                                {
                                  title:
                                    '\u5f53\u524d\u5b9e\u4f8b\u4e0a\u7684systemd\u914d\u7f6e\u6587\u4ef6\u9879\u662f\u5426\u63a5\u5165\u914d\u7f6e\u4e2d\u5fc3\n\u3002\u82e5\u663e\u793a\u672a\u63a5\u5165\uff0c\u5219\u9700\u8981\u4fee\u6539systemd\u4e0b\u53d1\u914d\u7f6e\uff0c\u8def\u5f84\u6539\u4e3a\u914d\u7f6e\u4e2d\u5fc3\u63d0\u4f9b\u7684\u8def\u5f84\n\u3002\u82e5\u5df2\u7ecf\u4fee\u6539\u4e0b\u53d1\u8fc7\uff0c\u70b9\u51fb\u3010\u540c\u6b65\u5b9e\u4f8b\u72b6\u6001\u3011\u5237\u65b0\u3002',
                                },
                                m.a.createElement(Wn['a'], { style: { marginLeft: '6px' } }),
                              ),
                            ),
                            render: function (e) {
                              return e
                                ? et('new', '\u5df2\u63a5\u5165')
                                : m.a.createElement(
                                    'div',
                                    null,
                                    et('del', '\u672a\u63a5\u5165'),
                                    m.a.createElement(
                                      K['a'],
                                      { title: '\u67e5\u770b\u63a5\u5165\u6587\u6863' },
                                      m.a.createElement(
                                        'a',
                                        {
                                          style: { marginLeft: '8px' },
                                          href:
                                            'http://doc.xxxx.com/ddse/preview/share/a7d0512dd8e8572737ba?sid=336&shareType=1',
                                          target: '_blank',
                                        },
                                        m.a.createElement(U['a'], { type: 'info-circle' }),
                                      ),
                                    ),
                                  );
                            },
                          },
                          {
                            key: 'is_latest',
                            dataIndex: 'is_latest',
                            title: m.a.createElement(
                              'span',
                              null,
                              '\u6587\u4ef6\u72b6\u6001',
                              m.a.createElement(
                                K['a'],
                                {
                                  title:
                                    '\u5f53\u524d\u5b9e\u4f8b\u4e0a\u7684\u914d\u7f6e\u6587\u4ef6\u662f\u5426\u4e3a\u6700\u65b0\u53d1\u5e03\n\u3002\u82e5\u663e\u793a\u672a\u540c\u6b65\uff0c\u70b9\u51fb\u3010\u5237\u65b0\u6587\u4ef6\u72b6\u6001\u3011\u3002\u82e5\u5237\u65b0\u65e0\u6548\u5219\u9700\u8981\u3010\u91cd\u65b0\u53d1\u5e03\u3011\u4e00\u6b21\u3002',
                                },
                                m.a.createElement(Wn['a'], { style: { marginLeft: '6px' } }),
                              ),
                            ),
                            render: function (e) {
                              return e
                                ? et('new', '\u5df2\u540c\u6b65')
                                : et('del', '\u672a\u540c\u6b65');
                            },
                          },
                          {
                            key: 'is_effect',
                            dataIndex: 'is_effect',
                            title: m.a.createElement(
                              'span',
                              null,
                              '\u914d\u7f6e\u72b6\u6001',
                              m.a.createElement(
                                K['a'],
                                {
                                  title:
                                    '\u91cd\u542f\u4e4b\u540e\u5e94\u7528\u914d\u7f6e\u662f\u5426\u751f\u6548',
                                },
                                m.a.createElement(Wn['a'], { style: { marginLeft: '6px' } }),
                              ),
                            ),
                            render: function (e) {
                              return e
                                ? et('new', '\u5df2\u751f\u6548')
                                : m.a.createElement('div', null, et('del', '\u672a\u751f\u6548'));
                            },
                          },
                          {
                            key: 'hostname',
                            dataIndex: 'hostname',
                            title: '\u5b9e\u4f8b\u540d\u79f0',
                          },
                          {
                            key: 'message',
                            dataIndex: 'message',
                            title: '\u63d0\u4ea4\u65e5\u5fd7',
                          },
                          {
                            key: 'timestamp',
                            dataIndex: 'timestamp',
                            title:
                              '\u6587\u4ef6\u540c\u6b65\u65f6\u95f4/\u8fdb\u7a0b\u542f\u52a8\u65f6\u95f4',
                            render: function (e, t) {
                              var n = t.process_start_time,
                                r = void 0 === n ? 0 : n,
                                i = t.is_latest,
                                o = t.is_use;
                              if (0 !== r) {
                                var a = 1e3 * e,
                                  l = 1e3 * r,
                                  s = null;
                                return (
                                  a > l
                                    ? (s = m.a.createElement(
                                        K['a'],
                                        {
                                          title:
                                            '\u914d\u7f6e\u6587\u4ef6\u5df2\u7ecf\u540c\u6b65\u5b8c\u6210\uff0c\u8fdb\u7a0b\u5c1a\u672a\u91cd\u542f\u751f\u6548',
                                        },
                                        m.a.createElement(U['a'], {
                                          type: 'clock-circle',
                                          style: { color: 'orange' },
                                        }),
                                      ))
                                    : i &&
                                      o &&
                                      (s = m.a.createElement(
                                        K['a'],
                                        {
                                          title: '\u6700\u65b0\u914d\u7f6e\u5df2\u7ecf\u751f\u6548',
                                        },
                                        m.a.createElement(U['a'], {
                                          type: 'check-circle',
                                          style: { color: 'green' },
                                        }),
                                      )),
                                  m.a.createElement(
                                    'div',
                                    null,
                                    m.a.createElement(
                                      'p',
                                      null,
                                      Xe()(a).format('YYYY-MM-DD HH:mm:ss'),
                                    ),
                                    m.a.createElement(
                                      'p',
                                      null,
                                      Xe()(l).format('YYYY-MM-DD HH:mm:ss'),
                                      ' ',
                                      s,
                                    ),
                                  )
                                );
                              }
                              return m.a.createElement(
                                'div',
                                null,
                                m.a.createElement(
                                  'p',
                                  null,
                                  Xe()(1e3 * e).format('YYYY-MM-DD HH:mm:ss'),
                                ),
                              );
                            },
                          },
                          {
                            key: 'params',
                            dataIndex: 'params',
                            title: m.a.createElement(
                              'span',
                              null,
                              '\u542f\u52a8\u53c2\u6570',
                              m.a.createElement(
                                K['a'],
                                {
                                  title:
                                    '\u5f53\u524d\u5b9e\u4f8b\u4e0a\u7684systemd\u914d\u7f6e\u4e2d\u7684\u542f\u52a8\u53c2\u6570\uff0c ${ConfigDir}\u53d8\u91cf\u4e3a\u914d\u7f6e\u4e2d\u5fc3\u9ed8\u8ba4\u4e0b\u53d1\u8def\u5f84\u3002\u542f\u52a8\u65f6\u95f4\u4e3a\u8fdb\u7a0b\u542f\u52a8\u65f6\u95f4\u3002',
                                },
                                m.a.createElement(U['a'], {
                                  style: { marginLeft: '6px' },
                                  type: 'question-circle',
                                }),
                              ),
                            ),
                            render: function (e, t) {
                              var n = e.split('/bin/%(program_name)s');
                              if (2 !== n.length) return e;
                              var r = n[1],
                                i = function (e) {
                                  return e
                                    .split(' ')
                                    .filter(function (e) {
                                      return e;
                                    })
                                    .filter(function (e) {
                                      return -1 === e.indexOf('-host');
                                    })
                                    .map(function (e) {
                                      return e.split('=');
                                    })
                                    .reduce(function (e, t) {
                                      return e.concat(t);
                                    })
                                    .map(function (e) {
                                      var t = new RegExp(
                                        '/home/www/.config/juno-agent/(.*?)/config',
                                        'ig',
                                      );
                                      return e.replace(t, '${ConfuDir}');
                                    })
                                    .join(' ');
                                };
                              return m.a.createElement(
                                'div',
                                null,
                                m.a.createElement('p', { style: { margin: 0 } }, i(r)),
                              );
                            },
                          },
                          {
                            key: 'op',
                            dataIndex: 'op',
                            title: '\u64cd\u4f5c',
                            render: function (e, n) {
                              var r = this,
                                i = (n.pub_id, n.is_latest);
                              if (i)
                                return m.a.createElement(
                                  'div',
                                  null,
                                  m.a.createElement(
                                    V['default'],
                                    {
                                      style: { color: 'black' },
                                      onClick: function (e) {
                                        t.showConfirm('restart', r.state.zone_code, n.hostname);
                                      },
                                    },
                                    '\u91cd\u542f',
                                  ),
                                );
                            },
                          },
                        ];
                      if ('\u6743\u9650\u9519\u8bef' === T)
                        return m.a.createElement(
                          'div',
                          { style: { marginTop: 10 } },
                          m.a.createElement(a['a'], {
                            message: '\u6743\u9650\u4e0d\u8db3',
                            description:
                              '\u5bf9\u7ebf\u4e0a\u914d\u7f6e\u64cd\u4f5c\u9700\u8981\u7ba1\u7406\u5458\u6743\u9650',
                            type: 'error',
                            showIcon: !0,
                          }),
                        );
                      var ce = [],
                        ue = [];
                      return (
                        N.forEach(function (e) {
                          ce.push(e.zone_code), (ue[e.zone_code] = e.zone_name);
                        }),
                        m.a.createElement(
                          Ge['a'],
                          null,
                          m.a.createElement(
                            Yn,
                            { width: 250, style: { backgroundColor: 'transparent' } },
                            m.a.createElement(
                              r['a'],
                              { style: ie },
                              m.a.createElement(
                                'p',
                                { style: { textAlign: 'left' } },
                                '\u914d\u7f6e\u6587\u4ef6\u5217\u8868',
                                m.a.createElement(
                                  V['default'],
                                  {
                                    style: { marginLeft: '8px' },
                                    size: 'small',
                                    type: 'primary',
                                    icon: m.a.createElement(Bn['a'], null),
                                    onClick: function () {
                                      e.setState({ showConfigFile: !0 });
                                    },
                                  },
                                  '\u6dfb\u52a0\u914d\u7f6e',
                                ),
                              ),
                              P && P.configs
                                ? m.a.createElement(
                                    qe['default'],
                                    {
                                      selectedKeys: [D + '_' + R + '_' + z],
                                      mode: 'inline',
                                      style: { height: '50%', borderRight: 0 },
                                      defaultOpenKeys: ce,
                                      onClick: this.changeAppConfig,
                                    },
                                    Object.keys(this.sortObj(P.files, ce)).map(function (t) {
                                      if ('all' == j || j == t)
                                        return m.a.createElement(
                                          qe['default'].SubMenu,
                                          {
                                            key: t,
                                            title: m.a.createElement('h4', null, ''.concat(ue[t])),
                                          },
                                          P.files[t].map(function (t) {
                                            return (
                                              console.log(
                                                'this.state.zone_code',
                                                e.state.zone_code,
                                              ),
                                              m.a.createElement(
                                                qe['default'].Item,
                                                {
                                                  style: { paddingLeft: '20px' },
                                                  key: t.id + '_' + t.env + '_' + t.format,
                                                },
                                                t.file_name,
                                              )
                                            );
                                          }),
                                        );
                                    }),
                                  )
                                : m.a.createElement(
                                    'div',
                                    { style: { textAlign: 'left' } },
                                    m.a.createElement(
                                      V['default'],
                                      {
                                        type: 'primary',
                                        onClick: function () {
                                          return e.setState({ showConfigFile: !0 });
                                        },
                                      },
                                      '\u6dfb\u52a0\u914d\u7f6e\u6587\u4ef6',
                                    ),
                                  ),
                            ),
                            m.a.createElement(
                              r['a'],
                              { style: ie },
                              m.a.createElement(
                                'p',
                                { style: { textAlign: 'left' } },
                                '\u6587\u4ef6\u7ba1\u7406',
                              ),
                              m.a.createElement(
                                V['default'],
                                {
                                  type: 'primary',
                                  onClick: this.handleFileManage,
                                  style: { marginLeft: '4px' },
                                },
                                '\u6587\u4ef6\u7ba1\u7406',
                              ),
                              m.a.createElement(
                                V['default'],
                                {
                                  type: 'primary',
                                  onClick: this.handleFileDiff,
                                  style: { marginLeft: '4px' },
                                },
                                '\u6587\u4ef6\u5bf9\u6bd4',
                              ),
                            ),
                          ),
                          m.a.createElement(
                            Zn,
                            null,
                            m.a.createElement(
                              'div',
                              null,
                              0 !== D &&
                                m.a.createElement(
                                  i['a'],
                                  {
                                    style: {
                                      marginTop: '4px',
                                      marginLeft: '4px',
                                      marginRight: '4px',
                                    },
                                  },
                                  m.a.createElement(
                                    o['a'],
                                    { span: 4, style: { textAlign: 'left' } },
                                    m.a.createElement(
                                      V['default'],
                                      {
                                        type: 'primary',
                                        style: { float: 'left', marginRight: '6px' },
                                        onClick: function (t) {
                                          e.getAppList().then(function (t) {
                                            e.autoChangeConfig(),
                                              l['a'].success('\u6570\u636e\u5df2\u66f4\u65b0');
                                          });
                                        },
                                      },
                                      m.a.createElement(U['a'], { type: 'sync' }),
                                      '\u5237\u65b0\u6570\u636e',
                                    ),
                                    m.a.createElement(
                                      K['a'],
                                      {
                                        title:
                                          '\u5f53\u524d\u9875\u9762\u4e3a\u9759\u6001\u9875\u9762\uff0c\u4fee\u6539\u914d\u7f6e\u524d\u9700\u8981\u5237\u65b0\u83b7\u53d6\u6700\u65b0\u914d\u7f6e\u6570\u636e\uff0c\u4ee5\u514d\u8986\u76d6\u5176\u4ed6\u4eba\u7684\u914d\u7f6e\u6570\u636e',
                                      },
                                      m.a.createElement(Wn['a'], null),
                                    ),
                                  ),
                                  m.a.createElement(
                                    o['a'],
                                    { span: 20, style: { textAlign: 'right' } },
                                    m.a.createElement(
                                      V['default'].Group,
                                      null,
                                      m.a.createElement(
                                        V['default'],
                                        {
                                          type: 'primary',
                                          onClick: function () {
                                            t.setState({ showPublish: !0 });
                                          },
                                        },
                                        '\u53d1\u5e03\u914d\u7f6e',
                                      ),
                                      m.a.createElement(
                                        V['default'],
                                        {
                                          type: 'danger',
                                          onClick: function (e) {
                                            t.changeTab('status');
                                          },
                                        },
                                        '\u91cd\u542f\u5217\u8868',
                                      ),
                                      m.a.createElement(
                                        V['default'],
                                        {
                                          type: 'primary',
                                          onClick: function (e) {
                                            t.setState({ showRollback: !0 });
                                          },
                                        },
                                        '\u914d\u7f6e\u56de\u6eda',
                                      ),
                                      m.a.createElement(
                                        V['default'],
                                        {
                                          onClick: function () {
                                            t.getHistoryList(), t.setState({ showHistory: !0 });
                                          },
                                        },
                                        '\u53d1\u5e03\u5386\u53f2',
                                      ),
                                    ),
                                  ),
                                ),
                              0 !== D &&
                                m.a.createElement(
                                  d['a'],
                                  {
                                    style: {
                                      backgroundColor: '#fff',
                                      marginTop: '4px',
                                      marginLeft: '4px',
                                      marginRight: '4px',
                                    },
                                    activeKey: this.state.tab,
                                    onChange: this.changeTab,
                                  },
                                  m.a.createElement(
                                    $n,
                                    {
                                      tab: m.a.createElement(
                                        'span',
                                        null,
                                        m.a.createElement(Vn['a'], null),
                                        '\u914d\u7f6e\u7f16\u8f91',
                                      ),
                                      key: 'table',
                                    },
                                    m.a.createElement(
                                      i['a'],
                                      null,
                                      m.a.createElement(
                                        o['a'],
                                        {
                                          style: {
                                            marginLeft: '10px',
                                            marginTop: '-10px',
                                            marginBottom: '5px',
                                          },
                                        },
                                        m.a.createElement(
                                          V['default'].Group,
                                          null,
                                          m.a.createElement(
                                            V['default'],
                                            {
                                              type: 'primary',
                                              onClick: function () {
                                                t.setState({ showAddItem: !0 }), t.getEnvResource();
                                              },
                                            },
                                            '\u65b0\u589e\u914d\u7f6e\u9879',
                                          ),
                                        ),
                                      ),
                                    ),
                                    m.a.createElement(B['a'], {
                                      columns: ae,
                                      dataSource: f
                                        .filter(function (e) {
                                          return 'x-custom' === F
                                            ? !e.key.startsWith('app') &&
                                                !e.key.startsWith('jupiter') &&
                                                !e.key.startsWith('server')
                                            : 'app' === F
                                            ? e.key.startsWith(F) || e.key.startsWith('server')
                                            : e.key.startsWith(F);
                                        })
                                        .filter(t.filterByKey)
                                        .filter(t.filterByValue),
                                      pagination: !1,
                                      size: 'small',
                                    }),
                                  ),
                                  m.a.createElement(
                                    $n,
                                    {
                                      tab: m.a.createElement(
                                        'span',
                                        null,
                                        m.a.createElement(Un['a'], null),
                                        '\u914d\u7f6e\u9884\u89c8',
                                      ),
                                      key: 'text',
                                    },
                                    m.a.createElement(W['default'], {
                                      spinning: this.state.loading,
                                    }),
                                    m.a.createElement(
                                      i['a'],
                                      null,
                                      m.a.createElement(
                                        o['a'],
                                        {
                                          style: {
                                            textAlign: 'left',
                                            marginLeft: '8px',
                                            marginBottom: '8px',
                                            fontSize: '18px',
                                          },
                                          span: 12,
                                        },
                                        _,
                                      ),
                                      m.a.createElement(
                                        o['a'],
                                        {
                                          style: {
                                            textAlign: 'right',
                                            marginRight: '8px',
                                            marginBottom: '8px',
                                          },
                                          span: 11,
                                        },
                                        m.a.createElement(
                                          V['default'].Group,
                                          null,
                                          this.state.readOnly
                                            ? m.a.createElement(
                                                'span',
                                                null,
                                                m.a.createElement(
                                                  V['default'],
                                                  {
                                                    onClick: function (e) {
                                                      Qe()(p),
                                                        l['a'].success(
                                                          '\u5df2\u590d\u5236\u5230\u526a\u5207\u677f',
                                                        );
                                                    },
                                                  },
                                                  '\u590d\u5236',
                                                ),
                                              )
                                            : m.a.createElement(
                                                'span',
                                                null,
                                                m.a.createElement(
                                                  V['default'],
                                                  {
                                                    style: { marginRight: '8px' },
                                                    onClick: function (e) {
                                                      var n = t.state.format,
                                                        r = t.configInputText;
                                                      'toml' === n
                                                        ? Object(tt['l'])(r)
                                                            .then(function (e) {
                                                              var n = e.code,
                                                                r = e.msg,
                                                                i = e.data;
                                                              if (0 === n) {
                                                                var o = t.refs.editor.editor;
                                                                o.setValue(i),
                                                                  l['a'].success(
                                                                    '\u683c\u5f0f\u5316\u5b8c\u6210',
                                                                  );
                                                              } else l['a'].success('\u683c\u5f0f\u5316\u5931\u8d25 ' + r);
                                                            })
                                                            .catch(function (e) {
                                                              l['a'].success(
                                                                '\u683c\u5f0f\u5316\u5931\u8d25 ' +
                                                                  e.message,
                                                              );
                                                            })
                                                        : l['a'].success(
                                                            '\u975etoml\u6587\u672c\u6682\u4e0d\u652f\u6301\u683c\u5f0f\u5316\u5931\u8d25',
                                                          );
                                                    },
                                                  },
                                                  '\u683c\u5f0f\u5316',
                                                ),
                                                m.a.createElement(
                                                  V['default'],
                                                  {
                                                    style: {
                                                      backgroundColor: '#6495ED',
                                                      color: '#fff',
                                                      marginRight: '8px',
                                                    },
                                                    onClick: function () {
                                                      return (
                                                        p === t.configInputText &&
                                                          l['a'].info('\u65e0\u53d8\u66f4'),
                                                        t.setState({ showPreview: !0 })
                                                      );
                                                    },
                                                  },
                                                  '\u9884\u89c8\u53d8\u66f4',
                                                ),
                                                m.a.createElement(
                                                  V['default'],
                                                  {
                                                    onClick: function (e) {
                                                      t.setState({ readOnly: !0 });
                                                      var n = t.refs.editor.editor;
                                                      n.setValue(p);
                                                    },
                                                  },
                                                  '\u53d6\u6d88\u4fee\u6539',
                                                ),
                                                m.a.createElement(
                                                  V['default'],
                                                  {
                                                    style: {
                                                      backgroundColor: '#52c41a',
                                                      color: '#fff',
                                                    },
                                                    onClick: this.saveText,
                                                  },
                                                  '\u4fdd\u5b58',
                                                ),
                                              ),
                                        ),
                                      ),
                                    ),
                                    m.a.createElement(
                                      'div',
                                      { className: 'configEditor' },
                                      m.a.createElement(at.a, {
                                        ref: 'editor',
                                        value: p,
                                        options: {
                                          mode: 'text/x-toml',
                                          lineNumbers: !0,
                                          autoMatchParens: !0,
                                          lineWrapping: !0,
                                          readOnly: this.state.readOnly,
                                        },
                                        onChange: function (t, n, r) {
                                          e.configInputText = t.getValue();
                                        },
                                      }),
                                    ),
                                  ),
                                  m.a.createElement(
                                    $n,
                                    {
                                      tab: m.a.createElement(
                                        'span',
                                        null,
                                        m.a.createElement(Kn['a'], null),
                                        m.a.createElement(
                                          H,
                                          { count: re, overflowCount: 9999, offset: [0, 18] },
                                          '\u66f4\u65b0\u8bb0\u5f55',
                                        ),
                                      ),
                                      key: 'history',
                                    },
                                    m.a.createElement(B['a'], {
                                      columns: le,
                                      dataSource: y,
                                      size: 'small',
                                      pagination: !1,
                                      rowKey: 'id',
                                    }),
                                  ),
                                  m.a.createElement(
                                    $n,
                                    {
                                      tab: m.a.createElement(
                                        'span',
                                        null,
                                        m.a.createElement(qn['a'], null),
                                        '\u8fd0\u884c\u5b9e\u4f8b',
                                      ),
                                      key: 'status',
                                    },
                                    m.a.createElement(W['default'], {
                                      spinning: this.state.showStatusSync,
                                    }),
                                    m.a.createElement(
                                      'div',
                                      { style: { marginLeft: '10px' } },
                                      '\u914d\u7f6e\u6587\u4ef6\u8def\u5f84:',
                                      m.a.createElement(
                                        'span',
                                        {
                                          style: {
                                            marginLeft: '8px',
                                            marginRight: '8px',
                                            fontSize: '16px',
                                          },
                                        },
                                        ''.concat(A),
                                      ),
                                      m.a.createElement(
                                        'a',
                                        {
                                          onClick: function (e) {
                                            Qe()(''.concat(A)),
                                              l['a'].success(
                                                '\u5df2\u590d\u5236\uff0c\u8bf7\u91cd\u65b0\u4e0b\u53d1\u914d\u7f6e\u6587\u4ef6\u751f\u6548',
                                              );
                                          },
                                        },
                                        '\u70b9\u51fb\u590d\u5236',
                                      ),
                                      m.a.createElement(
                                        K['a'],
                                        {
                                          title:
                                            '\u4fee\u6539systemd\u4e0b\u53d1\u7684\u914d\u7f6e\u6587\u4ef6\u8def\u5f84\uff0c\u7531\u539f\u6765\u7684\u9879\u76ee\u76f8\u5bf9\u8def\u5f84\u6539\u4e3a\u914d\u7f6e\u4e2d\u5fc3\u7684\u8def\u5f84',
                                        },
                                        m.a.createElement(U['a'], {
                                          style: { marginLeft: '6px' },
                                          type: 'question-circle',
                                        }),
                                      ),
                                      m.a.createElement(
                                        'span',
                                        {
                                          style: {
                                            float: 'right',
                                            marginRight: '8px',
                                            marginBottom: '8px',
                                          },
                                        },
                                        m.a.createElement(
                                          V['default'],
                                          {
                                            type: 'primary',
                                            onClick: function (e) {
                                              t.setState({ showStatusSync: !0 }),
                                                Object(tt['k'])({ caid: D })
                                                  .then(function (e) {
                                                    t.getConfigStatusList(),
                                                      l['a'].success('\u540c\u6b65\u6210\u529f'),
                                                      t.setState({ showStatusSync: !1 });
                                                  })
                                                  .catch(function (e) {
                                                    t.setState({ showStatusSync: !1 });
                                                  });
                                            },
                                          },
                                          '\u5237\u65b0\u5b9e\u4f8b\u72b6\u6001',
                                        ),
                                      ),
                                      m.a.createElement(B['a'], {
                                        size: 'small',
                                        columns: se,
                                        dataSource: w,
                                        pagination: !1,
                                      }),
                                    ),
                                  ),
                                ),
                              m.a.createElement(ht, {
                                show: this.state.showAddItem,
                                cancel: function () {
                                  e.setState({ showAddItem: !1 });
                                },
                                item: { resourceData: k },
                                env: this.state.env,
                                zone_code: this.state.zone_code,
                                submit: this.addItem,
                                caid: this.state.caid,
                                zone_codeMap: ue,
                              }),
                              m.a.createElement(vt, {
                                show: this.state.showUpdateItem,
                                env: this.state.env,
                                zone_code: this.state.zone_code,
                                cancel: function () {
                                  e.setState({ showUpdateItem: !1 });
                                },
                                changeResource: function (e) {
                                  t.setState({ selectIsResource: e });
                                },
                                changeResourceID: function (e) {
                                  t.setState({ selectResourceID: 1 * e });
                                },
                                caid: this.state.caid,
                                submit: this.updateItem,
                                item: {
                                  id: Y,
                                  key: Z,
                                  value: $,
                                  comment: J,
                                  is_resource: Q,
                                  resource_id: ee,
                                  resourceData: k,
                                },
                                zone_codeMap: ue,
                              }),
                              m.a.createElement(Mn, {
                                show: this.state.showPublish,
                                publish_loading: this.state.publish_loading,
                                file_name: _,
                                item: { caid: D },
                                cancel: function () {
                                  e.setState({ showPublish: !1 });
                                },
                                submit: this.publishItem,
                              }),
                              m.a.createElement(An, {
                                show: this.state.showConfigFile,
                                cancel: function () {
                                  e.setState({ showConfigFile: !1 });
                                },
                                submit: this.AddConfigFile,
                                zoneList: this.props.zoneList,
                              }),
                              m.a.createElement(jn, {
                                show: this.state.showHistory,
                                cancel: function () {
                                  e.setState({ showHistory: !1 }),
                                    e.props.dispatch({
                                      type: 'confuNew/setPublishChangeData',
                                      payload: {},
                                    });
                                },
                                list: C,
                              }),
                              m.a.createElement(Pn, {
                                oldCode: p,
                                newCode: this.configInputText,
                                show: this.state.showPreview,
                                cancel: function () {
                                  e.setState({ showPreview: !1 });
                                },
                              }),
                              this.state.showRollback &&
                                m.a.createElement(In, {
                                  caid: D,
                                  show: this.state.showRollback,
                                  rollback: function () {
                                    t.getConfigList();
                                  },
                                  cancel: function () {
                                    e.setState({ showRollback: !1 });
                                  },
                                }),
                              m.a.createElement(_n, {
                                show: this.state.showFileManage,
                                app_name: L,
                                app_id: O,
                                env: R,
                                zone_code: this.state.zone_code,
                                cancel: function () {
                                  e.setState({ showFileManage: !1 }, function () {
                                    e.autoChangeConfig;
                                  });
                                },
                              }),
                              m.a.createElement(Rn, {
                                show: this.state.showFileDiff,
                                originCid: this.state.caid,
                                rafeCid: 0,
                                appConfigList: this.props.appConfigList,
                                cancel: function () {
                                  e.setState({ showFileDiff: !1 });
                                },
                              }),
                            ),
                          ),
                          m.a.createElement(
                            Ye['a'],
                            {
                              title: '\u64cd\u4f5c\u9762\u677f',
                              visible: this.state.visible,
                              onOk: function (t) {
                                e.refreshState(), e.setState({ visible: !1, result_list: [] });
                              },
                              okText: '\u786e\u5b9a',
                              onCancel: function (t) {
                                e.refreshState(), e.setState({ visible: !1, result_list: [] });
                              },
                              cancelText: '\u5173\u95ed',
                            },
                            m.a.createElement(
                              'div',
                              null,
                              m.a.createElement(W['default'], { spinning: this.state.loading }),
                            ),
                            m.a.createElement(
                              'div',
                              { style: { backgroundColor: 'black', borderRadius: '5px' } },
                              ne.map(function (e, t) {
                                e.name;
                                var n = e.content;
                                return m.a.createElement(
                                  'p',
                                  { key: t, style: { color: 'green' } },
                                  n,
                                );
                              }),
                            ),
                          ),
                        )
                      );
                    },
                  },
                ]),
                n
              );
            })(m.a.Component)),
            (kn = En)),
          ) || kn),
        Jn = (function (e) {
          Object(f['a'])(n, e);
          var t = Object(p['a'])(n);
          function n(e) {
            return Object(c['a'])(this, n), t.call(this, e);
          }
          return (
            Object(u['a'])(n, [
              { key: 'componentWillMount', value: function () {} },
              {
                key: 'render',
                value: function () {
                  var e = 690,
                    t = '/pprof/' + this.props.iframepage;
                  return (
                    console.log('imgAddr', t),
                    m.a.createElement('iframe', {
                      src: t,
                      width: '100%',
                      height: e,
                      frameBorder: '0',
                    })
                  );
                },
              },
            ]),
            n
          );
        })(m.a.Component),
        Qn = n('mI1j'),
        er = n.n(Qn),
        tr = function (e) {
          var t = e.onChange,
            n = e.appEnvZone,
            r = e.env,
            i = e.defalutZone,
            o = [];
          return (
            o.push(m.a.createElement(rt['default'].Button, { value: 'all' }, '\u5168\u90e8')),
            n.forEach(function (e) {
              void 0 != r &&
                e.env == r &&
                e.zone_list.forEach(function (e) {
                  o.push(
                    m.a.createElement(rt['default'].Button, { value: e.zone_code }, e.zone_name),
                  );
                });
            }),
            m.a.createElement(
              'div',
              { className: er.a.lay },
              m.a.createElement(
                rt['default'].Group,
                { defaultValue: i, buttonStyle: 'solid', onChange: t },
                o,
              ),
            )
          );
        },
        nr = tr,
        rr = n('erfm'),
        ir = n('fce+'),
        or = n('Ue1A'),
        ar = n('2BaD'),
        lr = {
          profile: { name: 'CPU\u5206\u6790\uff08profile\uff09', type: 'profile' },
          profile_hy: {
            name: 'CPU\u5206\u6790\uff08\ud83d\udd25\u706b\u7130\u56fe\uff09',
            type: 'profile_hy',
          },
          heap: { name: '\u5185\u5b58\u5206\u6790\uff08heap\uff09', type: 'heap' },
          heap_hy: {
            name: '\u5185\u5b58\u5206\u6790\uff08\ud83d\udd25\u706b\u7130\u56fe\uff09',
            type: 'heap_hy',
          },
          goroutine: { name: '\u534f\u7a0b\u5206\u6790\uff08goroutine\uff09', type: 'goroutine' },
          goroutine_hy: {
            name: '\u534f\u7a0b\u5206\u6790\uff08\ud83d\udd25\u706b\u7130\u56fe\uff09',
            type: 'goroutine_hy',
          },
          block: { name: '\u963b\u585e\u540c\u6b65\u5206\u6790\uff08block\uff09', type: 'block' },
          block_hy: {
            name: '\u963b\u585e\u540c\u6b65\u5206\u6790\uff08\ud83d\udd25\u706b\u7130\u56fe\uff09',
            type: 'block_hy',
          },
        },
        sr =
          (X['a'].TextArea,
          (On = Object(Ze['c'])(function (e) {
            var t = e.pprofModel;
            e.loading;
            return { pprofList: t.pprofList };
          })),
          On(
            ((Tn = (function (e) {
              Object(f['a'])(n, e);
              var t = Object(p['a'])(n);
              function n(e) {
                var r;
                return (
                  Object(c['a'])(this, n),
                  (r = t.call(this, e)),
                  (r.GetCheckDep = function () {
                    Object(rr['a'])({ installType: 1 }).then(function (e) {
                      return 0 !== e.code
                        ? (l['a'].error(e.msg), !1)
                        : (r.setState({ depRes: e.data }), !0);
                    });
                  }),
                  (r.getList = function () {
                    var e = r.state,
                      t = e.appName,
                      n = e.zoneCode,
                      i = e.env;
                    r.props.dispatch({
                      type: 'pprofModel/list',
                      payload: { appName: t, zoneCode: n, env: i },
                    }),
                      r.props.dispatch({
                        type: 'appModel/nodeList',
                        payload: { appName: t, zoneCode: n, env: i },
                      });
                  }),
                  (r.btnLoadingFun = function (e, t) {
                    var n = {};
                    (n[e + 'Loading'] = !0 === t), r.setState(n);
                  }),
                  (r.enterLoading = function () {
                    r.setState({ loading: !0 });
                  }),
                  (r.stopLoading = function () {
                    r.setState({ loading: !1 });
                  }),
                  (r.changeNode = function (e) {
                    r.setState({ hostName: e });
                    var t = r.state,
                      n = t.appName,
                      i = t.idcCode,
                      o = t.env;
                    r.props.dispatch({
                      type: 'pprofModel/list',
                      payload: { appName: n, idcCode: i, hostName: e, env: o },
                    });
                  }),
                  (r.showProfileSvg = function (e, t, n) {
                    var i = Object($['a'])(r),
                      o = lr[t].name;
                    void 0 === o && (o = '\u67e5\u770b\u5206\u6790');
                    r.props.dispatch;
                    r.btnLoadingFun('profile', !0),
                      i.setState({ pprofActiveBtn: o, iframepage: n, visible: !0 });
                  }),
                  (r.runPprof = function () {
                    var e = r.props.dispatch,
                      t = r.state,
                      n = t.appName,
                      i = t.zoneCode,
                      o = t.hostName,
                      a = t.env;
                    r.enterLoading(),
                      e({
                        type: 'pprofModel/run',
                        payload: { zoneCode: i, appName: n, hostName: o, env: a },
                        callback: function (e) {
                          if (0 !== e.code)
                            return (
                              l['a'].error('\u66f4\u65b0\u9519\u8bef,err:' + e.msg),
                              void r.stopLoading()
                            );
                          r.stopLoading(),
                            l['a'].success(
                              '\u6210\u529f\uff01\u56e0\u6587\u4ef6\u670d\u52a1\u5ef6\u65f6\uff0c\u8bf7\u7a0d\u7b49\u7247\u523b\u67e5\u770b\u76f8\u5173\u5206\u6790\u6587\u4ef6\uff01',
                              8,
                            ),
                            r.getList();
                        },
                      });
                  }),
                  (r.handleCheckLog = function (e) {
                    console.log('click', e),
                      Object(Dn['a'])(r.state),
                      Object(ir['c'])({ installType: 1 * e }).then(function (e) {
                        var t = e.code,
                          n = e.msg;
                        e.data;
                        0 === t
                          ? (l['a'].success('\u5b89\u88c5\u6210\u529f\uff1a', n), r.GetCheckDep())
                          : l['a'].error('\u5b89\u88c5\u5931\u8d25:' + n);
                      });
                  }),
                  (r.onCancel = function (e) {
                    r.setState({ iframepage: '', visible: !1 });
                  }),
                  (r.columns = [
                    {
                      title: '\u65f6\u95f4',
                      dataIndex: 'create_time',
                      key: 'create_time',
                      width: 300,
                      render: function (e) {
                        return (
                          console.log('111', e),
                          Xe()(1e3 * e).format('YYYY\u5e74MM\u6708DD\u65e5HH:mm')
                        );
                      },
                    },
                    { title: '\u5b9e\u4f8b', dataIndex: 'hostName', key: 'hostName', width: 300 },
                    {
                      title: 'pprof\u9884\u89c8',
                      dataIndex: 'pprofList',
                      key: 'pprofList',
                      width: 1e3,
                      render: function (e) {
                        return m.a.createElement(
                          'span',
                          null,
                          e.length > 0 &&
                            e.map(function (e) {
                              return m.a.createElement(
                                V['default'],
                                {
                                  key: 'pp' + e.id,
                                  'data-id': e.id,
                                  'data-type': e.type,
                                  style: { marginRight: '8px', marginTop: '8px' },
                                  onClick: function () {
                                    r.showProfileSvg(e.id, e.type, e.url);
                                  },
                                },
                                lr[e.type].name,
                              );
                            }),
                        );
                      },
                    },
                  ]),
                  (r.state = {
                    btnList: [],
                    loading: !1,
                    app: {},
                    pageShowType: 'item',
                    pprofActiveBtn: '\u67e5\u770b\u5206\u6790',
                    pprofActiveTime: '',
                    visible: !1,
                    remarkVisible: !1,
                    remarkBox: '',
                    scenenId: '',
                    authCode: 1,
                    iframepage: 'about:blank',
                    hostName: '',
                    appName: e.appName,
                    mode: e.mode,
                    zoneCode: e.zoneCode,
                    env: e.env,
                    depRes: {},
                  }),
                  (r.aid = 0),
                  r
                );
              }
              return (
                Object(u['a'])(n, [
                  {
                    key: 'componentDidMount',
                    value: function () {
                      console.log('>>>>> props', this.props), this.getList(), this.GetCheckDep();
                    },
                  },
                  {
                    key: 'componentWillReceiveProps',
                    value: function (e, t) {
                      var n = this;
                      if ('' !== e.idcCode && '' !== e.appName && '' !== e.mode) {
                        var r = this.state,
                          i = r.idcCode,
                          o = r.appName,
                          a = r.mode,
                          l = r.env;
                        (e.idcCode === i && e.appName === o && e.mode === a && e.env === l) ||
                          this.setState(
                            { idcCode: e.idcCode, appName: e.appName, env: e.env, mode: e.mode },
                            function () {
                              n.getList(), n.GetCheckDep();
                            },
                          );
                      }
                    },
                  },
                  { key: 'componentWillMount', value: function () {} },
                  {
                    key: 'render',
                    value: function () {
                      var e = 750,
                        t = this.props,
                        n = (t.appIdcList, t.pprofList),
                        l = void 0 === n ? [] : n,
                        s = t.appNodeList,
                        c = void 0 === s ? [] : s,
                        u = (t.defalutZone, t.appEnvZone, t.onChangeZone, this.state),
                        f = u.pprofActiveBtn,
                        p = u.zoneCode,
                        d = (u.appName, u.env),
                        h = this.state,
                        g = h.loading,
                        v = h.depRes,
                        y = v.golang,
                        b = v.go_torch,
                        w = v.graphviz;
                      if ((console.log('env,zoneCode ', d, p), !d))
                        return m.a.createElement(
                          'div',
                          { style: { marginTop: 10 } },
                          m.a.createElement(a['a'], {
                            message: 'Warning',
                            description: '\u8bf7\u9009\u62e9\u73af\u5883.',
                            type: 'warning',
                            showIcon: !0,
                          }),
                        );
                      return m.a.createElement(
                        'div',
                        null,
                        m.a.createElement(
                          r['a'],
                          { style: { marginLeft: '10px' } },
                          m.a.createElement(
                            i['a'],
                            { style: { marginLeft: '10px' } },
                            m.a.createElement(
                              o['a'],
                              { span: 8 },
                              m.a.createElement(
                                mt['a'],
                                {
                                  dropdownMatchSelectWidth: !0,
                                  showSearch: !0,
                                  allowClear: !0,
                                  style: { width: 300 },
                                  placeholder: '\u9009\u62e9\u5b9e\u4f8b',
                                  onChange: this.changeNode,
                                },
                                void 0 != c &&
                                  c.length > 0 &&
                                  c.map(function (e, t) {
                                    return m.a.createElement(
                                      mt['a'].Option,
                                      { key: t, value: e.host_name },
                                      e.host_name + ' (' + e.ip + ')',
                                    );
                                  }),
                              ),
                            ),
                            m.a.createElement(
                              o['a'],
                              { span: 4 },
                              m.a.createElement(
                                q['a'],
                                {
                                  placement: 'rightBottom',
                                  title:
                                    'CPU\u5206\u6790\u9700\u7b49\u5f8530s\uff0c\u786e\u8ba4\u64cd\u4f5c\uff1f',
                                  onConfirm: this.runPprof,
                                  okText: 'Yes',
                                  cancelText: 'No',
                                },
                                m.a.createElement(
                                  V['default'],
                                  { type: 'primary', className: 'pprof-btn', loading: g },
                                  '\u66f4\u65b0\u5206\u6790\u56fe\u8868',
                                ),
                              ),
                            ),
                            m.a.createElement(
                              o['a'],
                              { span: 8 },
                              1 === y &&
                                m.a.createElement(
                                  G['a'],
                                  { color: 'green', key: 1 },
                                  'Golang ',
                                  m.a.createElement(or['a'], null),
                                ),
                              0 === y &&
                                m.a.createElement(
                                  G['a'],
                                  { color: 'geekblue', key: 2 },
                                  'Golang ',
                                  m.a.createElement(ar['a'], null),
                                ),
                              1 === b &&
                                m.a.createElement(
                                  G['a'],
                                  { color: 'green', key: 3 },
                                  'Go-torch ',
                                  m.a.createElement(or['a'], null),
                                ),
                              0 === b &&
                                m.a.createElement(
                                  G['a'],
                                  { color: 'geekblue', key: 4 },
                                  'Go-torch ',
                                  m.a.createElement(ar['a'], null),
                                ),
                              1 === w &&
                                m.a.createElement(
                                  G['a'],
                                  { color: 'green', key: 5 },
                                  'Graphviz ',
                                  m.a.createElement(or['a'], null),
                                ),
                              0 === w &&
                                m.a.createElement(
                                  G['a'],
                                  { color: 'geekblue', key: 6 },
                                  'Graphviz ',
                                  m.a.createElement(ar['a'], null),
                                ),
                            ),
                          ),
                          m.a.createElement(
                            i['a'],
                            { style: { marginTop: '10px', marginLeft: '10px' } },
                            m.a.createElement(B['a'], {
                              columns: this.columns,
                              dataSource: l,
                              pagination: { pageSize: 9999, hideOnSinglePage: !0 },
                            }),
                          ),
                          m.a.createElement(
                            Ye['a'],
                            {
                              title: f,
                              width: '88%',
                              visible: this.state.visible,
                              onCancel: this.onCancel,
                              maskClosable: !0,
                              footer: null,
                            },
                            m.a.createElement(
                              'div',
                              null,
                              m.a.createElement(Jn, { iframepage: this.state.iframepage }),
                            ),
                          ),
                          m.a.createElement(r['a'], {
                            bordered: !1,
                            style: { marginBottom: '20px', height: { iframeHeight: e } + 'px' },
                          }),
                        ),
                      );
                    },
                  },
                ]),
                n
              );
            })(m.a.PureComponent)),
            (Ln = Tn)),
          ) || Ln),
        cr = n('Hx5s'),
        ur = (n('bbsP'), n('/wGt')),
        fr = (n('jhiw'), n('Zm9Q')),
        pr = n('ACnJ'),
        dr = n('uaoM');
      function hr(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function mr(e) {
        return void 0 !== e && null !== e;
      }
      var gr = function (e) {
          var t,
            n = e.itemPrefixCls,
            r = e.component,
            i = e.span,
            o = e.className,
            a = e.style,
            l = e.bordered,
            s = e.label,
            c = e.content,
            u = e.colon,
            f = r;
          return l
            ? h['createElement'](
                f,
                {
                  className: y()(
                    ((t = {}),
                    hr(t, ''.concat(n, '-item-label'), mr(s)),
                    hr(t, ''.concat(n, '-item-content'), mr(c)),
                    t),
                    o,
                  ),
                  style: a,
                  colSpan: i,
                },
                mr(s) ? s : c,
              )
            : h['createElement'](
                f,
                { className: y()(''.concat(n, '-item'), o), style: a, colSpan: i },
                s &&
                  h['createElement'](
                    'span',
                    {
                      className: y()(
                        ''.concat(n, '-item-label'),
                        hr({}, ''.concat(n, '-item-no-colon'), !u),
                      ),
                    },
                    s,
                  ),
                c &&
                  h['createElement']('span', { className: y()(''.concat(n, '-item-content')) }, c),
              );
        },
        vr = gr;
      function yr(e, t, n) {
        var r = t.colon,
          i = t.prefixCls,
          o = t.bordered,
          a = n.component,
          l = n.type,
          s = n.showLabel,
          c = n.showContent;
        return e.map(function (e, t) {
          var n = e.props,
            u = n.label,
            f = n.children,
            p = n.prefixCls,
            d = void 0 === p ? i : p,
            m = n.className,
            g = n.style,
            v = n.span,
            y = void 0 === v ? 1 : v,
            b = e.key;
          return 'string' === typeof a
            ? h['createElement'](vr, {
                key: ''.concat(l, '-').concat(b || t),
                className: m,
                style: g,
                span: y,
                colon: r,
                component: a,
                itemPrefixCls: d,
                bordered: o,
                label: s ? u : null,
                content: c ? f : null,
              })
            : [
                h['createElement'](vr, {
                  key: 'label-'.concat(b || t),
                  className: m,
                  style: g,
                  span: 1,
                  colon: r,
                  component: a[0],
                  itemPrefixCls: d,
                  bordered: o,
                  label: u,
                }),
                h['createElement'](vr, {
                  key: 'content-'.concat(b || t),
                  className: m,
                  style: g,
                  span: 2 * y - 1,
                  component: a[1],
                  itemPrefixCls: d,
                  bordered: o,
                  content: f,
                }),
              ];
        });
      }
      var br = function (e) {
          var t = e.prefixCls,
            n = e.vertical,
            r = e.row,
            i = e.index,
            o = e.bordered;
          return n
            ? h['createElement'](
                h['Fragment'],
                null,
                h['createElement'](
                  'tr',
                  { key: 'label-'.concat(i), className: ''.concat(t, '-row') },
                  yr(r, e, { component: 'th', type: 'label', showLabel: !0 }),
                ),
                h['createElement'](
                  'tr',
                  { key: 'content-'.concat(i), className: ''.concat(t, '-row') },
                  yr(r, e, { component: 'td', type: 'content', showContent: !0 }),
                ),
              )
            : h['createElement'](
                'tr',
                { key: i, className: ''.concat(t, '-row') },
                yr(r, e, {
                  component: o ? ['th', 'td'] : 'td',
                  type: 'item',
                  showLabel: !0,
                  showContent: !0,
                }),
              );
        },
        wr = br,
        xr = function (e) {
          var t = e.children;
          return t;
        },
        Cr = xr;
      function Sr(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function kr(e, t) {
        return Nr(e) || Tr(e, t) || Or(e, t) || Er();
      }
      function Er() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      function Or(e, t) {
        if (e) {
          if ('string' === typeof e) return Lr(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? Lr(e, t)
              : void 0
          );
        }
      }
      function Lr(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function Tr(e, t) {
        if ('undefined' !== typeof Symbol && Symbol.iterator in Object(e)) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (var a, l = e[Symbol.iterator](); !(r = (a = l.next()).done); r = !0)
              if ((n.push(a.value), t && n.length === t)) break;
          } catch (s) {
            (i = !0), (o = s);
          } finally {
            try {
              r || null == l['return'] || l['return']();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        }
      }
      function Nr(e) {
        if (Array.isArray(e)) return e;
      }
      function Mr(e) {
        return (
          (Mr =
            'function' === typeof Symbol && 'symbol' === typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    'function' === typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? 'symbol'
                    : typeof e;
                }),
          Mr(e)
        );
      }
      var Ar = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 };
      function jr(e, t) {
        if ('number' === typeof e) return e;
        if ('object' === Mr(e))
          for (var n = 0; n < pr['b'].length; n++) {
            var r = pr['b'][n];
            if (t[r] && void 0 !== e[r]) return e[r] || Ar[r];
          }
        return 3;
      }
      function Pr(e, t, n) {
        var r = e;
        return (
          (void 0 === t || t > n) &&
            ((r = Object(w['a'])(e, { span: n })),
            Object(dr['a'])(
              void 0 === t,
              'Descriptions',
              'Sum of column `span` in a line not match `column` of Descriptions.',
            )),
          r
        );
      }
      function Ir(e, t) {
        var n = Object(fr['a'])(e).filter(function (e) {
            return e;
          }),
          r = [],
          i = [],
          o = t;
        return (
          n.forEach(function (e, a) {
            var l,
              s = null === (l = e.props) || void 0 === l ? void 0 : l.span,
              c = s || 1;
            if (a === n.length - 1) return i.push(Pr(e, s, o)), void r.push(i);
            c < o ? ((o -= c), i.push(e)) : (i.push(Pr(e, c, o)), r.push(i), (o = t), (i = []));
          }),
          r
        );
      }
      function Dr(e) {
        var t,
          n = e.prefixCls,
          r = e.title,
          i = e.column,
          o = void 0 === i ? Ar : i,
          a = e.colon,
          l = void 0 === a || a,
          s = e.bordered,
          c = e.layout,
          u = e.children,
          f = e.className,
          p = e.style,
          d = e.size,
          m = h['useContext'](b['b']),
          g = m.getPrefixCls,
          v = m.direction,
          w = g('descriptions', n),
          x = h['useState']({}),
          C = kr(x, 2),
          S = C[0],
          k = C[1],
          E = jr(o, S);
        h['useEffect'](function () {
          var e = pr['a'].subscribe(function (e) {
            'object' === Mr(o) && k(e);
          });
          return function () {
            pr['a'].unsubscribe(e);
          };
        }, []);
        var O = Ir(u, E);
        return h['createElement'](
          'div',
          {
            className: y()(
              w,
              f,
              ((t = {}),
              Sr(t, ''.concat(w, '-').concat(d), d && 'default' !== d),
              Sr(t, ''.concat(w, '-bordered'), !!s),
              Sr(t, ''.concat(w, '-rtl'), 'rtl' === v),
              t),
            ),
            style: p,
          },
          r && h['createElement']('div', { className: ''.concat(w, '-title') }, r),
          h['createElement'](
            'div',
            { className: ''.concat(w, '-view') },
            h['createElement'](
              'table',
              null,
              h['createElement'](
                'tbody',
                null,
                O.map(function (e, t) {
                  return h['createElement'](wr, {
                    key: t,
                    index: t,
                    colon: l,
                    prefixCls: w,
                    vertical: 'vertical' === c,
                    bordered: s,
                    row: e,
                  });
                }),
              ),
            ),
          ),
        );
      }
      Dr.Item = Cr;
      var _r = Dr,
        zr = n('Ge06'),
        Rr = n.n(zr),
        Fr = mt['a'].Option;
      function Hr(e) {
        var t = e.appInfo,
          n = e.appList,
          r = e.getAppInfoAction,
          a = e.setEnvAction,
          l = e.env,
          s = e.idcList,
          c = e.initDisable,
          u = Object(h['useState'])(c),
          f = Object(Z['a'])(u, 2),
          p = f[0],
          d = f[1],
          g = Object(h['useState'])(!1),
          v = Object(Z['a'])(g, 2),
          y = v[0],
          b = v[1],
          w = function () {
            b(!0);
          },
          x = function () {
            b(!1);
          },
          C = [];
        n.forEach(function (e) {
          C.push(m.a.createElement(Fr, { value: e.app_name }, e.app_name));
        });
        var S = function (e, t) {
            var n = !1;
            return (
              e.forEach(function (e) {
                e === t && (n = !0);
              }),
              n
            );
          },
          k = t || {},
          E = k.name,
          O = k.biz_domain,
          L = k.http_port,
          T = k.rpc_port,
          N = k.govern_port,
          M = k.users,
          A = k.app_name,
          j = [];
        void 0 != M &&
          M.forEach(function (e) {
            j.push(m.a.createElement(G['a'], { color: 'green', key: e }, e));
          });
        var P = [];
        n.forEach(function (e) {
          P.push(m.a.createElement(Fr, { value: e.aid + '*' + e.app_name }, e.app_name));
        });
        var I = function (e) {
            var t = e.split('*');
            r(t[0], t[1]), d(!1);
          },
          D = [],
          _ = [];
        return (
          s.forEach(function (e) {
            if (!S(_, e.env))
              switch ((_.push(e.env), e.env)) {
                case 'dev':
                  D.push(
                    m.a.createElement(
                      Fr,
                      { value: e.env },
                      m.a.createElement(G['a'], { color: '#87d068' }, e.env),
                    ),
                  );
                  break;
                case 'live':
                  D.push(
                    m.a.createElement(
                      Fr,
                      { value: e.env },
                      m.a.createElement(G['a'], { color: '#2db7f5' }, e.env),
                    ),
                  );
                  break;
                case 'pre':
                  D.push(
                    m.a.createElement(
                      Fr,
                      { value: e.env },
                      m.a.createElement(G['a'], { color: '#108ee9' }, e.env),
                    ),
                  );
                  break;
                case 'stress':
                  D.push(
                    m.a.createElement(
                      Fr,
                      { value: e.env },
                      m.a.createElement(G['a'], { color: '#f50' }, e.env),
                    ),
                  );
                  break;
                case 'gray':
                  D.push(
                    m.a.createElement(
                      Fr,
                      { value: e.env },
                      m.a.createElement(G['a'], { color: '#f50' }, e.env),
                    ),
                  );
                  break;
                case 'pub':
                  D.push(
                    m.a.createElement(
                      Fr,
                      { value: e.env },
                      m.a.createElement(G['a'], { color: '#f50' }, e.env),
                    ),
                  );
                  break;
                case 'prod':
                  D.push(
                    m.a.createElement(
                      Fr,
                      { value: e.env },
                      m.a.createElement(G['a'], { color: '#f50' }, e.env),
                    ),
                  );
                  break;
                default:
                  D.push(m.a.createElement(Fr, { value: e.env }, e.env));
              }
          }),
          m.a.createElement(
            m.a.Fragment,
            null,
            m.a.createElement(
              i['a'],
              { gutter: 24, style: { marginLeft: '1px', width: '100%' } },
              m.a.createElement(
                o['a'],
                { span: 6 },
                m.a.createElement(
                  mt['a'],
                  {
                    showSearch: !0,
                    size: 'large',
                    style: { width: '100%' },
                    placeholder: '\u5e94\u7528',
                    optionFilterProp: 'children',
                    onChange: I,
                    value: A,
                    filterOption: function (e, t) {
                      return t.props.children.toLowerCase().indexOf(e.toLowerCase()) >= 0;
                    },
                  },
                  P,
                ),
              ),
              m.a.createElement(
                o['a'],
                { span: 3 },
                m.a.createElement(
                  mt['a'],
                  {
                    showSearch: !0,
                    size: 'large',
                    style: { width: '100%' },
                    placeholder: '\u73af\u5883',
                    optionFilterProp: 'children',
                    onChange: a,
                    value: l,
                    disabled: p,
                    filterOption: function (e, t) {
                      return t.props.children.toLowerCase().indexOf(e.toLowerCase()) >= 0;
                    },
                  },
                  D,
                ),
              ),
              m.a.createElement(
                o['a'],
                null,
                m.a.createElement('div', { className: Rr.a.cube }, 'HTTP: ', L),
                m.a.createElement('div', { className: Rr.a.cube }, 'gRPC: ', T),
                m.a.createElement('div', { className: Rr.a.cube }, 'Govern: ', N),
                m.a.createElement(
                  'div',
                  { className: Rr.a.cube },
                  m.a.createElement(
                    'a',
                    { type: 'primary', onClick: w },
                    '\u5e94\u7528\u8be6\u60c5',
                  ),
                ),
              ),
            ),
            m.a.createElement(
              i['a'],
              null,
              m.a.createElement(
                ur['a'],
                {
                  title: '\u5e94\u7528\u8be6\u60c5',
                  placement: 'top',
                  closable: !1,
                  onClose: x,
                  visible: y,
                },
                m.a.createElement(
                  _r,
                  { size: 'small', column: { xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 } },
                  m.a.createElement(_r.Item, { label: '\u5e94\u7528' }, E),
                  m.a.createElement(_r.Item, { label: 'HTTP' }, L),
                  m.a.createElement(_r.Item, { label: 'gRPC' }, T),
                  m.a.createElement(_r.Item, { label: 'Govern' }, N),
                  m.a.createElement(_r.Item, { label: '\u9879\u76ee\u57df' }, O),
                  m.a.createElement(
                    _r.Item,
                    { label: '\u9879\u76ee' },
                    m.a.createElement(K['a'], { title: E }, m.a.createElement('span', null, A)),
                  ),
                  m.a.createElement(
                    _r.Item,
                    { label: '\u8d1f\u8d23\u4eba', span: 2 },
                    m.a.createElement('span', null, j),
                  ),
                ),
              ),
            ),
          )
        );
      }
      var Wr = n('+GzQ');
      function Br() {
        return Vr.apply(this, arguments);
      }
      function Vr() {
        return (
          (Vr = Object(ct['a'])(
            st.a.mark(function e() {
              return st.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt('return', Object(ut['J'])('/api/admin/resource/zone/list'));
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          Vr.apply(this, arguments)
        );
      }
      n('8R5B');
      var Ur = n('aJyg'),
        Kr = n('0T1o'),
        qr = n.n(Kr),
        Gr = function (e) {
          var t = e.aid,
            n = (e.env, e.appNodeList),
            r = (e.appEnvZone, e.zone, Object(h['useState'])([])),
            a = Object(Z['a'])(r, 2),
            s = a[0],
            c = a[1],
            u = Object(h['useState'])([]),
            f = Object(Z['a'])(u, 2),
            p = f[0],
            d = f[1],
            g = Object(h['useState'])([]),
            v = Object(Z['a'])(g, 2),
            y = v[0],
            b = v[1],
            w = Object(h['useState'])(Boolean),
            x = Object(Z['a'])(w, 2),
            C = x[0],
            S = x[1],
            k = Object(h['useState'])([]),
            E = Object(Z['a'])(k, 2),
            O = (E[0], E[1], Object(h['useState'])(!0)),
            L = Object(Z['a'])(O, 2),
            T = L[0],
            N = L[1];
          T && N(!1);
          var M = function () {
              Object(Wr['d'])({ aid: t }).then(function (e) {
                if (0 !== e.code) return l['a'].error(e.msg), !1;
                var t = [],
                  n = [];
                return (
                  e.data.source_list.forEach(function (e) {
                    n.push({
                      key: e.host_name,
                      title: ''.concat(e.host_name, '(').concat(e.ip, ')'),
                    }),
                      (t[e.host_name] = e.id);
                  }),
                  c(n),
                  d(e.data.target_list),
                  b(t),
                  !0
                );
              });
            },
            A = function () {
              S(!1);
              var e = [];
              p.forEach(function (t) {
                e.push({ host_name: t, id: y[t] });
              }),
                Object(Wr['e'])({ target: e, aid: t }).then(function (e) {
                  0 !== e.code ? l['a'].error(e.msg) : l['a'].success(e.msg);
                });
            },
            j = function () {
              S(!1);
            },
            P = function (e) {
              d(e);
            },
            I = [
              { title: '\u8282\u70b9\u540d\u79f0', dataIndex: 'host_name', key: 'host_name' },
              { title: 'IP', dataIndex: 'ip', key: 'ip' },
              {
                title: '\u5730\u533a',
                key: 'region_code',
                render: function (e) {
                  return m.a.createElement('span', null, e.region_code, '(', e.region_name, ')');
                },
              },
              {
                title: '\u53ef\u7528\u533a',
                key: 'zone_code',
                render: function (e) {
                  return m.a.createElement('span', null, e.zone_code, '(', e.zone_name, ')');
                },
              },
              { title: '\u73af\u5883', key: 'env', dataIndex: 'env' },
              {
                title: '\u66f4\u65b0\u65f6\u95f4',
                dataIndex: 'update_time',
                key: 'update_time',
                render: function (e) {
                  return Xe()(e, 'X').format('YYYY-MM-DD HH:mm:ss');
                },
              },
            ],
            D = function (e, t, n, r) {
              console.log('params', e, t, n, r);
            };
          return m.a.createElement(
            'div',
            { style: { marginLeft: '5px' } },
            m.a.createElement(
              i['a'],
              null,
              m.a.createElement(
                o['a'],
                { span: 12 },
                m.a.createElement(
                  'div',
                  { style: { float: 'left' } },
                  m.a.createElement(
                    V['default'],
                    {
                      type: 'primary',
                      className: qr.a.lay,
                      onClick: function () {
                        M(), S(!0);
                      },
                    },
                    '\u7f16\u8f91\u8282\u70b9',
                  ),
                ),
              ),
            ),
            m.a.createElement(
              i['a'],
              null,
              m.a.createElement(B['a'], {
                className: qr.a.lay_width_full,
                columns: I,
                dataSource: n,
                onChange: D,
              }),
            ),
            m.a.createElement(
              Ye['a'],
              { title: '\u9009\u62e9\u8282\u70b9', visible: C, onOk: A, onCancel: j, width: 1e3 },
              m.a.createElement(Ur['a'], {
                dataSource: s,
                showSearch: !0,
                listStyle: { width: 450, height: 400 },
                titles: ['\u672a\u5173\u8054', '\u5df2\u5173\u8054'],
                targetKeys: p,
                onChange: P,
                render: function (e) {
                  return ''.concat(e.title);
                },
              }),
            ),
          );
        },
        Yr = Gr,
        Zr = d['a'].TabPane,
        $r = (function (e) {
          Object(f['a'])(n, e);
          var t = Object(p['a'])(n);
          function n(e) {
            var r;
            return (
              Object(c['a'])(this, n),
              (r = t.call(this, e)),
              (r.getAppInfo = function (e, t) {
                r.getAppEnvZone(t),
                  Object(Wr['b'])(e, t).then(function (n) {
                    if (0 === n.code) {
                      r.setState({ appInfo: n.data, aid: e, appName: t });
                      var i = r.props.location.query;
                      ut['F'].push({
                        query: Object(s['a'])(Object(s['a'])({}, i), {}, { appName: t, aid: e }),
                      });
                    } else l['a'].error(n.msg);
                  });
              }),
              (r.setEnv = function (e) {
                r.setState({ env: e, zoneCode: 'all' }),
                  r.genZoneList(r.state.appEnvZone, e),
                  r.GetList(r.state.aid, e);
                var t = r.props.location.query;
                ut['F'].push({ query: Object(s['a'])(Object(s['a'])({}, t), {}, { env: e }) });
              }),
              (r.getAppEnvZone = function (e) {
                Object(Wr['a'])(e).then(function (e) {
                  0 === e.code
                    ? (r.genZoneList(e.data, r.state.env), r.setState({ appEnvZone: e.data }))
                    : l['a'].error(e.msg);
                });
              }),
              (r.genZoneList = function (e, t) {
                e.forEach(function (e) {
                  e.env == t && r.setState({ zoneList: e.zone_list });
                });
              }),
              (r.callback = function (e) {
                r.getAppEnvZone(r.state.appName), r.setState({ tab: e });
                var t = r.props.location.query;
                ut['F'].push({ query: Object(s['a'])(Object(s['a'])({}, t), {}, { tab: e }) });
              }),
              (r.GetList = function (e, t) {
                Object(Wr['f'])({ aid: e, env: t, pageSize: 1e4 }).then(function (e) {
                  0 == e.code ? r.setState({ appNodeList: e.data.list }) : l['a'].error(e.message);
                });
              }),
              (r.onChangeZone = function (e) {
                'all' != e
                  ? Object(Wr['f'])({
                      aid: r.state.aid,
                      env: r.state.env,
                      pageSize: 1e4,
                      zone_code: e,
                    }).then(function (e) {
                      0 == e.code
                        ? r.setState({ appNodeList: e.data.list })
                        : l['a'].error(e.message);
                    })
                  : r.GetList(r.state.aid, r.state.env);
              }),
              (r.changeZone = function (e) {
                r.onChangeZone(e.target.value), r.setState({ zoneCode: e.target.value });
              }),
              (r.state = {
                appName: r.props.location.query.appName,
                env: r.props.location.query.env,
                aid: parseInt(r.props.location.query.aid),
                appInfo: {},
                appList: [],
                appIdcList: [],
                idcList: [],
                appEnvZone: [],
                zoneList: [],
                appNodeList: [],
                disable: !0,
                zoneCode: 'all',
                tab: void 0 == r.props.location.query.tab ? 'detail' : r.props.location.query.tab,
              }),
              r
            );
          }
          return (
            Object(u['a'])(n, [
              {
                key: 'componentDidMount',
                value: function () {
                  var e = this;
                  Object(Wr['c'])().then(function (t) {
                    0 === t.code ? e.setState({ appList: t.data.list }) : l['a'].error(t.msg);
                  }),
                    Br().then(function (t) {
                      0 === t.code ? e.setState({ idcList: t.data.list }) : l['a'].error(t.msg);
                    });
                  var t = this.state,
                    n = t.aid,
                    r = t.appName,
                    i = t.tab;
                  void 0 != n &&
                    0 != n &&
                    void 0 != r &&
                    0 != r &&
                    (this.getAppInfo(n, r),
                    this.GetList(this.state.aid, this.state.env),
                    this.getAppEnvZone(r));
                  var o = this.props.location.query;
                  ut['F'].push({ query: Object(s['a'])(Object(s['a'])({}, o), {}, { tab: i }) });
                },
              },
              {
                key: 'render',
                value: function () {
                  var e = null,
                    t = this.state,
                    n = t.aid,
                    l = t.appName,
                    s = t.env,
                    c = t.appEnvZone,
                    u = this.state.disable;
                  return (
                    void 0 != l && '' != l && (u = !1),
                    (e =
                      void 0 == n || isNaN(n) || 0 == n
                        ? m.a.createElement(
                            o['a'],
                            { span: 24, style: { marginTop: 20 } },
                            m.a.createElement(a['a'], {
                              style: { marginLeft: 10, marginRight: 20, marginBottom: 20 },
                              message: '\u4f18\u5148\u9009\u62e9\u5e94\u7528',
                              description: '',
                              type: 'info',
                            }),
                          )
                        : m.a.createElement(
                            d['a'],
                            {
                              defaultActiveKey: this.state.tab,
                              onChange: this.callback,
                              type: 'card',
                              style: { width: '100%', marginTop: '10px' },
                            },
                            m.a.createElement(
                              Zr,
                              { tab: '\u8be6\u60c5', key: 'detail' },
                              m.a.createElement(Yr, {
                                aid: n,
                                env: s,
                                appNodeList: this.state.appNodeList,
                                appEnvZone: c,
                              }),
                            ),
                            m.a.createElement(
                              Zr,
                              { tab: '\u914d\u7f6e', key: 'confgo' },
                              m.a.createElement(Xn, {
                                aid: n,
                                env: s,
                                appName: l,
                                appInfo: this.state.appInfo,
                                appIdcList: '',
                                zoneCode: this.state.zoneCode,
                                param: '',
                                idcList: this.state.idcList,
                                appEnvZone: this.state.appEnvZone,
                                zoneList: this.state.zoneList,
                              }),
                            ),
                            m.a.createElement(
                              Zr,
                              { tab: 'Pprof', key: 'pprof' },
                              m.a.createElement(sr, {
                                aid: n,
                                env: s,
                                appName: l,
                                appInfo: this.state.appInfo,
                                appNodeList: this.state.appNodeList,
                                appIdcList: '',
                                zoneCode: '',
                                param: '',
                                appEnvZone: c,
                                idcList: this.state.idcList,
                                zoneList: this.state.zoneList,
                              }),
                            ),
                          )),
                    m.a.createElement(
                      cr['PageHeaderWrapper'],
                      null,
                      m.a.createElement(
                        r['a'],
                        null,
                        m.a.createElement(
                          i['a'],
                          null,
                          m.a.createElement(Hr, {
                            appInfo: this.state.appInfo,
                            appIdcList: this.state.appIdcList,
                            appList: this.state.appList,
                            appName: this.state.appName,
                            getAppInfoAction: this.getAppInfo,
                            setEnvAction: this.setEnv,
                            env: s,
                            zone_code: '',
                            idcList: this.state.idcList,
                            initDisable: u,
                          }),
                        ),
                        m.a.createElement(
                          i['a'],
                          { style: { marginTop: '10px', marginLeft: '6px' } },
                          m.a.createElement(
                            o['a'],
                            { span: 12 },
                            m.a.createElement(nr, {
                              appEnvZone: c,
                              env: s,
                              onChange: this.changeZone,
                              defalutZone: this.state.zoneCode,
                            }),
                          ),
                        ),
                        m.a.createElement(i['a'], null, e),
                      ),
                    )
                  );
                },
              },
            ]),
            n
          );
        })(m.a.Component);
    },
    Ruv9: function (e, t, n) {
      var r = n('PKsF');
      (r.Template = n('cK6b').Template), (r.template = r.Template), (e.exports = r);
    },
    'U+PY': function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = {
          icon: {
            tag: 'svg',
            attrs: { viewBox: '64 64 896 896', focusable: 'false' },
            children: [
              {
                tag: 'path',
                attrs: {
                  d:
                    'M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 208H676V232h212v136zm0 224H676V432h212v160zM412 432h200v160H412V432zm200-64H412V232h200v136zm-476 64h212v160H136V432zm0-200h212v136H136V232zm0 424h212v136H136V656zm276 0h200v136H412V656zm476 136H676V656h212v136z',
                },
              },
            ],
          },
          name: 'table',
          theme: 'outlined',
        },
        o = i,
        a = n('6VBw'),
        l = function (e, t) {
          return r['createElement'](a['a'], Object.assign({}, e, { ref: t, icon: o }));
        };
      l.displayName = 'TableOutlined';
      t['a'] = r['forwardRef'](l);
    },
    UADf: function (e, t, n) {},
    Ue1A: function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = {
          icon: {
            tag: 'svg',
            attrs: { viewBox: '64 64 896 896', focusable: 'false' },
            children: [
              {
                tag: 'path',
                attrs: {
                  d:
                    'M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z',
                },
              },
              {
                tag: 'path',
                attrs: {
                  d:
                    'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z',
                },
              },
            ],
          },
          name: 'check-circle',
          theme: 'outlined',
        },
        o = i,
        a = n('6VBw'),
        l = function (e, t) {
          return r['createElement'](a['a'], Object.assign({}, e, { ref: t, icon: o }));
        };
      l.displayName = 'CheckCircleOutlined';
      t['a'] = r['forwardRef'](l);
    },
    'VrN/': function (e, t, n) {
      (function (t, n) {
        e.exports = n();
      })(0, function () {
        'use strict';
        var e = navigator.userAgent,
          t = navigator.platform,
          n = /gecko\/\d/i.test(e),
          r = /MSIE \d/.test(e),
          i = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(e),
          o = /Edge\/(\d+)/.exec(e),
          a = r || i || o,
          l = a && (r ? document.documentMode || 6 : +(o || i)[1]),
          s = !o && /WebKit\//.test(e),
          c = s && /Qt\/\d+\.\d+/.test(e),
          u = !o && /Chrome\//.test(e),
          f = /Opera\//.test(e),
          p = /Apple Computer/.test(navigator.vendor),
          d = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(e),
          h = /PhantomJS/.test(e),
          m = !o && /AppleWebKit/.test(e) && /Mobile\/\w+/.test(e),
          g = /Android/.test(e),
          v = m || g || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(e),
          y = m || /Mac/.test(t),
          b = /\bCrOS\b/.test(e),
          w = /win/i.test(t),
          x = f && e.match(/Version\/(\d*\.\d*)/);
        x && (x = Number(x[1])), x && x >= 15 && ((f = !1), (s = !0));
        var C = y && (c || (f && (null == x || x < 12.11))),
          S = n || (a && l >= 9);
        function k(e) {
          return new RegExp('(^|\\s)' + e + '(?:$|\\s)\\s*');
        }
        var E,
          O = function (e, t) {
            var n = e.className,
              r = k(t).exec(n);
            if (r) {
              var i = n.slice(r.index + r[0].length);
              e.className = n.slice(0, r.index) + (i ? r[1] + i : '');
            }
          };
        function L(e) {
          for (var t = e.childNodes.length; t > 0; --t) e.removeChild(e.firstChild);
          return e;
        }
        function T(e, t) {
          return L(e).appendChild(t);
        }
        function N(e, t, n, r) {
          var i = document.createElement(e);
          if ((n && (i.className = n), r && (i.style.cssText = r), 'string' == typeof t))
            i.appendChild(document.createTextNode(t));
          else if (t) for (var o = 0; o < t.length; ++o) i.appendChild(t[o]);
          return i;
        }
        function M(e, t, n, r) {
          var i = N(e, t, n, r);
          return i.setAttribute('role', 'presentation'), i;
        }
        function A(e, t) {
          if ((3 == t.nodeType && (t = t.parentNode), e.contains)) return e.contains(t);
          do {
            if ((11 == t.nodeType && (t = t.host), t == e)) return !0;
          } while ((t = t.parentNode));
        }
        function j() {
          var e;
          try {
            e = document.activeElement;
          } catch (t) {
            e = document.body || null;
          }
          while (e && e.shadowRoot && e.shadowRoot.activeElement) e = e.shadowRoot.activeElement;
          return e;
        }
        function P(e, t) {
          var n = e.className;
          k(t).test(n) || (e.className += (n ? ' ' : '') + t);
        }
        function I(e, t) {
          for (var n = e.split(' '), r = 0; r < n.length; r++)
            n[r] && !k(n[r]).test(t) && (t += ' ' + n[r]);
          return t;
        }
        E = document.createRange
          ? function (e, t, n, r) {
              var i = document.createRange();
              return i.setEnd(r || e, n), i.setStart(e, t), i;
            }
          : function (e, t, n) {
              var r = document.body.createTextRange();
              try {
                r.moveToElementText(e.parentNode);
              } catch (i) {
                return r;
              }
              return r.collapse(!0), r.moveEnd('character', n), r.moveStart('character', t), r;
            };
        var D = function (e) {
          e.select();
        };
        function _(e) {
          var t = Array.prototype.slice.call(arguments, 1);
          return function () {
            return e.apply(null, t);
          };
        }
        function z(e, t, n) {
          for (var r in (t || (t = {}), e))
            !e.hasOwnProperty(r) || (!1 === n && t.hasOwnProperty(r)) || (t[r] = e[r]);
          return t;
        }
        function R(e, t, n, r, i) {
          null == t && ((t = e.search(/[^\s\u00a0]/)), -1 == t && (t = e.length));
          for (var o = r || 0, a = i || 0; ; ) {
            var l = e.indexOf('\t', o);
            if (l < 0 || l >= t) return a + (t - o);
            (a += l - o), (a += n - (a % n)), (o = l + 1);
          }
        }
        m
          ? (D = function (e) {
              (e.selectionStart = 0), (e.selectionEnd = e.value.length);
            })
          : a &&
            (D = function (e) {
              try {
                e.select();
              } catch (t) {}
            });
        var F = function () {
          (this.id = null),
            (this.f = null),
            (this.time = 0),
            (this.handler = _(this.onTimeout, this));
        };
        function H(e, t) {
          for (var n = 0; n < e.length; ++n) if (e[n] == t) return n;
          return -1;
        }
        (F.prototype.onTimeout = function (e) {
          (e.id = 0), e.time <= +new Date() ? e.f() : setTimeout(e.handler, e.time - +new Date());
        }),
          (F.prototype.set = function (e, t) {
            this.f = t;
            var n = +new Date() + e;
            (!this.id || n < this.time) &&
              (clearTimeout(this.id), (this.id = setTimeout(this.handler, e)), (this.time = n));
          });
        var W = 50,
          B = {
            toString: function () {
              return 'CodeMirror.Pass';
            },
          },
          V = { scroll: !1 },
          U = { origin: '*mouse' },
          K = { origin: '+move' };
        function q(e, t, n) {
          for (var r = 0, i = 0; ; ) {
            var o = e.indexOf('\t', r);
            -1 == o && (o = e.length);
            var a = o - r;
            if (o == e.length || i + a >= t) return r + Math.min(a, t - i);
            if (((i += o - r), (i += n - (i % n)), (r = o + 1), i >= t)) return r;
          }
        }
        var G = [''];
        function Y(e) {
          while (G.length <= e) G.push(Z(G) + ' ');
          return G[e];
        }
        function Z(e) {
          return e[e.length - 1];
        }
        function $(e, t) {
          for (var n = [], r = 0; r < e.length; r++) n[r] = t(e[r], r);
          return n;
        }
        function X(e, t, n) {
          var r = 0,
            i = n(t);
          while (r < e.length && n(e[r]) <= i) r++;
          e.splice(r, 0, t);
        }
        function J() {}
        function Q(e, t) {
          var n;
          return (
            Object.create ? (n = Object.create(e)) : ((J.prototype = e), (n = new J())),
            t && z(t, n),
            n
          );
        }
        var ee = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
        function te(e) {
          return /\w/.test(e) || (e > '\x80' && (e.toUpperCase() != e.toLowerCase() || ee.test(e)));
        }
        function ne(e, t) {
          return t ? !!(t.source.indexOf('\\w') > -1 && te(e)) || t.test(e) : te(e);
        }
        function re(e) {
          for (var t in e) if (e.hasOwnProperty(t) && e[t]) return !1;
          return !0;
        }
        var ie = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
        function oe(e) {
          return e.charCodeAt(0) >= 768 && ie.test(e);
        }
        function ae(e, t, n) {
          while ((n < 0 ? t > 0 : t < e.length) && oe(e.charAt(t))) t += n;
          return t;
        }
        function le(e, t, n) {
          for (var r = t > n ? -1 : 1; ; ) {
            if (t == n) return t;
            var i = (t + n) / 2,
              o = r < 0 ? Math.ceil(i) : Math.floor(i);
            if (o == t) return e(o) ? t : n;
            e(o) ? (n = o) : (t = o + r);
          }
        }
        function se(e, t, n, r) {
          if (!e) return r(t, n, 'ltr', 0);
          for (var i = !1, o = 0; o < e.length; ++o) {
            var a = e[o];
            ((a.from < n && a.to > t) || (t == n && a.to == t)) &&
              (r(Math.max(a.from, t), Math.min(a.to, n), 1 == a.level ? 'rtl' : 'ltr', o),
              (i = !0));
          }
          i || r(t, n, 'ltr');
        }
        var ce = null;
        function ue(e, t, n) {
          var r;
          ce = null;
          for (var i = 0; i < e.length; ++i) {
            var o = e[i];
            if (o.from < t && o.to > t) return i;
            o.to == t && (o.from != o.to && 'before' == n ? (r = i) : (ce = i)),
              o.from == t && (o.from != o.to && 'before' != n ? (r = i) : (ce = i));
          }
          return null != r ? r : ce;
        }
        var fe = (function () {
          var e =
              'bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN',
            t =
              'nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111';
          function n(n) {
            return n <= 247
              ? e.charAt(n)
              : 1424 <= n && n <= 1524
              ? 'R'
              : 1536 <= n && n <= 1785
              ? t.charAt(n - 1536)
              : 1774 <= n && n <= 2220
              ? 'r'
              : 8192 <= n && n <= 8203
              ? 'w'
              : 8204 == n
              ? 'b'
              : 'L';
          }
          var r = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,
            i = /[stwN]/,
            o = /[LRr]/,
            a = /[Lb1n]/,
            l = /[1n]/;
          function s(e, t, n) {
            (this.level = e), (this.from = t), (this.to = n);
          }
          return function (e, t) {
            var c = 'ltr' == t ? 'L' : 'R';
            if (0 == e.length || ('ltr' == t && !r.test(e))) return !1;
            for (var u = e.length, f = [], p = 0; p < u; ++p) f.push(n(e.charCodeAt(p)));
            for (var d = 0, h = c; d < u; ++d) {
              var m = f[d];
              'm' == m ? (f[d] = h) : (h = m);
            }
            for (var g = 0, v = c; g < u; ++g) {
              var y = f[g];
              '1' == y && 'r' == v
                ? (f[g] = 'n')
                : o.test(y) && ((v = y), 'r' == y && (f[g] = 'R'));
            }
            for (var b = 1, w = f[0]; b < u - 1; ++b) {
              var x = f[b];
              '+' == x && '1' == w && '1' == f[b + 1]
                ? (f[b] = '1')
                : ',' != x || w != f[b + 1] || ('1' != w && 'n' != w) || (f[b] = w),
                (w = x);
            }
            for (var C = 0; C < u; ++C) {
              var S = f[C];
              if (',' == S) f[C] = 'N';
              else if ('%' == S) {
                var k = void 0;
                for (k = C + 1; k < u && '%' == f[k]; ++k);
                for (
                  var E = (C && '!' == f[C - 1]) || (k < u && '1' == f[k]) ? '1' : 'N', O = C;
                  O < k;
                  ++O
                )
                  f[O] = E;
                C = k - 1;
              }
            }
            for (var L = 0, T = c; L < u; ++L) {
              var N = f[L];
              'L' == T && '1' == N ? (f[L] = 'L') : o.test(N) && (T = N);
            }
            for (var M = 0; M < u; ++M)
              if (i.test(f[M])) {
                var A = void 0;
                for (A = M + 1; A < u && i.test(f[A]); ++A);
                for (
                  var j = 'L' == (M ? f[M - 1] : c),
                    P = 'L' == (A < u ? f[A] : c),
                    I = j == P ? (j ? 'L' : 'R') : c,
                    D = M;
                  D < A;
                  ++D
                )
                  f[D] = I;
                M = A - 1;
              }
            for (var _, z = [], R = 0; R < u; )
              if (a.test(f[R])) {
                var F = R;
                for (++R; R < u && a.test(f[R]); ++R);
                z.push(new s(0, F, R));
              } else {
                var H = R,
                  W = z.length,
                  B = 'rtl' == t ? 1 : 0;
                for (++R; R < u && 'L' != f[R]; ++R);
                for (var V = H; V < R; )
                  if (l.test(f[V])) {
                    H < V && (z.splice(W, 0, new s(1, H, V)), (W += B));
                    var U = V;
                    for (++V; V < R && l.test(f[V]); ++V);
                    z.splice(W, 0, new s(2, U, V)), (W += B), (H = V);
                  } else ++V;
                H < R && z.splice(W, 0, new s(1, H, R));
              }
            return (
              'ltr' == t &&
                (1 == z[0].level &&
                  (_ = e.match(/^\s+/)) &&
                  ((z[0].from = _[0].length), z.unshift(new s(0, 0, _[0].length))),
                1 == Z(z).level &&
                  (_ = e.match(/\s+$/)) &&
                  ((Z(z).to -= _[0].length), z.push(new s(0, u - _[0].length, u)))),
              'rtl' == t ? z.reverse() : z
            );
          };
        })();
        function pe(e, t) {
          var n = e.order;
          return null == n && (n = e.order = fe(e.text, t)), n;
        }
        var de = [],
          he = function (e, t, n) {
            if (e.addEventListener) e.addEventListener(t, n, !1);
            else if (e.attachEvent) e.attachEvent('on' + t, n);
            else {
              var r = e._handlers || (e._handlers = {});
              r[t] = (r[t] || de).concat(n);
            }
          };
        function me(e, t) {
          return (e._handlers && e._handlers[t]) || de;
        }
        function ge(e, t, n) {
          if (e.removeEventListener) e.removeEventListener(t, n, !1);
          else if (e.detachEvent) e.detachEvent('on' + t, n);
          else {
            var r = e._handlers,
              i = r && r[t];
            if (i) {
              var o = H(i, n);
              o > -1 && (r[t] = i.slice(0, o).concat(i.slice(o + 1)));
            }
          }
        }
        function ve(e, t) {
          var n = me(e, t);
          if (n.length)
            for (var r = Array.prototype.slice.call(arguments, 2), i = 0; i < n.length; ++i)
              n[i].apply(null, r);
        }
        function ye(e, t, n) {
          return (
            'string' == typeof t &&
              (t = {
                type: t,
                preventDefault: function () {
                  this.defaultPrevented = !0;
                },
              }),
            ve(e, n || t.type, e, t),
            ke(t) || t.codemirrorIgnore
          );
        }
        function be(e) {
          var t = e._handlers && e._handlers.cursorActivity;
          if (t)
            for (
              var n = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []),
                r = 0;
              r < t.length;
              ++r
            )
              -1 == H(n, t[r]) && n.push(t[r]);
        }
        function we(e, t) {
          return me(e, t).length > 0;
        }
        function xe(e) {
          (e.prototype.on = function (e, t) {
            he(this, e, t);
          }),
            (e.prototype.off = function (e, t) {
              ge(this, e, t);
            });
        }
        function Ce(e) {
          e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
        }
        function Se(e) {
          e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = !0);
        }
        function ke(e) {
          return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue;
        }
        function Ee(e) {
          Ce(e), Se(e);
        }
        function Oe(e) {
          return e.target || e.srcElement;
        }
        function Le(e) {
          var t = e.which;
          return (
            null == t &&
              (1 & e.button ? (t = 1) : 2 & e.button ? (t = 3) : 4 & e.button && (t = 2)),
            y && e.ctrlKey && 1 == t && (t = 3),
            t
          );
        }
        var Te,
          Ne,
          Me = (function () {
            if (a && l < 9) return !1;
            var e = N('div');
            return 'draggable' in e || 'dragDrop' in e;
          })();
        function Ae(e) {
          if (null == Te) {
            var t = N('span', '\u200b');
            T(e, N('span', [t, document.createTextNode('x')])),
              0 != e.firstChild.offsetHeight &&
                (Te = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(a && l < 8));
          }
          var n = Te
            ? N('span', '\u200b')
            : N('span', '\xa0', null, 'display: inline-block; width: 1px; margin-right: -1px');
          return n.setAttribute('cm-text', ''), n;
        }
        function je(e) {
          if (null != Ne) return Ne;
          var t = T(e, document.createTextNode('A\u062eA')),
            n = E(t, 0, 1).getBoundingClientRect(),
            r = E(t, 1, 2).getBoundingClientRect();
          return L(e), !(!n || n.left == n.right) && (Ne = r.right - n.right < 3);
        }
        var Pe =
            3 != '\n\nb'.split(/\n/).length
              ? function (e) {
                  var t = 0,
                    n = [],
                    r = e.length;
                  while (t <= r) {
                    var i = e.indexOf('\n', t);
                    -1 == i && (i = e.length);
                    var o = e.slice(t, '\r' == e.charAt(i - 1) ? i - 1 : i),
                      a = o.indexOf('\r');
                    -1 != a ? (n.push(o.slice(0, a)), (t += a + 1)) : (n.push(o), (t = i + 1));
                  }
                  return n;
                }
              : function (e) {
                  return e.split(/\r\n?|\n/);
                },
          Ie = window.getSelection
            ? function (e) {
                try {
                  return e.selectionStart != e.selectionEnd;
                } catch (t) {
                  return !1;
                }
              }
            : function (e) {
                var t;
                try {
                  t = e.ownerDocument.selection.createRange();
                } catch (n) {}
                return !(!t || t.parentElement() != e) && 0 != t.compareEndPoints('StartToEnd', t);
              },
          De = (function () {
            var e = N('div');
            return (
              'oncopy' in e || (e.setAttribute('oncopy', 'return;'), 'function' == typeof e.oncopy)
            );
          })(),
          _e = null;
        function ze(e) {
          if (null != _e) return _e;
          var t = T(e, N('span', 'x')),
            n = t.getBoundingClientRect(),
            r = E(t, 0, 1).getBoundingClientRect();
          return (_e = Math.abs(n.left - r.left) > 1);
        }
        var Re = {},
          Fe = {};
        function He(e, t) {
          arguments.length > 2 && (t.dependencies = Array.prototype.slice.call(arguments, 2)),
            (Re[e] = t);
        }
        function We(e, t) {
          Fe[e] = t;
        }
        function Be(e) {
          if ('string' == typeof e && Fe.hasOwnProperty(e)) e = Fe[e];
          else if (e && 'string' == typeof e.name && Fe.hasOwnProperty(e.name)) {
            var t = Fe[e.name];
            'string' == typeof t && (t = { name: t }), (e = Q(t, e)), (e.name = t.name);
          } else {
            if ('string' == typeof e && /^[\w\-]+\/[\w\-]+\+xml$/.test(e))
              return Be('application/xml');
            if ('string' == typeof e && /^[\w\-]+\/[\w\-]+\+json$/.test(e))
              return Be('application/json');
          }
          return 'string' == typeof e ? { name: e } : e || { name: 'null' };
        }
        function Ve(e, t) {
          t = Be(t);
          var n = Re[t.name];
          if (!n) return Ve(e, 'text/plain');
          var r = n(e, t);
          if (Ue.hasOwnProperty(t.name)) {
            var i = Ue[t.name];
            for (var o in i)
              i.hasOwnProperty(o) && (r.hasOwnProperty(o) && (r['_' + o] = r[o]), (r[o] = i[o]));
          }
          if (((r.name = t.name), t.helperType && (r.helperType = t.helperType), t.modeProps))
            for (var a in t.modeProps) r[a] = t.modeProps[a];
          return r;
        }
        var Ue = {};
        function Ke(e, t) {
          var n = Ue.hasOwnProperty(e) ? Ue[e] : (Ue[e] = {});
          z(t, n);
        }
        function qe(e, t) {
          if (!0 === t) return t;
          if (e.copyState) return e.copyState(t);
          var n = {};
          for (var r in t) {
            var i = t[r];
            i instanceof Array && (i = i.concat([])), (n[r] = i);
          }
          return n;
        }
        function Ge(e, t) {
          var n;
          while (e.innerMode) {
            if (((n = e.innerMode(t)), !n || n.mode == e)) break;
            (t = n.state), (e = n.mode);
          }
          return n || { mode: e, state: t };
        }
        function Ye(e, t, n) {
          return !e.startState || e.startState(t, n);
        }
        var Ze = function (e, t, n) {
          (this.pos = this.start = 0),
            (this.string = e),
            (this.tabSize = t || 8),
            (this.lastColumnPos = this.lastColumnValue = 0),
            (this.lineStart = 0),
            (this.lineOracle = n);
        };
        function $e(e, t) {
          if (((t -= e.first), t < 0 || t >= e.size))
            throw new Error('There is no line ' + (t + e.first) + ' in the document.');
          var n = e;
          while (!n.lines)
            for (var r = 0; ; ++r) {
              var i = n.children[r],
                o = i.chunkSize();
              if (t < o) {
                n = i;
                break;
              }
              t -= o;
            }
          return n.lines[t];
        }
        function Xe(e, t, n) {
          var r = [],
            i = t.line;
          return (
            e.iter(t.line, n.line + 1, function (e) {
              var o = e.text;
              i == n.line && (o = o.slice(0, n.ch)),
                i == t.line && (o = o.slice(t.ch)),
                r.push(o),
                ++i;
            }),
            r
          );
        }
        function Je(e, t, n) {
          var r = [];
          return (
            e.iter(t, n, function (e) {
              r.push(e.text);
            }),
            r
          );
        }
        function Qe(e, t) {
          var n = t - e.height;
          if (n) for (var r = e; r; r = r.parent) r.height += n;
        }
        function et(e) {
          if (null == e.parent) return null;
          for (var t = e.parent, n = H(t.lines, e), r = t.parent; r; t = r, r = r.parent)
            for (var i = 0; ; ++i) {
              if (r.children[i] == t) break;
              n += r.children[i].chunkSize();
            }
          return n + t.first;
        }
        function tt(e, t) {
          var n = e.first;
          e: do {
            for (var r = 0; r < e.children.length; ++r) {
              var i = e.children[r],
                o = i.height;
              if (t < o) {
                e = i;
                continue e;
              }
              (t -= o), (n += i.chunkSize());
            }
            return n;
          } while (!e.lines);
          for (var a = 0; a < e.lines.length; ++a) {
            var l = e.lines[a],
              s = l.height;
            if (t < s) break;
            t -= s;
          }
          return n + a;
        }
        function nt(e, t) {
          return t >= e.first && t < e.first + e.size;
        }
        function rt(e, t) {
          return String(e.lineNumberFormatter(t + e.firstLineNumber));
        }
        function it(e, t, n) {
          if ((void 0 === n && (n = null), !(this instanceof it))) return new it(e, t, n);
          (this.line = e), (this.ch = t), (this.sticky = n);
        }
        function ot(e, t) {
          return e.line - t.line || e.ch - t.ch;
        }
        function at(e, t) {
          return e.sticky == t.sticky && 0 == ot(e, t);
        }
        function lt(e) {
          return it(e.line, e.ch);
        }
        function st(e, t) {
          return ot(e, t) < 0 ? t : e;
        }
        function ct(e, t) {
          return ot(e, t) < 0 ? e : t;
        }
        function ut(e, t) {
          return Math.max(e.first, Math.min(t, e.first + e.size - 1));
        }
        function ft(e, t) {
          if (t.line < e.first) return it(e.first, 0);
          var n = e.first + e.size - 1;
          return t.line > n ? it(n, $e(e, n).text.length) : pt(t, $e(e, t.line).text.length);
        }
        function pt(e, t) {
          var n = e.ch;
          return null == n || n > t ? it(e.line, t) : n < 0 ? it(e.line, 0) : e;
        }
        function dt(e, t) {
          for (var n = [], r = 0; r < t.length; r++) n[r] = ft(e, t[r]);
          return n;
        }
        (Ze.prototype.eol = function () {
          return this.pos >= this.string.length;
        }),
          (Ze.prototype.sol = function () {
            return this.pos == this.lineStart;
          }),
          (Ze.prototype.peek = function () {
            return this.string.charAt(this.pos) || void 0;
          }),
          (Ze.prototype.next = function () {
            if (this.pos < this.string.length) return this.string.charAt(this.pos++);
          }),
          (Ze.prototype.eat = function (e) {
            var t,
              n = this.string.charAt(this.pos);
            if (((t = 'string' == typeof e ? n == e : n && (e.test ? e.test(n) : e(n))), t))
              return ++this.pos, n;
          }),
          (Ze.prototype.eatWhile = function (e) {
            var t = this.pos;
            while (this.eat(e));
            return this.pos > t;
          }),
          (Ze.prototype.eatSpace = function () {
            var e = this.pos;
            while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
            return this.pos > e;
          }),
          (Ze.prototype.skipToEnd = function () {
            this.pos = this.string.length;
          }),
          (Ze.prototype.skipTo = function (e) {
            var t = this.string.indexOf(e, this.pos);
            if (t > -1) return (this.pos = t), !0;
          }),
          (Ze.prototype.backUp = function (e) {
            this.pos -= e;
          }),
          (Ze.prototype.column = function () {
            return (
              this.lastColumnPos < this.start &&
                ((this.lastColumnValue = R(
                  this.string,
                  this.start,
                  this.tabSize,
                  this.lastColumnPos,
                  this.lastColumnValue,
                )),
                (this.lastColumnPos = this.start)),
              this.lastColumnValue -
                (this.lineStart ? R(this.string, this.lineStart, this.tabSize) : 0)
            );
          }),
          (Ze.prototype.indentation = function () {
            return (
              R(this.string, null, this.tabSize) -
              (this.lineStart ? R(this.string, this.lineStart, this.tabSize) : 0)
            );
          }),
          (Ze.prototype.match = function (e, t, n) {
            if ('string' != typeof e) {
              var r = this.string.slice(this.pos).match(e);
              return r && r.index > 0 ? null : (r && !1 !== t && (this.pos += r[0].length), r);
            }
            var i = function (e) {
                return n ? e.toLowerCase() : e;
              },
              o = this.string.substr(this.pos, e.length);
            if (i(o) == i(e)) return !1 !== t && (this.pos += e.length), !0;
          }),
          (Ze.prototype.current = function () {
            return this.string.slice(this.start, this.pos);
          }),
          (Ze.prototype.hideFirstChars = function (e, t) {
            this.lineStart += e;
            try {
              return t();
            } finally {
              this.lineStart -= e;
            }
          }),
          (Ze.prototype.lookAhead = function (e) {
            var t = this.lineOracle;
            return t && t.lookAhead(e);
          }),
          (Ze.prototype.baseToken = function () {
            var e = this.lineOracle;
            return e && e.baseToken(this.pos);
          });
        var ht = function (e, t) {
            (this.state = e), (this.lookAhead = t);
          },
          mt = function (e, t, n, r) {
            (this.state = t),
              (this.doc = e),
              (this.line = n),
              (this.maxLookAhead = r || 0),
              (this.baseTokens = null),
              (this.baseTokenPos = 1);
          };
        function gt(e, t, n, r) {
          var i = [e.state.modeGen],
            o = {};
          Et(
            e,
            t.text,
            e.doc.mode,
            n,
            function (e, t) {
              return i.push(e, t);
            },
            o,
            r,
          );
          for (
            var a = n.state,
              l = function (r) {
                n.baseTokens = i;
                var l = e.state.overlays[r],
                  s = 1,
                  c = 0;
                (n.state = !0),
                  Et(
                    e,
                    t.text,
                    l.mode,
                    n,
                    function (e, t) {
                      var n = s;
                      while (c < e) {
                        var r = i[s];
                        r > e && i.splice(s, 1, e, i[s + 1], r), (s += 2), (c = Math.min(e, r));
                      }
                      if (t)
                        if (l.opaque) i.splice(n, s - n, e, 'overlay ' + t), (s = n + 2);
                        else
                          for (; n < s; n += 2) {
                            var o = i[n + 1];
                            i[n + 1] = (o ? o + ' ' : '') + 'overlay ' + t;
                          }
                    },
                    o,
                  ),
                  (n.state = a),
                  (n.baseTokens = null),
                  (n.baseTokenPos = 1);
              },
              s = 0;
            s < e.state.overlays.length;
            ++s
          )
            l(s);
          return { styles: i, classes: o.bgClass || o.textClass ? o : null };
        }
        function vt(e, t, n) {
          if (!t.styles || t.styles[0] != e.state.modeGen) {
            var r = yt(e, et(t)),
              i = t.text.length > e.options.maxHighlightLength && qe(e.doc.mode, r.state),
              o = gt(e, t, r);
            i && (r.state = i),
              (t.stateAfter = r.save(!i)),
              (t.styles = o.styles),
              o.classes ? (t.styleClasses = o.classes) : t.styleClasses && (t.styleClasses = null),
              n === e.doc.highlightFrontier &&
                (e.doc.modeFrontier = Math.max(e.doc.modeFrontier, ++e.doc.highlightFrontier));
          }
          return t.styles;
        }
        function yt(e, t, n) {
          var r = e.doc,
            i = e.display;
          if (!r.mode.startState) return new mt(r, !0, t);
          var o = Ot(e, t, n),
            a = o > r.first && $e(r, o - 1).stateAfter,
            l = a ? mt.fromSaved(r, a, o) : new mt(r, Ye(r.mode), o);
          return (
            r.iter(o, t, function (n) {
              bt(e, n.text, l);
              var r = l.line;
              (n.stateAfter =
                r == t - 1 || r % 5 == 0 || (r >= i.viewFrom && r < i.viewTo) ? l.save() : null),
                l.nextLine();
            }),
            n && (r.modeFrontier = l.line),
            l
          );
        }
        function bt(e, t, n, r) {
          var i = e.doc.mode,
            o = new Ze(t, e.options.tabSize, n);
          (o.start = o.pos = r || 0), '' == t && wt(i, n.state);
          while (!o.eol()) xt(i, o, n.state), (o.start = o.pos);
        }
        function wt(e, t) {
          if (e.blankLine) return e.blankLine(t);
          if (e.innerMode) {
            var n = Ge(e, t);
            return n.mode.blankLine ? n.mode.blankLine(n.state) : void 0;
          }
        }
        function xt(e, t, n, r) {
          for (var i = 0; i < 10; i++) {
            r && (r[0] = Ge(e, n).mode);
            var o = e.token(t, n);
            if (t.pos > t.start) return o;
          }
          throw new Error('Mode ' + e.name + ' failed to advance stream.');
        }
        (mt.prototype.lookAhead = function (e) {
          var t = this.doc.getLine(this.line + e);
          return null != t && e > this.maxLookAhead && (this.maxLookAhead = e), t;
        }),
          (mt.prototype.baseToken = function (e) {
            if (!this.baseTokens) return null;
            while (this.baseTokens[this.baseTokenPos] <= e) this.baseTokenPos += 2;
            var t = this.baseTokens[this.baseTokenPos + 1];
            return {
              type: t && t.replace(/( |^)overlay .*/, ''),
              size: this.baseTokens[this.baseTokenPos] - e,
            };
          }),
          (mt.prototype.nextLine = function () {
            this.line++, this.maxLookAhead > 0 && this.maxLookAhead--;
          }),
          (mt.fromSaved = function (e, t, n) {
            return t instanceof ht
              ? new mt(e, qe(e.mode, t.state), n, t.lookAhead)
              : new mt(e, qe(e.mode, t), n);
          }),
          (mt.prototype.save = function (e) {
            var t = !1 !== e ? qe(this.doc.mode, this.state) : this.state;
            return this.maxLookAhead > 0 ? new ht(t, this.maxLookAhead) : t;
          });
        var Ct = function (e, t, n) {
          (this.start = e.start),
            (this.end = e.pos),
            (this.string = e.current()),
            (this.type = t || null),
            (this.state = n);
        };
        function St(e, t, n, r) {
          var i,
            o = e.doc,
            a = o.mode;
          t = ft(o, t);
          var l,
            s = $e(o, t.line),
            c = yt(e, t.line, n),
            u = new Ze(s.text, e.options.tabSize, c);
          r && (l = []);
          while ((r || u.pos < t.ch) && !u.eol())
            (u.start = u.pos),
              (i = xt(a, u, c.state)),
              r && l.push(new Ct(u, i, qe(o.mode, c.state)));
          return r ? l : new Ct(u, i, c.state);
        }
        function kt(e, t) {
          if (e)
            for (;;) {
              var n = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
              if (!n) break;
              e = e.slice(0, n.index) + e.slice(n.index + n[0].length);
              var r = n[1] ? 'bgClass' : 'textClass';
              null == t[r]
                ? (t[r] = n[2])
                : new RegExp('(?:^|\\s)' + n[2] + '(?:$|\\s)').test(t[r]) || (t[r] += ' ' + n[2]);
            }
          return e;
        }
        function Et(e, t, n, r, i, o, a) {
          var l = n.flattenSpans;
          null == l && (l = e.options.flattenSpans);
          var s,
            c = 0,
            u = null,
            f = new Ze(t, e.options.tabSize, r),
            p = e.options.addModeClass && [null];
          '' == t && kt(wt(n, r.state), o);
          while (!f.eol()) {
            if (
              (f.pos > e.options.maxHighlightLength
                ? ((l = !1), a && bt(e, t, r, f.pos), (f.pos = t.length), (s = null))
                : (s = kt(xt(n, f, r.state, p), o)),
              p)
            ) {
              var d = p[0].name;
              d && (s = 'm-' + (s ? d + ' ' + s : d));
            }
            if (!l || u != s) {
              while (c < f.start) (c = Math.min(f.start, c + 5e3)), i(c, u);
              u = s;
            }
            f.start = f.pos;
          }
          while (c < f.pos) {
            var h = Math.min(f.pos, c + 5e3);
            i(h, u), (c = h);
          }
        }
        function Ot(e, t, n) {
          for (
            var r, i, o = e.doc, a = n ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), l = t;
            l > a;
            --l
          ) {
            if (l <= o.first) return o.first;
            var s = $e(o, l - 1),
              c = s.stateAfter;
            if (c && (!n || l + (c instanceof ht ? c.lookAhead : 0) <= o.modeFrontier)) return l;
            var u = R(s.text, null, e.options.tabSize);
            (null == i || r > u) && ((i = l - 1), (r = u));
          }
          return i;
        }
        function Lt(e, t) {
          if (((e.modeFrontier = Math.min(e.modeFrontier, t)), !(e.highlightFrontier < t - 10))) {
            for (var n = e.first, r = t - 1; r > n; r--) {
              var i = $e(e, r).stateAfter;
              if (i && (!(i instanceof ht) || r + i.lookAhead < t)) {
                n = r + 1;
                break;
              }
            }
            e.highlightFrontier = Math.min(e.highlightFrontier, n);
          }
        }
        var Tt = !1,
          Nt = !1;
        function Mt() {
          Tt = !0;
        }
        function At() {
          Nt = !0;
        }
        function jt(e, t, n) {
          (this.marker = e), (this.from = t), (this.to = n);
        }
        function Pt(e, t) {
          if (e)
            for (var n = 0; n < e.length; ++n) {
              var r = e[n];
              if (r.marker == t) return r;
            }
        }
        function It(e, t) {
          for (var n, r = 0; r < e.length; ++r) e[r] != t && (n || (n = [])).push(e[r]);
          return n;
        }
        function Dt(e, t) {
          (e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t]), t.marker.attachLine(e);
        }
        function _t(e, t, n) {
          var r;
          if (e)
            for (var i = 0; i < e.length; ++i) {
              var o = e[i],
                a = o.marker,
                l = null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t);
              if (l || (o.from == t && 'bookmark' == a.type && (!n || !o.marker.insertLeft))) {
                var s = null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t);
                (r || (r = [])).push(new jt(a, o.from, s ? null : o.to));
              }
            }
          return r;
        }
        function zt(e, t, n) {
          var r;
          if (e)
            for (var i = 0; i < e.length; ++i) {
              var o = e[i],
                a = o.marker,
                l = null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t);
              if (l || (o.from == t && 'bookmark' == a.type && (!n || o.marker.insertLeft))) {
                var s = null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t);
                (r || (r = [])).push(
                  new jt(a, s ? null : o.from - t, null == o.to ? null : o.to - t),
                );
              }
            }
          return r;
        }
        function Rt(e, t) {
          if (t.full) return null;
          var n = nt(e, t.from.line) && $e(e, t.from.line).markedSpans,
            r = nt(e, t.to.line) && $e(e, t.to.line).markedSpans;
          if (!n && !r) return null;
          var i = t.from.ch,
            o = t.to.ch,
            a = 0 == ot(t.from, t.to),
            l = _t(n, i, a),
            s = zt(r, o, a),
            c = 1 == t.text.length,
            u = Z(t.text).length + (c ? i : 0);
          if (l)
            for (var f = 0; f < l.length; ++f) {
              var p = l[f];
              if (null == p.to) {
                var d = Pt(s, p.marker);
                d ? c && (p.to = null == d.to ? null : d.to + u) : (p.to = i);
              }
            }
          if (s)
            for (var h = 0; h < s.length; ++h) {
              var m = s[h];
              if ((null != m.to && (m.to += u), null == m.from)) {
                var g = Pt(l, m.marker);
                g || ((m.from = u), c && (l || (l = [])).push(m));
              } else (m.from += u), c && (l || (l = [])).push(m);
            }
          l && (l = Ft(l)), s && s != l && (s = Ft(s));
          var v = [l];
          if (!c) {
            var y,
              b = t.text.length - 2;
            if (b > 0 && l)
              for (var w = 0; w < l.length; ++w)
                null == l[w].to && (y || (y = [])).push(new jt(l[w].marker, null, null));
            for (var x = 0; x < b; ++x) v.push(y);
            v.push(s);
          }
          return v;
        }
        function Ft(e) {
          for (var t = 0; t < e.length; ++t) {
            var n = e[t];
            null != n.from && n.from == n.to && !1 !== n.marker.clearWhenEmpty && e.splice(t--, 1);
          }
          return e.length ? e : null;
        }
        function Ht(e, t, n) {
          var r = null;
          if (
            (e.iter(t.line, n.line + 1, function (e) {
              if (e.markedSpans)
                for (var t = 0; t < e.markedSpans.length; ++t) {
                  var n = e.markedSpans[t].marker;
                  !n.readOnly || (r && -1 != H(r, n)) || (r || (r = [])).push(n);
                }
            }),
            !r)
          )
            return null;
          for (var i = [{ from: t, to: n }], o = 0; o < r.length; ++o)
            for (var a = r[o], l = a.find(0), s = 0; s < i.length; ++s) {
              var c = i[s];
              if (!(ot(c.to, l.from) < 0 || ot(c.from, l.to) > 0)) {
                var u = [s, 1],
                  f = ot(c.from, l.from),
                  p = ot(c.to, l.to);
                (f < 0 || (!a.inclusiveLeft && !f)) && u.push({ from: c.from, to: l.from }),
                  (p > 0 || (!a.inclusiveRight && !p)) && u.push({ from: l.to, to: c.to }),
                  i.splice.apply(i, u),
                  (s += u.length - 3);
              }
            }
          return i;
        }
        function Wt(e) {
          var t = e.markedSpans;
          if (t) {
            for (var n = 0; n < t.length; ++n) t[n].marker.detachLine(e);
            e.markedSpans = null;
          }
        }
        function Bt(e, t) {
          if (t) {
            for (var n = 0; n < t.length; ++n) t[n].marker.attachLine(e);
            e.markedSpans = t;
          }
        }
        function Vt(e) {
          return e.inclusiveLeft ? -1 : 0;
        }
        function Ut(e) {
          return e.inclusiveRight ? 1 : 0;
        }
        function Kt(e, t) {
          var n = e.lines.length - t.lines.length;
          if (0 != n) return n;
          var r = e.find(),
            i = t.find(),
            o = ot(r.from, i.from) || Vt(e) - Vt(t);
          if (o) return -o;
          var a = ot(r.to, i.to) || Ut(e) - Ut(t);
          return a || t.id - e.id;
        }
        function qt(e, t) {
          var n,
            r = Nt && e.markedSpans;
          if (r)
            for (var i = void 0, o = 0; o < r.length; ++o)
              (i = r[o]),
                i.marker.collapsed &&
                  null == (t ? i.from : i.to) &&
                  (!n || Kt(n, i.marker) < 0) &&
                  (n = i.marker);
          return n;
        }
        function Gt(e) {
          return qt(e, !0);
        }
        function Yt(e) {
          return qt(e, !1);
        }
        function Zt(e, t) {
          var n,
            r = Nt && e.markedSpans;
          if (r)
            for (var i = 0; i < r.length; ++i) {
              var o = r[i];
              o.marker.collapsed &&
                (null == o.from || o.from < t) &&
                (null == o.to || o.to > t) &&
                (!n || Kt(n, o.marker) < 0) &&
                (n = o.marker);
            }
          return n;
        }
        function $t(e, t, n, r, i) {
          var o = $e(e, t),
            a = Nt && o.markedSpans;
          if (a)
            for (var l = 0; l < a.length; ++l) {
              var s = a[l];
              if (s.marker.collapsed) {
                var c = s.marker.find(0),
                  u = ot(c.from, n) || Vt(s.marker) - Vt(i),
                  f = ot(c.to, r) || Ut(s.marker) - Ut(i);
                if (
                  !((u >= 0 && f <= 0) || (u <= 0 && f >= 0)) &&
                  ((u <= 0 &&
                    (s.marker.inclusiveRight && i.inclusiveLeft
                      ? ot(c.to, n) >= 0
                      : ot(c.to, n) > 0)) ||
                    (u >= 0 &&
                      (s.marker.inclusiveRight && i.inclusiveLeft
                        ? ot(c.from, r) <= 0
                        : ot(c.from, r) < 0)))
                )
                  return !0;
              }
            }
        }
        function Xt(e) {
          var t;
          while ((t = Gt(e))) e = t.find(-1, !0).line;
          return e;
        }
        function Jt(e) {
          var t;
          while ((t = Yt(e))) e = t.find(1, !0).line;
          return e;
        }
        function Qt(e) {
          var t, n;
          while ((t = Yt(e))) (e = t.find(1, !0).line), (n || (n = [])).push(e);
          return n;
        }
        function en(e, t) {
          var n = $e(e, t),
            r = Xt(n);
          return n == r ? t : et(r);
        }
        function tn(e, t) {
          if (t > e.lastLine()) return t;
          var n,
            r = $e(e, t);
          if (!nn(e, r)) return t;
          while ((n = Yt(r))) r = n.find(1, !0).line;
          return et(r) + 1;
        }
        function nn(e, t) {
          var n = Nt && t.markedSpans;
          if (n)
            for (var r = void 0, i = 0; i < n.length; ++i)
              if (((r = n[i]), r.marker.collapsed)) {
                if (null == r.from) return !0;
                if (!r.marker.widgetNode && 0 == r.from && r.marker.inclusiveLeft && rn(e, t, r))
                  return !0;
              }
        }
        function rn(e, t, n) {
          if (null == n.to) {
            var r = n.marker.find(1, !0);
            return rn(e, r.line, Pt(r.line.markedSpans, n.marker));
          }
          if (n.marker.inclusiveRight && n.to == t.text.length) return !0;
          for (var i = void 0, o = 0; o < t.markedSpans.length; ++o)
            if (
              ((i = t.markedSpans[o]),
              i.marker.collapsed &&
                !i.marker.widgetNode &&
                i.from == n.to &&
                (null == i.to || i.to != n.from) &&
                (i.marker.inclusiveLeft || n.marker.inclusiveRight) &&
                rn(e, t, i))
            )
              return !0;
        }
        function on(e) {
          e = Xt(e);
          for (var t = 0, n = e.parent, r = 0; r < n.lines.length; ++r) {
            var i = n.lines[r];
            if (i == e) break;
            t += i.height;
          }
          for (var o = n.parent; o; n = o, o = n.parent)
            for (var a = 0; a < o.children.length; ++a) {
              var l = o.children[a];
              if (l == n) break;
              t += l.height;
            }
          return t;
        }
        function an(e) {
          if (0 == e.height) return 0;
          var t,
            n = e.text.length,
            r = e;
          while ((t = Gt(r))) {
            var i = t.find(0, !0);
            (r = i.from.line), (n += i.from.ch - i.to.ch);
          }
          r = e;
          while ((t = Yt(r))) {
            var o = t.find(0, !0);
            (n -= r.text.length - o.from.ch), (r = o.to.line), (n += r.text.length - o.to.ch);
          }
          return n;
        }
        function ln(e) {
          var t = e.display,
            n = e.doc;
          (t.maxLine = $e(n, n.first)),
            (t.maxLineLength = an(t.maxLine)),
            (t.maxLineChanged = !0),
            n.iter(function (e) {
              var n = an(e);
              n > t.maxLineLength && ((t.maxLineLength = n), (t.maxLine = e));
            });
        }
        var sn = function (e, t, n) {
          (this.text = e), Bt(this, t), (this.height = n ? n(this) : 1);
        };
        function cn(e, t, n, r) {
          (e.text = t),
            e.stateAfter && (e.stateAfter = null),
            e.styles && (e.styles = null),
            null != e.order && (e.order = null),
            Wt(e),
            Bt(e, n);
          var i = r ? r(e) : 1;
          i != e.height && Qe(e, i);
        }
        function un(e) {
          (e.parent = null), Wt(e);
        }
        (sn.prototype.lineNo = function () {
          return et(this);
        }),
          xe(sn);
        var fn = {},
          pn = {};
        function dn(e, t) {
          if (!e || /^\s*$/.test(e)) return null;
          var n = t.addModeClass ? pn : fn;
          return n[e] || (n[e] = e.replace(/\S+/g, 'cm-$&'));
        }
        function hn(e, t) {
          var n = M('span', null, null, s ? 'padding-right: .1px' : null),
            r = {
              pre: M('pre', [n], 'CodeMirror-line'),
              content: n,
              col: 0,
              pos: 0,
              cm: e,
              trailingSpace: !1,
              splitSpaces: e.getOption('lineWrapping'),
            };
          t.measure = {};
          for (var i = 0; i <= (t.rest ? t.rest.length : 0); i++) {
            var o = i ? t.rest[i - 1] : t.line,
              a = void 0;
            (r.pos = 0),
              (r.addToken = gn),
              je(e.display.measure) &&
                (a = pe(o, e.doc.direction)) &&
                (r.addToken = yn(r.addToken, a)),
              (r.map = []);
            var l = t != e.display.externalMeasured && et(o);
            wn(o, r, vt(e, o, l)),
              o.styleClasses &&
                (o.styleClasses.bgClass && (r.bgClass = I(o.styleClasses.bgClass, r.bgClass || '')),
                o.styleClasses.textClass &&
                  (r.textClass = I(o.styleClasses.textClass, r.textClass || ''))),
              0 == r.map.length && r.map.push(0, 0, r.content.appendChild(Ae(e.display.measure))),
              0 == i
                ? ((t.measure.map = r.map), (t.measure.cache = {}))
                : ((t.measure.maps || (t.measure.maps = [])).push(r.map),
                  (t.measure.caches || (t.measure.caches = [])).push({}));
          }
          if (s) {
            var c = r.content.lastChild;
            (/\bcm-tab\b/.test(c.className) || (c.querySelector && c.querySelector('.cm-tab'))) &&
              (r.content.className = 'cm-tab-wrap-hack');
          }
          return (
            ve(e, 'renderLine', e, t.line, r.pre),
            r.pre.className && (r.textClass = I(r.pre.className, r.textClass || '')),
            r
          );
        }
        function mn(e) {
          var t = N('span', '\u2022', 'cm-invalidchar');
          return (
            (t.title = '\\u' + e.charCodeAt(0).toString(16)),
            t.setAttribute('aria-label', t.title),
            t
          );
        }
        function gn(e, t, n, r, i, o, s) {
          if (t) {
            var c,
              u = e.splitSpaces ? vn(t, e.trailingSpace) : t,
              f = e.cm.state.specialChars,
              p = !1;
            if (f.test(t)) {
              c = document.createDocumentFragment();
              var d = 0;
              while (1) {
                f.lastIndex = d;
                var h = f.exec(t),
                  m = h ? h.index - d : t.length - d;
                if (m) {
                  var g = document.createTextNode(u.slice(d, d + m));
                  a && l < 9 ? c.appendChild(N('span', [g])) : c.appendChild(g),
                    e.map.push(e.pos, e.pos + m, g),
                    (e.col += m),
                    (e.pos += m);
                }
                if (!h) break;
                d += m + 1;
                var v = void 0;
                if ('\t' == h[0]) {
                  var y = e.cm.options.tabSize,
                    b = y - (e.col % y);
                  (v = c.appendChild(N('span', Y(b), 'cm-tab'))),
                    v.setAttribute('role', 'presentation'),
                    v.setAttribute('cm-text', '\t'),
                    (e.col += b);
                } else
                  '\r' == h[0] || '\n' == h[0]
                    ? ((v = c.appendChild(
                        N('span', '\r' == h[0] ? '\u240d' : '\u2424', 'cm-invalidchar'),
                      )),
                      v.setAttribute('cm-text', h[0]),
                      (e.col += 1))
                    : ((v = e.cm.options.specialCharPlaceholder(h[0])),
                      v.setAttribute('cm-text', h[0]),
                      a && l < 9 ? c.appendChild(N('span', [v])) : c.appendChild(v),
                      (e.col += 1));
                e.map.push(e.pos, e.pos + 1, v), e.pos++;
              }
            } else
              (e.col += t.length),
                (c = document.createTextNode(u)),
                e.map.push(e.pos, e.pos + t.length, c),
                a && l < 9 && (p = !0),
                (e.pos += t.length);
            if (((e.trailingSpace = 32 == u.charCodeAt(t.length - 1)), n || r || i || p || o)) {
              var w = n || '';
              r && (w += r), i && (w += i);
              var x = N('span', [c], w, o);
              if (s)
                for (var C in s)
                  s.hasOwnProperty(C) && 'style' != C && 'class' != C && x.setAttribute(C, s[C]);
              return e.content.appendChild(x);
            }
            e.content.appendChild(c);
          }
        }
        function vn(e, t) {
          if (e.length > 1 && !/  /.test(e)) return e;
          for (var n = t, r = '', i = 0; i < e.length; i++) {
            var o = e.charAt(i);
            ' ' != o || !n || (i != e.length - 1 && 32 != e.charCodeAt(i + 1)) || (o = '\xa0'),
              (r += o),
              (n = ' ' == o);
          }
          return r;
        }
        function yn(e, t) {
          return function (n, r, i, o, a, l, s) {
            i = i ? i + ' cm-force-border' : 'cm-force-border';
            for (var c = n.pos, u = c + r.length; ; ) {
              for (var f = void 0, p = 0; p < t.length; p++)
                if (((f = t[p]), f.to > c && f.from <= c)) break;
              if (f.to >= u) return e(n, r, i, o, a, l, s);
              e(n, r.slice(0, f.to - c), i, o, null, l, s),
                (o = null),
                (r = r.slice(f.to - c)),
                (c = f.to);
            }
          };
        }
        function bn(e, t, n, r) {
          var i = !r && n.widgetNode;
          i && e.map.push(e.pos, e.pos + t, i),
            !r &&
              e.cm.display.input.needsContentAttribute &&
              (i || (i = e.content.appendChild(document.createElement('span'))),
              i.setAttribute('cm-marker', n.id)),
            i && (e.cm.display.input.setUneditable(i), e.content.appendChild(i)),
            (e.pos += t),
            (e.trailingSpace = !1);
        }
        function wn(e, t, n) {
          var r = e.markedSpans,
            i = e.text,
            o = 0;
          if (r)
            for (var a, l, s, c, u, f, p, d = i.length, h = 0, m = 1, g = '', v = 0; ; ) {
              if (v == h) {
                (s = c = u = l = ''), (p = null), (f = null), (v = 1 / 0);
                for (var y = [], b = void 0, w = 0; w < r.length; ++w) {
                  var x = r[w],
                    C = x.marker;
                  if ('bookmark' == C.type && x.from == h && C.widgetNode) y.push(C);
                  else if (
                    x.from <= h &&
                    (null == x.to || x.to > h || (C.collapsed && x.to == h && x.from == h))
                  ) {
                    if (
                      (null != x.to && x.to != h && v > x.to && ((v = x.to), (c = '')),
                      C.className && (s += ' ' + C.className),
                      C.css && (l = (l ? l + ';' : '') + C.css),
                      C.startStyle && x.from == h && (u += ' ' + C.startStyle),
                      C.endStyle && x.to == v && (b || (b = [])).push(C.endStyle, x.to),
                      C.title && ((p || (p = {})).title = C.title),
                      C.attributes)
                    )
                      for (var S in C.attributes) (p || (p = {}))[S] = C.attributes[S];
                    C.collapsed && (!f || Kt(f.marker, C) < 0) && (f = x);
                  } else x.from > h && v > x.from && (v = x.from);
                }
                if (b) for (var k = 0; k < b.length; k += 2) b[k + 1] == v && (c += ' ' + b[k]);
                if (!f || f.from == h) for (var E = 0; E < y.length; ++E) bn(t, 0, y[E]);
                if (f && (f.from || 0) == h) {
                  if (
                    (bn(t, (null == f.to ? d + 1 : f.to) - h, f.marker, null == f.from),
                    null == f.to)
                  )
                    return;
                  f.to == h && (f = !1);
                }
              }
              if (h >= d) break;
              var O = Math.min(d, v);
              while (1) {
                if (g) {
                  var L = h + g.length;
                  if (!f) {
                    var T = L > O ? g.slice(0, O - h) : g;
                    t.addToken(t, T, a ? a + s : s, u, h + T.length == v ? c : '', l, p);
                  }
                  if (L >= O) {
                    (g = g.slice(O - h)), (h = O);
                    break;
                  }
                  (h = L), (u = '');
                }
                (g = i.slice(o, (o = n[m++]))), (a = dn(n[m++], t.cm.options));
              }
            }
          else
            for (var N = 1; N < n.length; N += 2)
              t.addToken(t, i.slice(o, (o = n[N])), dn(n[N + 1], t.cm.options));
        }
        function xn(e, t, n) {
          (this.line = t),
            (this.rest = Qt(t)),
            (this.size = this.rest ? et(Z(this.rest)) - n + 1 : 1),
            (this.node = this.text = null),
            (this.hidden = nn(e, t));
        }
        function Cn(e, t, n) {
          for (var r, i = [], o = t; o < n; o = r) {
            var a = new xn(e.doc, $e(e.doc, o), o);
            (r = o + a.size), i.push(a);
          }
          return i;
        }
        var Sn = null;
        function kn(e) {
          Sn ? Sn.ops.push(e) : (e.ownsGroup = Sn = { ops: [e], delayedCallbacks: [] });
        }
        function En(e) {
          var t = e.delayedCallbacks,
            n = 0;
          do {
            for (; n < t.length; n++) t[n].call(null);
            for (var r = 0; r < e.ops.length; r++) {
              var i = e.ops[r];
              if (i.cursorActivityHandlers)
                while (i.cursorActivityCalled < i.cursorActivityHandlers.length)
                  i.cursorActivityHandlers[i.cursorActivityCalled++].call(null, i.cm);
            }
          } while (n < t.length);
        }
        function On(e, t) {
          var n = e.ownsGroup;
          if (n)
            try {
              En(n);
            } finally {
              (Sn = null), t(n);
            }
        }
        var Ln = null;
        function Tn(e, t) {
          var n = me(e, t);
          if (n.length) {
            var r,
              i = Array.prototype.slice.call(arguments, 2);
            Sn ? (r = Sn.delayedCallbacks) : Ln ? (r = Ln) : ((r = Ln = []), setTimeout(Nn, 0));
            for (
              var o = function (e) {
                  r.push(function () {
                    return n[e].apply(null, i);
                  });
                },
                a = 0;
              a < n.length;
              ++a
            )
              o(a);
          }
        }
        function Nn() {
          var e = Ln;
          Ln = null;
          for (var t = 0; t < e.length; ++t) e[t]();
        }
        function Mn(e, t, n, r) {
          for (var i = 0; i < t.changes.length; i++) {
            var o = t.changes[i];
            'text' == o
              ? In(e, t)
              : 'gutter' == o
              ? _n(e, t, n, r)
              : 'class' == o
              ? Dn(e, t)
              : 'widget' == o && zn(e, t, r);
          }
          t.changes = null;
        }
        function An(e) {
          return (
            e.node == e.text &&
              ((e.node = N('div', null, null, 'position: relative')),
              e.text.parentNode && e.text.parentNode.replaceChild(e.node, e.text),
              e.node.appendChild(e.text),
              a && l < 8 && (e.node.style.zIndex = 2)),
            e.node
          );
        }
        function jn(e, t) {
          var n = t.bgClass ? t.bgClass + ' ' + (t.line.bgClass || '') : t.line.bgClass;
          if ((n && (n += ' CodeMirror-linebackground'), t.background))
            n
              ? (t.background.className = n)
              : (t.background.parentNode.removeChild(t.background), (t.background = null));
          else if (n) {
            var r = An(t);
            (t.background = r.insertBefore(N('div', null, n), r.firstChild)),
              e.display.input.setUneditable(t.background);
          }
        }
        function Pn(e, t) {
          var n = e.display.externalMeasured;
          return n && n.line == t.line
            ? ((e.display.externalMeasured = null), (t.measure = n.measure), n.built)
            : hn(e, t);
        }
        function In(e, t) {
          var n = t.text.className,
            r = Pn(e, t);
          t.text == t.node && (t.node = r.pre),
            t.text.parentNode.replaceChild(r.pre, t.text),
            (t.text = r.pre),
            r.bgClass != t.bgClass || r.textClass != t.textClass
              ? ((t.bgClass = r.bgClass), (t.textClass = r.textClass), Dn(e, t))
              : n && (t.text.className = n);
        }
        function Dn(e, t) {
          jn(e, t),
            t.line.wrapClass
              ? (An(t).className = t.line.wrapClass)
              : t.node != t.text && (t.node.className = '');
          var n = t.textClass ? t.textClass + ' ' + (t.line.textClass || '') : t.line.textClass;
          t.text.className = n || '';
        }
        function _n(e, t, n, r) {
          if (
            (t.gutter && (t.node.removeChild(t.gutter), (t.gutter = null)),
            t.gutterBackground &&
              (t.node.removeChild(t.gutterBackground), (t.gutterBackground = null)),
            t.line.gutterClass)
          ) {
            var i = An(t);
            (t.gutterBackground = N(
              'div',
              null,
              'CodeMirror-gutter-background ' + t.line.gutterClass,
              'left: ' +
                (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) +
                'px; width: ' +
                r.gutterTotalWidth +
                'px',
            )),
              e.display.input.setUneditable(t.gutterBackground),
              i.insertBefore(t.gutterBackground, t.text);
          }
          var o = t.line.gutterMarkers;
          if (e.options.lineNumbers || o) {
            var a = An(t),
              l = (t.gutter = N(
                'div',
                null,
                'CodeMirror-gutter-wrapper',
                'left: ' + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + 'px',
              ));
            if (
              (e.display.input.setUneditable(l),
              a.insertBefore(l, t.text),
              t.line.gutterClass && (l.className += ' ' + t.line.gutterClass),
              !e.options.lineNumbers ||
                (o && o['CodeMirror-linenumbers']) ||
                (t.lineNumber = l.appendChild(
                  N(
                    'div',
                    rt(e.options, n),
                    'CodeMirror-linenumber CodeMirror-gutter-elt',
                    'left: ' +
                      r.gutterLeft['CodeMirror-linenumbers'] +
                      'px; width: ' +
                      e.display.lineNumInnerWidth +
                      'px',
                  ),
                )),
              o)
            )
              for (var s = 0; s < e.display.gutterSpecs.length; ++s) {
                var c = e.display.gutterSpecs[s].className,
                  u = o.hasOwnProperty(c) && o[c];
                u &&
                  l.appendChild(
                    N(
                      'div',
                      [u],
                      'CodeMirror-gutter-elt',
                      'left: ' + r.gutterLeft[c] + 'px; width: ' + r.gutterWidth[c] + 'px',
                    ),
                  );
              }
          }
        }
        function zn(e, t, n) {
          t.alignable && (t.alignable = null);
          for (var r = k('CodeMirror-linewidget'), i = t.node.firstChild, o = void 0; i; i = o)
            (o = i.nextSibling), r.test(i.className) && t.node.removeChild(i);
          Fn(e, t, n);
        }
        function Rn(e, t, n, r) {
          var i = Pn(e, t);
          return (
            (t.text = t.node = i.pre),
            i.bgClass && (t.bgClass = i.bgClass),
            i.textClass && (t.textClass = i.textClass),
            Dn(e, t),
            _n(e, t, n, r),
            Fn(e, t, r),
            t.node
          );
        }
        function Fn(e, t, n) {
          if ((Hn(e, t.line, t, n, !0), t.rest))
            for (var r = 0; r < t.rest.length; r++) Hn(e, t.rest[r], t, n, !1);
        }
        function Hn(e, t, n, r, i) {
          if (t.widgets)
            for (var o = An(n), a = 0, l = t.widgets; a < l.length; ++a) {
              var s = l[a],
                c = N(
                  'div',
                  [s.node],
                  'CodeMirror-linewidget' + (s.className ? ' ' + s.className : ''),
                );
              s.handleMouseEvents || c.setAttribute('cm-ignore-events', 'true'),
                Wn(s, c, n, r),
                e.display.input.setUneditable(c),
                i && s.above ? o.insertBefore(c, n.gutter || n.text) : o.appendChild(c),
                Tn(s, 'redraw');
            }
        }
        function Wn(e, t, n, r) {
          if (e.noHScroll) {
            (n.alignable || (n.alignable = [])).push(t);
            var i = r.wrapperWidth;
            (t.style.left = r.fixedPos + 'px'),
              e.coverGutter ||
                ((i -= r.gutterTotalWidth), (t.style.paddingLeft = r.gutterTotalWidth + 'px')),
              (t.style.width = i + 'px');
          }
          e.coverGutter &&
            ((t.style.zIndex = 5),
            (t.style.position = 'relative'),
            e.noHScroll || (t.style.marginLeft = -r.gutterTotalWidth + 'px'));
        }
        function Bn(e) {
          if (null != e.height) return e.height;
          var t = e.doc.cm;
          if (!t) return 0;
          if (!A(document.body, e.node)) {
            var n = 'position: relative;';
            e.coverGutter && (n += 'margin-left: -' + t.display.gutters.offsetWidth + 'px;'),
              e.noHScroll && (n += 'width: ' + t.display.wrapper.clientWidth + 'px;'),
              T(t.display.measure, N('div', [e.node], null, n));
          }
          return (e.height = e.node.parentNode.offsetHeight);
        }
        function Vn(e, t) {
          for (var n = Oe(t); n != e.wrapper; n = n.parentNode)
            if (
              !n ||
              (1 == n.nodeType && 'true' == n.getAttribute('cm-ignore-events')) ||
              (n.parentNode == e.sizer && n != e.mover)
            )
              return !0;
        }
        function Un(e) {
          return e.lineSpace.offsetTop;
        }
        function Kn(e) {
          return e.mover.offsetHeight - e.lineSpace.offsetHeight;
        }
        function qn(e) {
          if (e.cachedPaddingH) return e.cachedPaddingH;
          var t = T(e.measure, N('pre', 'x', 'CodeMirror-line-like')),
            n = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle,
            r = { left: parseInt(n.paddingLeft), right: parseInt(n.paddingRight) };
          return isNaN(r.left) || isNaN(r.right) || (e.cachedPaddingH = r), r;
        }
        function Gn(e) {
          return W - e.display.nativeBarWidth;
        }
        function Yn(e) {
          return e.display.scroller.clientWidth - Gn(e) - e.display.barWidth;
        }
        function Zn(e) {
          return e.display.scroller.clientHeight - Gn(e) - e.display.barHeight;
        }
        function $n(e, t, n) {
          var r = e.options.lineWrapping,
            i = r && Yn(e);
          if (!t.measure.heights || (r && t.measure.width != i)) {
            var o = (t.measure.heights = []);
            if (r) {
              t.measure.width = i;
              for (var a = t.text.firstChild.getClientRects(), l = 0; l < a.length - 1; l++) {
                var s = a[l],
                  c = a[l + 1];
                Math.abs(s.bottom - c.bottom) > 2 && o.push((s.bottom + c.top) / 2 - n.top);
              }
            }
            o.push(n.bottom - n.top);
          }
        }
        function Xn(e, t, n) {
          if (e.line == t) return { map: e.measure.map, cache: e.measure.cache };
          for (var r = 0; r < e.rest.length; r++)
            if (e.rest[r] == t) return { map: e.measure.maps[r], cache: e.measure.caches[r] };
          for (var i = 0; i < e.rest.length; i++)
            if (et(e.rest[i]) > n)
              return { map: e.measure.maps[i], cache: e.measure.caches[i], before: !0 };
        }
        function Jn(e, t) {
          t = Xt(t);
          var n = et(t),
            r = (e.display.externalMeasured = new xn(e.doc, t, n));
          r.lineN = n;
          var i = (r.built = hn(e, r));
          return (r.text = i.pre), T(e.display.lineMeasure, i.pre), r;
        }
        function Qn(e, t, n, r) {
          return nr(e, tr(e, t), n, r);
        }
        function er(e, t) {
          if (t >= e.display.viewFrom && t < e.display.viewTo) return e.display.view[Dr(e, t)];
          var n = e.display.externalMeasured;
          return n && t >= n.lineN && t < n.lineN + n.size ? n : void 0;
        }
        function tr(e, t) {
          var n = et(t),
            r = er(e, n);
          r && !r.text
            ? (r = null)
            : r && r.changes && (Mn(e, r, n, Mr(e)), (e.curOp.forceUpdate = !0)),
            r || (r = Jn(e, t));
          var i = Xn(r, t, n);
          return {
            line: t,
            view: r,
            rect: null,
            map: i.map,
            cache: i.cache,
            before: i.before,
            hasHeights: !1,
          };
        }
        function nr(e, t, n, r, i) {
          t.before && (n = -1);
          var o,
            a = n + (r || '');
          return (
            t.cache.hasOwnProperty(a)
              ? (o = t.cache[a])
              : (t.rect || (t.rect = t.view.text.getBoundingClientRect()),
                t.hasHeights || ($n(e, t.view, t.rect), (t.hasHeights = !0)),
                (o = lr(e, t, n, r)),
                o.bogus || (t.cache[a] = o)),
            {
              left: o.left,
              right: o.right,
              top: i ? o.rtop : o.top,
              bottom: i ? o.rbottom : o.bottom,
            }
          );
        }
        var rr,
          ir = { left: 0, right: 0, top: 0, bottom: 0 };
        function or(e, t, n) {
          for (var r, i, o, a, l, s, c = 0; c < e.length; c += 3)
            if (
              ((l = e[c]),
              (s = e[c + 1]),
              t < l
                ? ((i = 0), (o = 1), (a = 'left'))
                : t < s
                ? ((i = t - l), (o = i + 1))
                : (c == e.length - 3 || (t == s && e[c + 3] > t)) &&
                  ((o = s - l), (i = o - 1), t >= s && (a = 'right')),
              null != i)
            ) {
              if (
                ((r = e[c + 2]),
                l == s && n == (r.insertLeft ? 'left' : 'right') && (a = n),
                'left' == n && 0 == i)
              )
                while (c && e[c - 2] == e[c - 3] && e[c - 1].insertLeft)
                  (r = e[2 + (c -= 3)]), (a = 'left');
              if ('right' == n && i == s - l)
                while (c < e.length - 3 && e[c + 3] == e[c + 4] && !e[c + 5].insertLeft)
                  (r = e[(c += 3) + 2]), (a = 'right');
              break;
            }
          return { node: r, start: i, end: o, collapse: a, coverStart: l, coverEnd: s };
        }
        function ar(e, t) {
          var n = ir;
          if ('left' == t) {
            for (var r = 0; r < e.length; r++) if ((n = e[r]).left != n.right) break;
          } else for (var i = e.length - 1; i >= 0; i--) if ((n = e[i]).left != n.right) break;
          return n;
        }
        function lr(e, t, n, r) {
          var i,
            o = or(t.map, n, r),
            s = o.node,
            c = o.start,
            u = o.end,
            f = o.collapse;
          if (3 == s.nodeType) {
            for (var p = 0; p < 4; p++) {
              while (c && oe(t.line.text.charAt(o.coverStart + c))) --c;
              while (o.coverStart + u < o.coverEnd && oe(t.line.text.charAt(o.coverStart + u))) ++u;
              if (
                ((i =
                  a && l < 9 && 0 == c && u == o.coverEnd - o.coverStart
                    ? s.parentNode.getBoundingClientRect()
                    : ar(E(s, c, u).getClientRects(), r)),
                i.left || i.right || 0 == c)
              )
                break;
              (u = c), (c -= 1), (f = 'right');
            }
            a && l < 11 && (i = sr(e.display.measure, i));
          } else {
            var d;
            c > 0 && (f = r = 'right'),
              (i =
                e.options.lineWrapping && (d = s.getClientRects()).length > 1
                  ? d['right' == r ? d.length - 1 : 0]
                  : s.getBoundingClientRect());
          }
          if (a && l < 9 && !c && (!i || (!i.left && !i.right))) {
            var h = s.parentNode.getClientRects()[0];
            i = h
              ? { left: h.left, right: h.left + Nr(e.display), top: h.top, bottom: h.bottom }
              : ir;
          }
          for (
            var m = i.top - t.rect.top,
              g = i.bottom - t.rect.top,
              v = (m + g) / 2,
              y = t.view.measure.heights,
              b = 0;
            b < y.length - 1;
            b++
          )
            if (v < y[b]) break;
          var w = b ? y[b - 1] : 0,
            x = y[b],
            C = {
              left: ('right' == f ? i.right : i.left) - t.rect.left,
              right: ('left' == f ? i.left : i.right) - t.rect.left,
              top: w,
              bottom: x,
            };
          return (
            i.left || i.right || (C.bogus = !0),
            e.options.singleCursorHeightPerLine || ((C.rtop = m), (C.rbottom = g)),
            C
          );
        }
        function sr(e, t) {
          if (
            !window.screen ||
            null == screen.logicalXDPI ||
            screen.logicalXDPI == screen.deviceXDPI ||
            !ze(e)
          )
            return t;
          var n = screen.logicalXDPI / screen.deviceXDPI,
            r = screen.logicalYDPI / screen.deviceYDPI;
          return { left: t.left * n, right: t.right * n, top: t.top * r, bottom: t.bottom * r };
        }
        function cr(e) {
          if (e.measure && ((e.measure.cache = {}), (e.measure.heights = null), e.rest))
            for (var t = 0; t < e.rest.length; t++) e.measure.caches[t] = {};
        }
        function ur(e) {
          (e.display.externalMeasure = null), L(e.display.lineMeasure);
          for (var t = 0; t < e.display.view.length; t++) cr(e.display.view[t]);
        }
        function fr(e) {
          ur(e),
            (e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null),
            e.options.lineWrapping || (e.display.maxLineChanged = !0),
            (e.display.lineNumChars = null);
        }
        function pr() {
          return u && g
            ? -(
                document.body.getBoundingClientRect().left -
                parseInt(getComputedStyle(document.body).marginLeft)
              )
            : window.pageXOffset || (document.documentElement || document.body).scrollLeft;
        }
        function dr() {
          return u && g
            ? -(
                document.body.getBoundingClientRect().top -
                parseInt(getComputedStyle(document.body).marginTop)
              )
            : window.pageYOffset || (document.documentElement || document.body).scrollTop;
        }
        function hr(e) {
          var t = 0;
          if (e.widgets)
            for (var n = 0; n < e.widgets.length; ++n)
              e.widgets[n].above && (t += Bn(e.widgets[n]));
          return t;
        }
        function mr(e, t, n, r, i) {
          if (!i) {
            var o = hr(t);
            (n.top += o), (n.bottom += o);
          }
          if ('line' == r) return n;
          r || (r = 'local');
          var a = on(t);
          if (
            ('local' == r ? (a += Un(e.display)) : (a -= e.display.viewOffset),
            'page' == r || 'window' == r)
          ) {
            var l = e.display.lineSpace.getBoundingClientRect();
            a += l.top + ('window' == r ? 0 : dr());
            var s = l.left + ('window' == r ? 0 : pr());
            (n.left += s), (n.right += s);
          }
          return (n.top += a), (n.bottom += a), n;
        }
        function gr(e, t, n) {
          if ('div' == n) return t;
          var r = t.left,
            i = t.top;
          if ('page' == n) (r -= pr()), (i -= dr());
          else if ('local' == n || !n) {
            var o = e.display.sizer.getBoundingClientRect();
            (r += o.left), (i += o.top);
          }
          var a = e.display.lineSpace.getBoundingClientRect();
          return { left: r - a.left, top: i - a.top };
        }
        function vr(e, t, n, r, i) {
          return r || (r = $e(e.doc, t.line)), mr(e, r, Qn(e, r, t.ch, i), n);
        }
        function yr(e, t, n, r, i, o) {
          function a(t, a) {
            var l = nr(e, i, t, a ? 'right' : 'left', o);
            return a ? (l.left = l.right) : (l.right = l.left), mr(e, r, l, n);
          }
          (r = r || $e(e.doc, t.line)), i || (i = tr(e, r));
          var l = pe(r, e.doc.direction),
            s = t.ch,
            c = t.sticky;
          if (
            (s >= r.text.length
              ? ((s = r.text.length), (c = 'before'))
              : s <= 0 && ((s = 0), (c = 'after')),
            !l)
          )
            return a('before' == c ? s - 1 : s, 'before' == c);
          function u(e, t, n) {
            var r = l[t],
              i = 1 == r.level;
            return a(n ? e - 1 : e, i != n);
          }
          var f = ue(l, s, c),
            p = ce,
            d = u(s, f, 'before' == c);
          return null != p && (d.other = u(s, p, 'before' != c)), d;
        }
        function br(e, t) {
          var n = 0;
          (t = ft(e.doc, t)), e.options.lineWrapping || (n = Nr(e.display) * t.ch);
          var r = $e(e.doc, t.line),
            i = on(r) + Un(e.display);
          return { left: n, right: n, top: i, bottom: i + r.height };
        }
        function wr(e, t, n, r, i) {
          var o = it(e, t, n);
          return (o.xRel = i), r && (o.outside = r), o;
        }
        function xr(e, t, n) {
          var r = e.doc;
          if (((n += e.display.viewOffset), n < 0)) return wr(r.first, 0, null, -1, -1);
          var i = tt(r, n),
            o = r.first + r.size - 1;
          if (i > o) return wr(r.first + r.size - 1, $e(r, o).text.length, null, 1, 1);
          t < 0 && (t = 0);
          for (var a = $e(r, i); ; ) {
            var l = Er(e, a, i, t, n),
              s = Zt(a, l.ch + (l.xRel > 0 || l.outside > 0 ? 1 : 0));
            if (!s) return l;
            var c = s.find(1);
            if (c.line == i) return c;
            a = $e(r, (i = c.line));
          }
        }
        function Cr(e, t, n, r) {
          r -= hr(t);
          var i = t.text.length,
            o = le(
              function (t) {
                return nr(e, n, t - 1).bottom <= r;
              },
              i,
              0,
            );
          return (
            (i = le(
              function (t) {
                return nr(e, n, t).top > r;
              },
              o,
              i,
            )),
            { begin: o, end: i }
          );
        }
        function Sr(e, t, n, r) {
          n || (n = tr(e, t));
          var i = mr(e, t, nr(e, n, r), 'line').top;
          return Cr(e, t, n, i);
        }
        function kr(e, t, n, r) {
          return !(e.bottom <= n) && (e.top > n || (r ? e.left : e.right) > t);
        }
        function Er(e, t, n, r, i) {
          i -= on(t);
          var o = tr(e, t),
            a = hr(t),
            l = 0,
            s = t.text.length,
            c = !0,
            u = pe(t, e.doc.direction);
          if (u) {
            var f = (e.options.lineWrapping ? Lr : Or)(e, t, n, o, u, r, i);
            (c = 1 != f.level), (l = c ? f.from : f.to - 1), (s = c ? f.to : f.from - 1);
          }
          var p,
            d,
            h = null,
            m = null,
            g = le(
              function (t) {
                var n = nr(e, o, t);
                return (
                  (n.top += a),
                  (n.bottom += a),
                  !!kr(n, r, i, !1) && (n.top <= i && n.left <= r && ((h = t), (m = n)), !0)
                );
              },
              l,
              s,
            ),
            v = !1;
          if (m) {
            var y = r - m.left < m.right - r,
              b = y == c;
            (g = h + (b ? 0 : 1)), (d = b ? 'after' : 'before'), (p = y ? m.left : m.right);
          } else {
            c || (g != s && g != l) || g++,
              (d =
                0 == g
                  ? 'after'
                  : g == t.text.length
                  ? 'before'
                  : nr(e, o, g - (c ? 1 : 0)).bottom + a <= i == c
                  ? 'after'
                  : 'before');
            var w = yr(e, it(n, g, d), 'line', t, o);
            (p = w.left), (v = i < w.top ? -1 : i >= w.bottom ? 1 : 0);
          }
          return (g = ae(t.text, g, 1)), wr(n, g, d, v, r - p);
        }
        function Or(e, t, n, r, i, o, a) {
          var l = le(
              function (l) {
                var s = i[l],
                  c = 1 != s.level;
                return kr(
                  yr(e, it(n, c ? s.to : s.from, c ? 'before' : 'after'), 'line', t, r),
                  o,
                  a,
                  !0,
                );
              },
              0,
              i.length - 1,
            ),
            s = i[l];
          if (l > 0) {
            var c = 1 != s.level,
              u = yr(e, it(n, c ? s.from : s.to, c ? 'after' : 'before'), 'line', t, r);
            kr(u, o, a, !0) && u.top > a && (s = i[l - 1]);
          }
          return s;
        }
        function Lr(e, t, n, r, i, o, a) {
          var l = Cr(e, t, r, a),
            s = l.begin,
            c = l.end;
          /\s/.test(t.text.charAt(c - 1)) && c--;
          for (var u = null, f = null, p = 0; p < i.length; p++) {
            var d = i[p];
            if (!(d.from >= c || d.to <= s)) {
              var h = 1 != d.level,
                m = nr(e, r, h ? Math.min(c, d.to) - 1 : Math.max(s, d.from)).right,
                g = m < o ? o - m + 1e9 : m - o;
              (!u || f > g) && ((u = d), (f = g));
            }
          }
          return (
            u || (u = i[i.length - 1]),
            u.from < s && (u = { from: s, to: u.to, level: u.level }),
            u.to > c && (u = { from: u.from, to: c, level: u.level }),
            u
          );
        }
        function Tr(e) {
          if (null != e.cachedTextHeight) return e.cachedTextHeight;
          if (null == rr) {
            rr = N('pre', null, 'CodeMirror-line-like');
            for (var t = 0; t < 49; ++t)
              rr.appendChild(document.createTextNode('x')), rr.appendChild(N('br'));
            rr.appendChild(document.createTextNode('x'));
          }
          T(e.measure, rr);
          var n = rr.offsetHeight / 50;
          return n > 3 && (e.cachedTextHeight = n), L(e.measure), n || 1;
        }
        function Nr(e) {
          if (null != e.cachedCharWidth) return e.cachedCharWidth;
          var t = N('span', 'xxxxxxxxxx'),
            n = N('pre', [t], 'CodeMirror-line-like');
          T(e.measure, n);
          var r = t.getBoundingClientRect(),
            i = (r.right - r.left) / 10;
          return i > 2 && (e.cachedCharWidth = i), i || 10;
        }
        function Mr(e) {
          for (
            var t = e.display,
              n = {},
              r = {},
              i = t.gutters.clientLeft,
              o = t.gutters.firstChild,
              a = 0;
            o;
            o = o.nextSibling, ++a
          ) {
            var l = e.display.gutterSpecs[a].className;
            (n[l] = o.offsetLeft + o.clientLeft + i), (r[l] = o.clientWidth);
          }
          return {
            fixedPos: Ar(t),
            gutterTotalWidth: t.gutters.offsetWidth,
            gutterLeft: n,
            gutterWidth: r,
            wrapperWidth: t.wrapper.clientWidth,
          };
        }
        function Ar(e) {
          return e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left;
        }
        function jr(e) {
          var t = Tr(e.display),
            n = e.options.lineWrapping,
            r = n && Math.max(5, e.display.scroller.clientWidth / Nr(e.display) - 3);
          return function (i) {
            if (nn(e.doc, i)) return 0;
            var o = 0;
            if (i.widgets)
              for (var a = 0; a < i.widgets.length; a++)
                i.widgets[a].height && (o += i.widgets[a].height);
            return n ? o + (Math.ceil(i.text.length / r) || 1) * t : o + t;
          };
        }
        function Pr(e) {
          var t = e.doc,
            n = jr(e);
          t.iter(function (e) {
            var t = n(e);
            t != e.height && Qe(e, t);
          });
        }
        function Ir(e, t, n, r) {
          var i = e.display;
          if (!n && 'true' == Oe(t).getAttribute('cm-not-content')) return null;
          var o,
            a,
            l = i.lineSpace.getBoundingClientRect();
          try {
            (o = t.clientX - l.left), (a = t.clientY - l.top);
          } catch (t) {
            return null;
          }
          var s,
            c = xr(e, o, a);
          if (r && c.xRel > 0 && (s = $e(e.doc, c.line).text).length == c.ch) {
            var u = R(s, s.length, e.options.tabSize) - s.length;
            c = it(c.line, Math.max(0, Math.round((o - qn(e.display).left) / Nr(e.display)) - u));
          }
          return c;
        }
        function Dr(e, t) {
          if (t >= e.display.viewTo) return null;
          if (((t -= e.display.viewFrom), t < 0)) return null;
          for (var n = e.display.view, r = 0; r < n.length; r++)
            if (((t -= n[r].size), t < 0)) return r;
        }
        function _r(e, t, n, r) {
          null == t && (t = e.doc.first), null == n && (n = e.doc.first + e.doc.size), r || (r = 0);
          var i = e.display;
          if (
            (r &&
              n < i.viewTo &&
              (null == i.updateLineNumbers || i.updateLineNumbers > t) &&
              (i.updateLineNumbers = t),
            (e.curOp.viewChanged = !0),
            t >= i.viewTo)
          )
            Nt && en(e.doc, t) < i.viewTo && Rr(e);
          else if (n <= i.viewFrom)
            Nt && tn(e.doc, n + r) > i.viewFrom ? Rr(e) : ((i.viewFrom += r), (i.viewTo += r));
          else if (t <= i.viewFrom && n >= i.viewTo) Rr(e);
          else if (t <= i.viewFrom) {
            var o = Fr(e, n, n + r, 1);
            o ? ((i.view = i.view.slice(o.index)), (i.viewFrom = o.lineN), (i.viewTo += r)) : Rr(e);
          } else if (n >= i.viewTo) {
            var a = Fr(e, t, t, -1);
            a ? ((i.view = i.view.slice(0, a.index)), (i.viewTo = a.lineN)) : Rr(e);
          } else {
            var l = Fr(e, t, t, -1),
              s = Fr(e, n, n + r, 1);
            l && s
              ? ((i.view = i.view
                  .slice(0, l.index)
                  .concat(Cn(e, l.lineN, s.lineN))
                  .concat(i.view.slice(s.index))),
                (i.viewTo += r))
              : Rr(e);
          }
          var c = i.externalMeasured;
          c && (n < c.lineN ? (c.lineN += r) : t < c.lineN + c.size && (i.externalMeasured = null));
        }
        function zr(e, t, n) {
          e.curOp.viewChanged = !0;
          var r = e.display,
            i = e.display.externalMeasured;
          if (
            (i && t >= i.lineN && t < i.lineN + i.size && (r.externalMeasured = null),
            !(t < r.viewFrom || t >= r.viewTo))
          ) {
            var o = r.view[Dr(e, t)];
            if (null != o.node) {
              var a = o.changes || (o.changes = []);
              -1 == H(a, n) && a.push(n);
            }
          }
        }
        function Rr(e) {
          (e.display.viewFrom = e.display.viewTo = e.doc.first),
            (e.display.view = []),
            (e.display.viewOffset = 0);
        }
        function Fr(e, t, n, r) {
          var i,
            o = Dr(e, t),
            a = e.display.view;
          if (!Nt || n == e.doc.first + e.doc.size) return { index: o, lineN: n };
          for (var l = e.display.viewFrom, s = 0; s < o; s++) l += a[s].size;
          if (l != t) {
            if (r > 0) {
              if (o == a.length - 1) return null;
              (i = l + a[o].size - t), o++;
            } else i = l - t;
            (t += i), (n += i);
          }
          while (en(e.doc, n) != n) {
            if (o == (r < 0 ? 0 : a.length - 1)) return null;
            (n += r * a[o - (r < 0 ? 1 : 0)].size), (o += r);
          }
          return { index: o, lineN: n };
        }
        function Hr(e, t, n) {
          var r = e.display,
            i = r.view;
          0 == i.length || t >= r.viewTo || n <= r.viewFrom
            ? ((r.view = Cn(e, t, n)), (r.viewFrom = t))
            : (r.viewFrom > t
                ? (r.view = Cn(e, t, r.viewFrom).concat(r.view))
                : r.viewFrom < t && (r.view = r.view.slice(Dr(e, t))),
              (r.viewFrom = t),
              r.viewTo < n
                ? (r.view = r.view.concat(Cn(e, r.viewTo, n)))
                : r.viewTo > n && (r.view = r.view.slice(0, Dr(e, n)))),
            (r.viewTo = n);
        }
        function Wr(e) {
          for (var t = e.display.view, n = 0, r = 0; r < t.length; r++) {
            var i = t[r];
            i.hidden || (i.node && !i.changes) || ++n;
          }
          return n;
        }
        function Br(e) {
          e.display.input.showSelection(e.display.input.prepareSelection());
        }
        function Vr(e, t) {
          void 0 === t && (t = !0);
          for (
            var n = e.doc,
              r = {},
              i = (r.cursors = document.createDocumentFragment()),
              o = (r.selection = document.createDocumentFragment()),
              a = 0;
            a < n.sel.ranges.length;
            a++
          )
            if (t || a != n.sel.primIndex) {
              var l = n.sel.ranges[a];
              if (!(l.from().line >= e.display.viewTo || l.to().line < e.display.viewFrom)) {
                var s = l.empty();
                (s || e.options.showCursorWhenSelecting) && Ur(e, l.head, i), s || qr(e, l, o);
              }
            }
          return r;
        }
        function Ur(e, t, n) {
          var r = yr(e, t, 'div', null, null, !e.options.singleCursorHeightPerLine),
            i = n.appendChild(N('div', '\xa0', 'CodeMirror-cursor'));
          if (
            ((i.style.left = r.left + 'px'),
            (i.style.top = r.top + 'px'),
            (i.style.height = Math.max(0, r.bottom - r.top) * e.options.cursorHeight + 'px'),
            r.other)
          ) {
            var o = n.appendChild(N('div', '\xa0', 'CodeMirror-cursor CodeMirror-secondarycursor'));
            (o.style.display = ''),
              (o.style.left = r.other.left + 'px'),
              (o.style.top = r.other.top + 'px'),
              (o.style.height = 0.85 * (r.other.bottom - r.other.top) + 'px');
          }
        }
        function Kr(e, t) {
          return e.top - t.top || e.left - t.left;
        }
        function qr(e, t, n) {
          var r = e.display,
            i = e.doc,
            o = document.createDocumentFragment(),
            a = qn(e.display),
            l = a.left,
            s = Math.max(r.sizerWidth, Yn(e) - r.sizer.offsetLeft) - a.right,
            c = 'ltr' == i.direction;
          function u(e, t, n, r) {
            t < 0 && (t = 0),
              (t = Math.round(t)),
              (r = Math.round(r)),
              o.appendChild(
                N(
                  'div',
                  null,
                  'CodeMirror-selected',
                  'position: absolute; left: ' +
                    e +
                    'px;\n                             top: ' +
                    t +
                    'px; width: ' +
                    (null == n ? s - e : n) +
                    'px;\n                             height: ' +
                    (r - t) +
                    'px',
                ),
              );
          }
          function f(t, n, r) {
            var o,
              a,
              f = $e(i, t),
              p = f.text.length;
            function d(n, r) {
              return vr(e, it(t, n), 'div', f, r);
            }
            function h(t, n, r) {
              var i = Sr(e, f, null, t),
                o = ('ltr' == n) == ('after' == r) ? 'left' : 'right',
                a = 'after' == r ? i.begin : i.end - (/\s/.test(f.text.charAt(i.end - 1)) ? 2 : 1);
              return d(a, o)[o];
            }
            var m = pe(f, i.direction);
            return (
              se(m, n || 0, null == r ? p : r, function (e, t, i, f) {
                var g = 'ltr' == i,
                  v = d(e, g ? 'left' : 'right'),
                  y = d(t - 1, g ? 'right' : 'left'),
                  b = null == n && 0 == e,
                  w = null == r && t == p,
                  x = 0 == f,
                  C = !m || f == m.length - 1;
                if (y.top - v.top <= 3) {
                  var S = (c ? b : w) && x,
                    k = (c ? w : b) && C,
                    E = S ? l : (g ? v : y).left,
                    O = k ? s : (g ? y : v).right;
                  u(E, v.top, O - E, v.bottom);
                } else {
                  var L, T, N, M;
                  g
                    ? ((L = c && b && x ? l : v.left),
                      (T = c ? s : h(e, i, 'before')),
                      (N = c ? l : h(t, i, 'after')),
                      (M = c && w && C ? s : y.right))
                    : ((L = c ? h(e, i, 'before') : l),
                      (T = !c && b && x ? s : v.right),
                      (N = !c && w && C ? l : y.left),
                      (M = c ? h(t, i, 'after') : s)),
                    u(L, v.top, T - L, v.bottom),
                    v.bottom < y.top && u(l, v.bottom, null, y.top),
                    u(N, y.top, M - N, y.bottom);
                }
                (!o || Kr(v, o) < 0) && (o = v),
                  Kr(y, o) < 0 && (o = y),
                  (!a || Kr(v, a) < 0) && (a = v),
                  Kr(y, a) < 0 && (a = y);
              }),
              { start: o, end: a }
            );
          }
          var p = t.from(),
            d = t.to();
          if (p.line == d.line) f(p.line, p.ch, d.ch);
          else {
            var h = $e(i, p.line),
              m = $e(i, d.line),
              g = Xt(h) == Xt(m),
              v = f(p.line, p.ch, g ? h.text.length + 1 : null).end,
              y = f(d.line, g ? 0 : null, d.ch).start;
            g &&
              (v.top < y.top - 2
                ? (u(v.right, v.top, null, v.bottom), u(l, y.top, y.left, y.bottom))
                : u(v.right, v.top, y.left - v.right, v.bottom)),
              v.bottom < y.top && u(l, v.bottom, null, y.top);
          }
          n.appendChild(o);
        }
        function Gr(e) {
          if (e.state.focused) {
            var t = e.display;
            clearInterval(t.blinker);
            var n = !0;
            (t.cursorDiv.style.visibility = ''),
              e.options.cursorBlinkRate > 0
                ? (t.blinker = setInterval(function () {
                    return (t.cursorDiv.style.visibility = (n = !n) ? '' : 'hidden');
                  }, e.options.cursorBlinkRate))
                : e.options.cursorBlinkRate < 0 && (t.cursorDiv.style.visibility = 'hidden');
          }
        }
        function Yr(e) {
          e.state.focused || (e.display.input.focus(), $r(e));
        }
        function Zr(e) {
          (e.state.delayingBlurEvent = !0),
            setTimeout(function () {
              e.state.delayingBlurEvent && ((e.state.delayingBlurEvent = !1), Xr(e));
            }, 100);
        }
        function $r(e, t) {
          e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1),
            'nocursor' != e.options.readOnly &&
              (e.state.focused ||
                (ve(e, 'focus', e, t),
                (e.state.focused = !0),
                P(e.display.wrapper, 'CodeMirror-focused'),
                e.curOp ||
                  e.display.selForContextMenu == e.doc.sel ||
                  (e.display.input.reset(),
                  s &&
                    setTimeout(function () {
                      return e.display.input.reset(!0);
                    }, 20)),
                e.display.input.receivedFocus()),
              Gr(e));
        }
        function Xr(e, t) {
          e.state.delayingBlurEvent ||
            (e.state.focused &&
              (ve(e, 'blur', e, t),
              (e.state.focused = !1),
              O(e.display.wrapper, 'CodeMirror-focused')),
            clearInterval(e.display.blinker),
            setTimeout(function () {
              e.state.focused || (e.display.shift = !1);
            }, 150));
        }
        function Jr(e) {
          for (var t = e.display, n = t.lineDiv.offsetTop, r = 0; r < t.view.length; r++) {
            var i = t.view[r],
              o = e.options.lineWrapping,
              s = void 0,
              c = 0;
            if (!i.hidden) {
              if (a && l < 8) {
                var u = i.node.offsetTop + i.node.offsetHeight;
                (s = u - n), (n = u);
              } else {
                var f = i.node.getBoundingClientRect();
                (s = f.bottom - f.top),
                  !o &&
                    i.text.firstChild &&
                    (c = i.text.firstChild.getBoundingClientRect().right - f.left - 1);
              }
              var p = i.line.height - s;
              if ((p > 0.005 || p < -0.005) && (Qe(i.line, s), Qr(i.line), i.rest))
                for (var d = 0; d < i.rest.length; d++) Qr(i.rest[d]);
              if (c > e.display.sizerWidth) {
                var h = Math.ceil(c / Nr(e.display));
                h > e.display.maxLineLength &&
                  ((e.display.maxLineLength = h),
                  (e.display.maxLine = i.line),
                  (e.display.maxLineChanged = !0));
              }
            }
          }
        }
        function Qr(e) {
          if (e.widgets)
            for (var t = 0; t < e.widgets.length; ++t) {
              var n = e.widgets[t],
                r = n.node.parentNode;
              r && (n.height = r.offsetHeight);
            }
        }
        function ei(e, t, n) {
          var r = n && null != n.top ? Math.max(0, n.top) : e.scroller.scrollTop;
          r = Math.floor(r - Un(e));
          var i = n && null != n.bottom ? n.bottom : r + e.wrapper.clientHeight,
            o = tt(t, r),
            a = tt(t, i);
          if (n && n.ensure) {
            var l = n.ensure.from.line,
              s = n.ensure.to.line;
            l < o
              ? ((o = l), (a = tt(t, on($e(t, l)) + e.wrapper.clientHeight)))
              : Math.min(s, t.lastLine()) >= a &&
                ((o = tt(t, on($e(t, s)) - e.wrapper.clientHeight)), (a = s));
          }
          return { from: o, to: Math.max(a, o + 1) };
        }
        function ti(e, t) {
          if (!ye(e, 'scrollCursorIntoView')) {
            var n = e.display,
              r = n.sizer.getBoundingClientRect(),
              i = null;
            if (
              (t.top + r.top < 0
                ? (i = !0)
                : t.bottom + r.top >
                    (window.innerHeight || document.documentElement.clientHeight) && (i = !1),
              null != i && !h)
            ) {
              var o = N(
                'div',
                '\u200b',
                null,
                'position: absolute;\n                         top: ' +
                  (t.top - n.viewOffset - Un(e.display)) +
                  'px;\n                         height: ' +
                  (t.bottom - t.top + Gn(e) + n.barHeight) +
                  'px;\n                         left: ' +
                  t.left +
                  'px; width: ' +
                  Math.max(2, t.right - t.left) +
                  'px;',
              );
              e.display.lineSpace.appendChild(o),
                o.scrollIntoView(i),
                e.display.lineSpace.removeChild(o);
            }
          }
        }
        function ni(e, t, n, r) {
          var i;
          null == r && (r = 0),
            e.options.lineWrapping ||
              t != n ||
              ((t = t.ch ? it(t.line, 'before' == t.sticky ? t.ch - 1 : t.ch, 'after') : t),
              (n = 'before' == t.sticky ? it(t.line, t.ch + 1, 'before') : t));
          for (var o = 0; o < 5; o++) {
            var a = !1,
              l = yr(e, t),
              s = n && n != t ? yr(e, n) : l;
            i = {
              left: Math.min(l.left, s.left),
              top: Math.min(l.top, s.top) - r,
              right: Math.max(l.left, s.left),
              bottom: Math.max(l.bottom, s.bottom) + r,
            };
            var c = ii(e, i),
              u = e.doc.scrollTop,
              f = e.doc.scrollLeft;
            if (
              (null != c.scrollTop &&
                (fi(e, c.scrollTop), Math.abs(e.doc.scrollTop - u) > 1 && (a = !0)),
              null != c.scrollLeft &&
                (di(e, c.scrollLeft), Math.abs(e.doc.scrollLeft - f) > 1 && (a = !0)),
              !a)
            )
              break;
          }
          return i;
        }
        function ri(e, t) {
          var n = ii(e, t);
          null != n.scrollTop && fi(e, n.scrollTop), null != n.scrollLeft && di(e, n.scrollLeft);
        }
        function ii(e, t) {
          var n = e.display,
            r = Tr(e.display);
          t.top < 0 && (t.top = 0);
          var i = e.curOp && null != e.curOp.scrollTop ? e.curOp.scrollTop : n.scroller.scrollTop,
            o = Zn(e),
            a = {};
          t.bottom - t.top > o && (t.bottom = t.top + o);
          var l = e.doc.height + Kn(n),
            s = t.top < r,
            c = t.bottom > l - r;
          if (t.top < i) a.scrollTop = s ? 0 : t.top;
          else if (t.bottom > i + o) {
            var u = Math.min(t.top, (c ? l : t.bottom) - o);
            u != i && (a.scrollTop = u);
          }
          var f =
              e.curOp && null != e.curOp.scrollLeft ? e.curOp.scrollLeft : n.scroller.scrollLeft,
            p = Yn(e) - (e.options.fixedGutter ? n.gutters.offsetWidth : 0),
            d = t.right - t.left > p;
          return (
            d && (t.right = t.left + p),
            t.left < 10
              ? (a.scrollLeft = 0)
              : t.left < f
              ? (a.scrollLeft = Math.max(0, t.left - (d ? 0 : 10)))
              : t.right > p + f - 3 && (a.scrollLeft = t.right + (d ? 0 : 10) - p),
            a
          );
        }
        function oi(e, t) {
          null != t &&
            (ci(e),
            (e.curOp.scrollTop =
              (null == e.curOp.scrollTop ? e.doc.scrollTop : e.curOp.scrollTop) + t));
        }
        function ai(e) {
          ci(e);
          var t = e.getCursor();
          e.curOp.scrollToPos = { from: t, to: t, margin: e.options.cursorScrollMargin };
        }
        function li(e, t, n) {
          (null == t && null == n) || ci(e),
            null != t && (e.curOp.scrollLeft = t),
            null != n && (e.curOp.scrollTop = n);
        }
        function si(e, t) {
          ci(e), (e.curOp.scrollToPos = t);
        }
        function ci(e) {
          var t = e.curOp.scrollToPos;
          if (t) {
            e.curOp.scrollToPos = null;
            var n = br(e, t.from),
              r = br(e, t.to);
            ui(e, n, r, t.margin);
          }
        }
        function ui(e, t, n, r) {
          var i = ii(e, {
            left: Math.min(t.left, n.left),
            top: Math.min(t.top, n.top) - r,
            right: Math.max(t.right, n.right),
            bottom: Math.max(t.bottom, n.bottom) + r,
          });
          li(e, i.scrollLeft, i.scrollTop);
        }
        function fi(e, t) {
          Math.abs(e.doc.scrollTop - t) < 2 ||
            (n || Bi(e, { top: t }), pi(e, t, !0), n && Bi(e), Ii(e, 100));
        }
        function pi(e, t, n) {
          (t = Math.max(
            0,
            Math.min(e.display.scroller.scrollHeight - e.display.scroller.clientHeight, t),
          )),
            (e.display.scroller.scrollTop != t || n) &&
              ((e.doc.scrollTop = t),
              e.display.scrollbars.setScrollTop(t),
              e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t));
        }
        function di(e, t, n, r) {
          (t = Math.max(
            0,
            Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth),
          )),
            ((n ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) && !r) ||
              ((e.doc.scrollLeft = t),
              qi(e),
              e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t),
              e.display.scrollbars.setScrollLeft(t));
        }
        function hi(e) {
          var t = e.display,
            n = t.gutters.offsetWidth,
            r = Math.round(e.doc.height + Kn(e.display));
          return {
            clientHeight: t.scroller.clientHeight,
            viewHeight: t.wrapper.clientHeight,
            scrollWidth: t.scroller.scrollWidth,
            clientWidth: t.scroller.clientWidth,
            viewWidth: t.wrapper.clientWidth,
            barLeft: e.options.fixedGutter ? n : 0,
            docHeight: r,
            scrollHeight: r + Gn(e) + t.barHeight,
            nativeBarWidth: t.nativeBarWidth,
            gutterWidth: n,
          };
        }
        var mi = function (e, t, n) {
          this.cm = n;
          var r = (this.vert = N(
              'div',
              [N('div', null, null, 'min-width: 1px')],
              'CodeMirror-vscrollbar',
            )),
            i = (this.horiz = N(
              'div',
              [N('div', null, null, 'height: 100%; min-height: 1px')],
              'CodeMirror-hscrollbar',
            ));
          (r.tabIndex = i.tabIndex = -1),
            e(r),
            e(i),
            he(r, 'scroll', function () {
              r.clientHeight && t(r.scrollTop, 'vertical');
            }),
            he(i, 'scroll', function () {
              i.clientWidth && t(i.scrollLeft, 'horizontal');
            }),
            (this.checkedZeroWidth = !1),
            a && l < 8 && (this.horiz.style.minHeight = this.vert.style.minWidth = '18px');
        };
        (mi.prototype.update = function (e) {
          var t = e.scrollWidth > e.clientWidth + 1,
            n = e.scrollHeight > e.clientHeight + 1,
            r = e.nativeBarWidth;
          if (n) {
            (this.vert.style.display = 'block'), (this.vert.style.bottom = t ? r + 'px' : '0');
            var i = e.viewHeight - (t ? r : 0);
            this.vert.firstChild.style.height =
              Math.max(0, e.scrollHeight - e.clientHeight + i) + 'px';
          } else (this.vert.style.display = ''), (this.vert.firstChild.style.height = '0');
          if (t) {
            (this.horiz.style.display = 'block'),
              (this.horiz.style.right = n ? r + 'px' : '0'),
              (this.horiz.style.left = e.barLeft + 'px');
            var o = e.viewWidth - e.barLeft - (n ? r : 0);
            this.horiz.firstChild.style.width =
              Math.max(0, e.scrollWidth - e.clientWidth + o) + 'px';
          } else (this.horiz.style.display = ''), (this.horiz.firstChild.style.width = '0');
          return (
            !this.checkedZeroWidth &&
              e.clientHeight > 0 &&
              (0 == r && this.zeroWidthHack(), (this.checkedZeroWidth = !0)),
            { right: n ? r : 0, bottom: t ? r : 0 }
          );
        }),
          (mi.prototype.setScrollLeft = function (e) {
            this.horiz.scrollLeft != e && (this.horiz.scrollLeft = e),
              this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz, 'horiz');
          }),
          (mi.prototype.setScrollTop = function (e) {
            this.vert.scrollTop != e && (this.vert.scrollTop = e),
              this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert, 'vert');
          }),
          (mi.prototype.zeroWidthHack = function () {
            var e = y && !d ? '12px' : '18px';
            (this.horiz.style.height = this.vert.style.width = e),
              (this.horiz.style.pointerEvents = this.vert.style.pointerEvents = 'none'),
              (this.disableHoriz = new F()),
              (this.disableVert = new F());
          }),
          (mi.prototype.enableZeroWidthBar = function (e, t, n) {
            function r() {
              var i = e.getBoundingClientRect(),
                o =
                  'vert' == n
                    ? document.elementFromPoint(i.right - 1, (i.top + i.bottom) / 2)
                    : document.elementFromPoint((i.right + i.left) / 2, i.bottom - 1);
              o != e ? (e.style.pointerEvents = 'none') : t.set(1e3, r);
            }
            (e.style.pointerEvents = 'auto'), t.set(1e3, r);
          }),
          (mi.prototype.clear = function () {
            var e = this.horiz.parentNode;
            e.removeChild(this.horiz), e.removeChild(this.vert);
          });
        var gi = function () {};
        function vi(e, t) {
          t || (t = hi(e));
          var n = e.display.barWidth,
            r = e.display.barHeight;
          yi(e, t);
          for (var i = 0; (i < 4 && n != e.display.barWidth) || r != e.display.barHeight; i++)
            n != e.display.barWidth && e.options.lineWrapping && Jr(e),
              yi(e, hi(e)),
              (n = e.display.barWidth),
              (r = e.display.barHeight);
        }
        function yi(e, t) {
          var n = e.display,
            r = n.scrollbars.update(t);
          (n.sizer.style.paddingRight = (n.barWidth = r.right) + 'px'),
            (n.sizer.style.paddingBottom = (n.barHeight = r.bottom) + 'px'),
            (n.heightForcer.style.borderBottom = r.bottom + 'px solid transparent'),
            r.right && r.bottom
              ? ((n.scrollbarFiller.style.display = 'block'),
                (n.scrollbarFiller.style.height = r.bottom + 'px'),
                (n.scrollbarFiller.style.width = r.right + 'px'))
              : (n.scrollbarFiller.style.display = ''),
            r.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter
              ? ((n.gutterFiller.style.display = 'block'),
                (n.gutterFiller.style.height = r.bottom + 'px'),
                (n.gutterFiller.style.width = t.gutterWidth + 'px'))
              : (n.gutterFiller.style.display = '');
        }
        (gi.prototype.update = function () {
          return { bottom: 0, right: 0 };
        }),
          (gi.prototype.setScrollLeft = function () {}),
          (gi.prototype.setScrollTop = function () {}),
          (gi.prototype.clear = function () {});
        var bi = { native: mi, null: gi };
        function wi(e) {
          e.display.scrollbars &&
            (e.display.scrollbars.clear(),
            e.display.scrollbars.addClass && O(e.display.wrapper, e.display.scrollbars.addClass)),
            (e.display.scrollbars = new bi[e.options.scrollbarStyle](
              function (t) {
                e.display.wrapper.insertBefore(t, e.display.scrollbarFiller),
                  he(t, 'mousedown', function () {
                    e.state.focused &&
                      setTimeout(function () {
                        return e.display.input.focus();
                      }, 0);
                  }),
                  t.setAttribute('cm-not-content', 'true');
              },
              function (t, n) {
                'horizontal' == n ? di(e, t) : fi(e, t);
              },
              e,
            )),
            e.display.scrollbars.addClass && P(e.display.wrapper, e.display.scrollbars.addClass);
        }
        var xi = 0;
        function Ci(e) {
          (e.curOp = {
            cm: e,
            viewChanged: !1,
            startHeight: e.doc.height,
            forceUpdate: !1,
            updateInput: 0,
            typing: !1,
            changeObjs: null,
            cursorActivityHandlers: null,
            cursorActivityCalled: 0,
            selectionChanged: !1,
            updateMaxLine: !1,
            scrollLeft: null,
            scrollTop: null,
            scrollToPos: null,
            focus: !1,
            id: ++xi,
          }),
            kn(e.curOp);
        }
        function Si(e) {
          var t = e.curOp;
          t &&
            On(t, function (e) {
              for (var t = 0; t < e.ops.length; t++) e.ops[t].cm.curOp = null;
              ki(e);
            });
        }
        function ki(e) {
          for (var t = e.ops, n = 0; n < t.length; n++) Ei(t[n]);
          for (var r = 0; r < t.length; r++) Oi(t[r]);
          for (var i = 0; i < t.length; i++) Li(t[i]);
          for (var o = 0; o < t.length; o++) Ti(t[o]);
          for (var a = 0; a < t.length; a++) Ni(t[a]);
        }
        function Ei(e) {
          var t = e.cm,
            n = t.display;
          zi(t),
            e.updateMaxLine && ln(t),
            (e.mustUpdate =
              e.viewChanged ||
              e.forceUpdate ||
              null != e.scrollTop ||
              (e.scrollToPos &&
                (e.scrollToPos.from.line < n.viewFrom || e.scrollToPos.to.line >= n.viewTo)) ||
              (n.maxLineChanged && t.options.lineWrapping)),
            (e.update =
              e.mustUpdate &&
              new _i(
                t,
                e.mustUpdate && { top: e.scrollTop, ensure: e.scrollToPos },
                e.forceUpdate,
              ));
        }
        function Oi(e) {
          e.updatedDisplay = e.mustUpdate && Hi(e.cm, e.update);
        }
        function Li(e) {
          var t = e.cm,
            n = t.display;
          e.updatedDisplay && Jr(t),
            (e.barMeasure = hi(t)),
            n.maxLineChanged &&
              !t.options.lineWrapping &&
              ((e.adjustWidthTo = Qn(t, n.maxLine, n.maxLine.text.length).left + 3),
              (t.display.sizerWidth = e.adjustWidthTo),
              (e.barMeasure.scrollWidth = Math.max(
                n.scroller.clientWidth,
                n.sizer.offsetLeft + e.adjustWidthTo + Gn(t) + t.display.barWidth,
              )),
              (e.maxScrollLeft = Math.max(0, n.sizer.offsetLeft + e.adjustWidthTo - Yn(t)))),
            (e.updatedDisplay || e.selectionChanged) &&
              (e.preparedSelection = n.input.prepareSelection());
        }
        function Ti(e) {
          var t = e.cm;
          null != e.adjustWidthTo &&
            ((t.display.sizer.style.minWidth = e.adjustWidthTo + 'px'),
            e.maxScrollLeft < t.doc.scrollLeft &&
              di(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), !0),
            (t.display.maxLineChanged = !1));
          var n = e.focus && e.focus == j();
          e.preparedSelection && t.display.input.showSelection(e.preparedSelection, n),
            (e.updatedDisplay || e.startHeight != t.doc.height) && vi(t, e.barMeasure),
            e.updatedDisplay && Ki(t, e.barMeasure),
            e.selectionChanged && Gr(t),
            t.state.focused && e.updateInput && t.display.input.reset(e.typing),
            n && Yr(e.cm);
        }
        function Ni(e) {
          var t = e.cm,
            n = t.display,
            r = t.doc;
          if (
            (e.updatedDisplay && Wi(t, e.update),
            null == n.wheelStartX ||
              (null == e.scrollTop && null == e.scrollLeft && !e.scrollToPos) ||
              (n.wheelStartX = n.wheelStartY = null),
            null != e.scrollTop && pi(t, e.scrollTop, e.forceScroll),
            null != e.scrollLeft && di(t, e.scrollLeft, !0, !0),
            e.scrollToPos)
          ) {
            var i = ni(t, ft(r, e.scrollToPos.from), ft(r, e.scrollToPos.to), e.scrollToPos.margin);
            ti(t, i);
          }
          var o = e.maybeHiddenMarkers,
            a = e.maybeUnhiddenMarkers;
          if (o) for (var l = 0; l < o.length; ++l) o[l].lines.length || ve(o[l], 'hide');
          if (a) for (var s = 0; s < a.length; ++s) a[s].lines.length && ve(a[s], 'unhide');
          n.wrapper.offsetHeight && (r.scrollTop = t.display.scroller.scrollTop),
            e.changeObjs && ve(t, 'changes', t, e.changeObjs),
            e.update && e.update.finish();
        }
        function Mi(e, t) {
          if (e.curOp) return t();
          Ci(e);
          try {
            return t();
          } finally {
            Si(e);
          }
        }
        function Ai(e, t) {
          return function () {
            if (e.curOp) return t.apply(e, arguments);
            Ci(e);
            try {
              return t.apply(e, arguments);
            } finally {
              Si(e);
            }
          };
        }
        function ji(e) {
          return function () {
            if (this.curOp) return e.apply(this, arguments);
            Ci(this);
            try {
              return e.apply(this, arguments);
            } finally {
              Si(this);
            }
          };
        }
        function Pi(e) {
          return function () {
            var t = this.cm;
            if (!t || t.curOp) return e.apply(this, arguments);
            Ci(t);
            try {
              return e.apply(this, arguments);
            } finally {
              Si(t);
            }
          };
        }
        function Ii(e, t) {
          e.doc.highlightFrontier < e.display.viewTo && e.state.highlight.set(t, _(Di, e));
        }
        function Di(e) {
          var t = e.doc;
          if (!(t.highlightFrontier >= e.display.viewTo)) {
            var n = +new Date() + e.options.workTime,
              r = yt(e, t.highlightFrontier),
              i = [];
            t.iter(r.line, Math.min(t.first + t.size, e.display.viewTo + 500), function (o) {
              if (r.line >= e.display.viewFrom) {
                var a = o.styles,
                  l = o.text.length > e.options.maxHighlightLength ? qe(t.mode, r.state) : null,
                  s = gt(e, o, r, !0);
                l && (r.state = l), (o.styles = s.styles);
                var c = o.styleClasses,
                  u = s.classes;
                u ? (o.styleClasses = u) : c && (o.styleClasses = null);
                for (
                  var f =
                      !a ||
                      a.length != o.styles.length ||
                      (c != u &&
                        (!c || !u || c.bgClass != u.bgClass || c.textClass != u.textClass)),
                    p = 0;
                  !f && p < a.length;
                  ++p
                )
                  f = a[p] != o.styles[p];
                f && i.push(r.line), (o.stateAfter = r.save()), r.nextLine();
              } else o.text.length <= e.options.maxHighlightLength && bt(e, o.text, r), (o.stateAfter = r.line % 5 == 0 ? r.save() : null), r.nextLine();
              if (+new Date() > n) return Ii(e, e.options.workDelay), !0;
            }),
              (t.highlightFrontier = r.line),
              (t.modeFrontier = Math.max(t.modeFrontier, r.line)),
              i.length &&
                Mi(e, function () {
                  for (var t = 0; t < i.length; t++) zr(e, i[t], 'text');
                });
          }
        }
        var _i = function (e, t, n) {
          var r = e.display;
          (this.viewport = t),
            (this.visible = ei(r, e.doc, t)),
            (this.editorIsHidden = !r.wrapper.offsetWidth),
            (this.wrapperHeight = r.wrapper.clientHeight),
            (this.wrapperWidth = r.wrapper.clientWidth),
            (this.oldDisplayWidth = Yn(e)),
            (this.force = n),
            (this.dims = Mr(e)),
            (this.events = []);
        };
        function zi(e) {
          var t = e.display;
          !t.scrollbarsClipped &&
            t.scroller.offsetWidth &&
            ((t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth),
            (t.heightForcer.style.height = Gn(e) + 'px'),
            (t.sizer.style.marginBottom = -t.nativeBarWidth + 'px'),
            (t.sizer.style.borderRightWidth = Gn(e) + 'px'),
            (t.scrollbarsClipped = !0));
        }
        function Ri(e) {
          if (e.hasFocus()) return null;
          var t = j();
          if (!t || !A(e.display.lineDiv, t)) return null;
          var n = { activeElt: t };
          if (window.getSelection) {
            var r = window.getSelection();
            r.anchorNode &&
              r.extend &&
              A(e.display.lineDiv, r.anchorNode) &&
              ((n.anchorNode = r.anchorNode),
              (n.anchorOffset = r.anchorOffset),
              (n.focusNode = r.focusNode),
              (n.focusOffset = r.focusOffset));
          }
          return n;
        }
        function Fi(e) {
          if (
            e &&
            e.activeElt &&
            e.activeElt != j() &&
            (e.activeElt.focus(),
            !/^(INPUT|TEXTAREA)$/.test(e.activeElt.nodeName) &&
              e.anchorNode &&
              A(document.body, e.anchorNode) &&
              A(document.body, e.focusNode))
          ) {
            var t = window.getSelection(),
              n = document.createRange();
            n.setEnd(e.anchorNode, e.anchorOffset),
              n.collapse(!1),
              t.removeAllRanges(),
              t.addRange(n),
              t.extend(e.focusNode, e.focusOffset);
          }
        }
        function Hi(e, t) {
          var n = e.display,
            r = e.doc;
          if (t.editorIsHidden) return Rr(e), !1;
          if (
            !t.force &&
            t.visible.from >= n.viewFrom &&
            t.visible.to <= n.viewTo &&
            (null == n.updateLineNumbers || n.updateLineNumbers >= n.viewTo) &&
            n.renderedView == n.view &&
            0 == Wr(e)
          )
            return !1;
          Gi(e) && (Rr(e), (t.dims = Mr(e)));
          var i = r.first + r.size,
            o = Math.max(t.visible.from - e.options.viewportMargin, r.first),
            a = Math.min(i, t.visible.to + e.options.viewportMargin);
          n.viewFrom < o && o - n.viewFrom < 20 && (o = Math.max(r.first, n.viewFrom)),
            n.viewTo > a && n.viewTo - a < 20 && (a = Math.min(i, n.viewTo)),
            Nt && ((o = en(e.doc, o)), (a = tn(e.doc, a)));
          var l =
            o != n.viewFrom ||
            a != n.viewTo ||
            n.lastWrapHeight != t.wrapperHeight ||
            n.lastWrapWidth != t.wrapperWidth;
          Hr(e, o, a),
            (n.viewOffset = on($e(e.doc, n.viewFrom))),
            (e.display.mover.style.top = n.viewOffset + 'px');
          var s = Wr(e);
          if (
            !l &&
            0 == s &&
            !t.force &&
            n.renderedView == n.view &&
            (null == n.updateLineNumbers || n.updateLineNumbers >= n.viewTo)
          )
            return !1;
          var c = Ri(e);
          return (
            s > 4 && (n.lineDiv.style.display = 'none'),
            Vi(e, n.updateLineNumbers, t.dims),
            s > 4 && (n.lineDiv.style.display = ''),
            (n.renderedView = n.view),
            Fi(c),
            L(n.cursorDiv),
            L(n.selectionDiv),
            (n.gutters.style.height = n.sizer.style.minHeight = 0),
            l &&
              ((n.lastWrapHeight = t.wrapperHeight),
              (n.lastWrapWidth = t.wrapperWidth),
              Ii(e, 400)),
            (n.updateLineNumbers = null),
            !0
          );
        }
        function Wi(e, t) {
          for (var n = t.viewport, r = !0; ; r = !1) {
            if (r && e.options.lineWrapping && t.oldDisplayWidth != Yn(e))
              r && (t.visible = ei(e.display, e.doc, n));
            else if (
              (n &&
                null != n.top &&
                (n = { top: Math.min(e.doc.height + Kn(e.display) - Zn(e), n.top) }),
              (t.visible = ei(e.display, e.doc, n)),
              t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo)
            )
              break;
            if (!Hi(e, t)) break;
            Jr(e);
            var i = hi(e);
            Br(e), vi(e, i), Ki(e, i), (t.force = !1);
          }
          t.signal(e, 'update', e),
            (e.display.viewFrom == e.display.reportedViewFrom &&
              e.display.viewTo == e.display.reportedViewTo) ||
              (t.signal(e, 'viewportChange', e, e.display.viewFrom, e.display.viewTo),
              (e.display.reportedViewFrom = e.display.viewFrom),
              (e.display.reportedViewTo = e.display.viewTo));
        }
        function Bi(e, t) {
          var n = new _i(e, t);
          if (Hi(e, n)) {
            Jr(e), Wi(e, n);
            var r = hi(e);
            Br(e), vi(e, r), Ki(e, r), n.finish();
          }
        }
        function Vi(e, t, n) {
          var r = e.display,
            i = e.options.lineNumbers,
            o = r.lineDiv,
            a = o.firstChild;
          function l(t) {
            var n = t.nextSibling;
            return (
              s && y && e.display.currentWheelTarget == t
                ? (t.style.display = 'none')
                : t.parentNode.removeChild(t),
              n
            );
          }
          for (var c = r.view, u = r.viewFrom, f = 0; f < c.length; f++) {
            var p = c[f];
            if (p.hidden);
            else if (p.node && p.node.parentNode == o) {
              while (a != p.node) a = l(a);
              var d = i && null != t && t <= u && p.lineNumber;
              p.changes && (H(p.changes, 'gutter') > -1 && (d = !1), Mn(e, p, u, n)),
                d &&
                  (L(p.lineNumber),
                  p.lineNumber.appendChild(document.createTextNode(rt(e.options, u)))),
                (a = p.node.nextSibling);
            } else {
              var h = Rn(e, p, u, n);
              o.insertBefore(h, a);
            }
            u += p.size;
          }
          while (a) a = l(a);
        }
        function Ui(e) {
          var t = e.gutters.offsetWidth;
          e.sizer.style.marginLeft = t + 'px';
        }
        function Ki(e, t) {
          (e.display.sizer.style.minHeight = t.docHeight + 'px'),
            (e.display.heightForcer.style.top = t.docHeight + 'px'),
            (e.display.gutters.style.height = t.docHeight + e.display.barHeight + Gn(e) + 'px');
        }
        function qi(e) {
          var t = e.display,
            n = t.view;
          if (t.alignWidgets || (t.gutters.firstChild && e.options.fixedGutter)) {
            for (
              var r = Ar(t) - t.scroller.scrollLeft + e.doc.scrollLeft,
                i = t.gutters.offsetWidth,
                o = r + 'px',
                a = 0;
              a < n.length;
              a++
            )
              if (!n[a].hidden) {
                e.options.fixedGutter &&
                  (n[a].gutter && (n[a].gutter.style.left = o),
                  n[a].gutterBackground && (n[a].gutterBackground.style.left = o));
                var l = n[a].alignable;
                if (l) for (var s = 0; s < l.length; s++) l[s].style.left = o;
              }
            e.options.fixedGutter && (t.gutters.style.left = r + i + 'px');
          }
        }
        function Gi(e) {
          if (!e.options.lineNumbers) return !1;
          var t = e.doc,
            n = rt(e.options, t.first + t.size - 1),
            r = e.display;
          if (n.length != r.lineNumChars) {
            var i = r.measure.appendChild(
                N('div', [N('div', n)], 'CodeMirror-linenumber CodeMirror-gutter-elt'),
              ),
              o = i.firstChild.offsetWidth,
              a = i.offsetWidth - o;
            return (
              (r.lineGutter.style.width = ''),
              (r.lineNumInnerWidth = Math.max(o, r.lineGutter.offsetWidth - a) + 1),
              (r.lineNumWidth = r.lineNumInnerWidth + a),
              (r.lineNumChars = r.lineNumInnerWidth ? n.length : -1),
              (r.lineGutter.style.width = r.lineNumWidth + 'px'),
              Ui(e.display),
              !0
            );
          }
          return !1;
        }
        function Yi(e, t) {
          for (var n = [], r = !1, i = 0; i < e.length; i++) {
            var o = e[i],
              a = null;
            if (
              ('string' != typeof o && ((a = o.style), (o = o.className)),
              'CodeMirror-linenumbers' == o)
            ) {
              if (!t) continue;
              r = !0;
            }
            n.push({ className: o, style: a });
          }
          return t && !r && n.push({ className: 'CodeMirror-linenumbers', style: null }), n;
        }
        function Zi(e) {
          var t = e.gutters,
            n = e.gutterSpecs;
          L(t), (e.lineGutter = null);
          for (var r = 0; r < n.length; ++r) {
            var i = n[r],
              o = i.className,
              a = i.style,
              l = t.appendChild(N('div', null, 'CodeMirror-gutter ' + o));
            a && (l.style.cssText = a),
              'CodeMirror-linenumbers' == o &&
                ((e.lineGutter = l), (l.style.width = (e.lineNumWidth || 1) + 'px'));
          }
          (t.style.display = n.length ? '' : 'none'), Ui(e);
        }
        function $i(e) {
          Zi(e.display), _r(e), qi(e);
        }
        function Xi(e, t, r, i) {
          var o = this;
          (this.input = r),
            (o.scrollbarFiller = N('div', null, 'CodeMirror-scrollbar-filler')),
            o.scrollbarFiller.setAttribute('cm-not-content', 'true'),
            (o.gutterFiller = N('div', null, 'CodeMirror-gutter-filler')),
            o.gutterFiller.setAttribute('cm-not-content', 'true'),
            (o.lineDiv = M('div', null, 'CodeMirror-code')),
            (o.selectionDiv = N('div', null, null, 'position: relative; z-index: 1')),
            (o.cursorDiv = N('div', null, 'CodeMirror-cursors')),
            (o.measure = N('div', null, 'CodeMirror-measure')),
            (o.lineMeasure = N('div', null, 'CodeMirror-measure')),
            (o.lineSpace = M(
              'div',
              [o.measure, o.lineMeasure, o.selectionDiv, o.cursorDiv, o.lineDiv],
              null,
              'position: relative; outline: none',
            ));
          var c = M('div', [o.lineSpace], 'CodeMirror-lines');
          (o.mover = N('div', [c], null, 'position: relative')),
            (o.sizer = N('div', [o.mover], 'CodeMirror-sizer')),
            (o.sizerWidth = null),
            (o.heightForcer = N(
              'div',
              null,
              null,
              'position: absolute; height: ' + W + 'px; width: 1px;',
            )),
            (o.gutters = N('div', null, 'CodeMirror-gutters')),
            (o.lineGutter = null),
            (o.scroller = N('div', [o.sizer, o.heightForcer, o.gutters], 'CodeMirror-scroll')),
            o.scroller.setAttribute('tabIndex', '-1'),
            (o.wrapper = N('div', [o.scrollbarFiller, o.gutterFiller, o.scroller], 'CodeMirror')),
            a && l < 8 && ((o.gutters.style.zIndex = -1), (o.scroller.style.paddingRight = 0)),
            s || (n && v) || (o.scroller.draggable = !0),
            e && (e.appendChild ? e.appendChild(o.wrapper) : e(o.wrapper)),
            (o.viewFrom = o.viewTo = t.first),
            (o.reportedViewFrom = o.reportedViewTo = t.first),
            (o.view = []),
            (o.renderedView = null),
            (o.externalMeasured = null),
            (o.viewOffset = 0),
            (o.lastWrapHeight = o.lastWrapWidth = 0),
            (o.updateLineNumbers = null),
            (o.nativeBarWidth = o.barHeight = o.barWidth = 0),
            (o.scrollbarsClipped = !1),
            (o.lineNumWidth = o.lineNumInnerWidth = o.lineNumChars = null),
            (o.alignWidgets = !1),
            (o.cachedCharWidth = o.cachedTextHeight = o.cachedPaddingH = null),
            (o.maxLine = null),
            (o.maxLineLength = 0),
            (o.maxLineChanged = !1),
            (o.wheelDX = o.wheelDY = o.wheelStartX = o.wheelStartY = null),
            (o.shift = !1),
            (o.selForContextMenu = null),
            (o.activeTouch = null),
            (o.gutterSpecs = Yi(i.gutters, i.lineNumbers)),
            Zi(o),
            r.init(o);
        }
        (_i.prototype.signal = function (e, t) {
          we(e, t) && this.events.push(arguments);
        }),
          (_i.prototype.finish = function () {
            for (var e = 0; e < this.events.length; e++) ve.apply(null, this.events[e]);
          });
        var Ji = 0,
          Qi = null;
        function eo(e) {
          var t = e.wheelDeltaX,
            n = e.wheelDeltaY;
          return (
            null == t && e.detail && e.axis == e.HORIZONTAL_AXIS && (t = e.detail),
            null == n && e.detail && e.axis == e.VERTICAL_AXIS
              ? (n = e.detail)
              : null == n && (n = e.wheelDelta),
            { x: t, y: n }
          );
        }
        function to(e) {
          var t = eo(e);
          return (t.x *= Qi), (t.y *= Qi), t;
        }
        function no(e, t) {
          var r = eo(t),
            i = r.x,
            o = r.y,
            a = e.display,
            l = a.scroller,
            c = l.scrollWidth > l.clientWidth,
            u = l.scrollHeight > l.clientHeight;
          if ((i && c) || (o && u)) {
            if (o && y && s)
              e: for (var p = t.target, d = a.view; p != l; p = p.parentNode)
                for (var h = 0; h < d.length; h++)
                  if (d[h].node == p) {
                    e.display.currentWheelTarget = p;
                    break e;
                  }
            if (i && !n && !f && null != Qi)
              return (
                o && u && fi(e, Math.max(0, l.scrollTop + o * Qi)),
                di(e, Math.max(0, l.scrollLeft + i * Qi)),
                (!o || (o && u)) && Ce(t),
                void (a.wheelStartX = null)
              );
            if (o && null != Qi) {
              var m = o * Qi,
                g = e.doc.scrollTop,
                v = g + a.wrapper.clientHeight;
              m < 0 ? (g = Math.max(0, g + m - 50)) : (v = Math.min(e.doc.height, v + m + 50)),
                Bi(e, { top: g, bottom: v });
            }
            Ji < 20 &&
              (null == a.wheelStartX
                ? ((a.wheelStartX = l.scrollLeft),
                  (a.wheelStartY = l.scrollTop),
                  (a.wheelDX = i),
                  (a.wheelDY = o),
                  setTimeout(function () {
                    if (null != a.wheelStartX) {
                      var e = l.scrollLeft - a.wheelStartX,
                        t = l.scrollTop - a.wheelStartY,
                        n = (t && a.wheelDY && t / a.wheelDY) || (e && a.wheelDX && e / a.wheelDX);
                      (a.wheelStartX = a.wheelStartY = null),
                        n && ((Qi = (Qi * Ji + n) / (Ji + 1)), ++Ji);
                    }
                  }, 200))
                : ((a.wheelDX += i), (a.wheelDY += o)));
          }
        }
        a ? (Qi = -0.53) : n ? (Qi = 15) : u ? (Qi = -0.7) : p && (Qi = -1 / 3);
        var ro = function (e, t) {
          (this.ranges = e), (this.primIndex = t);
        };
        (ro.prototype.primary = function () {
          return this.ranges[this.primIndex];
        }),
          (ro.prototype.equals = function (e) {
            if (e == this) return !0;
            if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length) return !1;
            for (var t = 0; t < this.ranges.length; t++) {
              var n = this.ranges[t],
                r = e.ranges[t];
              if (!at(n.anchor, r.anchor) || !at(n.head, r.head)) return !1;
            }
            return !0;
          }),
          (ro.prototype.deepCopy = function () {
            for (var e = [], t = 0; t < this.ranges.length; t++)
              e[t] = new io(lt(this.ranges[t].anchor), lt(this.ranges[t].head));
            return new ro(e, this.primIndex);
          }),
          (ro.prototype.somethingSelected = function () {
            for (var e = 0; e < this.ranges.length; e++) if (!this.ranges[e].empty()) return !0;
            return !1;
          }),
          (ro.prototype.contains = function (e, t) {
            t || (t = e);
            for (var n = 0; n < this.ranges.length; n++) {
              var r = this.ranges[n];
              if (ot(t, r.from()) >= 0 && ot(e, r.to()) <= 0) return n;
            }
            return -1;
          });
        var io = function (e, t) {
          (this.anchor = e), (this.head = t);
        };
        function oo(e, t, n) {
          var r = e && e.options.selectionsMayTouch,
            i = t[n];
          t.sort(function (e, t) {
            return ot(e.from(), t.from());
          }),
            (n = H(t, i));
          for (var o = 1; o < t.length; o++) {
            var a = t[o],
              l = t[o - 1],
              s = ot(l.to(), a.from());
            if (r && !a.empty() ? s > 0 : s >= 0) {
              var c = ct(l.from(), a.from()),
                u = st(l.to(), a.to()),
                f = l.empty() ? a.from() == a.head : l.from() == l.head;
              o <= n && --n, t.splice(--o, 2, new io(f ? u : c, f ? c : u));
            }
          }
          return new ro(t, n);
        }
        function ao(e, t) {
          return new ro([new io(e, t || e)], 0);
        }
        function lo(e) {
          return e.text
            ? it(
                e.from.line + e.text.length - 1,
                Z(e.text).length + (1 == e.text.length ? e.from.ch : 0),
              )
            : e.to;
        }
        function so(e, t) {
          if (ot(e, t.from) < 0) return e;
          if (ot(e, t.to) <= 0) return lo(t);
          var n = e.line + t.text.length - (t.to.line - t.from.line) - 1,
            r = e.ch;
          return e.line == t.to.line && (r += lo(t).ch - t.to.ch), it(n, r);
        }
        function co(e, t) {
          for (var n = [], r = 0; r < e.sel.ranges.length; r++) {
            var i = e.sel.ranges[r];
            n.push(new io(so(i.anchor, t), so(i.head, t)));
          }
          return oo(e.cm, n, e.sel.primIndex);
        }
        function uo(e, t, n) {
          return e.line == t.line
            ? it(n.line, e.ch - t.ch + n.ch)
            : it(n.line + (e.line - t.line), e.ch);
        }
        function fo(e, t, n) {
          for (var r = [], i = it(e.first, 0), o = i, a = 0; a < t.length; a++) {
            var l = t[a],
              s = uo(l.from, i, o),
              c = uo(lo(l), i, o);
            if (((i = l.to), (o = c), 'around' == n)) {
              var u = e.sel.ranges[a],
                f = ot(u.head, u.anchor) < 0;
              r[a] = new io(f ? c : s, f ? s : c);
            } else r[a] = new io(s, s);
          }
          return new ro(r, e.sel.primIndex);
        }
        function po(e) {
          (e.doc.mode = Ve(e.options, e.doc.modeOption)), ho(e);
        }
        function ho(e) {
          e.doc.iter(function (e) {
            e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null);
          }),
            (e.doc.modeFrontier = e.doc.highlightFrontier = e.doc.first),
            Ii(e, 100),
            e.state.modeGen++,
            e.curOp && _r(e);
        }
        function mo(e, t) {
          return (
            0 == t.from.ch &&
            0 == t.to.ch &&
            '' == Z(t.text) &&
            (!e.cm || e.cm.options.wholeLineUpdateBefore)
          );
        }
        function go(e, t, n, r) {
          function i(e) {
            return n ? n[e] : null;
          }
          function o(e, n, i) {
            cn(e, n, i, r), Tn(e, 'change', e, t);
          }
          function a(e, t) {
            for (var n = [], o = e; o < t; ++o) n.push(new sn(c[o], i(o), r));
            return n;
          }
          var l = t.from,
            s = t.to,
            c = t.text,
            u = $e(e, l.line),
            f = $e(e, s.line),
            p = Z(c),
            d = i(c.length - 1),
            h = s.line - l.line;
          if (t.full) e.insert(0, a(0, c.length)), e.remove(c.length, e.size - c.length);
          else if (mo(e, t)) {
            var m = a(0, c.length - 1);
            o(f, f.text, d), h && e.remove(l.line, h), m.length && e.insert(l.line, m);
          } else if (u == f)
            if (1 == c.length) o(u, u.text.slice(0, l.ch) + p + u.text.slice(s.ch), d);
            else {
              var g = a(1, c.length - 1);
              g.push(new sn(p + u.text.slice(s.ch), d, r)),
                o(u, u.text.slice(0, l.ch) + c[0], i(0)),
                e.insert(l.line + 1, g);
            }
          else if (1 == c.length)
            o(u, u.text.slice(0, l.ch) + c[0] + f.text.slice(s.ch), i(0)), e.remove(l.line + 1, h);
          else {
            o(u, u.text.slice(0, l.ch) + c[0], i(0)), o(f, p + f.text.slice(s.ch), d);
            var v = a(1, c.length - 1);
            h > 1 && e.remove(l.line + 1, h - 1), e.insert(l.line + 1, v);
          }
          Tn(e, 'change', e, t);
        }
        function vo(e, t, n) {
          function r(e, i, o) {
            if (e.linked)
              for (var a = 0; a < e.linked.length; ++a) {
                var l = e.linked[a];
                if (l.doc != i) {
                  var s = o && l.sharedHist;
                  (n && !s) || (t(l.doc, s), r(l.doc, e, s));
                }
              }
          }
          r(e, null, !0);
        }
        function yo(e, t) {
          if (t.cm) throw new Error('This document is already in use.');
          (e.doc = t),
            (t.cm = e),
            Pr(e),
            po(e),
            bo(e),
            e.options.lineWrapping || ln(e),
            (e.options.mode = t.modeOption),
            _r(e);
        }
        function bo(e) {
          ('rtl' == e.doc.direction ? P : O)(e.display.lineDiv, 'CodeMirror-rtl');
        }
        function wo(e) {
          Mi(e, function () {
            bo(e), _r(e);
          });
        }
        function xo(e) {
          (this.done = []),
            (this.undone = []),
            (this.undoDepth = 1 / 0),
            (this.lastModTime = this.lastSelTime = 0),
            (this.lastOp = this.lastSelOp = null),
            (this.lastOrigin = this.lastSelOrigin = null),
            (this.generation = this.maxGeneration = e || 1);
        }
        function Co(e, t) {
          var n = { from: lt(t.from), to: lo(t), text: Xe(e, t.from, t.to) };
          return (
            No(e, n, t.from.line, t.to.line + 1),
            vo(
              e,
              function (e) {
                return No(e, n, t.from.line, t.to.line + 1);
              },
              !0,
            ),
            n
          );
        }
        function So(e) {
          while (e.length) {
            var t = Z(e);
            if (!t.ranges) break;
            e.pop();
          }
        }
        function ko(e, t) {
          return t
            ? (So(e.done), Z(e.done))
            : e.done.length && !Z(e.done).ranges
            ? Z(e.done)
            : e.done.length > 1 && !e.done[e.done.length - 2].ranges
            ? (e.done.pop(), Z(e.done))
            : void 0;
        }
        function Eo(e, t, n, r) {
          var i = e.history;
          i.undone.length = 0;
          var o,
            a,
            l = +new Date();
          if (
            (i.lastOp == r ||
              (i.lastOrigin == t.origin &&
                t.origin &&
                (('+' == t.origin.charAt(0) &&
                  i.lastModTime > l - (e.cm ? e.cm.options.historyEventDelay : 500)) ||
                  '*' == t.origin.charAt(0)))) &&
            (o = ko(i, i.lastOp == r))
          )
            (a = Z(o.changes)),
              0 == ot(t.from, t.to) && 0 == ot(t.from, a.to)
                ? (a.to = lo(t))
                : o.changes.push(Co(e, t));
          else {
            var s = Z(i.done);
            (s && s.ranges) || To(e.sel, i.done),
              (o = { changes: [Co(e, t)], generation: i.generation }),
              i.done.push(o);
            while (i.done.length > i.undoDepth) i.done.shift(), i.done[0].ranges || i.done.shift();
          }
          i.done.push(n),
            (i.generation = ++i.maxGeneration),
            (i.lastModTime = i.lastSelTime = l),
            (i.lastOp = i.lastSelOp = r),
            (i.lastOrigin = i.lastSelOrigin = t.origin),
            a || ve(e, 'historyAdded');
        }
        function Oo(e, t, n, r) {
          var i = t.charAt(0);
          return (
            '*' == i ||
            ('+' == i &&
              n.ranges.length == r.ranges.length &&
              n.somethingSelected() == r.somethingSelected() &&
              new Date() - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500))
          );
        }
        function Lo(e, t, n, r) {
          var i = e.history,
            o = r && r.origin;
          n == i.lastSelOp ||
          (o &&
            i.lastSelOrigin == o &&
            ((i.lastModTime == i.lastSelTime && i.lastOrigin == o) || Oo(e, o, Z(i.done), t)))
            ? (i.done[i.done.length - 1] = t)
            : To(t, i.done),
            (i.lastSelTime = +new Date()),
            (i.lastSelOrigin = o),
            (i.lastSelOp = n),
            r && !1 !== r.clearRedo && So(i.undone);
        }
        function To(e, t) {
          var n = Z(t);
          (n && n.ranges && n.equals(e)) || t.push(e);
        }
        function No(e, t, n, r) {
          var i = t['spans_' + e.id],
            o = 0;
          e.iter(Math.max(e.first, n), Math.min(e.first + e.size, r), function (n) {
            n.markedSpans && ((i || (i = t['spans_' + e.id] = {}))[o] = n.markedSpans), ++o;
          });
        }
        function Mo(e) {
          if (!e) return null;
          for (var t, n = 0; n < e.length; ++n)
            e[n].marker.explicitlyCleared ? t || (t = e.slice(0, n)) : t && t.push(e[n]);
          return t ? (t.length ? t : null) : e;
        }
        function Ao(e, t) {
          var n = t['spans_' + e.id];
          if (!n) return null;
          for (var r = [], i = 0; i < t.text.length; ++i) r.push(Mo(n[i]));
          return r;
        }
        function jo(e, t) {
          var n = Ao(e, t),
            r = Rt(e, t);
          if (!n) return r;
          if (!r) return n;
          for (var i = 0; i < n.length; ++i) {
            var o = n[i],
              a = r[i];
            if (o && a)
              e: for (var l = 0; l < a.length; ++l) {
                for (var s = a[l], c = 0; c < o.length; ++c)
                  if (o[c].marker == s.marker) continue e;
                o.push(s);
              }
            else a && (n[i] = a);
          }
          return n;
        }
        function Po(e, t, n) {
          for (var r = [], i = 0; i < e.length; ++i) {
            var o = e[i];
            if (o.ranges) r.push(n ? ro.prototype.deepCopy.call(o) : o);
            else {
              var a = o.changes,
                l = [];
              r.push({ changes: l });
              for (var s = 0; s < a.length; ++s) {
                var c = a[s],
                  u = void 0;
                if ((l.push({ from: c.from, to: c.to, text: c.text }), t))
                  for (var f in c)
                    (u = f.match(/^spans_(\d+)$/)) &&
                      H(t, Number(u[1])) > -1 &&
                      ((Z(l)[f] = c[f]), delete c[f]);
              }
            }
          }
          return r;
        }
        function Io(e, t, n, r) {
          if (r) {
            var i = e.anchor;
            if (n) {
              var o = ot(t, i) < 0;
              o != ot(n, i) < 0 ? ((i = t), (t = n)) : o != ot(t, n) < 0 && (t = n);
            }
            return new io(i, t);
          }
          return new io(n || t, t);
        }
        function Do(e, t, n, r, i) {
          null == i && (i = e.cm && (e.cm.display.shift || e.extend)),
            Wo(e, new ro([Io(e.sel.primary(), t, n, i)], 0), r);
        }
        function _o(e, t, n) {
          for (
            var r = [], i = e.cm && (e.cm.display.shift || e.extend), o = 0;
            o < e.sel.ranges.length;
            o++
          )
            r[o] = Io(e.sel.ranges[o], t[o], null, i);
          var a = oo(e.cm, r, e.sel.primIndex);
          Wo(e, a, n);
        }
        function zo(e, t, n, r) {
          var i = e.sel.ranges.slice(0);
          (i[t] = n), Wo(e, oo(e.cm, i, e.sel.primIndex), r);
        }
        function Ro(e, t, n, r) {
          Wo(e, ao(t, n), r);
        }
        function Fo(e, t, n) {
          var r = {
            ranges: t.ranges,
            update: function (t) {
              this.ranges = [];
              for (var n = 0; n < t.length; n++)
                this.ranges[n] = new io(ft(e, t[n].anchor), ft(e, t[n].head));
            },
            origin: n && n.origin,
          };
          return (
            ve(e, 'beforeSelectionChange', e, r),
            e.cm && ve(e.cm, 'beforeSelectionChange', e.cm, r),
            r.ranges != t.ranges ? oo(e.cm, r.ranges, r.ranges.length - 1) : t
          );
        }
        function Ho(e, t, n) {
          var r = e.history.done,
            i = Z(r);
          i && i.ranges ? ((r[r.length - 1] = t), Bo(e, t, n)) : Wo(e, t, n);
        }
        function Wo(e, t, n) {
          Bo(e, t, n), Lo(e, e.sel, e.cm ? e.cm.curOp.id : NaN, n);
        }
        function Bo(e, t, n) {
          (we(e, 'beforeSelectionChange') || (e.cm && we(e.cm, 'beforeSelectionChange'))) &&
            (t = Fo(e, t, n));
          var r = (n && n.bias) || (ot(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
          Vo(e, Ko(e, t, r, !0)), (n && !1 === n.scroll) || !e.cm || ai(e.cm);
        }
        function Vo(e, t) {
          t.equals(e.sel) ||
            ((e.sel = t),
            e.cm && ((e.cm.curOp.updateInput = 1), (e.cm.curOp.selectionChanged = !0), be(e.cm)),
            Tn(e, 'cursorActivity', e));
        }
        function Uo(e) {
          Vo(e, Ko(e, e.sel, null, !1));
        }
        function Ko(e, t, n, r) {
          for (var i, o = 0; o < t.ranges.length; o++) {
            var a = t.ranges[o],
              l = t.ranges.length == e.sel.ranges.length && e.sel.ranges[o],
              s = Go(e, a.anchor, l && l.anchor, n, r),
              c = Go(e, a.head, l && l.head, n, r);
            (i || s != a.anchor || c != a.head) &&
              (i || (i = t.ranges.slice(0, o)), (i[o] = new io(s, c)));
          }
          return i ? oo(e.cm, i, t.primIndex) : t;
        }
        function qo(e, t, n, r, i) {
          var o = $e(e, t.line);
          if (o.markedSpans)
            for (var a = 0; a < o.markedSpans.length; ++a) {
              var l = o.markedSpans[a],
                s = l.marker,
                c = 'selectLeft' in s ? !s.selectLeft : s.inclusiveLeft,
                u = 'selectRight' in s ? !s.selectRight : s.inclusiveRight;
              if (
                (null == l.from || (c ? l.from <= t.ch : l.from < t.ch)) &&
                (null == l.to || (u ? l.to >= t.ch : l.to > t.ch))
              ) {
                if (i && (ve(s, 'beforeCursorEnter'), s.explicitlyCleared)) {
                  if (o.markedSpans) {
                    --a;
                    continue;
                  }
                  break;
                }
                if (!s.atomic) continue;
                if (n) {
                  var f = s.find(r < 0 ? 1 : -1),
                    p = void 0;
                  if (
                    ((r < 0 ? u : c) && (f = Yo(e, f, -r, f && f.line == t.line ? o : null)),
                    f && f.line == t.line && (p = ot(f, n)) && (r < 0 ? p < 0 : p > 0))
                  )
                    return qo(e, f, t, r, i);
                }
                var d = s.find(r < 0 ? -1 : 1);
                return (
                  (r < 0 ? c : u) && (d = Yo(e, d, r, d.line == t.line ? o : null)),
                  d ? qo(e, d, t, r, i) : null
                );
              }
            }
          return t;
        }
        function Go(e, t, n, r, i) {
          var o = r || 1,
            a =
              qo(e, t, n, o, i) ||
              (!i && qo(e, t, n, o, !0)) ||
              qo(e, t, n, -o, i) ||
              (!i && qo(e, t, n, -o, !0));
          return a || ((e.cantEdit = !0), it(e.first, 0));
        }
        function Yo(e, t, n, r) {
          return n < 0 && 0 == t.ch
            ? t.line > e.first
              ? ft(e, it(t.line - 1))
              : null
            : n > 0 && t.ch == (r || $e(e, t.line)).text.length
            ? t.line < e.first + e.size - 1
              ? it(t.line + 1, 0)
              : null
            : new it(t.line, t.ch + n);
        }
        function Zo(e) {
          e.setSelection(it(e.firstLine(), 0), it(e.lastLine()), V);
        }
        function $o(e, t, n) {
          var r = {
            canceled: !1,
            from: t.from,
            to: t.to,
            text: t.text,
            origin: t.origin,
            cancel: function () {
              return (r.canceled = !0);
            },
          };
          return (
            n &&
              (r.update = function (t, n, i, o) {
                t && (r.from = ft(e, t)),
                  n && (r.to = ft(e, n)),
                  i && (r.text = i),
                  void 0 !== o && (r.origin = o);
              }),
            ve(e, 'beforeChange', e, r),
            e.cm && ve(e.cm, 'beforeChange', e.cm, r),
            r.canceled
              ? (e.cm && (e.cm.curOp.updateInput = 2), null)
              : { from: r.from, to: r.to, text: r.text, origin: r.origin }
          );
        }
        function Xo(e, t, n) {
          if (e.cm) {
            if (!e.cm.curOp) return Ai(e.cm, Xo)(e, t, n);
            if (e.cm.state.suppressEdits) return;
          }
          if (
            !(we(e, 'beforeChange') || (e.cm && we(e.cm, 'beforeChange'))) ||
            ((t = $o(e, t, !0)), t)
          ) {
            var r = Tt && !n && Ht(e, t.from, t.to);
            if (r)
              for (var i = r.length - 1; i >= 0; --i)
                Jo(e, { from: r[i].from, to: r[i].to, text: i ? [''] : t.text, origin: t.origin });
            else Jo(e, t);
          }
        }
        function Jo(e, t) {
          if (1 != t.text.length || '' != t.text[0] || 0 != ot(t.from, t.to)) {
            var n = co(e, t);
            Eo(e, t, n, e.cm ? e.cm.curOp.id : NaN), ta(e, t, n, Rt(e, t));
            var r = [];
            vo(e, function (e, n) {
              n || -1 != H(r, e.history) || (aa(e.history, t), r.push(e.history)),
                ta(e, t, null, Rt(e, t));
            });
          }
        }
        function Qo(e, t, n) {
          var r = e.cm && e.cm.state.suppressEdits;
          if (!r || n) {
            for (
              var i,
                o = e.history,
                a = e.sel,
                l = 'undo' == t ? o.done : o.undone,
                s = 'undo' == t ? o.undone : o.done,
                c = 0;
              c < l.length;
              c++
            )
              if (((i = l[c]), n ? i.ranges && !i.equals(e.sel) : !i.ranges)) break;
            if (c != l.length) {
              for (o.lastOrigin = o.lastSelOrigin = null; ; ) {
                if (((i = l.pop()), !i.ranges)) {
                  if (r) return void l.push(i);
                  break;
                }
                if ((To(i, s), n && !i.equals(e.sel))) return void Wo(e, i, { clearRedo: !1 });
                a = i;
              }
              var u = [];
              To(a, s),
                s.push({ changes: u, generation: o.generation }),
                (o.generation = i.generation || ++o.maxGeneration);
              for (
                var f = we(e, 'beforeChange') || (e.cm && we(e.cm, 'beforeChange')),
                  p = function (n) {
                    var r = i.changes[n];
                    if (((r.origin = t), f && !$o(e, r, !1))) return (l.length = 0), {};
                    u.push(Co(e, r));
                    var o = n ? co(e, r) : Z(l);
                    ta(e, r, o, jo(e, r)),
                      !n && e.cm && e.cm.scrollIntoView({ from: r.from, to: lo(r) });
                    var a = [];
                    vo(e, function (e, t) {
                      t || -1 != H(a, e.history) || (aa(e.history, r), a.push(e.history)),
                        ta(e, r, null, jo(e, r));
                    });
                  },
                  d = i.changes.length - 1;
                d >= 0;
                --d
              ) {
                var h = p(d);
                if (h) return h.v;
              }
            }
          }
        }
        function ea(e, t) {
          if (
            0 != t &&
            ((e.first += t),
            (e.sel = new ro(
              $(e.sel.ranges, function (e) {
                return new io(it(e.anchor.line + t, e.anchor.ch), it(e.head.line + t, e.head.ch));
              }),
              e.sel.primIndex,
            )),
            e.cm)
          ) {
            _r(e.cm, e.first, e.first - t, t);
            for (var n = e.cm.display, r = n.viewFrom; r < n.viewTo; r++) zr(e.cm, r, 'gutter');
          }
        }
        function ta(e, t, n, r) {
          if (e.cm && !e.cm.curOp) return Ai(e.cm, ta)(e, t, n, r);
          if (t.to.line < e.first) ea(e, t.text.length - 1 - (t.to.line - t.from.line));
          else if (!(t.from.line > e.lastLine())) {
            if (t.from.line < e.first) {
              var i = t.text.length - 1 - (e.first - t.from.line);
              ea(e, i),
                (t = {
                  from: it(e.first, 0),
                  to: it(t.to.line + i, t.to.ch),
                  text: [Z(t.text)],
                  origin: t.origin,
                });
            }
            var o = e.lastLine();
            t.to.line > o &&
              (t = {
                from: t.from,
                to: it(o, $e(e, o).text.length),
                text: [t.text[0]],
                origin: t.origin,
              }),
              (t.removed = Xe(e, t.from, t.to)),
              n || (n = co(e, t)),
              e.cm ? na(e.cm, t, r) : go(e, t, r),
              Bo(e, n, V),
              e.cantEdit && Go(e, it(e.firstLine(), 0)) && (e.cantEdit = !1);
          }
        }
        function na(e, t, n) {
          var r = e.doc,
            i = e.display,
            o = t.from,
            a = t.to,
            l = !1,
            s = o.line;
          e.options.lineWrapping ||
            ((s = et(Xt($e(r, o.line)))),
            r.iter(s, a.line + 1, function (e) {
              if (e == i.maxLine) return (l = !0), !0;
            })),
            r.sel.contains(t.from, t.to) > -1 && be(e),
            go(r, t, n, jr(e)),
            e.options.lineWrapping ||
              (r.iter(s, o.line + t.text.length, function (e) {
                var t = an(e);
                t > i.maxLineLength &&
                  ((i.maxLine = e), (i.maxLineLength = t), (i.maxLineChanged = !0), (l = !1));
              }),
              l && (e.curOp.updateMaxLine = !0)),
            Lt(r, o.line),
            Ii(e, 400);
          var c = t.text.length - (a.line - o.line) - 1;
          t.full
            ? _r(e)
            : o.line != a.line || 1 != t.text.length || mo(e.doc, t)
            ? _r(e, o.line, a.line + 1, c)
            : zr(e, o.line, 'text');
          var u = we(e, 'changes'),
            f = we(e, 'change');
          if (f || u) {
            var p = { from: o, to: a, text: t.text, removed: t.removed, origin: t.origin };
            f && Tn(e, 'change', e, p),
              u && (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(p);
          }
          e.display.selForContextMenu = null;
        }
        function ra(e, t, n, r, i) {
          var o;
          r || (r = n),
            ot(r, n) < 0 && ((o = [r, n]), (n = o[0]), (r = o[1])),
            'string' == typeof t && (t = e.splitLines(t)),
            Xo(e, { from: n, to: r, text: t, origin: i });
        }
        function ia(e, t, n, r) {
          n < e.line ? (e.line += r) : t < e.line && ((e.line = t), (e.ch = 0));
        }
        function oa(e, t, n, r) {
          for (var i = 0; i < e.length; ++i) {
            var o = e[i],
              a = !0;
            if (o.ranges) {
              o.copied || ((o = e[i] = o.deepCopy()), (o.copied = !0));
              for (var l = 0; l < o.ranges.length; l++)
                ia(o.ranges[l].anchor, t, n, r), ia(o.ranges[l].head, t, n, r);
            } else {
              for (var s = 0; s < o.changes.length; ++s) {
                var c = o.changes[s];
                if (n < c.from.line)
                  (c.from = it(c.from.line + r, c.from.ch)), (c.to = it(c.to.line + r, c.to.ch));
                else if (t <= c.to.line) {
                  a = !1;
                  break;
                }
              }
              a || (e.splice(0, i + 1), (i = 0));
            }
          }
        }
        function aa(e, t) {
          var n = t.from.line,
            r = t.to.line,
            i = t.text.length - (r - n) - 1;
          oa(e.done, n, r, i), oa(e.undone, n, r, i);
        }
        function la(e, t, n, r) {
          var i = t,
            o = t;
          return (
            'number' == typeof t ? (o = $e(e, ut(e, t))) : (i = et(t)),
            null == i ? null : (r(o, i) && e.cm && zr(e.cm, i, n), o)
          );
        }
        function sa(e) {
          (this.lines = e), (this.parent = null);
          for (var t = 0, n = 0; n < e.length; ++n) (e[n].parent = this), (t += e[n].height);
          this.height = t;
        }
        function ca(e) {
          this.children = e;
          for (var t = 0, n = 0, r = 0; r < e.length; ++r) {
            var i = e[r];
            (t += i.chunkSize()), (n += i.height), (i.parent = this);
          }
          (this.size = t), (this.height = n), (this.parent = null);
        }
        (io.prototype.from = function () {
          return ct(this.anchor, this.head);
        }),
          (io.prototype.to = function () {
            return st(this.anchor, this.head);
          }),
          (io.prototype.empty = function () {
            return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
          }),
          (sa.prototype = {
            chunkSize: function () {
              return this.lines.length;
            },
            removeInner: function (e, t) {
              for (var n = e, r = e + t; n < r; ++n) {
                var i = this.lines[n];
                (this.height -= i.height), un(i), Tn(i, 'delete');
              }
              this.lines.splice(e, t);
            },
            collapse: function (e) {
              e.push.apply(e, this.lines);
            },
            insertInner: function (e, t, n) {
              (this.height += n),
                (this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e)));
              for (var r = 0; r < t.length; ++r) t[r].parent = this;
            },
            iterN: function (e, t, n) {
              for (var r = e + t; e < r; ++e) if (n(this.lines[e])) return !0;
            },
          }),
          (ca.prototype = {
            chunkSize: function () {
              return this.size;
            },
            removeInner: function (e, t) {
              this.size -= t;
              for (var n = 0; n < this.children.length; ++n) {
                var r = this.children[n],
                  i = r.chunkSize();
                if (e < i) {
                  var o = Math.min(t, i - e),
                    a = r.height;
                  if (
                    (r.removeInner(e, o),
                    (this.height -= a - r.height),
                    i == o && (this.children.splice(n--, 1), (r.parent = null)),
                    0 == (t -= o))
                  )
                    break;
                  e = 0;
                } else e -= i;
              }
              if (
                this.size - t < 25 &&
                (this.children.length > 1 || !(this.children[0] instanceof sa))
              ) {
                var l = [];
                this.collapse(l), (this.children = [new sa(l)]), (this.children[0].parent = this);
              }
            },
            collapse: function (e) {
              for (var t = 0; t < this.children.length; ++t) this.children[t].collapse(e);
            },
            insertInner: function (e, t, n) {
              (this.size += t.length), (this.height += n);
              for (var r = 0; r < this.children.length; ++r) {
                var i = this.children[r],
                  o = i.chunkSize();
                if (e <= o) {
                  if ((i.insertInner(e, t, n), i.lines && i.lines.length > 50)) {
                    for (var a = (i.lines.length % 25) + 25, l = a; l < i.lines.length; ) {
                      var s = new sa(i.lines.slice(l, (l += 25)));
                      (i.height -= s.height), this.children.splice(++r, 0, s), (s.parent = this);
                    }
                    (i.lines = i.lines.slice(0, a)), this.maybeSpill();
                  }
                  break;
                }
                e -= o;
              }
            },
            maybeSpill: function () {
              if (!(this.children.length <= 10)) {
                var e = this;
                do {
                  var t = e.children.splice(e.children.length - 5, 5),
                    n = new ca(t);
                  if (e.parent) {
                    (e.size -= n.size), (e.height -= n.height);
                    var r = H(e.parent.children, e);
                    e.parent.children.splice(r + 1, 0, n);
                  } else {
                    var i = new ca(e.children);
                    (i.parent = e), (e.children = [i, n]), (e = i);
                  }
                  n.parent = e.parent;
                } while (e.children.length > 10);
                e.parent.maybeSpill();
              }
            },
            iterN: function (e, t, n) {
              for (var r = 0; r < this.children.length; ++r) {
                var i = this.children[r],
                  o = i.chunkSize();
                if (e < o) {
                  var a = Math.min(t, o - e);
                  if (i.iterN(e, a, n)) return !0;
                  if (0 == (t -= a)) break;
                  e = 0;
                } else e -= o;
              }
            },
          });
        var ua = function (e, t, n) {
          if (n) for (var r in n) n.hasOwnProperty(r) && (this[r] = n[r]);
          (this.doc = e), (this.node = t);
        };
        function fa(e, t, n) {
          on(t) < ((e.curOp && e.curOp.scrollTop) || e.doc.scrollTop) && oi(e, n);
        }
        function pa(e, t, n, r) {
          var i = new ua(e, n, r),
            o = e.cm;
          return (
            o && i.noHScroll && (o.display.alignWidgets = !0),
            la(e, t, 'widget', function (t) {
              var n = t.widgets || (t.widgets = []);
              if (
                (null == i.insertAt
                  ? n.push(i)
                  : n.splice(Math.min(n.length - 1, Math.max(0, i.insertAt)), 0, i),
                (i.line = t),
                o && !nn(e, t))
              ) {
                var r = on(t) < e.scrollTop;
                Qe(t, t.height + Bn(i)), r && oi(o, i.height), (o.curOp.forceUpdate = !0);
              }
              return !0;
            }),
            o && Tn(o, 'lineWidgetAdded', o, i, 'number' == typeof t ? t : et(t)),
            i
          );
        }
        (ua.prototype.clear = function () {
          var e = this.doc.cm,
            t = this.line.widgets,
            n = this.line,
            r = et(n);
          if (null != r && t) {
            for (var i = 0; i < t.length; ++i) t[i] == this && t.splice(i--, 1);
            t.length || (n.widgets = null);
            var o = Bn(this);
            Qe(n, Math.max(0, n.height - o)),
              e &&
                (Mi(e, function () {
                  fa(e, n, -o), zr(e, r, 'widget');
                }),
                Tn(e, 'lineWidgetCleared', e, this, r));
          }
        }),
          (ua.prototype.changed = function () {
            var e = this,
              t = this.height,
              n = this.doc.cm,
              r = this.line;
            this.height = null;
            var i = Bn(this) - t;
            i &&
              (nn(this.doc, r) || Qe(r, r.height + i),
              n &&
                Mi(n, function () {
                  (n.curOp.forceUpdate = !0), fa(n, r, i), Tn(n, 'lineWidgetChanged', n, e, et(r));
                }));
          }),
          xe(ua);
        var da = 0,
          ha = function (e, t) {
            (this.lines = []), (this.type = t), (this.doc = e), (this.id = ++da);
          };
        function ma(e, t, n, r, i) {
          if (r && r.shared) return va(e, t, n, r, i);
          if (e.cm && !e.cm.curOp) return Ai(e.cm, ma)(e, t, n, r, i);
          var o = new ha(e, i),
            a = ot(t, n);
          if ((r && z(r, o, !1), a > 0 || (0 == a && !1 !== o.clearWhenEmpty))) return o;
          if (
            (o.replacedWith &&
              ((o.collapsed = !0),
              (o.widgetNode = M('span', [o.replacedWith], 'CodeMirror-widget')),
              r.handleMouseEvents || o.widgetNode.setAttribute('cm-ignore-events', 'true'),
              r.insertLeft && (o.widgetNode.insertLeft = !0)),
            o.collapsed)
          ) {
            if ($t(e, t.line, t, n, o) || (t.line != n.line && $t(e, n.line, t, n, o)))
              throw new Error('Inserting collapsed marker partially overlapping an existing one');
            At();
          }
          o.addToHistory && Eo(e, { from: t, to: n, origin: 'markText' }, e.sel, NaN);
          var l,
            s = t.line,
            c = e.cm;
          if (
            (e.iter(s, n.line + 1, function (e) {
              c && o.collapsed && !c.options.lineWrapping && Xt(e) == c.display.maxLine && (l = !0),
                o.collapsed && s != t.line && Qe(e, 0),
                Dt(e, new jt(o, s == t.line ? t.ch : null, s == n.line ? n.ch : null)),
                ++s;
            }),
            o.collapsed &&
              e.iter(t.line, n.line + 1, function (t) {
                nn(e, t) && Qe(t, 0);
              }),
            o.clearOnEnter &&
              he(o, 'beforeCursorEnter', function () {
                return o.clear();
              }),
            o.readOnly &&
              (Mt(), (e.history.done.length || e.history.undone.length) && e.clearHistory()),
            o.collapsed && ((o.id = ++da), (o.atomic = !0)),
            c)
          ) {
            if ((l && (c.curOp.updateMaxLine = !0), o.collapsed)) _r(c, t.line, n.line + 1);
            else if (o.className || o.startStyle || o.endStyle || o.css || o.attributes || o.title)
              for (var u = t.line; u <= n.line; u++) zr(c, u, 'text');
            o.atomic && Uo(c.doc), Tn(c, 'markerAdded', c, o);
          }
          return o;
        }
        (ha.prototype.clear = function () {
          if (!this.explicitlyCleared) {
            var e = this.doc.cm,
              t = e && !e.curOp;
            if ((t && Ci(e), we(this, 'clear'))) {
              var n = this.find();
              n && Tn(this, 'clear', n.from, n.to);
            }
            for (var r = null, i = null, o = 0; o < this.lines.length; ++o) {
              var a = this.lines[o],
                l = Pt(a.markedSpans, this);
              e && !this.collapsed
                ? zr(e, et(a), 'text')
                : e && (null != l.to && (i = et(a)), null != l.from && (r = et(a))),
                (a.markedSpans = It(a.markedSpans, l)),
                null == l.from && this.collapsed && !nn(this.doc, a) && e && Qe(a, Tr(e.display));
            }
            if (e && this.collapsed && !e.options.lineWrapping)
              for (var s = 0; s < this.lines.length; ++s) {
                var c = Xt(this.lines[s]),
                  u = an(c);
                u > e.display.maxLineLength &&
                  ((e.display.maxLine = c),
                  (e.display.maxLineLength = u),
                  (e.display.maxLineChanged = !0));
              }
            null != r && e && this.collapsed && _r(e, r, i + 1),
              (this.lines.length = 0),
              (this.explicitlyCleared = !0),
              this.atomic && this.doc.cantEdit && ((this.doc.cantEdit = !1), e && Uo(e.doc)),
              e && Tn(e, 'markerCleared', e, this, r, i),
              t && Si(e),
              this.parent && this.parent.clear();
          }
        }),
          (ha.prototype.find = function (e, t) {
            var n, r;
            null == e && 'bookmark' == this.type && (e = 1);
            for (var i = 0; i < this.lines.length; ++i) {
              var o = this.lines[i],
                a = Pt(o.markedSpans, this);
              if (null != a.from && ((n = it(t ? o : et(o), a.from)), -1 == e)) return n;
              if (null != a.to && ((r = it(t ? o : et(o), a.to)), 1 == e)) return r;
            }
            return n && { from: n, to: r };
          }),
          (ha.prototype.changed = function () {
            var e = this,
              t = this.find(-1, !0),
              n = this,
              r = this.doc.cm;
            t &&
              r &&
              Mi(r, function () {
                var i = t.line,
                  o = et(t.line),
                  a = er(r, o);
                if (
                  (a && (cr(a), (r.curOp.selectionChanged = r.curOp.forceUpdate = !0)),
                  (r.curOp.updateMaxLine = !0),
                  !nn(n.doc, i) && null != n.height)
                ) {
                  var l = n.height;
                  n.height = null;
                  var s = Bn(n) - l;
                  s && Qe(i, i.height + s);
                }
                Tn(r, 'markerChanged', r, e);
              });
          }),
          (ha.prototype.attachLine = function (e) {
            if (!this.lines.length && this.doc.cm) {
              var t = this.doc.cm.curOp;
              (t.maybeHiddenMarkers && -1 != H(t.maybeHiddenMarkers, this)) ||
                (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this);
            }
            this.lines.push(e);
          }),
          (ha.prototype.detachLine = function (e) {
            if ((this.lines.splice(H(this.lines, e), 1), !this.lines.length && this.doc.cm)) {
              var t = this.doc.cm.curOp;
              (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this);
            }
          }),
          xe(ha);
        var ga = function (e, t) {
          (this.markers = e), (this.primary = t);
          for (var n = 0; n < e.length; ++n) e[n].parent = this;
        };
        function va(e, t, n, r, i) {
          (r = z(r)), (r.shared = !1);
          var o = [ma(e, t, n, r, i)],
            a = o[0],
            l = r.widgetNode;
          return (
            vo(e, function (e) {
              l && (r.widgetNode = l.cloneNode(!0)), o.push(ma(e, ft(e, t), ft(e, n), r, i));
              for (var s = 0; s < e.linked.length; ++s) if (e.linked[s].isParent) return;
              a = Z(o);
            }),
            new ga(o, a)
          );
        }
        function ya(e) {
          return e.findMarks(it(e.first, 0), e.clipPos(it(e.lastLine())), function (e) {
            return e.parent;
          });
        }
        function ba(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n],
              i = r.find(),
              o = e.clipPos(i.from),
              a = e.clipPos(i.to);
            if (ot(o, a)) {
              var l = ma(e, o, a, r.primary, r.primary.type);
              r.markers.push(l), (l.parent = r);
            }
          }
        }
        function wa(e) {
          for (
            var t = function (t) {
                var n = e[t],
                  r = [n.primary.doc];
                vo(n.primary.doc, function (e) {
                  return r.push(e);
                });
                for (var i = 0; i < n.markers.length; i++) {
                  var o = n.markers[i];
                  -1 == H(r, o.doc) && ((o.parent = null), n.markers.splice(i--, 1));
                }
              },
              n = 0;
            n < e.length;
            n++
          )
            t(n);
        }
        (ga.prototype.clear = function () {
          if (!this.explicitlyCleared) {
            this.explicitlyCleared = !0;
            for (var e = 0; e < this.markers.length; ++e) this.markers[e].clear();
            Tn(this, 'clear');
          }
        }),
          (ga.prototype.find = function (e, t) {
            return this.primary.find(e, t);
          }),
          xe(ga);
        var xa = 0,
          Ca = function e(t, n, r, i, o) {
            if (!(this instanceof e)) return new e(t, n, r, i, o);
            null == r && (r = 0),
              ca.call(this, [new sa([new sn('', null)])]),
              (this.first = r),
              (this.scrollTop = this.scrollLeft = 0),
              (this.cantEdit = !1),
              (this.cleanGeneration = 1),
              (this.modeFrontier = this.highlightFrontier = r);
            var a = it(r, 0);
            (this.sel = ao(a)),
              (this.history = new xo(null)),
              (this.id = ++xa),
              (this.modeOption = n),
              (this.lineSep = i),
              (this.direction = 'rtl' == o ? 'rtl' : 'ltr'),
              (this.extend = !1),
              'string' == typeof t && (t = this.splitLines(t)),
              go(this, { from: a, to: a, text: t }),
              Wo(this, ao(a), V);
          };
        (Ca.prototype = Q(ca.prototype, {
          constructor: Ca,
          iter: function (e, t, n) {
            n
              ? this.iterN(e - this.first, t - e, n)
              : this.iterN(this.first, this.first + this.size, e);
          },
          insert: function (e, t) {
            for (var n = 0, r = 0; r < t.length; ++r) n += t[r].height;
            this.insertInner(e - this.first, t, n);
          },
          remove: function (e, t) {
            this.removeInner(e - this.first, t);
          },
          getValue: function (e) {
            var t = Je(this, this.first, this.first + this.size);
            return !1 === e ? t : t.join(e || this.lineSeparator());
          },
          setValue: Pi(function (e) {
            var t = it(this.first, 0),
              n = this.first + this.size - 1;
            Xo(
              this,
              {
                from: t,
                to: it(n, $e(this, n).text.length),
                text: this.splitLines(e),
                origin: 'setValue',
                full: !0,
              },
              !0,
            ),
              this.cm && li(this.cm, 0, 0),
              Wo(this, ao(t), V);
          }),
          replaceRange: function (e, t, n, r) {
            (t = ft(this, t)), (n = n ? ft(this, n) : t), ra(this, e, t, n, r);
          },
          getRange: function (e, t, n) {
            var r = Xe(this, ft(this, e), ft(this, t));
            return !1 === n ? r : r.join(n || this.lineSeparator());
          },
          getLine: function (e) {
            var t = this.getLineHandle(e);
            return t && t.text;
          },
          getLineHandle: function (e) {
            if (nt(this, e)) return $e(this, e);
          },
          getLineNumber: function (e) {
            return et(e);
          },
          getLineHandleVisualStart: function (e) {
            return 'number' == typeof e && (e = $e(this, e)), Xt(e);
          },
          lineCount: function () {
            return this.size;
          },
          firstLine: function () {
            return this.first;
          },
          lastLine: function () {
            return this.first + this.size - 1;
          },
          clipPos: function (e) {
            return ft(this, e);
          },
          getCursor: function (e) {
            var t,
              n = this.sel.primary();
            return (
              (t =
                null == e || 'head' == e
                  ? n.head
                  : 'anchor' == e
                  ? n.anchor
                  : 'end' == e || 'to' == e || !1 === e
                  ? n.to()
                  : n.from()),
              t
            );
          },
          listSelections: function () {
            return this.sel.ranges;
          },
          somethingSelected: function () {
            return this.sel.somethingSelected();
          },
          setCursor: Pi(function (e, t, n) {
            Ro(this, ft(this, 'number' == typeof e ? it(e, t || 0) : e), null, n);
          }),
          setSelection: Pi(function (e, t, n) {
            Ro(this, ft(this, e), ft(this, t || e), n);
          }),
          extendSelection: Pi(function (e, t, n) {
            Do(this, ft(this, e), t && ft(this, t), n);
          }),
          extendSelections: Pi(function (e, t) {
            _o(this, dt(this, e), t);
          }),
          extendSelectionsBy: Pi(function (e, t) {
            var n = $(this.sel.ranges, e);
            _o(this, dt(this, n), t);
          }),
          setSelections: Pi(function (e, t, n) {
            if (e.length) {
              for (var r = [], i = 0; i < e.length; i++)
                r[i] = new io(ft(this, e[i].anchor), ft(this, e[i].head));
              null == t && (t = Math.min(e.length - 1, this.sel.primIndex)),
                Wo(this, oo(this.cm, r, t), n);
            }
          }),
          addSelection: Pi(function (e, t, n) {
            var r = this.sel.ranges.slice(0);
            r.push(new io(ft(this, e), ft(this, t || e))),
              Wo(this, oo(this.cm, r, r.length - 1), n);
          }),
          getSelection: function (e) {
            for (var t, n = this.sel.ranges, r = 0; r < n.length; r++) {
              var i = Xe(this, n[r].from(), n[r].to());
              t = t ? t.concat(i) : i;
            }
            return !1 === e ? t : t.join(e || this.lineSeparator());
          },
          getSelections: function (e) {
            for (var t = [], n = this.sel.ranges, r = 0; r < n.length; r++) {
              var i = Xe(this, n[r].from(), n[r].to());
              !1 !== e && (i = i.join(e || this.lineSeparator())), (t[r] = i);
            }
            return t;
          },
          replaceSelection: function (e, t, n) {
            for (var r = [], i = 0; i < this.sel.ranges.length; i++) r[i] = e;
            this.replaceSelections(r, t, n || '+input');
          },
          replaceSelections: Pi(function (e, t, n) {
            for (var r = [], i = this.sel, o = 0; o < i.ranges.length; o++) {
              var a = i.ranges[o];
              r[o] = { from: a.from(), to: a.to(), text: this.splitLines(e[o]), origin: n };
            }
            for (var l = t && 'end' != t && fo(this, r, t), s = r.length - 1; s >= 0; s--)
              Xo(this, r[s]);
            l ? Ho(this, l) : this.cm && ai(this.cm);
          }),
          undo: Pi(function () {
            Qo(this, 'undo');
          }),
          redo: Pi(function () {
            Qo(this, 'redo');
          }),
          undoSelection: Pi(function () {
            Qo(this, 'undo', !0);
          }),
          redoSelection: Pi(function () {
            Qo(this, 'redo', !0);
          }),
          setExtending: function (e) {
            this.extend = e;
          },
          getExtending: function () {
            return this.extend;
          },
          historySize: function () {
            for (var e = this.history, t = 0, n = 0, r = 0; r < e.done.length; r++)
              e.done[r].ranges || ++t;
            for (var i = 0; i < e.undone.length; i++) e.undone[i].ranges || ++n;
            return { undo: t, redo: n };
          },
          clearHistory: function () {
            var e = this;
            (this.history = new xo(this.history.maxGeneration)),
              vo(
                this,
                function (t) {
                  return (t.history = e.history);
                },
                !0,
              );
          },
          markClean: function () {
            this.cleanGeneration = this.changeGeneration(!0);
          },
          changeGeneration: function (e) {
            return (
              e && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null),
              this.history.generation
            );
          },
          isClean: function (e) {
            return this.history.generation == (e || this.cleanGeneration);
          },
          getHistory: function () {
            return { done: Po(this.history.done), undone: Po(this.history.undone) };
          },
          setHistory: function (e) {
            var t = (this.history = new xo(this.history.maxGeneration));
            (t.done = Po(e.done.slice(0), null, !0)), (t.undone = Po(e.undone.slice(0), null, !0));
          },
          setGutterMarker: Pi(function (e, t, n) {
            return la(this, e, 'gutter', function (e) {
              var r = e.gutterMarkers || (e.gutterMarkers = {});
              return (r[t] = n), !n && re(r) && (e.gutterMarkers = null), !0;
            });
          }),
          clearGutter: Pi(function (e) {
            var t = this;
            this.iter(function (n) {
              n.gutterMarkers &&
                n.gutterMarkers[e] &&
                la(t, n, 'gutter', function () {
                  return (
                    (n.gutterMarkers[e] = null), re(n.gutterMarkers) && (n.gutterMarkers = null), !0
                  );
                });
            });
          }),
          lineInfo: function (e) {
            var t;
            if ('number' == typeof e) {
              if (!nt(this, e)) return null;
              if (((t = e), (e = $e(this, e)), !e)) return null;
            } else if (((t = et(e)), null == t)) return null;
            return {
              line: t,
              handle: e,
              text: e.text,
              gutterMarkers: e.gutterMarkers,
              textClass: e.textClass,
              bgClass: e.bgClass,
              wrapClass: e.wrapClass,
              widgets: e.widgets,
            };
          },
          addLineClass: Pi(function (e, t, n) {
            return la(this, e, 'gutter' == t ? 'gutter' : 'class', function (e) {
              var r =
                'text' == t
                  ? 'textClass'
                  : 'background' == t
                  ? 'bgClass'
                  : 'gutter' == t
                  ? 'gutterClass'
                  : 'wrapClass';
              if (e[r]) {
                if (k(n).test(e[r])) return !1;
                e[r] += ' ' + n;
              } else e[r] = n;
              return !0;
            });
          }),
          removeLineClass: Pi(function (e, t, n) {
            return la(this, e, 'gutter' == t ? 'gutter' : 'class', function (e) {
              var r =
                  'text' == t
                    ? 'textClass'
                    : 'background' == t
                    ? 'bgClass'
                    : 'gutter' == t
                    ? 'gutterClass'
                    : 'wrapClass',
                i = e[r];
              if (!i) return !1;
              if (null == n) e[r] = null;
              else {
                var o = i.match(k(n));
                if (!o) return !1;
                var a = o.index + o[0].length;
                e[r] =
                  i.slice(0, o.index) + (o.index && a != i.length ? ' ' : '') + i.slice(a) || null;
              }
              return !0;
            });
          }),
          addLineWidget: Pi(function (e, t, n) {
            return pa(this, e, t, n);
          }),
          removeLineWidget: function (e) {
            e.clear();
          },
          markText: function (e, t, n) {
            return ma(this, ft(this, e), ft(this, t), n, (n && n.type) || 'range');
          },
          setBookmark: function (e, t) {
            var n = {
              replacedWith: t && (null == t.nodeType ? t.widget : t),
              insertLeft: t && t.insertLeft,
              clearWhenEmpty: !1,
              shared: t && t.shared,
              handleMouseEvents: t && t.handleMouseEvents,
            };
            return (e = ft(this, e)), ma(this, e, e, n, 'bookmark');
          },
          findMarksAt: function (e) {
            e = ft(this, e);
            var t = [],
              n = $e(this, e.line).markedSpans;
            if (n)
              for (var r = 0; r < n.length; ++r) {
                var i = n[r];
                (null == i.from || i.from <= e.ch) &&
                  (null == i.to || i.to >= e.ch) &&
                  t.push(i.marker.parent || i.marker);
              }
            return t;
          },
          findMarks: function (e, t, n) {
            (e = ft(this, e)), (t = ft(this, t));
            var r = [],
              i = e.line;
            return (
              this.iter(e.line, t.line + 1, function (o) {
                var a = o.markedSpans;
                if (a)
                  for (var l = 0; l < a.length; l++) {
                    var s = a[l];
                    (null != s.to && i == e.line && e.ch >= s.to) ||
                      (null == s.from && i != e.line) ||
                      (null != s.from && i == t.line && s.from >= t.ch) ||
                      (n && !n(s.marker)) ||
                      r.push(s.marker.parent || s.marker);
                  }
                ++i;
              }),
              r
            );
          },
          getAllMarks: function () {
            var e = [];
            return (
              this.iter(function (t) {
                var n = t.markedSpans;
                if (n) for (var r = 0; r < n.length; ++r) null != n[r].from && e.push(n[r].marker);
              }),
              e
            );
          },
          posFromIndex: function (e) {
            var t,
              n = this.first,
              r = this.lineSeparator().length;
            return (
              this.iter(function (i) {
                var o = i.text.length + r;
                if (o > e) return (t = e), !0;
                (e -= o), ++n;
              }),
              ft(this, it(n, t))
            );
          },
          indexFromPos: function (e) {
            e = ft(this, e);
            var t = e.ch;
            if (e.line < this.first || e.ch < 0) return 0;
            var n = this.lineSeparator().length;
            return (
              this.iter(this.first, e.line, function (e) {
                t += e.text.length + n;
              }),
              t
            );
          },
          copy: function (e) {
            var t = new Ca(
              Je(this, this.first, this.first + this.size),
              this.modeOption,
              this.first,
              this.lineSep,
              this.direction,
            );
            return (
              (t.scrollTop = this.scrollTop),
              (t.scrollLeft = this.scrollLeft),
              (t.sel = this.sel),
              (t.extend = !1),
              e &&
                ((t.history.undoDepth = this.history.undoDepth), t.setHistory(this.getHistory())),
              t
            );
          },
          linkedDoc: function (e) {
            e || (e = {});
            var t = this.first,
              n = this.first + this.size;
            null != e.from && e.from > t && (t = e.from), null != e.to && e.to < n && (n = e.to);
            var r = new Ca(
              Je(this, t, n),
              e.mode || this.modeOption,
              t,
              this.lineSep,
              this.direction,
            );
            return (
              e.sharedHist && (r.history = this.history),
              (this.linked || (this.linked = [])).push({ doc: r, sharedHist: e.sharedHist }),
              (r.linked = [{ doc: this, isParent: !0, sharedHist: e.sharedHist }]),
              ba(r, ya(this)),
              r
            );
          },
          unlinkDoc: function (e) {
            if ((e instanceof _l && (e = e.doc), this.linked))
              for (var t = 0; t < this.linked.length; ++t) {
                var n = this.linked[t];
                if (n.doc == e) {
                  this.linked.splice(t, 1), e.unlinkDoc(this), wa(ya(this));
                  break;
                }
              }
            if (e.history == this.history) {
              var r = [e.id];
              vo(
                e,
                function (e) {
                  return r.push(e.id);
                },
                !0,
              ),
                (e.history = new xo(null)),
                (e.history.done = Po(this.history.done, r)),
                (e.history.undone = Po(this.history.undone, r));
            }
          },
          iterLinkedDocs: function (e) {
            vo(this, e);
          },
          getMode: function () {
            return this.mode;
          },
          getEditor: function () {
            return this.cm;
          },
          splitLines: function (e) {
            return this.lineSep ? e.split(this.lineSep) : Pe(e);
          },
          lineSeparator: function () {
            return this.lineSep || '\n';
          },
          setDirection: Pi(function (e) {
            'rtl' != e && (e = 'ltr'),
              e != this.direction &&
                ((this.direction = e),
                this.iter(function (e) {
                  return (e.order = null);
                }),
                this.cm && wo(this.cm));
          }),
        })),
          (Ca.prototype.eachLine = Ca.prototype.iter);
        var Sa = 0;
        function ka(e) {
          var t = this;
          if ((La(t), !ye(t, e) && !Vn(t.display, e))) {
            Ce(e), a && (Sa = +new Date());
            var n = Ir(t, e, !0),
              r = e.dataTransfer.files;
            if (n && !t.isReadOnly())
              if (r && r.length && window.FileReader && window.File)
                for (
                  var i = r.length,
                    o = Array(i),
                    l = 0,
                    s = function () {
                      ++l == i &&
                        Ai(t, function () {
                          n = ft(t.doc, n);
                          var e = {
                            from: n,
                            to: n,
                            text: t.doc.splitLines(
                              o
                                .filter(function (e) {
                                  return null != e;
                                })
                                .join(t.doc.lineSeparator()),
                            ),
                            origin: 'paste',
                          };
                          Xo(t.doc, e), Ho(t.doc, ao(ft(t.doc, n), ft(t.doc, lo(e))));
                        })();
                    },
                    c = function (e, n) {
                      if (
                        t.options.allowDropFileTypes &&
                        -1 == H(t.options.allowDropFileTypes, e.type)
                      )
                        s();
                      else {
                        var r = new FileReader();
                        (r.onerror = function () {
                          return s();
                        }),
                          (r.onload = function () {
                            var e = r.result;
                            /[\x00-\x08\x0e-\x1f]{2}/.test(e) || (o[n] = e), s();
                          }),
                          r.readAsText(e);
                      }
                    },
                    u = 0;
                  u < r.length;
                  u++
                )
                  c(r[u], u);
              else {
                if (t.state.draggingText && t.doc.sel.contains(n) > -1)
                  return (
                    t.state.draggingText(e),
                    void setTimeout(function () {
                      return t.display.input.focus();
                    }, 20)
                  );
                try {
                  var f = e.dataTransfer.getData('Text');
                  if (f) {
                    var p;
                    if (
                      (t.state.draggingText &&
                        !t.state.draggingText.copy &&
                        (p = t.listSelections()),
                      Bo(t.doc, ao(n, n)),
                      p)
                    )
                      for (var d = 0; d < p.length; ++d)
                        ra(t.doc, '', p[d].anchor, p[d].head, 'drag');
                    t.replaceSelection(f, 'around', 'paste'), t.display.input.focus();
                  }
                } catch (e) {}
              }
          }
        }
        function Ea(e, t) {
          if (a && (!e.state.draggingText || +new Date() - Sa < 100)) Ee(t);
          else if (
            !ye(e, t) &&
            !Vn(e.display, t) &&
            (t.dataTransfer.setData('Text', e.getSelection()),
            (t.dataTransfer.effectAllowed = 'copyMove'),
            t.dataTransfer.setDragImage && !p)
          ) {
            var n = N('img', null, null, 'position: fixed; left: 0; top: 0;');
            (n.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='),
              f &&
                ((n.width = n.height = 1),
                e.display.wrapper.appendChild(n),
                (n._top = n.offsetTop)),
              t.dataTransfer.setDragImage(n, 0, 0),
              f && n.parentNode.removeChild(n);
          }
        }
        function Oa(e, t) {
          var n = Ir(e, t);
          if (n) {
            var r = document.createDocumentFragment();
            Ur(e, n, r),
              e.display.dragCursor ||
                ((e.display.dragCursor = N(
                  'div',
                  null,
                  'CodeMirror-cursors CodeMirror-dragcursors',
                )),
                e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv)),
              T(e.display.dragCursor, r);
          }
        }
        function La(e) {
          e.display.dragCursor &&
            (e.display.lineSpace.removeChild(e.display.dragCursor), (e.display.dragCursor = null));
        }
        function Ta(e) {
          if (document.getElementsByClassName) {
            for (
              var t = document.getElementsByClassName('CodeMirror'), n = [], r = 0;
              r < t.length;
              r++
            ) {
              var i = t[r].CodeMirror;
              i && n.push(i);
            }
            n.length &&
              n[0].operation(function () {
                for (var t = 0; t < n.length; t++) e(n[t]);
              });
          }
        }
        var Na = !1;
        function Ma() {
          Na || (Aa(), (Na = !0));
        }
        function Aa() {
          var e;
          he(window, 'resize', function () {
            null == e &&
              (e = setTimeout(function () {
                (e = null), Ta(ja);
              }, 100));
          }),
            he(window, 'blur', function () {
              return Ta(Xr);
            });
        }
        function ja(e) {
          var t = e.display;
          (t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null),
            (t.scrollbarsClipped = !1),
            e.setSize();
        }
        for (
          var Pa = {
              3: 'Pause',
              8: 'Backspace',
              9: 'Tab',
              13: 'Enter',
              16: 'Shift',
              17: 'Ctrl',
              18: 'Alt',
              19: 'Pause',
              20: 'CapsLock',
              27: 'Esc',
              32: 'Space',
              33: 'PageUp',
              34: 'PageDown',
              35: 'End',
              36: 'Home',
              37: 'Left',
              38: 'Up',
              39: 'Right',
              40: 'Down',
              44: 'PrintScrn',
              45: 'Insert',
              46: 'Delete',
              59: ';',
              61: '=',
              91: 'Mod',
              92: 'Mod',
              93: 'Mod',
              106: '*',
              107: '=',
              109: '-',
              110: '.',
              111: '/',
              145: 'ScrollLock',
              173: '-',
              186: ';',
              187: '=',
              188: ',',
              189: '-',
              190: '.',
              191: '/',
              192: '`',
              219: '[',
              220: '\\',
              221: ']',
              222: "'",
              63232: 'Up',
              63233: 'Down',
              63234: 'Left',
              63235: 'Right',
              63272: 'Delete',
              63273: 'Home',
              63275: 'End',
              63276: 'PageUp',
              63277: 'PageDown',
              63302: 'Insert',
            },
            Ia = 0;
          Ia < 10;
          Ia++
        )
          Pa[Ia + 48] = Pa[Ia + 96] = String(Ia);
        for (var Da = 65; Da <= 90; Da++) Pa[Da] = String.fromCharCode(Da);
        for (var _a = 1; _a <= 12; _a++) Pa[_a + 111] = Pa[_a + 63235] = 'F' + _a;
        var za = {};
        function Ra(e) {
          var t,
            n,
            r,
            i,
            o = e.split(/-(?!$)/);
          e = o[o.length - 1];
          for (var a = 0; a < o.length - 1; a++) {
            var l = o[a];
            if (/^(cmd|meta|m)$/i.test(l)) i = !0;
            else if (/^a(lt)?$/i.test(l)) t = !0;
            else if (/^(c|ctrl|control)$/i.test(l)) n = !0;
            else {
              if (!/^s(hift)?$/i.test(l)) throw new Error('Unrecognized modifier name: ' + l);
              r = !0;
            }
          }
          return (
            t && (e = 'Alt-' + e),
            n && (e = 'Ctrl-' + e),
            i && (e = 'Cmd-' + e),
            r && (e = 'Shift-' + e),
            e
          );
        }
        function Fa(e) {
          var t = {};
          for (var n in e)
            if (e.hasOwnProperty(n)) {
              var r = e[n];
              if (/^(name|fallthrough|(de|at)tach)$/.test(n)) continue;
              if ('...' == r) {
                delete e[n];
                continue;
              }
              for (var i = $(n.split(' '), Ra), o = 0; o < i.length; o++) {
                var a = void 0,
                  l = void 0;
                o == i.length - 1
                  ? ((l = i.join(' ')), (a = r))
                  : ((l = i.slice(0, o + 1).join(' ')), (a = '...'));
                var s = t[l];
                if (s) {
                  if (s != a) throw new Error('Inconsistent bindings for ' + l);
                } else t[l] = a;
              }
              delete e[n];
            }
          for (var c in t) e[c] = t[c];
          return e;
        }
        function Ha(e, t, n, r) {
          t = Ua(t);
          var i = t.call ? t.call(e, r) : t[e];
          if (!1 === i) return 'nothing';
          if ('...' === i) return 'multi';
          if (null != i && n(i)) return 'handled';
          if (t.fallthrough) {
            if ('[object Array]' != Object.prototype.toString.call(t.fallthrough))
              return Ha(e, t.fallthrough, n, r);
            for (var o = 0; o < t.fallthrough.length; o++) {
              var a = Ha(e, t.fallthrough[o], n, r);
              if (a) return a;
            }
          }
        }
        function Wa(e) {
          var t = 'string' == typeof e ? e : Pa[e.keyCode];
          return 'Ctrl' == t || 'Alt' == t || 'Shift' == t || 'Mod' == t;
        }
        function Ba(e, t, n) {
          var r = e;
          return (
            t.altKey && 'Alt' != r && (e = 'Alt-' + e),
            (C ? t.metaKey : t.ctrlKey) && 'Ctrl' != r && (e = 'Ctrl-' + e),
            (C ? t.ctrlKey : t.metaKey) && 'Cmd' != r && (e = 'Cmd-' + e),
            !n && t.shiftKey && 'Shift' != r && (e = 'Shift-' + e),
            e
          );
        }
        function Va(e, t) {
          if (f && 34 == e.keyCode && e['char']) return !1;
          var n = Pa[e.keyCode];
          return (
            null != n && !e.altGraphKey && (3 == e.keyCode && e.code && (n = e.code), Ba(n, e, t))
          );
        }
        function Ua(e) {
          return 'string' == typeof e ? za[e] : e;
        }
        function Ka(e, t) {
          for (var n = e.doc.sel.ranges, r = [], i = 0; i < n.length; i++) {
            var o = t(n[i]);
            while (r.length && ot(o.from, Z(r).to) <= 0) {
              var a = r.pop();
              if (ot(a.from, o.from) < 0) {
                o.from = a.from;
                break;
              }
            }
            r.push(o);
          }
          Mi(e, function () {
            for (var t = r.length - 1; t >= 0; t--) ra(e.doc, '', r[t].from, r[t].to, '+delete');
            ai(e);
          });
        }
        function qa(e, t, n) {
          var r = ae(e.text, t + n, n);
          return r < 0 || r > e.text.length ? null : r;
        }
        function Ga(e, t, n) {
          var r = qa(e, t.ch, n);
          return null == r ? null : new it(t.line, r, n < 0 ? 'after' : 'before');
        }
        function Ya(e, t, n, r, i) {
          if (e) {
            'rtl' == t.doc.direction && (i = -i);
            var o = pe(n, t.doc.direction);
            if (o) {
              var a,
                l = i < 0 ? Z(o) : o[0],
                s = i < 0 == (1 == l.level),
                c = s ? 'after' : 'before';
              if (l.level > 0 || 'rtl' == t.doc.direction) {
                var u = tr(t, n);
                a = i < 0 ? n.text.length - 1 : 0;
                var f = nr(t, u, a).top;
                (a = le(
                  function (e) {
                    return nr(t, u, e).top == f;
                  },
                  i < 0 == (1 == l.level) ? l.from : l.to - 1,
                  a,
                )),
                  'before' == c && (a = qa(n, a, 1));
              } else a = i < 0 ? l.to : l.from;
              return new it(r, a, c);
            }
          }
          return new it(r, i < 0 ? n.text.length : 0, i < 0 ? 'before' : 'after');
        }
        function Za(e, t, n, r) {
          var i = pe(t, e.doc.direction);
          if (!i) return Ga(t, n, r);
          n.ch >= t.text.length
            ? ((n.ch = t.text.length), (n.sticky = 'before'))
            : n.ch <= 0 && ((n.ch = 0), (n.sticky = 'after'));
          var o = ue(i, n.ch, n.sticky),
            a = i[o];
          if ('ltr' == e.doc.direction && a.level % 2 == 0 && (r > 0 ? a.to > n.ch : a.from < n.ch))
            return Ga(t, n, r);
          var l,
            s = function (e, n) {
              return qa(t, e instanceof it ? e.ch : e, n);
            },
            c = function (n) {
              return e.options.lineWrapping
                ? ((l = l || tr(e, t)), Sr(e, t, l, n))
                : { begin: 0, end: t.text.length };
            },
            u = c('before' == n.sticky ? s(n, -1) : n.ch);
          if ('rtl' == e.doc.direction || 1 == a.level) {
            var f = (1 == a.level) == r < 0,
              p = s(n, f ? 1 : -1);
            if (null != p && (f ? p <= a.to && p <= u.end : p >= a.from && p >= u.begin)) {
              var d = f ? 'before' : 'after';
              return new it(n.line, p, d);
            }
          }
          var h = function (e, t, r) {
              for (
                var o = function (e, t) {
                  return t ? new it(n.line, s(e, 1), 'before') : new it(n.line, e, 'after');
                };
                e >= 0 && e < i.length;
                e += t
              ) {
                var a = i[e],
                  l = t > 0 == (1 != a.level),
                  c = l ? r.begin : s(r.end, -1);
                if (a.from <= c && c < a.to) return o(c, l);
                if (((c = l ? a.from : s(a.to, -1)), r.begin <= c && c < r.end)) return o(c, l);
              }
            },
            m = h(o + r, r, u);
          if (m) return m;
          var g = r > 0 ? u.end : s(u.begin, -1);
          return null == g ||
            (r > 0 && g == t.text.length) ||
            ((m = h(r > 0 ? 0 : i.length - 1, r, c(g))), !m)
            ? null
            : m;
        }
        (za.basic = {
          Left: 'goCharLeft',
          Right: 'goCharRight',
          Up: 'goLineUp',
          Down: 'goLineDown',
          End: 'goLineEnd',
          Home: 'goLineStartSmart',
          PageUp: 'goPageUp',
          PageDown: 'goPageDown',
          Delete: 'delCharAfter',
          Backspace: 'delCharBefore',
          'Shift-Backspace': 'delCharBefore',
          Tab: 'defaultTab',
          'Shift-Tab': 'indentAuto',
          Enter: 'newlineAndIndent',
          Insert: 'toggleOverwrite',
          Esc: 'singleSelection',
        }),
          (za.pcDefault = {
            'Ctrl-A': 'selectAll',
            'Ctrl-D': 'deleteLine',
            'Ctrl-Z': 'undo',
            'Shift-Ctrl-Z': 'redo',
            'Ctrl-Y': 'redo',
            'Ctrl-Home': 'goDocStart',
            'Ctrl-End': 'goDocEnd',
            'Ctrl-Up': 'goLineUp',
            'Ctrl-Down': 'goLineDown',
            'Ctrl-Left': 'goGroupLeft',
            'Ctrl-Right': 'goGroupRight',
            'Alt-Left': 'goLineStart',
            'Alt-Right': 'goLineEnd',
            'Ctrl-Backspace': 'delGroupBefore',
            'Ctrl-Delete': 'delGroupAfter',
            'Ctrl-S': 'save',
            'Ctrl-F': 'find',
            'Ctrl-G': 'findNext',
            'Shift-Ctrl-G': 'findPrev',
            'Shift-Ctrl-F': 'replace',
            'Shift-Ctrl-R': 'replaceAll',
            'Ctrl-[': 'indentLess',
            'Ctrl-]': 'indentMore',
            'Ctrl-U': 'undoSelection',
            'Shift-Ctrl-U': 'redoSelection',
            'Alt-U': 'redoSelection',
            fallthrough: 'basic',
          }),
          (za.emacsy = {
            'Ctrl-F': 'goCharRight',
            'Ctrl-B': 'goCharLeft',
            'Ctrl-P': 'goLineUp',
            'Ctrl-N': 'goLineDown',
            'Alt-F': 'goWordRight',
            'Alt-B': 'goWordLeft',
            'Ctrl-A': 'goLineStart',
            'Ctrl-E': 'goLineEnd',
            'Ctrl-V': 'goPageDown',
            'Shift-Ctrl-V': 'goPageUp',
            'Ctrl-D': 'delCharAfter',
            'Ctrl-H': 'delCharBefore',
            'Alt-D': 'delWordAfter',
            'Alt-Backspace': 'delWordBefore',
            'Ctrl-K': 'killLine',
            'Ctrl-T': 'transposeChars',
            'Ctrl-O': 'openLine',
          }),
          (za.macDefault = {
            'Cmd-A': 'selectAll',
            'Cmd-D': 'deleteLine',
            'Cmd-Z': 'undo',
            'Shift-Cmd-Z': 'redo',
            'Cmd-Y': 'redo',
            'Cmd-Home': 'goDocStart',
            'Cmd-Up': 'goDocStart',
            'Cmd-End': 'goDocEnd',
            'Cmd-Down': 'goDocEnd',
            'Alt-Left': 'goGroupLeft',
            'Alt-Right': 'goGroupRight',
            'Cmd-Left': 'goLineLeft',
            'Cmd-Right': 'goLineRight',
            'Alt-Backspace': 'delGroupBefore',
            'Ctrl-Alt-Backspace': 'delGroupAfter',
            'Alt-Delete': 'delGroupAfter',
            'Cmd-S': 'save',
            'Cmd-F': 'find',
            'Cmd-G': 'findNext',
            'Shift-Cmd-G': 'findPrev',
            'Cmd-Alt-F': 'replace',
            'Shift-Cmd-Alt-F': 'replaceAll',
            'Cmd-[': 'indentLess',
            'Cmd-]': 'indentMore',
            'Cmd-Backspace': 'delWrappedLineLeft',
            'Cmd-Delete': 'delWrappedLineRight',
            'Cmd-U': 'undoSelection',
            'Shift-Cmd-U': 'redoSelection',
            'Ctrl-Up': 'goDocStart',
            'Ctrl-Down': 'goDocEnd',
            fallthrough: ['basic', 'emacsy'],
          }),
          (za['default'] = y ? za.macDefault : za.pcDefault);
        var $a = {
          selectAll: Zo,
          singleSelection: function (e) {
            return e.setSelection(e.getCursor('anchor'), e.getCursor('head'), V);
          },
          killLine: function (e) {
            return Ka(e, function (t) {
              if (t.empty()) {
                var n = $e(e.doc, t.head.line).text.length;
                return t.head.ch == n && t.head.line < e.lastLine()
                  ? { from: t.head, to: it(t.head.line + 1, 0) }
                  : { from: t.head, to: it(t.head.line, n) };
              }
              return { from: t.from(), to: t.to() };
            });
          },
          deleteLine: function (e) {
            return Ka(e, function (t) {
              return { from: it(t.from().line, 0), to: ft(e.doc, it(t.to().line + 1, 0)) };
            });
          },
          delLineLeft: function (e) {
            return Ka(e, function (e) {
              return { from: it(e.from().line, 0), to: e.from() };
            });
          },
          delWrappedLineLeft: function (e) {
            return Ka(e, function (t) {
              var n = e.charCoords(t.head, 'div').top + 5,
                r = e.coordsChar({ left: 0, top: n }, 'div');
              return { from: r, to: t.from() };
            });
          },
          delWrappedLineRight: function (e) {
            return Ka(e, function (t) {
              var n = e.charCoords(t.head, 'div').top + 5,
                r = e.coordsChar({ left: e.display.lineDiv.offsetWidth + 100, top: n }, 'div');
              return { from: t.from(), to: r };
            });
          },
          undo: function (e) {
            return e.undo();
          },
          redo: function (e) {
            return e.redo();
          },
          undoSelection: function (e) {
            return e.undoSelection();
          },
          redoSelection: function (e) {
            return e.redoSelection();
          },
          goDocStart: function (e) {
            return e.extendSelection(it(e.firstLine(), 0));
          },
          goDocEnd: function (e) {
            return e.extendSelection(it(e.lastLine()));
          },
          goLineStart: function (e) {
            return e.extendSelectionsBy(
              function (t) {
                return Xa(e, t.head.line);
              },
              { origin: '+move', bias: 1 },
            );
          },
          goLineStartSmart: function (e) {
            return e.extendSelectionsBy(
              function (t) {
                return Qa(e, t.head);
              },
              { origin: '+move', bias: 1 },
            );
          },
          goLineEnd: function (e) {
            return e.extendSelectionsBy(
              function (t) {
                return Ja(e, t.head.line);
              },
              { origin: '+move', bias: -1 },
            );
          },
          goLineRight: function (e) {
            return e.extendSelectionsBy(function (t) {
              var n = e.cursorCoords(t.head, 'div').top + 5;
              return e.coordsChar({ left: e.display.lineDiv.offsetWidth + 100, top: n }, 'div');
            }, K);
          },
          goLineLeft: function (e) {
            return e.extendSelectionsBy(function (t) {
              var n = e.cursorCoords(t.head, 'div').top + 5;
              return e.coordsChar({ left: 0, top: n }, 'div');
            }, K);
          },
          goLineLeftSmart: function (e) {
            return e.extendSelectionsBy(function (t) {
              var n = e.cursorCoords(t.head, 'div').top + 5,
                r = e.coordsChar({ left: 0, top: n }, 'div');
              return r.ch < e.getLine(r.line).search(/\S/) ? Qa(e, t.head) : r;
            }, K);
          },
          goLineUp: function (e) {
            return e.moveV(-1, 'line');
          },
          goLineDown: function (e) {
            return e.moveV(1, 'line');
          },
          goPageUp: function (e) {
            return e.moveV(-1, 'page');
          },
          goPageDown: function (e) {
            return e.moveV(1, 'page');
          },
          goCharLeft: function (e) {
            return e.moveH(-1, 'char');
          },
          goCharRight: function (e) {
            return e.moveH(1, 'char');
          },
          goColumnLeft: function (e) {
            return e.moveH(-1, 'column');
          },
          goColumnRight: function (e) {
            return e.moveH(1, 'column');
          },
          goWordLeft: function (e) {
            return e.moveH(-1, 'word');
          },
          goGroupRight: function (e) {
            return e.moveH(1, 'group');
          },
          goGroupLeft: function (e) {
            return e.moveH(-1, 'group');
          },
          goWordRight: function (e) {
            return e.moveH(1, 'word');
          },
          delCharBefore: function (e) {
            return e.deleteH(-1, 'char');
          },
          delCharAfter: function (e) {
            return e.deleteH(1, 'char');
          },
          delWordBefore: function (e) {
            return e.deleteH(-1, 'word');
          },
          delWordAfter: function (e) {
            return e.deleteH(1, 'word');
          },
          delGroupBefore: function (e) {
            return e.deleteH(-1, 'group');
          },
          delGroupAfter: function (e) {
            return e.deleteH(1, 'group');
          },
          indentAuto: function (e) {
            return e.indentSelection('smart');
          },
          indentMore: function (e) {
            return e.indentSelection('add');
          },
          indentLess: function (e) {
            return e.indentSelection('subtract');
          },
          insertTab: function (e) {
            return e.replaceSelection('\t');
          },
          insertSoftTab: function (e) {
            for (
              var t = [], n = e.listSelections(), r = e.options.tabSize, i = 0;
              i < n.length;
              i++
            ) {
              var o = n[i].from(),
                a = R(e.getLine(o.line), o.ch, r);
              t.push(Y(r - (a % r)));
            }
            e.replaceSelections(t);
          },
          defaultTab: function (e) {
            e.somethingSelected() ? e.indentSelection('add') : e.execCommand('insertTab');
          },
          transposeChars: function (e) {
            return Mi(e, function () {
              for (var t = e.listSelections(), n = [], r = 0; r < t.length; r++)
                if (t[r].empty()) {
                  var i = t[r].head,
                    o = $e(e.doc, i.line).text;
                  if (o)
                    if ((i.ch == o.length && (i = new it(i.line, i.ch - 1)), i.ch > 0))
                      (i = new it(i.line, i.ch + 1)),
                        e.replaceRange(
                          o.charAt(i.ch - 1) + o.charAt(i.ch - 2),
                          it(i.line, i.ch - 2),
                          i,
                          '+transpose',
                        );
                    else if (i.line > e.doc.first) {
                      var a = $e(e.doc, i.line - 1).text;
                      a &&
                        ((i = new it(i.line, 1)),
                        e.replaceRange(
                          o.charAt(0) + e.doc.lineSeparator() + a.charAt(a.length - 1),
                          it(i.line - 1, a.length - 1),
                          i,
                          '+transpose',
                        ));
                    }
                  n.push(new io(i, i));
                }
              e.setSelections(n);
            });
          },
          newlineAndIndent: function (e) {
            return Mi(e, function () {
              for (var t = e.listSelections(), n = t.length - 1; n >= 0; n--)
                e.replaceRange(e.doc.lineSeparator(), t[n].anchor, t[n].head, '+input');
              t = e.listSelections();
              for (var r = 0; r < t.length; r++) e.indentLine(t[r].from().line, null, !0);
              ai(e);
            });
          },
          openLine: function (e) {
            return e.replaceSelection('\n', 'start');
          },
          toggleOverwrite: function (e) {
            return e.toggleOverwrite();
          },
        };
        function Xa(e, t) {
          var n = $e(e.doc, t),
            r = Xt(n);
          return r != n && (t = et(r)), Ya(!0, e, r, t, 1);
        }
        function Ja(e, t) {
          var n = $e(e.doc, t),
            r = Jt(n);
          return r != n && (t = et(r)), Ya(!0, e, n, t, -1);
        }
        function Qa(e, t) {
          var n = Xa(e, t.line),
            r = $e(e.doc, n.line),
            i = pe(r, e.doc.direction);
          if (!i || 0 == i[0].level) {
            var o = Math.max(n.ch, r.text.search(/\S/)),
              a = t.line == n.line && t.ch <= o && t.ch;
            return it(n.line, a ? 0 : o, n.sticky);
          }
          return n;
        }
        function el(e, t, n) {
          if ('string' == typeof t && ((t = $a[t]), !t)) return !1;
          e.display.input.ensurePolled();
          var r = e.display.shift,
            i = !1;
          try {
            e.isReadOnly() && (e.state.suppressEdits = !0),
              n && (e.display.shift = !1),
              (i = t(e) != B);
          } finally {
            (e.display.shift = r), (e.state.suppressEdits = !1);
          }
          return i;
        }
        function tl(e, t, n) {
          for (var r = 0; r < e.state.keyMaps.length; r++) {
            var i = Ha(t, e.state.keyMaps[r], n, e);
            if (i) return i;
          }
          return (
            (e.options.extraKeys && Ha(t, e.options.extraKeys, n, e)) ||
            Ha(t, e.options.keyMap, n, e)
          );
        }
        var nl = new F();
        function rl(e, t, n, r) {
          var i = e.state.keySeq;
          if (i) {
            if (Wa(t)) return 'handled';
            if (
              (/\'$/.test(t)
                ? (e.state.keySeq = null)
                : nl.set(50, function () {
                    e.state.keySeq == i && ((e.state.keySeq = null), e.display.input.reset());
                  }),
              il(e, i + ' ' + t, n, r))
            )
              return !0;
          }
          return il(e, t, n, r);
        }
        function il(e, t, n, r) {
          var i = tl(e, t, r);
          return (
            'multi' == i && (e.state.keySeq = t),
            'handled' == i && Tn(e, 'keyHandled', e, t, n),
            ('handled' != i && 'multi' != i) || (Ce(n), Gr(e)),
            !!i
          );
        }
        function ol(e, t) {
          var n = Va(t, !0);
          return (
            !!n &&
            (t.shiftKey && !e.state.keySeq
              ? rl(e, 'Shift-' + n, t, function (t) {
                  return el(e, t, !0);
                }) ||
                rl(e, n, t, function (t) {
                  if ('string' == typeof t ? /^go[A-Z]/.test(t) : t.motion) return el(e, t);
                })
              : rl(e, n, t, function (t) {
                  return el(e, t);
                }))
          );
        }
        function al(e, t, n) {
          return rl(e, "'" + n + "'", t, function (t) {
            return el(e, t, !0);
          });
        }
        var ll = null;
        function sl(e) {
          var t = this;
          if (
            (!e.target || e.target == t.display.input.getField()) &&
            ((t.curOp.focus = j()), !ye(t, e))
          ) {
            a && l < 11 && 27 == e.keyCode && (e.returnValue = !1);
            var r = e.keyCode;
            t.display.shift = 16 == r || e.shiftKey;
            var i = ol(t, e);
            f &&
              ((ll = i ? r : null),
              i ||
                88 != r ||
                De ||
                !(y ? e.metaKey : e.ctrlKey) ||
                t.replaceSelection('', null, 'cut')),
              n &&
                !y &&
                !i &&
                46 == r &&
                e.shiftKey &&
                !e.ctrlKey &&
                document.execCommand &&
                document.execCommand('cut'),
              18 != r || /\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className) || cl(t);
          }
        }
        function cl(e) {
          var t = e.display.lineDiv;
          function n(e) {
            (18 != e.keyCode && e.altKey) ||
              (O(t, 'CodeMirror-crosshair'),
              ge(document, 'keyup', n),
              ge(document, 'mouseover', n));
          }
          P(t, 'CodeMirror-crosshair'), he(document, 'keyup', n), he(document, 'mouseover', n);
        }
        function ul(e) {
          16 == e.keyCode && (this.doc.sel.shift = !1), ye(this, e);
        }
        function fl(e) {
          var t = this;
          if (
            (!e.target || e.target == t.display.input.getField()) &&
            !(Vn(t.display, e) || ye(t, e) || (e.ctrlKey && !e.altKey) || (y && e.metaKey))
          ) {
            var n = e.keyCode,
              r = e.charCode;
            if (f && n == ll) return (ll = null), void Ce(e);
            if (!f || (e.which && !(e.which < 10)) || !ol(t, e)) {
              var i = String.fromCharCode(null == r ? n : r);
              '\b' != i && (al(t, e, i) || t.display.input.onKeyPress(e));
            }
          }
        }
        var pl,
          dl,
          hl = 400,
          ml = function (e, t, n) {
            (this.time = e), (this.pos = t), (this.button = n);
          };
        function gl(e, t) {
          var n = +new Date();
          return dl && dl.compare(n, e, t)
            ? ((pl = dl = null), 'triple')
            : pl && pl.compare(n, e, t)
            ? ((dl = new ml(n, e, t)), (pl = null), 'double')
            : ((pl = new ml(n, e, t)), (dl = null), 'single');
        }
        function vl(e) {
          var t = this,
            n = t.display;
          if (!(ye(t, e) || (n.activeTouch && n.input.supportsTouch())))
            if ((n.input.ensurePolled(), (n.shift = e.shiftKey), Vn(n, e)))
              s ||
                ((n.scroller.draggable = !1),
                setTimeout(function () {
                  return (n.scroller.draggable = !0);
                }, 100));
            else if (!Ol(t, e)) {
              var r = Ir(t, e),
                i = Le(e),
                o = r ? gl(r, i) : 'single';
              window.focus(),
                1 == i && t.state.selectingText && t.state.selectingText(e),
                (r && yl(t, i, r, o, e)) ||
                  (1 == i
                    ? r
                      ? wl(t, r, o, e)
                      : Oe(e) == n.scroller && Ce(e)
                    : 2 == i
                    ? (r && Do(t.doc, r),
                      setTimeout(function () {
                        return n.input.focus();
                      }, 20))
                    : 3 == i && (S ? t.display.input.onContextMenu(e) : Zr(t)));
            }
        }
        function yl(e, t, n, r, i) {
          var o = 'Click';
          return (
            'double' == r ? (o = 'Double' + o) : 'triple' == r && (o = 'Triple' + o),
            (o = (1 == t ? 'Left' : 2 == t ? 'Middle' : 'Right') + o),
            rl(e, Ba(o, i), i, function (t) {
              if (('string' == typeof t && (t = $a[t]), !t)) return !1;
              var r = !1;
              try {
                e.isReadOnly() && (e.state.suppressEdits = !0), (r = t(e, n) != B);
              } finally {
                e.state.suppressEdits = !1;
              }
              return r;
            })
          );
        }
        function bl(e, t, n) {
          var r = e.getOption('configureMouse'),
            i = r ? r(e, t, n) : {};
          if (null == i.unit) {
            var o = b ? n.shiftKey && n.metaKey : n.altKey;
            i.unit = o ? 'rectangle' : 'single' == t ? 'char' : 'double' == t ? 'word' : 'line';
          }
          return (
            (null == i.extend || e.doc.extend) && (i.extend = e.doc.extend || n.shiftKey),
            null == i.addNew && (i.addNew = y ? n.metaKey : n.ctrlKey),
            null == i.moveOnDrag && (i.moveOnDrag = !(y ? n.altKey : n.ctrlKey)),
            i
          );
        }
        function wl(e, t, n, r) {
          a ? setTimeout(_(Yr, e), 0) : (e.curOp.focus = j());
          var i,
            o = bl(e, n, r),
            l = e.doc.sel;
          e.options.dragDrop &&
          Me &&
          !e.isReadOnly() &&
          'single' == n &&
          (i = l.contains(t)) > -1 &&
          (ot((i = l.ranges[i]).from(), t) < 0 || t.xRel > 0) &&
          (ot(i.to(), t) > 0 || t.xRel < 0)
            ? xl(e, r, t, o)
            : Sl(e, r, t, o);
        }
        function xl(e, t, n, r) {
          var i = e.display,
            o = !1,
            c = Ai(e, function (t) {
              s && (i.scroller.draggable = !1),
                (e.state.draggingText = !1),
                ge(i.wrapper.ownerDocument, 'mouseup', c),
                ge(i.wrapper.ownerDocument, 'mousemove', u),
                ge(i.scroller, 'dragstart', f),
                ge(i.scroller, 'drop', c),
                o ||
                  (Ce(t),
                  r.addNew || Do(e.doc, n, null, null, r.extend),
                  (s && !p) || (a && 9 == l)
                    ? setTimeout(function () {
                        i.wrapper.ownerDocument.body.focus({ preventScroll: !0 }), i.input.focus();
                      }, 20)
                    : i.input.focus());
            }),
            u = function (e) {
              o = o || Math.abs(t.clientX - e.clientX) + Math.abs(t.clientY - e.clientY) >= 10;
            },
            f = function () {
              return (o = !0);
            };
          s && (i.scroller.draggable = !0),
            (e.state.draggingText = c),
            (c.copy = !r.moveOnDrag),
            i.scroller.dragDrop && i.scroller.dragDrop(),
            he(i.wrapper.ownerDocument, 'mouseup', c),
            he(i.wrapper.ownerDocument, 'mousemove', u),
            he(i.scroller, 'dragstart', f),
            he(i.scroller, 'drop', c),
            Zr(e),
            setTimeout(function () {
              return i.input.focus();
            }, 20);
        }
        function Cl(e, t, n) {
          if ('char' == n) return new io(t, t);
          if ('word' == n) return e.findWordAt(t);
          if ('line' == n) return new io(it(t.line, 0), ft(e.doc, it(t.line + 1, 0)));
          var r = n(e, t);
          return new io(r.from, r.to);
        }
        function Sl(e, t, n, r) {
          var i = e.display,
            o = e.doc;
          Ce(t);
          var a,
            l,
            s = o.sel,
            c = s.ranges;
          if (
            (r.addNew && !r.extend
              ? ((l = o.sel.contains(n)), (a = l > -1 ? c[l] : new io(n, n)))
              : ((a = o.sel.primary()), (l = o.sel.primIndex)),
            'rectangle' == r.unit)
          )
            r.addNew || (a = new io(n, n)), (n = Ir(e, t, !0, !0)), (l = -1);
          else {
            var u = Cl(e, n, r.unit);
            a = r.extend ? Io(a, u.anchor, u.head, r.extend) : u;
          }
          r.addNew
            ? -1 == l
              ? ((l = c.length), Wo(o, oo(e, c.concat([a]), l), { scroll: !1, origin: '*mouse' }))
              : c.length > 1 && c[l].empty() && 'char' == r.unit && !r.extend
              ? (Wo(o, oo(e, c.slice(0, l).concat(c.slice(l + 1)), 0), {
                  scroll: !1,
                  origin: '*mouse',
                }),
                (s = o.sel))
              : zo(o, l, a, U)
            : ((l = 0), Wo(o, new ro([a], 0), U), (s = o.sel));
          var f = n;
          function p(t) {
            if (0 != ot(f, t))
              if (((f = t), 'rectangle' == r.unit)) {
                for (
                  var i = [],
                    c = e.options.tabSize,
                    u = R($e(o, n.line).text, n.ch, c),
                    p = R($e(o, t.line).text, t.ch, c),
                    d = Math.min(u, p),
                    h = Math.max(u, p),
                    m = Math.min(n.line, t.line),
                    g = Math.min(e.lastLine(), Math.max(n.line, t.line));
                  m <= g;
                  m++
                ) {
                  var v = $e(o, m).text,
                    y = q(v, d, c);
                  d == h
                    ? i.push(new io(it(m, y), it(m, y)))
                    : v.length > y && i.push(new io(it(m, y), it(m, q(v, h, c))));
                }
                i.length || i.push(new io(n, n)),
                  Wo(o, oo(e, s.ranges.slice(0, l).concat(i), l), { origin: '*mouse', scroll: !1 }),
                  e.scrollIntoView(t);
              } else {
                var b,
                  w = a,
                  x = Cl(e, t, r.unit),
                  C = w.anchor;
                ot(x.anchor, C) > 0
                  ? ((b = x.head), (C = ct(w.from(), x.anchor)))
                  : ((b = x.anchor), (C = st(w.to(), x.head)));
                var S = s.ranges.slice(0);
                (S[l] = kl(e, new io(ft(o, C), b))), Wo(o, oo(e, S, l), U);
              }
          }
          var d = i.wrapper.getBoundingClientRect(),
            h = 0;
          function m(t) {
            var n = ++h,
              a = Ir(e, t, !0, 'rectangle' == r.unit);
            if (a)
              if (0 != ot(a, f)) {
                (e.curOp.focus = j()), p(a);
                var l = ei(i, o);
                (a.line >= l.to || a.line < l.from) &&
                  setTimeout(
                    Ai(e, function () {
                      h == n && m(t);
                    }),
                    150,
                  );
              } else {
                var s = t.clientY < d.top ? -20 : t.clientY > d.bottom ? 20 : 0;
                s &&
                  setTimeout(
                    Ai(e, function () {
                      h == n && ((i.scroller.scrollTop += s), m(t));
                    }),
                    50,
                  );
              }
          }
          function g(t) {
            (e.state.selectingText = !1),
              (h = 1 / 0),
              t && (Ce(t), i.input.focus()),
              ge(i.wrapper.ownerDocument, 'mousemove', v),
              ge(i.wrapper.ownerDocument, 'mouseup', y),
              (o.history.lastSelOrigin = null);
          }
          var v = Ai(e, function (e) {
              0 !== e.buttons && Le(e) ? m(e) : g(e);
            }),
            y = Ai(e, g);
          (e.state.selectingText = y),
            he(i.wrapper.ownerDocument, 'mousemove', v),
            he(i.wrapper.ownerDocument, 'mouseup', y);
        }
        function kl(e, t) {
          var n = t.anchor,
            r = t.head,
            i = $e(e.doc, n.line);
          if (0 == ot(n, r) && n.sticky == r.sticky) return t;
          var o = pe(i);
          if (!o) return t;
          var a = ue(o, n.ch, n.sticky),
            l = o[a];
          if (l.from != n.ch && l.to != n.ch) return t;
          var s,
            c = a + ((l.from == n.ch) == (1 != l.level) ? 0 : 1);
          if (0 == c || c == o.length) return t;
          if (r.line != n.line) s = (r.line - n.line) * ('ltr' == e.doc.direction ? 1 : -1) > 0;
          else {
            var u = ue(o, r.ch, r.sticky),
              f = u - a || (r.ch - n.ch) * (1 == l.level ? -1 : 1);
            s = u == c - 1 || u == c ? f < 0 : f > 0;
          }
          var p = o[c + (s ? -1 : 0)],
            d = s == (1 == p.level),
            h = d ? p.from : p.to,
            m = d ? 'after' : 'before';
          return n.ch == h && n.sticky == m ? t : new io(new it(n.line, h, m), r);
        }
        function El(e, t, n, r) {
          var i, o;
          if (t.touches) (i = t.touches[0].clientX), (o = t.touches[0].clientY);
          else
            try {
              (i = t.clientX), (o = t.clientY);
            } catch (t) {
              return !1;
            }
          if (i >= Math.floor(e.display.gutters.getBoundingClientRect().right)) return !1;
          r && Ce(t);
          var a = e.display,
            l = a.lineDiv.getBoundingClientRect();
          if (o > l.bottom || !we(e, n)) return ke(t);
          o -= l.top - a.viewOffset;
          for (var s = 0; s < e.display.gutterSpecs.length; ++s) {
            var c = a.gutters.childNodes[s];
            if (c && c.getBoundingClientRect().right >= i) {
              var u = tt(e.doc, o),
                f = e.display.gutterSpecs[s];
              return ve(e, n, e, u, f.className, t), ke(t);
            }
          }
        }
        function Ol(e, t) {
          return El(e, t, 'gutterClick', !0);
        }
        function Ll(e, t) {
          Vn(e.display, t) ||
            Tl(e, t) ||
            ye(e, t, 'contextmenu') ||
            S ||
            e.display.input.onContextMenu(t);
        }
        function Tl(e, t) {
          return !!we(e, 'gutterContextMenu') && El(e, t, 'gutterContextMenu', !1);
        }
        function Nl(e) {
          (e.display.wrapper.className =
            e.display.wrapper.className.replace(/\s*cm-s-\S+/g, '') +
            e.options.theme.replace(/(^|\s)\s*/g, ' cm-s-')),
            fr(e);
        }
        ml.prototype.compare = function (e, t, n) {
          return this.time + hl > e && 0 == ot(t, this.pos) && n == this.button;
        };
        var Ml = {
            toString: function () {
              return 'CodeMirror.Init';
            },
          },
          Al = {},
          jl = {};
        function Pl(e) {
          var t = e.optionHandlers;
          function n(n, r, i, o) {
            (e.defaults[n] = r),
              i &&
                (t[n] = o
                  ? function (e, t, n) {
                      n != Ml && i(e, t, n);
                    }
                  : i);
          }
          (e.defineOption = n),
            (e.Init = Ml),
            n(
              'value',
              '',
              function (e, t) {
                return e.setValue(t);
              },
              !0,
            ),
            n(
              'mode',
              null,
              function (e, t) {
                (e.doc.modeOption = t), po(e);
              },
              !0,
            ),
            n('indentUnit', 2, po, !0),
            n('indentWithTabs', !1),
            n('smartIndent', !0),
            n(
              'tabSize',
              4,
              function (e) {
                ho(e), fr(e), _r(e);
              },
              !0,
            ),
            n('lineSeparator', null, function (e, t) {
              if (((e.doc.lineSep = t), t)) {
                var n = [],
                  r = e.doc.first;
                e.doc.iter(function (e) {
                  for (var i = 0; ; ) {
                    var o = e.text.indexOf(t, i);
                    if (-1 == o) break;
                    (i = o + t.length), n.push(it(r, o));
                  }
                  r++;
                });
                for (var i = n.length - 1; i >= 0; i--)
                  ra(e.doc, t, n[i], it(n[i].line, n[i].ch + t.length));
              }
            }),
            n(
              'specialChars',
              /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g,
              function (e, t, n) {
                (e.state.specialChars = new RegExp(t.source + (t.test('\t') ? '' : '|\t'), 'g')),
                  n != Ml && e.refresh();
              },
            ),
            n(
              'specialCharPlaceholder',
              mn,
              function (e) {
                return e.refresh();
              },
              !0,
            ),
            n('electricChars', !0),
            n(
              'inputStyle',
              v ? 'contenteditable' : 'textarea',
              function () {
                throw new Error('inputStyle can not (yet) be changed in a running editor');
              },
              !0,
            ),
            n(
              'spellcheck',
              !1,
              function (e, t) {
                return (e.getInputField().spellcheck = t);
              },
              !0,
            ),
            n(
              'autocorrect',
              !1,
              function (e, t) {
                return (e.getInputField().autocorrect = t);
              },
              !0,
            ),
            n(
              'autocapitalize',
              !1,
              function (e, t) {
                return (e.getInputField().autocapitalize = t);
              },
              !0,
            ),
            n('rtlMoveVisually', !w),
            n('wholeLineUpdateBefore', !0),
            n(
              'theme',
              'default',
              function (e) {
                Nl(e), $i(e);
              },
              !0,
            ),
            n('keyMap', 'default', function (e, t, n) {
              var r = Ua(t),
                i = n != Ml && Ua(n);
              i && i.detach && i.detach(e, r), r.attach && r.attach(e, i || null);
            }),
            n('extraKeys', null),
            n('configureMouse', null),
            n('lineWrapping', !1, Dl, !0),
            n(
              'gutters',
              [],
              function (e, t) {
                (e.display.gutterSpecs = Yi(t, e.options.lineNumbers)), $i(e);
              },
              !0,
            ),
            n(
              'fixedGutter',
              !0,
              function (e, t) {
                (e.display.gutters.style.left = t ? Ar(e.display) + 'px' : '0'), e.refresh();
              },
              !0,
            ),
            n(
              'coverGutterNextToScrollbar',
              !1,
              function (e) {
                return vi(e);
              },
              !0,
            ),
            n(
              'scrollbarStyle',
              'native',
              function (e) {
                wi(e),
                  vi(e),
                  e.display.scrollbars.setScrollTop(e.doc.scrollTop),
                  e.display.scrollbars.setScrollLeft(e.doc.scrollLeft);
              },
              !0,
            ),
            n(
              'lineNumbers',
              !1,
              function (e, t) {
                (e.display.gutterSpecs = Yi(e.options.gutters, t)), $i(e);
              },
              !0,
            ),
            n('firstLineNumber', 1, $i, !0),
            n(
              'lineNumberFormatter',
              function (e) {
                return e;
              },
              $i,
              !0,
            ),
            n('showCursorWhenSelecting', !1, Br, !0),
            n('resetSelectionOnContextMenu', !0),
            n('lineWiseCopyCut', !0),
            n('pasteLinesPerSelection', !0),
            n('selectionsMayTouch', !1),
            n('readOnly', !1, function (e, t) {
              'nocursor' == t && (Xr(e), e.display.input.blur()),
                e.display.input.readOnlyChanged(t);
            }),
            n('screenReaderLabel', null, function (e, t) {
              (t = '' === t ? null : t), e.display.input.screenReaderLabelChanged(t);
            }),
            n(
              'disableInput',
              !1,
              function (e, t) {
                t || e.display.input.reset();
              },
              !0,
            ),
            n('dragDrop', !0, Il),
            n('allowDropFileTypes', null),
            n('cursorBlinkRate', 530),
            n('cursorScrollMargin', 0),
            n('cursorHeight', 1, Br, !0),
            n('singleCursorHeightPerLine', !0, Br, !0),
            n('workTime', 100),
            n('workDelay', 100),
            n('flattenSpans', !0, ho, !0),
            n('addModeClass', !1, ho, !0),
            n('pollInterval', 100),
            n('undoDepth', 200, function (e, t) {
              return (e.doc.history.undoDepth = t);
            }),
            n('historyEventDelay', 1250),
            n(
              'viewportMargin',
              10,
              function (e) {
                return e.refresh();
              },
              !0,
            ),
            n('maxHighlightLength', 1e4, ho, !0),
            n('moveInputWithCursor', !0, function (e, t) {
              t || e.display.input.resetPosition();
            }),
            n('tabindex', null, function (e, t) {
              return (e.display.input.getField().tabIndex = t || '');
            }),
            n('autofocus', null),
            n(
              'direction',
              'ltr',
              function (e, t) {
                return e.doc.setDirection(t);
              },
              !0,
            ),
            n('phrases', null);
        }
        function Il(e, t, n) {
          var r = n && n != Ml;
          if (!t != !r) {
            var i = e.display.dragFunctions,
              o = t ? he : ge;
            o(e.display.scroller, 'dragstart', i.start),
              o(e.display.scroller, 'dragenter', i.enter),
              o(e.display.scroller, 'dragover', i.over),
              o(e.display.scroller, 'dragleave', i.leave),
              o(e.display.scroller, 'drop', i.drop);
          }
        }
        function Dl(e) {
          e.options.lineWrapping
            ? (P(e.display.wrapper, 'CodeMirror-wrap'),
              (e.display.sizer.style.minWidth = ''),
              (e.display.sizerWidth = null))
            : (O(e.display.wrapper, 'CodeMirror-wrap'), ln(e)),
            Pr(e),
            _r(e),
            fr(e),
            setTimeout(function () {
              return vi(e);
            }, 100);
        }
        function _l(e, t) {
          var n = this;
          if (!(this instanceof _l)) return new _l(e, t);
          (this.options = t = t ? z(t) : {}), z(Al, t, !1);
          var r = t.value;
          'string' == typeof r
            ? (r = new Ca(r, t.mode, null, t.lineSeparator, t.direction))
            : t.mode && (r.modeOption = t.mode),
            (this.doc = r);
          var i = new _l.inputStyles[t.inputStyle](this),
            o = (this.display = new Xi(e, r, i, t));
          for (var c in ((o.wrapper.CodeMirror = this),
          Nl(this),
          t.lineWrapping && (this.display.wrapper.className += ' CodeMirror-wrap'),
          wi(this),
          (this.state = {
            keyMaps: [],
            overlays: [],
            modeGen: 0,
            overwrite: !1,
            delayingBlurEvent: !1,
            focused: !1,
            suppressEdits: !1,
            pasteIncoming: -1,
            cutIncoming: -1,
            selectingText: !1,
            draggingText: !1,
            highlight: new F(),
            keySeq: null,
            specialChars: null,
          }),
          t.autofocus && !v && o.input.focus(),
          a &&
            l < 11 &&
            setTimeout(function () {
              return n.display.input.reset(!0);
            }, 20),
          zl(this),
          Ma(),
          Ci(this),
          (this.curOp.forceUpdate = !0),
          yo(this, r),
          (t.autofocus && !v) || this.hasFocus() ? setTimeout(_($r, this), 20) : Xr(this),
          jl))
            jl.hasOwnProperty(c) && jl[c](this, t[c], Ml);
          Gi(this), t.finishInit && t.finishInit(this);
          for (var u = 0; u < Rl.length; ++u) Rl[u](this);
          Si(this),
            s &&
              t.lineWrapping &&
              'optimizelegibility' == getComputedStyle(o.lineDiv).textRendering &&
              (o.lineDiv.style.textRendering = 'auto');
        }
        function zl(e) {
          var t = e.display;
          he(t.scroller, 'mousedown', Ai(e, vl)),
            he(
              t.scroller,
              'dblclick',
              a && l < 11
                ? Ai(e, function (t) {
                    if (!ye(e, t)) {
                      var n = Ir(e, t);
                      if (n && !Ol(e, t) && !Vn(e.display, t)) {
                        Ce(t);
                        var r = e.findWordAt(n);
                        Do(e.doc, r.anchor, r.head);
                      }
                    }
                  })
                : function (t) {
                    return ye(e, t) || Ce(t);
                  },
            ),
            he(t.scroller, 'contextmenu', function (t) {
              return Ll(e, t);
            }),
            he(t.input.getField(), 'contextmenu', function (n) {
              t.scroller.contains(n.target) || Ll(e, n);
            });
          var n,
            r = { end: 0 };
          function i() {
            t.activeTouch &&
              ((n = setTimeout(function () {
                return (t.activeTouch = null);
              }, 1e3)),
              (r = t.activeTouch),
              (r.end = +new Date()));
          }
          function o(e) {
            if (1 != e.touches.length) return !1;
            var t = e.touches[0];
            return t.radiusX <= 1 && t.radiusY <= 1;
          }
          function s(e, t) {
            if (null == t.left) return !0;
            var n = t.left - e.left,
              r = t.top - e.top;
            return n * n + r * r > 400;
          }
          he(t.scroller, 'touchstart', function (i) {
            if (!ye(e, i) && !o(i) && !Ol(e, i)) {
              t.input.ensurePolled(), clearTimeout(n);
              var a = +new Date();
              (t.activeTouch = { start: a, moved: !1, prev: a - r.end <= 300 ? r : null }),
                1 == i.touches.length &&
                  ((t.activeTouch.left = i.touches[0].pageX),
                  (t.activeTouch.top = i.touches[0].pageY));
            }
          }),
            he(t.scroller, 'touchmove', function () {
              t.activeTouch && (t.activeTouch.moved = !0);
            }),
            he(t.scroller, 'touchend', function (n) {
              var r = t.activeTouch;
              if (r && !Vn(t, n) && null != r.left && !r.moved && new Date() - r.start < 300) {
                var o,
                  a = e.coordsChar(t.activeTouch, 'page');
                (o =
                  !r.prev || s(r, r.prev)
                    ? new io(a, a)
                    : !r.prev.prev || s(r, r.prev.prev)
                    ? e.findWordAt(a)
                    : new io(it(a.line, 0), ft(e.doc, it(a.line + 1, 0)))),
                  e.setSelection(o.anchor, o.head),
                  e.focus(),
                  Ce(n);
              }
              i();
            }),
            he(t.scroller, 'touchcancel', i),
            he(t.scroller, 'scroll', function () {
              t.scroller.clientHeight &&
                (fi(e, t.scroller.scrollTop), di(e, t.scroller.scrollLeft, !0), ve(e, 'scroll', e));
            }),
            he(t.scroller, 'mousewheel', function (t) {
              return no(e, t);
            }),
            he(t.scroller, 'DOMMouseScroll', function (t) {
              return no(e, t);
            }),
            he(t.wrapper, 'scroll', function () {
              return (t.wrapper.scrollTop = t.wrapper.scrollLeft = 0);
            }),
            (t.dragFunctions = {
              enter: function (t) {
                ye(e, t) || Ee(t);
              },
              over: function (t) {
                ye(e, t) || (Oa(e, t), Ee(t));
              },
              start: function (t) {
                return Ea(e, t);
              },
              drop: Ai(e, ka),
              leave: function (t) {
                ye(e, t) || La(e);
              },
            });
          var c = t.input.getField();
          he(c, 'keyup', function (t) {
            return ul.call(e, t);
          }),
            he(c, 'keydown', Ai(e, sl)),
            he(c, 'keypress', Ai(e, fl)),
            he(c, 'focus', function (t) {
              return $r(e, t);
            }),
            he(c, 'blur', function (t) {
              return Xr(e, t);
            });
        }
        (_l.defaults = Al), (_l.optionHandlers = jl);
        var Rl = [];
        function Fl(e, t, n, r) {
          var i,
            o = e.doc;
          null == n && (n = 'add'),
            'smart' == n && (o.mode.indent ? (i = yt(e, t).state) : (n = 'prev'));
          var a = e.options.tabSize,
            l = $e(o, t),
            s = R(l.text, null, a);
          l.stateAfter && (l.stateAfter = null);
          var c,
            u = l.text.match(/^\s*/)[0];
          if (r || /\S/.test(l.text)) {
            if (
              'smart' == n &&
              ((c = o.mode.indent(i, l.text.slice(u.length), l.text)), c == B || c > 150)
            ) {
              if (!r) return;
              n = 'prev';
            }
          } else (c = 0), (n = 'not');
          'prev' == n
            ? (c = t > o.first ? R($e(o, t - 1).text, null, a) : 0)
            : 'add' == n
            ? (c = s + e.options.indentUnit)
            : 'subtract' == n
            ? (c = s - e.options.indentUnit)
            : 'number' == typeof n && (c = s + n),
            (c = Math.max(0, c));
          var f = '',
            p = 0;
          if (e.options.indentWithTabs)
            for (var d = Math.floor(c / a); d; --d) (p += a), (f += '\t');
          if ((p < c && (f += Y(c - p)), f != u))
            return ra(o, f, it(t, 0), it(t, u.length), '+input'), (l.stateAfter = null), !0;
          for (var h = 0; h < o.sel.ranges.length; h++) {
            var m = o.sel.ranges[h];
            if (m.head.line == t && m.head.ch < u.length) {
              var g = it(t, u.length);
              zo(o, h, new io(g, g));
              break;
            }
          }
        }
        _l.defineInitHook = function (e) {
          return Rl.push(e);
        };
        var Hl = null;
        function Wl(e) {
          Hl = e;
        }
        function Bl(e, t, n, r, i) {
          var o = e.doc;
          (e.display.shift = !1), r || (r = o.sel);
          var a = +new Date() - 200,
            l = 'paste' == i || e.state.pasteIncoming > a,
            s = Pe(t),
            c = null;
          if (l && r.ranges.length > 1)
            if (Hl && Hl.text.join('\n') == t) {
              if (r.ranges.length % Hl.text.length == 0) {
                c = [];
                for (var u = 0; u < Hl.text.length; u++) c.push(o.splitLines(Hl.text[u]));
              }
            } else
              s.length == r.ranges.length &&
                e.options.pasteLinesPerSelection &&
                (c = $(s, function (e) {
                  return [e];
                }));
          for (var f = e.curOp.updateInput, p = r.ranges.length - 1; p >= 0; p--) {
            var d = r.ranges[p],
              h = d.from(),
              m = d.to();
            d.empty() &&
              (n && n > 0
                ? (h = it(h.line, h.ch - n))
                : e.state.overwrite && !l
                ? (m = it(m.line, Math.min($e(o, m.line).text.length, m.ch + Z(s).length)))
                : l && Hl && Hl.lineWise && Hl.text.join('\n') == t && (h = m = it(h.line, 0)));
            var g = {
              from: h,
              to: m,
              text: c ? c[p % c.length] : s,
              origin: i || (l ? 'paste' : e.state.cutIncoming > a ? 'cut' : '+input'),
            };
            Xo(e.doc, g), Tn(e, 'inputRead', e, g);
          }
          t && !l && Ul(e, t),
            ai(e),
            e.curOp.updateInput < 2 && (e.curOp.updateInput = f),
            (e.curOp.typing = !0),
            (e.state.pasteIncoming = e.state.cutIncoming = -1);
        }
        function Vl(e, t) {
          var n = e.clipboardData && e.clipboardData.getData('Text');
          if (n)
            return (
              e.preventDefault(),
              t.isReadOnly() ||
                t.options.disableInput ||
                Mi(t, function () {
                  return Bl(t, n, 0, null, 'paste');
                }),
              !0
            );
        }
        function Ul(e, t) {
          if (e.options.electricChars && e.options.smartIndent)
            for (var n = e.doc.sel, r = n.ranges.length - 1; r >= 0; r--) {
              var i = n.ranges[r];
              if (!(i.head.ch > 100 || (r && n.ranges[r - 1].head.line == i.head.line))) {
                var o = e.getModeAt(i.head),
                  a = !1;
                if (o.electricChars) {
                  for (var l = 0; l < o.electricChars.length; l++)
                    if (t.indexOf(o.electricChars.charAt(l)) > -1) {
                      a = Fl(e, i.head.line, 'smart');
                      break;
                    }
                } else
                  o.electricInput &&
                    o.electricInput.test($e(e.doc, i.head.line).text.slice(0, i.head.ch)) &&
                    (a = Fl(e, i.head.line, 'smart'));
                a && Tn(e, 'electricInput', e, i.head.line);
              }
            }
        }
        function Kl(e) {
          for (var t = [], n = [], r = 0; r < e.doc.sel.ranges.length; r++) {
            var i = e.doc.sel.ranges[r].head.line,
              o = { anchor: it(i, 0), head: it(i + 1, 0) };
            n.push(o), t.push(e.getRange(o.anchor, o.head));
          }
          return { text: t, ranges: n };
        }
        function ql(e, t, n, r) {
          e.setAttribute('autocorrect', n ? '' : 'off'),
            e.setAttribute('autocapitalize', r ? '' : 'off'),
            e.setAttribute('spellcheck', !!t);
        }
        function Gl() {
          var e = N(
              'textarea',
              null,
              null,
              'position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none',
            ),
            t = N(
              'div',
              [e],
              null,
              'overflow: hidden; position: relative; width: 3px; height: 0px;',
            );
          return (
            s ? (e.style.width = '1000px') : e.setAttribute('wrap', 'off'),
            m && (e.style.border = '1px solid black'),
            ql(e),
            t
          );
        }
        function Yl(e) {
          var t = e.optionHandlers,
            n = (e.helpers = {});
          (e.prototype = {
            constructor: e,
            focus: function () {
              window.focus(), this.display.input.focus();
            },
            setOption: function (e, n) {
              var r = this.options,
                i = r[e];
              (r[e] == n && 'mode' != e) ||
                ((r[e] = n),
                t.hasOwnProperty(e) && Ai(this, t[e])(this, n, i),
                ve(this, 'optionChange', this, e));
            },
            getOption: function (e) {
              return this.options[e];
            },
            getDoc: function () {
              return this.doc;
            },
            addKeyMap: function (e, t) {
              this.state.keyMaps[t ? 'push' : 'unshift'](Ua(e));
            },
            removeKeyMap: function (e) {
              for (var t = this.state.keyMaps, n = 0; n < t.length; ++n)
                if (t[n] == e || t[n].name == e) return t.splice(n, 1), !0;
            },
            addOverlay: ji(function (t, n) {
              var r = t.token ? t : e.getMode(this.options, t);
              if (r.startState) throw new Error('Overlays may not be stateful.');
              X(
                this.state.overlays,
                { mode: r, modeSpec: t, opaque: n && n.opaque, priority: (n && n.priority) || 0 },
                function (e) {
                  return e.priority;
                },
              ),
                this.state.modeGen++,
                _r(this);
            }),
            removeOverlay: ji(function (e) {
              for (var t = this.state.overlays, n = 0; n < t.length; ++n) {
                var r = t[n].modeSpec;
                if (r == e || ('string' == typeof e && r.name == e))
                  return t.splice(n, 1), this.state.modeGen++, void _r(this);
              }
            }),
            indentLine: ji(function (e, t, n) {
              'string' != typeof t &&
                'number' != typeof t &&
                (t =
                  null == t
                    ? this.options.smartIndent
                      ? 'smart'
                      : 'prev'
                    : t
                    ? 'add'
                    : 'subtract'),
                nt(this.doc, e) && Fl(this, e, t, n);
            }),
            indentSelection: ji(function (e) {
              for (var t = this.doc.sel.ranges, n = -1, r = 0; r < t.length; r++) {
                var i = t[r];
                if (i.empty())
                  i.head.line > n &&
                    (Fl(this, i.head.line, e, !0),
                    (n = i.head.line),
                    r == this.doc.sel.primIndex && ai(this));
                else {
                  var o = i.from(),
                    a = i.to(),
                    l = Math.max(n, o.line);
                  n = Math.min(this.lastLine(), a.line - (a.ch ? 0 : 1)) + 1;
                  for (var s = l; s < n; ++s) Fl(this, s, e);
                  var c = this.doc.sel.ranges;
                  0 == o.ch &&
                    t.length == c.length &&
                    c[r].from().ch > 0 &&
                    zo(this.doc, r, new io(o, c[r].to()), V);
                }
              }
            }),
            getTokenAt: function (e, t) {
              return St(this, e, t);
            },
            getLineTokens: function (e, t) {
              return St(this, it(e), t, !0);
            },
            getTokenTypeAt: function (e) {
              e = ft(this.doc, e);
              var t,
                n = vt(this, $e(this.doc, e.line)),
                r = 0,
                i = (n.length - 1) / 2,
                o = e.ch;
              if (0 == o) t = n[2];
              else
                for (;;) {
                  var a = (r + i) >> 1;
                  if ((a ? n[2 * a - 1] : 0) >= o) i = a;
                  else {
                    if (!(n[2 * a + 1] < o)) {
                      t = n[2 * a + 2];
                      break;
                    }
                    r = a + 1;
                  }
                }
              var l = t ? t.indexOf('overlay ') : -1;
              return l < 0 ? t : 0 == l ? null : t.slice(0, l - 1);
            },
            getModeAt: function (t) {
              var n = this.doc.mode;
              return n.innerMode ? e.innerMode(n, this.getTokenAt(t).state).mode : n;
            },
            getHelper: function (e, t) {
              return this.getHelpers(e, t)[0];
            },
            getHelpers: function (e, t) {
              var r = [];
              if (!n.hasOwnProperty(t)) return r;
              var i = n[t],
                o = this.getModeAt(e);
              if ('string' == typeof o[t]) i[o[t]] && r.push(i[o[t]]);
              else if (o[t])
                for (var a = 0; a < o[t].length; a++) {
                  var l = i[o[t][a]];
                  l && r.push(l);
                }
              else
                o.helperType && i[o.helperType]
                  ? r.push(i[o.helperType])
                  : i[o.name] && r.push(i[o.name]);
              for (var s = 0; s < i._global.length; s++) {
                var c = i._global[s];
                c.pred(o, this) && -1 == H(r, c.val) && r.push(c.val);
              }
              return r;
            },
            getStateAfter: function (e, t) {
              var n = this.doc;
              return (e = ut(n, null == e ? n.first + n.size - 1 : e)), yt(this, e + 1, t).state;
            },
            cursorCoords: function (e, t) {
              var n,
                r = this.doc.sel.primary();
              return (
                (n =
                  null == e
                    ? r.head
                    : 'object' == typeof e
                    ? ft(this.doc, e)
                    : e
                    ? r.from()
                    : r.to()),
                yr(this, n, t || 'page')
              );
            },
            charCoords: function (e, t) {
              return vr(this, ft(this.doc, e), t || 'page');
            },
            coordsChar: function (e, t) {
              return (e = gr(this, e, t || 'page')), xr(this, e.left, e.top);
            },
            lineAtHeight: function (e, t) {
              return (
                (e = gr(this, { top: e, left: 0 }, t || 'page').top),
                tt(this.doc, e + this.display.viewOffset)
              );
            },
            heightAtLine: function (e, t, n) {
              var r,
                i = !1;
              if ('number' == typeof e) {
                var o = this.doc.first + this.doc.size - 1;
                e < this.doc.first ? (e = this.doc.first) : e > o && ((e = o), (i = !0)),
                  (r = $e(this.doc, e));
              } else r = e;
              return (
                mr(this, r, { top: 0, left: 0 }, t || 'page', n || i).top +
                (i ? this.doc.height - on(r) : 0)
              );
            },
            defaultTextHeight: function () {
              return Tr(this.display);
            },
            defaultCharWidth: function () {
              return Nr(this.display);
            },
            getViewport: function () {
              return { from: this.display.viewFrom, to: this.display.viewTo };
            },
            addWidget: function (e, t, n, r, i) {
              var o = this.display;
              e = yr(this, ft(this.doc, e));
              var a = e.bottom,
                l = e.left;
              if (
                ((t.style.position = 'absolute'),
                t.setAttribute('cm-ignore-events', 'true'),
                this.display.input.setUneditable(t),
                o.sizer.appendChild(t),
                'over' == r)
              )
                a = e.top;
              else if ('above' == r || 'near' == r) {
                var s = Math.max(o.wrapper.clientHeight, this.doc.height),
                  c = Math.max(o.sizer.clientWidth, o.lineSpace.clientWidth);
                ('above' == r || e.bottom + t.offsetHeight > s) && e.top > t.offsetHeight
                  ? (a = e.top - t.offsetHeight)
                  : e.bottom + t.offsetHeight <= s && (a = e.bottom),
                  l + t.offsetWidth > c && (l = c - t.offsetWidth);
              }
              (t.style.top = a + 'px'),
                (t.style.left = t.style.right = ''),
                'right' == i
                  ? ((l = o.sizer.clientWidth - t.offsetWidth), (t.style.right = '0px'))
                  : ('left' == i
                      ? (l = 0)
                      : 'middle' == i && (l = (o.sizer.clientWidth - t.offsetWidth) / 2),
                    (t.style.left = l + 'px')),
                n &&
                  ri(this, {
                    left: l,
                    top: a,
                    right: l + t.offsetWidth,
                    bottom: a + t.offsetHeight,
                  });
            },
            triggerOnKeyDown: ji(sl),
            triggerOnKeyPress: ji(fl),
            triggerOnKeyUp: ul,
            triggerOnMouseDown: ji(vl),
            execCommand: function (e) {
              if ($a.hasOwnProperty(e)) return $a[e].call(null, this);
            },
            triggerElectric: ji(function (e) {
              Ul(this, e);
            }),
            findPosH: function (e, t, n, r) {
              var i = 1;
              t < 0 && ((i = -1), (t = -t));
              for (var o = ft(this.doc, e), a = 0; a < t; ++a)
                if (((o = Zl(this.doc, o, i, n, r)), o.hitSide)) break;
              return o;
            },
            moveH: ji(function (e, t) {
              var n = this;
              this.extendSelectionsBy(function (r) {
                return n.display.shift || n.doc.extend || r.empty()
                  ? Zl(n.doc, r.head, e, t, n.options.rtlMoveVisually)
                  : e < 0
                  ? r.from()
                  : r.to();
              }, K);
            }),
            deleteH: ji(function (e, t) {
              var n = this.doc.sel,
                r = this.doc;
              n.somethingSelected()
                ? r.replaceSelection('', null, '+delete')
                : Ka(this, function (n) {
                    var i = Zl(r, n.head, e, t, !1);
                    return e < 0 ? { from: i, to: n.head } : { from: n.head, to: i };
                  });
            }),
            findPosV: function (e, t, n, r) {
              var i = 1,
                o = r;
              t < 0 && ((i = -1), (t = -t));
              for (var a = ft(this.doc, e), l = 0; l < t; ++l) {
                var s = yr(this, a, 'div');
                if ((null == o ? (o = s.left) : (s.left = o), (a = $l(this, s, i, n)), a.hitSide))
                  break;
              }
              return a;
            },
            moveV: ji(function (e, t) {
              var n = this,
                r = this.doc,
                i = [],
                o = !this.display.shift && !r.extend && r.sel.somethingSelected();
              if (
                (r.extendSelectionsBy(function (a) {
                  if (o) return e < 0 ? a.from() : a.to();
                  var l = yr(n, a.head, 'div');
                  null != a.goalColumn && (l.left = a.goalColumn), i.push(l.left);
                  var s = $l(n, l, e, t);
                  return (
                    'page' == t && a == r.sel.primary() && oi(n, vr(n, s, 'div').top - l.top), s
                  );
                }, K),
                i.length)
              )
                for (var a = 0; a < r.sel.ranges.length; a++) r.sel.ranges[a].goalColumn = i[a];
            }),
            findWordAt: function (e) {
              var t = this.doc,
                n = $e(t, e.line).text,
                r = e.ch,
                i = e.ch;
              if (n) {
                var o = this.getHelper(e, 'wordChars');
                ('before' != e.sticky && i != n.length) || !r ? ++i : --r;
                var a = n.charAt(r),
                  l = ne(a, o)
                    ? function (e) {
                        return ne(e, o);
                      }
                    : /\s/.test(a)
                    ? function (e) {
                        return /\s/.test(e);
                      }
                    : function (e) {
                        return !/\s/.test(e) && !ne(e);
                      };
                while (r > 0 && l(n.charAt(r - 1))) --r;
                while (i < n.length && l(n.charAt(i))) ++i;
              }
              return new io(it(e.line, r), it(e.line, i));
            },
            toggleOverwrite: function (e) {
              (null != e && e == this.state.overwrite) ||
                ((this.state.overwrite = !this.state.overwrite)
                  ? P(this.display.cursorDiv, 'CodeMirror-overwrite')
                  : O(this.display.cursorDiv, 'CodeMirror-overwrite'),
                ve(this, 'overwriteToggle', this, this.state.overwrite));
            },
            hasFocus: function () {
              return this.display.input.getField() == j();
            },
            isReadOnly: function () {
              return !(!this.options.readOnly && !this.doc.cantEdit);
            },
            scrollTo: ji(function (e, t) {
              li(this, e, t);
            }),
            getScrollInfo: function () {
              var e = this.display.scroller;
              return {
                left: e.scrollLeft,
                top: e.scrollTop,
                height: e.scrollHeight - Gn(this) - this.display.barHeight,
                width: e.scrollWidth - Gn(this) - this.display.barWidth,
                clientHeight: Zn(this),
                clientWidth: Yn(this),
              };
            },
            scrollIntoView: ji(function (e, t) {
              null == e
                ? ((e = { from: this.doc.sel.primary().head, to: null }),
                  null == t && (t = this.options.cursorScrollMargin))
                : 'number' == typeof e
                ? (e = { from: it(e, 0), to: null })
                : null == e.from && (e = { from: e, to: null }),
                e.to || (e.to = e.from),
                (e.margin = t || 0),
                null != e.from.line ? si(this, e) : ui(this, e.from, e.to, e.margin);
            }),
            setSize: ji(function (e, t) {
              var n = this,
                r = function (e) {
                  return 'number' == typeof e || /^\d+$/.test(String(e)) ? e + 'px' : e;
                };
              null != e && (this.display.wrapper.style.width = r(e)),
                null != t && (this.display.wrapper.style.height = r(t)),
                this.options.lineWrapping && ur(this);
              var i = this.display.viewFrom;
              this.doc.iter(i, this.display.viewTo, function (e) {
                if (e.widgets)
                  for (var t = 0; t < e.widgets.length; t++)
                    if (e.widgets[t].noHScroll) {
                      zr(n, i, 'widget');
                      break;
                    }
                ++i;
              }),
                (this.curOp.forceUpdate = !0),
                ve(this, 'refresh', this);
            }),
            operation: function (e) {
              return Mi(this, e);
            },
            startOperation: function () {
              return Ci(this);
            },
            endOperation: function () {
              return Si(this);
            },
            refresh: ji(function () {
              var e = this.display.cachedTextHeight;
              _r(this),
                (this.curOp.forceUpdate = !0),
                fr(this),
                li(this, this.doc.scrollLeft, this.doc.scrollTop),
                Ui(this.display),
                (null == e || Math.abs(e - Tr(this.display)) > 0.5 || this.options.lineWrapping) &&
                  Pr(this),
                ve(this, 'refresh', this);
            }),
            swapDoc: ji(function (e) {
              var t = this.doc;
              return (
                (t.cm = null),
                this.state.selectingText && this.state.selectingText(),
                yo(this, e),
                fr(this),
                this.display.input.reset(),
                li(this, e.scrollLeft, e.scrollTop),
                (this.curOp.forceScroll = !0),
                Tn(this, 'swapDoc', this, t),
                t
              );
            }),
            phrase: function (e) {
              var t = this.options.phrases;
              return t && Object.prototype.hasOwnProperty.call(t, e) ? t[e] : e;
            },
            getInputField: function () {
              return this.display.input.getField();
            },
            getWrapperElement: function () {
              return this.display.wrapper;
            },
            getScrollerElement: function () {
              return this.display.scroller;
            },
            getGutterElement: function () {
              return this.display.gutters;
            },
          }),
            xe(e),
            (e.registerHelper = function (t, r, i) {
              n.hasOwnProperty(t) || (n[t] = e[t] = { _global: [] }), (n[t][r] = i);
            }),
            (e.registerGlobalHelper = function (t, r, i, o) {
              e.registerHelper(t, r, o), n[t]._global.push({ pred: i, val: o });
            });
        }
        function Zl(e, t, n, r, i) {
          var o = t,
            a = n,
            l = $e(e, t.line),
            s = i && 'rtl' == e.direction ? -n : n;
          function c() {
            var n = t.line + s;
            return (
              !(n < e.first || n >= e.first + e.size) &&
              ((t = new it(n, t.ch, t.sticky)), (l = $e(e, n)))
            );
          }
          function u(r) {
            var o;
            if (((o = i ? Za(e.cm, l, t, n) : Ga(l, t, n)), null == o)) {
              if (r || !c()) return !1;
              t = Ya(i, e.cm, l, t.line, s);
            } else t = o;
            return !0;
          }
          if ('char' == r) u();
          else if ('column' == r) u(!0);
          else if ('word' == r || 'group' == r)
            for (
              var f = null, p = 'group' == r, d = e.cm && e.cm.getHelper(t, 'wordChars'), h = !0;
              ;
              h = !1
            ) {
              if (n < 0 && !u(!h)) break;
              var m = l.text.charAt(t.ch) || '\n',
                g = ne(m, d) ? 'w' : p && '\n' == m ? 'n' : !p || /\s/.test(m) ? null : 'p';
              if ((!p || h || g || (g = 's'), f && f != g)) {
                n < 0 && ((n = 1), u(), (t.sticky = 'after'));
                break;
              }
              if ((g && (f = g), n > 0 && !u(!h))) break;
            }
          var v = Go(e, t, o, a, !0);
          return at(o, v) && (v.hitSide = !0), v;
        }
        function $l(e, t, n, r) {
          var i,
            o,
            a = e.doc,
            l = t.left;
          if ('page' == r) {
            var s = Math.min(
                e.display.wrapper.clientHeight,
                window.innerHeight || document.documentElement.clientHeight,
              ),
              c = Math.max(s - 0.5 * Tr(e.display), 3);
            i = (n > 0 ? t.bottom : t.top) + n * c;
          } else 'line' == r && (i = n > 0 ? t.bottom + 3 : t.top - 3);
          for (;;) {
            if (((o = xr(e, l, i)), !o.outside)) break;
            if (n < 0 ? i <= 0 : i >= a.height) {
              o.hitSide = !0;
              break;
            }
            i += 5 * n;
          }
          return o;
        }
        var Xl = function (e) {
          (this.cm = e),
            (this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null),
            (this.polling = new F()),
            (this.composing = null),
            (this.gracePeriod = !1),
            (this.readDOMTimeout = null);
        };
        function Jl(e, t) {
          var n = er(e, t.line);
          if (!n || n.hidden) return null;
          var r = $e(e.doc, t.line),
            i = Xn(n, r, t.line),
            o = pe(r, e.doc.direction),
            a = 'left';
          if (o) {
            var l = ue(o, t.ch);
            a = l % 2 ? 'right' : 'left';
          }
          var s = or(i.map, t.ch, a);
          return (s.offset = 'right' == s.collapse ? s.end : s.start), s;
        }
        function Ql(e) {
          for (var t = e; t; t = t.parentNode)
            if (/CodeMirror-gutter-wrapper/.test(t.className)) return !0;
          return !1;
        }
        function es(e, t) {
          return t && (e.bad = !0), e;
        }
        function ts(e, t, n, r, i) {
          var o = '',
            a = !1,
            l = e.doc.lineSeparator(),
            s = !1;
          function c(e) {
            return function (t) {
              return t.id == e;
            };
          }
          function u() {
            a && ((o += l), s && (o += l), (a = s = !1));
          }
          function f(e) {
            e && (u(), (o += e));
          }
          function p(t) {
            if (1 == t.nodeType) {
              var n = t.getAttribute('cm-text');
              if (n) return void f(n);
              var o,
                d = t.getAttribute('cm-marker');
              if (d) {
                var h = e.findMarks(it(r, 0), it(i + 1, 0), c(+d));
                return void (h.length && (o = h[0].find(0)) && f(Xe(e.doc, o.from, o.to).join(l)));
              }
              if ('false' == t.getAttribute('contenteditable')) return;
              var m = /^(pre|div|p|li|table|br)$/i.test(t.nodeName);
              if (!/^br$/i.test(t.nodeName) && 0 == t.textContent.length) return;
              m && u();
              for (var g = 0; g < t.childNodes.length; g++) p(t.childNodes[g]);
              /^(pre|p)$/i.test(t.nodeName) && (s = !0), m && (a = !0);
            } else 3 == t.nodeType && f(t.nodeValue.replace(/\u200b/g, '').replace(/\u00a0/g, ' '));
          }
          for (;;) {
            if ((p(t), t == n)) break;
            (t = t.nextSibling), (s = !1);
          }
          return o;
        }
        function ns(e, t, n) {
          var r;
          if (t == e.display.lineDiv) {
            if (((r = e.display.lineDiv.childNodes[n]), !r))
              return es(e.clipPos(it(e.display.viewTo - 1)), !0);
            (t = null), (n = 0);
          } else
            for (r = t; ; r = r.parentNode) {
              if (!r || r == e.display.lineDiv) return null;
              if (r.parentNode && r.parentNode == e.display.lineDiv) break;
            }
          for (var i = 0; i < e.display.view.length; i++) {
            var o = e.display.view[i];
            if (o.node == r) return rs(o, t, n);
          }
        }
        function rs(e, t, n) {
          var r = e.text.firstChild,
            i = !1;
          if (!t || !A(r, t)) return es(it(et(e.line), 0), !0);
          if (t == r && ((i = !0), (t = r.childNodes[n]), (n = 0), !t)) {
            var o = e.rest ? Z(e.rest) : e.line;
            return es(it(et(o), o.text.length), i);
          }
          var a = 3 == t.nodeType ? t : null,
            l = t;
          a ||
            1 != t.childNodes.length ||
            3 != t.firstChild.nodeType ||
            ((a = t.firstChild), n && (n = a.nodeValue.length));
          while (l.parentNode != r) l = l.parentNode;
          var s = e.measure,
            c = s.maps;
          function u(t, n, r) {
            for (var i = -1; i < (c ? c.length : 0); i++)
              for (var o = i < 0 ? s.map : c[i], a = 0; a < o.length; a += 3) {
                var l = o[a + 2];
                if (l == t || l == n) {
                  var u = et(i < 0 ? e.line : e.rest[i]),
                    f = o[a] + r;
                  return (r < 0 || l != t) && (f = o[a + (r ? 1 : 0)]), it(u, f);
                }
              }
          }
          var f = u(a, l, n);
          if (f) return es(f, i);
          for (var p = l.nextSibling, d = a ? a.nodeValue.length - n : 0; p; p = p.nextSibling) {
            if (((f = u(p, p.firstChild, 0)), f)) return es(it(f.line, f.ch - d), i);
            d += p.textContent.length;
          }
          for (var h = l.previousSibling, m = n; h; h = h.previousSibling) {
            if (((f = u(h, h.firstChild, -1)), f)) return es(it(f.line, f.ch + m), i);
            m += h.textContent.length;
          }
        }
        (Xl.prototype.init = function (e) {
          var t = this,
            n = this,
            r = n.cm,
            i = (n.div = e.lineDiv);
          function o(e) {
            for (var t = e.target; t; t = t.parentNode) {
              if (t == i) return !0;
              if (/\bCodeMirror-(?:line)?widget\b/.test(t.className)) break;
            }
            return !1;
          }
          function a(e) {
            if (o(e) && !ye(r, e)) {
              if (r.somethingSelected())
                Wl({ lineWise: !1, text: r.getSelections() }),
                  'cut' == e.type && r.replaceSelection('', null, 'cut');
              else {
                if (!r.options.lineWiseCopyCut) return;
                var t = Kl(r);
                Wl({ lineWise: !0, text: t.text }),
                  'cut' == e.type &&
                    r.operation(function () {
                      r.setSelections(t.ranges, 0, V), r.replaceSelection('', null, 'cut');
                    });
              }
              if (e.clipboardData) {
                e.clipboardData.clearData();
                var a = Hl.text.join('\n');
                if ((e.clipboardData.setData('Text', a), e.clipboardData.getData('Text') == a))
                  return void e.preventDefault();
              }
              var l = Gl(),
                s = l.firstChild;
              r.display.lineSpace.insertBefore(l, r.display.lineSpace.firstChild),
                (s.value = Hl.text.join('\n'));
              var c = document.activeElement;
              D(s),
                setTimeout(function () {
                  r.display.lineSpace.removeChild(l), c.focus(), c == i && n.showPrimarySelection();
                }, 50);
            }
          }
          ql(i, r.options.spellcheck, r.options.autocorrect, r.options.autocapitalize),
            he(i, 'paste', function (e) {
              !o(e) ||
                ye(r, e) ||
                Vl(e, r) ||
                (l <= 11 &&
                  setTimeout(
                    Ai(r, function () {
                      return t.updateFromDOM();
                    }),
                    20,
                  ));
            }),
            he(i, 'compositionstart', function (e) {
              t.composing = { data: e.data, done: !1 };
            }),
            he(i, 'compositionupdate', function (e) {
              t.composing || (t.composing = { data: e.data, done: !1 });
            }),
            he(i, 'compositionend', function (e) {
              t.composing &&
                (e.data != t.composing.data && t.readFromDOMSoon(), (t.composing.done = !0));
            }),
            he(i, 'touchstart', function () {
              return n.forceCompositionEnd();
            }),
            he(i, 'input', function () {
              t.composing || t.readFromDOMSoon();
            }),
            he(i, 'copy', a),
            he(i, 'cut', a);
        }),
          (Xl.prototype.screenReaderLabelChanged = function (e) {
            e ? this.div.setAttribute('aria-label', e) : this.div.removeAttribute('aria-label');
          }),
          (Xl.prototype.prepareSelection = function () {
            var e = Vr(this.cm, !1);
            return (e.focus = document.activeElement == this.div), e;
          }),
          (Xl.prototype.showSelection = function (e, t) {
            e &&
              this.cm.display.view.length &&
              ((e.focus || t) && this.showPrimarySelection(), this.showMultipleSelections(e));
          }),
          (Xl.prototype.getSelection = function () {
            return this.cm.display.wrapper.ownerDocument.getSelection();
          }),
          (Xl.prototype.showPrimarySelection = function () {
            var e = this.getSelection(),
              t = this.cm,
              r = t.doc.sel.primary(),
              i = r.from(),
              o = r.to();
            if (
              t.display.viewTo == t.display.viewFrom ||
              i.line >= t.display.viewTo ||
              o.line < t.display.viewFrom
            )
              e.removeAllRanges();
            else {
              var a = ns(t, e.anchorNode, e.anchorOffset),
                l = ns(t, e.focusNode, e.focusOffset);
              if (!a || a.bad || !l || l.bad || 0 != ot(ct(a, l), i) || 0 != ot(st(a, l), o)) {
                var s = t.display.view,
                  c = (i.line >= t.display.viewFrom && Jl(t, i)) || {
                    node: s[0].measure.map[2],
                    offset: 0,
                  },
                  u = o.line < t.display.viewTo && Jl(t, o);
                if (!u) {
                  var f = s[s.length - 1].measure,
                    p = f.maps ? f.maps[f.maps.length - 1] : f.map;
                  u = { node: p[p.length - 1], offset: p[p.length - 2] - p[p.length - 3] };
                }
                if (c && u) {
                  var d,
                    h = e.rangeCount && e.getRangeAt(0);
                  try {
                    d = E(c.node, c.offset, u.offset, u.node);
                  } catch (m) {}
                  d &&
                    (!n && t.state.focused
                      ? (e.collapse(c.node, c.offset),
                        d.collapsed || (e.removeAllRanges(), e.addRange(d)))
                      : (e.removeAllRanges(), e.addRange(d)),
                    h && null == e.anchorNode ? e.addRange(h) : n && this.startGracePeriod()),
                    this.rememberSelection();
                } else e.removeAllRanges();
              }
            }
          }),
          (Xl.prototype.startGracePeriod = function () {
            var e = this;
            clearTimeout(this.gracePeriod),
              (this.gracePeriod = setTimeout(function () {
                (e.gracePeriod = !1),
                  e.selectionChanged() &&
                    e.cm.operation(function () {
                      return (e.cm.curOp.selectionChanged = !0);
                    });
              }, 20));
          }),
          (Xl.prototype.showMultipleSelections = function (e) {
            T(this.cm.display.cursorDiv, e.cursors), T(this.cm.display.selectionDiv, e.selection);
          }),
          (Xl.prototype.rememberSelection = function () {
            var e = this.getSelection();
            (this.lastAnchorNode = e.anchorNode),
              (this.lastAnchorOffset = e.anchorOffset),
              (this.lastFocusNode = e.focusNode),
              (this.lastFocusOffset = e.focusOffset);
          }),
          (Xl.prototype.selectionInEditor = function () {
            var e = this.getSelection();
            if (!e.rangeCount) return !1;
            var t = e.getRangeAt(0).commonAncestorContainer;
            return A(this.div, t);
          }),
          (Xl.prototype.focus = function () {
            'nocursor' != this.cm.options.readOnly &&
              ((this.selectionInEditor() && document.activeElement == this.div) ||
                this.showSelection(this.prepareSelection(), !0),
              this.div.focus());
          }),
          (Xl.prototype.blur = function () {
            this.div.blur();
          }),
          (Xl.prototype.getField = function () {
            return this.div;
          }),
          (Xl.prototype.supportsTouch = function () {
            return !0;
          }),
          (Xl.prototype.receivedFocus = function () {
            var e = this;
            function t() {
              e.cm.state.focused &&
                (e.pollSelection(), e.polling.set(e.cm.options.pollInterval, t));
            }
            this.selectionInEditor()
              ? this.pollSelection()
              : Mi(this.cm, function () {
                  return (e.cm.curOp.selectionChanged = !0);
                }),
              this.polling.set(this.cm.options.pollInterval, t);
          }),
          (Xl.prototype.selectionChanged = function () {
            var e = this.getSelection();
            return (
              e.anchorNode != this.lastAnchorNode ||
              e.anchorOffset != this.lastAnchorOffset ||
              e.focusNode != this.lastFocusNode ||
              e.focusOffset != this.lastFocusOffset
            );
          }),
          (Xl.prototype.pollSelection = function () {
            if (null == this.readDOMTimeout && !this.gracePeriod && this.selectionChanged()) {
              var e = this.getSelection(),
                t = this.cm;
              if (g && u && this.cm.display.gutterSpecs.length && Ql(e.anchorNode))
                return (
                  this.cm.triggerOnKeyDown({
                    type: 'keydown',
                    keyCode: 8,
                    preventDefault: Math.abs,
                  }),
                  this.blur(),
                  void this.focus()
                );
              if (!this.composing) {
                this.rememberSelection();
                var n = ns(t, e.anchorNode, e.anchorOffset),
                  r = ns(t, e.focusNode, e.focusOffset);
                n &&
                  r &&
                  Mi(t, function () {
                    Wo(t.doc, ao(n, r), V), (n.bad || r.bad) && (t.curOp.selectionChanged = !0);
                  });
              }
            }
          }),
          (Xl.prototype.pollContent = function () {
            null != this.readDOMTimeout &&
              (clearTimeout(this.readDOMTimeout), (this.readDOMTimeout = null));
            var e,
              t,
              n,
              r = this.cm,
              i = r.display,
              o = r.doc.sel.primary(),
              a = o.from(),
              l = o.to();
            if (
              (0 == a.ch &&
                a.line > r.firstLine() &&
                (a = it(a.line - 1, $e(r.doc, a.line - 1).length)),
              l.ch == $e(r.doc, l.line).text.length &&
                l.line < r.lastLine() &&
                (l = it(l.line + 1, 0)),
              a.line < i.viewFrom || l.line > i.viewTo - 1)
            )
              return !1;
            a.line == i.viewFrom || 0 == (e = Dr(r, a.line))
              ? ((t = et(i.view[0].line)), (n = i.view[0].node))
              : ((t = et(i.view[e].line)), (n = i.view[e - 1].node.nextSibling));
            var s,
              c,
              u = Dr(r, l.line);
            if (
              (u == i.view.length - 1
                ? ((s = i.viewTo - 1), (c = i.lineDiv.lastChild))
                : ((s = et(i.view[u + 1].line) - 1), (c = i.view[u + 1].node.previousSibling)),
              !n)
            )
              return !1;
            var f = r.doc.splitLines(ts(r, n, c, t, s)),
              p = Xe(r.doc, it(t, 0), it(s, $e(r.doc, s).text.length));
            while (f.length > 1 && p.length > 1)
              if (Z(f) == Z(p)) f.pop(), p.pop(), s--;
              else {
                if (f[0] != p[0]) break;
                f.shift(), p.shift(), t++;
              }
            var d = 0,
              h = 0,
              m = f[0],
              g = p[0],
              v = Math.min(m.length, g.length);
            while (d < v && m.charCodeAt(d) == g.charCodeAt(d)) ++d;
            var y = Z(f),
              b = Z(p),
              w = Math.min(y.length - (1 == f.length ? d : 0), b.length - (1 == p.length ? d : 0));
            while (h < w && y.charCodeAt(y.length - h - 1) == b.charCodeAt(b.length - h - 1)) ++h;
            if (1 == f.length && 1 == p.length && t == a.line)
              while (
                d &&
                d > a.ch &&
                y.charCodeAt(y.length - h - 1) == b.charCodeAt(b.length - h - 1)
              )
                d--, h++;
            (f[f.length - 1] = y.slice(0, y.length - h).replace(/^\u200b+/, '')),
              (f[0] = f[0].slice(d).replace(/\u200b+$/, ''));
            var x = it(t, d),
              C = it(s, p.length ? Z(p).length - h : 0);
            return f.length > 1 || f[0] || ot(x, C) ? (ra(r.doc, f, x, C, '+input'), !0) : void 0;
          }),
          (Xl.prototype.ensurePolled = function () {
            this.forceCompositionEnd();
          }),
          (Xl.prototype.reset = function () {
            this.forceCompositionEnd();
          }),
          (Xl.prototype.forceCompositionEnd = function () {
            this.composing &&
              (clearTimeout(this.readDOMTimeout),
              (this.composing = null),
              this.updateFromDOM(),
              this.div.blur(),
              this.div.focus());
          }),
          (Xl.prototype.readFromDOMSoon = function () {
            var e = this;
            null == this.readDOMTimeout &&
              (this.readDOMTimeout = setTimeout(function () {
                if (((e.readDOMTimeout = null), e.composing)) {
                  if (!e.composing.done) return;
                  e.composing = null;
                }
                e.updateFromDOM();
              }, 80));
          }),
          (Xl.prototype.updateFromDOM = function () {
            var e = this;
            (!this.cm.isReadOnly() && this.pollContent()) ||
              Mi(this.cm, function () {
                return _r(e.cm);
              });
          }),
          (Xl.prototype.setUneditable = function (e) {
            e.contentEditable = 'false';
          }),
          (Xl.prototype.onKeyPress = function (e) {
            0 == e.charCode ||
              this.composing ||
              (e.preventDefault(),
              this.cm.isReadOnly() ||
                Ai(this.cm, Bl)(
                  this.cm,
                  String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode),
                  0,
                ));
          }),
          (Xl.prototype.readOnlyChanged = function (e) {
            this.div.contentEditable = String('nocursor' != e);
          }),
          (Xl.prototype.onContextMenu = function () {}),
          (Xl.prototype.resetPosition = function () {}),
          (Xl.prototype.needsContentAttribute = !0);
        var is = function (e) {
          (this.cm = e),
            (this.prevInput = ''),
            (this.pollingFast = !1),
            (this.polling = new F()),
            (this.hasSelection = !1),
            (this.composing = null);
        };
        function os(e, t) {
          if (
            ((t = t ? z(t) : {}),
            (t.value = e.value),
            !t.tabindex && e.tabIndex && (t.tabindex = e.tabIndex),
            !t.placeholder && e.placeholder && (t.placeholder = e.placeholder),
            null == t.autofocus)
          ) {
            var n = j();
            t.autofocus = n == e || (null != e.getAttribute('autofocus') && n == document.body);
          }
          function r() {
            e.value = l.getValue();
          }
          var i;
          if (e.form && (he(e.form, 'submit', r), !t.leaveSubmitMethodAlone)) {
            var o = e.form;
            i = o.submit;
            try {
              var a = (o.submit = function () {
                r(), (o.submit = i), o.submit(), (o.submit = a);
              });
            } catch (s) {}
          }
          (t.finishInit = function (n) {
            (n.save = r),
              (n.getTextArea = function () {
                return e;
              }),
              (n.toTextArea = function () {
                (n.toTextArea = isNaN),
                  r(),
                  e.parentNode.removeChild(n.getWrapperElement()),
                  (e.style.display = ''),
                  e.form &&
                    (ge(e.form, 'submit', r),
                    t.leaveSubmitMethodAlone ||
                      'function' != typeof e.form.submit ||
                      (e.form.submit = i));
              });
          }),
            (e.style.display = 'none');
          var l = _l(function (t) {
            return e.parentNode.insertBefore(t, e.nextSibling);
          }, t);
          return l;
        }
        function as(e) {
          (e.off = ge),
            (e.on = he),
            (e.wheelEventPixels = to),
            (e.Doc = Ca),
            (e.splitLines = Pe),
            (e.countColumn = R),
            (e.findColumn = q),
            (e.isWordChar = te),
            (e.Pass = B),
            (e.signal = ve),
            (e.Line = sn),
            (e.changeEnd = lo),
            (e.scrollbarModel = bi),
            (e.Pos = it),
            (e.cmpPos = ot),
            (e.modes = Re),
            (e.mimeModes = Fe),
            (e.resolveMode = Be),
            (e.getMode = Ve),
            (e.modeExtensions = Ue),
            (e.extendMode = Ke),
            (e.copyState = qe),
            (e.startState = Ye),
            (e.innerMode = Ge),
            (e.commands = $a),
            (e.keyMap = za),
            (e.keyName = Va),
            (e.isModifierKey = Wa),
            (e.lookupKey = Ha),
            (e.normalizeKeyMap = Fa),
            (e.StringStream = Ze),
            (e.SharedTextMarker = ga),
            (e.TextMarker = ha),
            (e.LineWidget = ua),
            (e.e_preventDefault = Ce),
            (e.e_stopPropagation = Se),
            (e.e_stop = Ee),
            (e.addClass = P),
            (e.contains = A),
            (e.rmClass = O),
            (e.keyNames = Pa);
        }
        (is.prototype.init = function (e) {
          var t = this,
            n = this,
            r = this.cm;
          this.createField(e);
          var i = this.textarea;
          function o(e) {
            if (!ye(r, e)) {
              if (r.somethingSelected()) Wl({ lineWise: !1, text: r.getSelections() });
              else {
                if (!r.options.lineWiseCopyCut) return;
                var t = Kl(r);
                Wl({ lineWise: !0, text: t.text }),
                  'cut' == e.type
                    ? r.setSelections(t.ranges, null, V)
                    : ((n.prevInput = ''), (i.value = t.text.join('\n')), D(i));
              }
              'cut' == e.type && (r.state.cutIncoming = +new Date());
            }
          }
          e.wrapper.insertBefore(this.wrapper, e.wrapper.firstChild),
            m && (i.style.width = '0px'),
            he(i, 'input', function () {
              a && l >= 9 && t.hasSelection && (t.hasSelection = null), n.poll();
            }),
            he(i, 'paste', function (e) {
              ye(r, e) || Vl(e, r) || ((r.state.pasteIncoming = +new Date()), n.fastPoll());
            }),
            he(i, 'cut', o),
            he(i, 'copy', o),
            he(e.scroller, 'paste', function (t) {
              if (!Vn(e, t) && !ye(r, t)) {
                if (!i.dispatchEvent) return (r.state.pasteIncoming = +new Date()), void n.focus();
                var o = new Event('paste');
                (o.clipboardData = t.clipboardData), i.dispatchEvent(o);
              }
            }),
            he(e.lineSpace, 'selectstart', function (t) {
              Vn(e, t) || Ce(t);
            }),
            he(i, 'compositionstart', function () {
              var e = r.getCursor('from');
              n.composing && n.composing.range.clear(),
                (n.composing = {
                  start: e,
                  range: r.markText(e, r.getCursor('to'), { className: 'CodeMirror-composing' }),
                });
            }),
            he(i, 'compositionend', function () {
              n.composing && (n.poll(), n.composing.range.clear(), (n.composing = null));
            });
        }),
          (is.prototype.createField = function (e) {
            (this.wrapper = Gl()), (this.textarea = this.wrapper.firstChild);
          }),
          (is.prototype.screenReaderLabelChanged = function (e) {
            e
              ? this.textarea.setAttribute('aria-label', e)
              : this.textarea.removeAttribute('aria-label');
          }),
          (is.prototype.prepareSelection = function () {
            var e = this.cm,
              t = e.display,
              n = e.doc,
              r = Vr(e);
            if (e.options.moveInputWithCursor) {
              var i = yr(e, n.sel.primary().head, 'div'),
                o = t.wrapper.getBoundingClientRect(),
                a = t.lineDiv.getBoundingClientRect();
              (r.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, i.top + a.top - o.top))),
                (r.teLeft = Math.max(
                  0,
                  Math.min(t.wrapper.clientWidth - 10, i.left + a.left - o.left),
                ));
            }
            return r;
          }),
          (is.prototype.showSelection = function (e) {
            var t = this.cm,
              n = t.display;
            T(n.cursorDiv, e.cursors),
              T(n.selectionDiv, e.selection),
              null != e.teTop &&
                ((this.wrapper.style.top = e.teTop + 'px'),
                (this.wrapper.style.left = e.teLeft + 'px'));
          }),
          (is.prototype.reset = function (e) {
            if (!this.contextMenuPending && !this.composing) {
              var t = this.cm;
              if (t.somethingSelected()) {
                this.prevInput = '';
                var n = t.getSelection();
                (this.textarea.value = n),
                  t.state.focused && D(this.textarea),
                  a && l >= 9 && (this.hasSelection = n);
              } else
                e ||
                  ((this.prevInput = this.textarea.value = ''),
                  a && l >= 9 && (this.hasSelection = null));
            }
          }),
          (is.prototype.getField = function () {
            return this.textarea;
          }),
          (is.prototype.supportsTouch = function () {
            return !1;
          }),
          (is.prototype.focus = function () {
            if ('nocursor' != this.cm.options.readOnly && (!v || j() != this.textarea))
              try {
                this.textarea.focus();
              } catch (e) {}
          }),
          (is.prototype.blur = function () {
            this.textarea.blur();
          }),
          (is.prototype.resetPosition = function () {
            this.wrapper.style.top = this.wrapper.style.left = 0;
          }),
          (is.prototype.receivedFocus = function () {
            this.slowPoll();
          }),
          (is.prototype.slowPoll = function () {
            var e = this;
            this.pollingFast ||
              this.polling.set(this.cm.options.pollInterval, function () {
                e.poll(), e.cm.state.focused && e.slowPoll();
              });
          }),
          (is.prototype.fastPoll = function () {
            var e = !1,
              t = this;
            function n() {
              var r = t.poll();
              r || e ? ((t.pollingFast = !1), t.slowPoll()) : ((e = !0), t.polling.set(60, n));
            }
            (t.pollingFast = !0), t.polling.set(20, n);
          }),
          (is.prototype.poll = function () {
            var e = this,
              t = this.cm,
              n = this.textarea,
              r = this.prevInput;
            if (
              this.contextMenuPending ||
              !t.state.focused ||
              (Ie(n) && !r && !this.composing) ||
              t.isReadOnly() ||
              t.options.disableInput ||
              t.state.keySeq
            )
              return !1;
            var i = n.value;
            if (i == r && !t.somethingSelected()) return !1;
            if ((a && l >= 9 && this.hasSelection === i) || (y && /[\uf700-\uf7ff]/.test(i)))
              return t.display.input.reset(), !1;
            if (t.doc.sel == t.display.selForContextMenu) {
              var o = i.charCodeAt(0);
              if ((8203 != o || r || (r = '\u200b'), 8666 == o))
                return this.reset(), this.cm.execCommand('undo');
            }
            var s = 0,
              c = Math.min(r.length, i.length);
            while (s < c && r.charCodeAt(s) == i.charCodeAt(s)) ++s;
            return (
              Mi(t, function () {
                Bl(t, i.slice(s), r.length - s, null, e.composing ? '*compose' : null),
                  i.length > 1e3 || i.indexOf('\n') > -1
                    ? (n.value = e.prevInput = '')
                    : (e.prevInput = i),
                  e.composing &&
                    (e.composing.range.clear(),
                    (e.composing.range = t.markText(e.composing.start, t.getCursor('to'), {
                      className: 'CodeMirror-composing',
                    })));
              }),
              !0
            );
          }),
          (is.prototype.ensurePolled = function () {
            this.pollingFast && this.poll() && (this.pollingFast = !1);
          }),
          (is.prototype.onKeyPress = function () {
            a && l >= 9 && (this.hasSelection = null), this.fastPoll();
          }),
          (is.prototype.onContextMenu = function (e) {
            var t = this,
              n = t.cm,
              r = n.display,
              i = t.textarea;
            t.contextMenuPending && t.contextMenuPending();
            var o = Ir(n, e),
              c = r.scroller.scrollTop;
            if (o && !f) {
              var u = n.options.resetSelectionOnContextMenu;
              u && -1 == n.doc.sel.contains(o) && Ai(n, Wo)(n.doc, ao(o), V);
              var p,
                d = i.style.cssText,
                h = t.wrapper.style.cssText,
                m = t.wrapper.offsetParent.getBoundingClientRect();
              if (
                ((t.wrapper.style.cssText = 'position: static'),
                (i.style.cssText =
                  'position: absolute; width: 30px; height: 30px;\n      top: ' +
                  (e.clientY - m.top - 5) +
                  'px; left: ' +
                  (e.clientX - m.left - 5) +
                  'px;\n      z-index: 1000; background: ' +
                  (a ? 'rgba(255, 255, 255, .05)' : 'transparent') +
                  ';\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);'),
                s && (p = window.scrollY),
                r.input.focus(),
                s && window.scrollTo(null, p),
                r.input.reset(),
                n.somethingSelected() || (i.value = t.prevInput = ' '),
                (t.contextMenuPending = y),
                (r.selForContextMenu = n.doc.sel),
                clearTimeout(r.detectingSelectAll),
                a && l >= 9 && v(),
                S)
              ) {
                Ee(e);
                var g = function e() {
                  ge(window, 'mouseup', e), setTimeout(y, 20);
                };
                he(window, 'mouseup', g);
              } else setTimeout(y, 50);
            }
            function v() {
              if (null != i.selectionStart) {
                var e = n.somethingSelected(),
                  o = '\u200b' + (e ? i.value : '');
                (i.value = '\u21da'),
                  (i.value = o),
                  (t.prevInput = e ? '' : '\u200b'),
                  (i.selectionStart = 1),
                  (i.selectionEnd = o.length),
                  (r.selForContextMenu = n.doc.sel);
              }
            }
            function y() {
              if (
                t.contextMenuPending == y &&
                ((t.contextMenuPending = !1),
                (t.wrapper.style.cssText = h),
                (i.style.cssText = d),
                a && l < 9 && r.scrollbars.setScrollTop((r.scroller.scrollTop = c)),
                null != i.selectionStart)
              ) {
                (!a || (a && l < 9)) && v();
                var e = 0,
                  o = function o() {
                    r.selForContextMenu == n.doc.sel &&
                    0 == i.selectionStart &&
                    i.selectionEnd > 0 &&
                    '\u200b' == t.prevInput
                      ? Ai(n, Zo)(n)
                      : e++ < 10
                      ? (r.detectingSelectAll = setTimeout(o, 500))
                      : ((r.selForContextMenu = null), r.input.reset());
                  };
                r.detectingSelectAll = setTimeout(o, 200);
              }
            }
          }),
          (is.prototype.readOnlyChanged = function (e) {
            e || this.reset(), (this.textarea.disabled = 'nocursor' == e);
          }),
          (is.prototype.setUneditable = function () {}),
          (is.prototype.needsContentAttribute = !1),
          Pl(_l),
          Yl(_l);
        var ls = 'iter insert remove copy getEditor constructor'.split(' ');
        for (var ss in Ca.prototype)
          Ca.prototype.hasOwnProperty(ss) &&
            H(ls, ss) < 0 &&
            (_l.prototype[ss] = (function (e) {
              return function () {
                return e.apply(this.doc, arguments);
              };
            })(Ca.prototype[ss]));
        return (
          xe(Ca),
          (_l.inputStyles = { textarea: is, contenteditable: Xl }),
          (_l.defineMode = function (e) {
            _l.defaults.mode || 'null' == e || (_l.defaults.mode = e), He.apply(this, arguments);
          }),
          (_l.defineMIME = We),
          _l.defineMode('null', function () {
            return {
              token: function (e) {
                return e.skipToEnd();
              },
            };
          }),
          _l.defineMIME('text/plain', 'null'),
          (_l.defineExtension = function (e, t) {
            _l.prototype[e] = t;
          }),
          (_l.defineDocExtension = function (e, t) {
            Ca.prototype[e] = t;
          }),
          (_l.fromTextArea = os),
          as(_l),
          (_l.version = '5.54.0'),
          _l
        );
      });
    },
    WtSK: function (e, t, n) {},
    XPNs: function (e, t, n) {
      'use strict';
      function r(e) {
        var t = [],
          n = [],
          r = '',
          i = Object.create(null),
          o = i;
        return a(e);
        function a(e) {
          for (var t, n = 0; n < e.length; n++)
            switch (((t = e[n]), t.type)) {
              case 'Assign':
                s(t);
                break;
              case 'ObjectPath':
                p(t);
                break;
              case 'ArrayPath':
                d(t);
                break;
            }
          return i;
        }
        function l(e, t, n) {
          var r = new Error(e);
          throw ((r.line = t), (r.column = n), r);
        }
        function s(e) {
          var i,
            a = e.key,
            s = e.value,
            f = e.line,
            p = e.column;
          (i = r ? r + '.' + a : a),
            'undefined' !== typeof o[a] && l("Cannot redefine existing key '" + i + "'.", f, p),
            (o[a] = u(s)),
            c(i) || (t.push(i), n.push(i));
        }
        function c(e) {
          return -1 !== t.indexOf(e);
        }
        function u(e) {
          return 'Array' === e.type ? m(e.value) : 'InlineTable' === e.type ? f(e.value) : e.value;
        }
        function f(e) {
          for (var t = Object.create(null), n = 0; n < e.length; n++) {
            var r = e[n];
            'InlineTable' === r.value.type
              ? (t[r.key] = f(r.value.value))
              : 'InlineTableValue' === r.type && (t[r.key] = u(r.value));
          }
          return t;
        }
        function p(e) {
          var n = e.value,
            a = n.map(g).join('.'),
            s = e.line,
            u = e.column;
          c(a) && l("Cannot redefine existing key '" + n + "'.", s, u),
            t.push(a),
            (o = h(i, n, Object.create(null), s, u)),
            (r = n);
        }
        function d(e) {
          var n = e.value,
            a = n.map(g).join('.'),
            s = e.line,
            u = e.column;
          if (
            (c(a) || t.push(a),
            (t = t.filter(function (e) {
              return 0 !== e.indexOf(a);
            })),
            t.push(a),
            (o = h(i, n, [], s, u)),
            (r = a),
            o instanceof Array)
          ) {
            var f = Object.create(null);
            o.push(f), (o = f);
          } else l("Cannot redefine existing key '" + n + "'.", s, u);
        }
        function h(e, t, r, i, o) {
          for (var a = [], s = '', c = (t.join('.'), e), u = 0; u < t.length; u++) {
            var f = t[u];
            a.push(f),
              (s = a.join('.')),
              'undefined' === typeof c[f]
                ? u === t.length - 1
                  ? (c[f] = r)
                  : (c[f] = Object.create(null))
                : u !== t.length - 1 &&
                  n.indexOf(s) > -1 &&
                  l("Cannot redefine existing key '" + s + "'.", i, o),
              (c = c[f]),
              c instanceof Array && c.length && u < t.length - 1 && (c = c[c.length - 1]);
          }
          return c;
        }
        function m(e) {
          for (var t = null, n = 0; n < e.length; n++) {
            var r = e[n];
            null === t
              ? (t = r.type)
              : r.type !== t &&
                l(
                  'Cannot add value of type ' + r.type + ' to array of type ' + t + '.',
                  r.line,
                  r.column,
                );
          }
          return e.map(u);
        }
        function g(e) {
          return e.indexOf('.') > -1 ? '"' + e + '"' : e;
        }
      }
      e.exports = { compile: r };
    },
    aJyg: function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = n('TSYQ'),
        o = n.n(i),
        a = n('BGR+'),
        l = n('HQEm'),
        s = n.n(l),
        c = n('kaz8'),
        u = n('BvKs'),
        f = n('jsC+'),
        p = n('kbBi'),
        d = n.n(p),
        h = n('w6Tc'),
        m = n.n(h),
        g = n('5rEg');
      function v(e) {
        return (
          (v =
            'function' === typeof Symbol && 'symbol' === typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    'function' === typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? 'symbol'
                    : typeof e;
                }),
          v(e)
        );
      }
      function y(e, t) {
        if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
      }
      function b(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function w(e, t, n) {
        return t && b(e.prototype, t), n && b(e, n), e;
      }
      function x(e, t) {
        if ('function' !== typeof t && null !== t)
          throw new TypeError('Super expression must either be null or a function');
        (e.prototype = Object.create(t && t.prototype, {
          constructor: { value: e, writable: !0, configurable: !0 },
        })),
          t && C(e, t);
      }
      function C(e, t) {
        return (
          (C =
            Object.setPrototypeOf ||
            function (e, t) {
              return (e.__proto__ = t), e;
            }),
          C(e, t)
        );
      }
      function S(e) {
        var t = O();
        return function () {
          var n,
            r = L(e);
          if (t) {
            var i = L(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return k(this, n);
        };
      }
      function k(e, t) {
        return !t || ('object' !== v(t) && 'function' !== typeof t) ? E(e) : t;
      }
      function E(e) {
        if (void 0 === e)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e;
      }
      function O() {
        if ('undefined' === typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ('function' === typeof Proxy) return !0;
        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }
      function L(e) {
        return (
          (L = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e);
              }),
          L(e)
        );
      }
      var T = (function () {
          var e = (function (e) {
            x(n, e);
            var t = S(n);
            function n() {
              var e;
              return (
                y(this, n),
                (e = t.apply(this, arguments)),
                (e.handleChange = function (t) {
                  var n = e.props.onChange;
                  n && n(t);
                }),
                (e.handleClear = function (t) {
                  t.preventDefault();
                  var n = e.props,
                    r = n.handleClear,
                    i = n.disabled;
                  !i && r && r(t);
                }),
                e
              );
            }
            return (
              w(n, [
                {
                  key: 'render',
                  value: function () {
                    var e = this.props,
                      t = e.placeholder,
                      n = e.value,
                      i = e.prefixCls,
                      o = e.disabled,
                      a =
                        n && n.length > 0
                          ? r['createElement'](
                              'a',
                              {
                                href: '#',
                                className: ''.concat(i, '-action'),
                                onClick: this.handleClear,
                              },
                              r['createElement'](d.a, null),
                            )
                          : r['createElement'](
                              'span',
                              { className: ''.concat(i, '-action') },
                              r['createElement'](m.a, null),
                            );
                    return r['createElement'](
                      'div',
                      null,
                      r['createElement'](g['a'], {
                        placeholder: t,
                        className: i,
                        value: n,
                        onChange: this.handleChange,
                        disabled: o,
                      }),
                      a,
                    );
                  },
                },
              ]),
              n
            );
          })(r['Component']);
          return (e.defaultProps = { placeholder: '' }), e;
        })(),
        N = T,
        M = n('CWQg'),
        A = n('NUBc'),
        j = n('/MfK'),
        P = n('ZvpZ'),
        I = n('gDlH'),
        D = n('YMnH');
      function _(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      var z = function (e) {
          var t,
            n,
            i = e.renderedText,
            a = e.renderedEl,
            l = e.item,
            s = e.checked,
            u = e.disabled,
            f = e.prefixCls,
            p = e.onClick,
            d = e.onRemove,
            h = e.showRemove,
            m = o()(
              ((t = {}),
              _(t, ''.concat(f, '-content-item'), !0),
              _(t, ''.concat(f, '-content-item-disabled'), u || l.disabled),
              _(t, ''.concat(f, '-content-item-checked'), s),
              t),
            );
          return (
            ('string' !== typeof i && 'number' !== typeof i) || (n = String(i)),
            r['createElement'](
              D['a'],
              { componentName: 'Transfer', defaultLocale: P['a'].Transfer },
              function (e) {
                var t = { className: m, title: n },
                  i = r['createElement'](
                    'span',
                    { className: ''.concat(f, '-content-item-text') },
                    a,
                  );
                return h
                  ? r['createElement'](
                      'li',
                      t,
                      i,
                      r['createElement'](
                        I['a'],
                        {
                          disabled: u || l.disabled,
                          className: ''.concat(f, '-content-item-remove'),
                          'aria-label': e.remove,
                          onClick: function () {
                            null === d || void 0 === d || d(l);
                          },
                        },
                        r['createElement'](j['a'], null),
                      ),
                    )
                  : ((t.onClick =
                      u || l.disabled
                        ? void 0
                        : function () {
                            return p(l);
                          }),
                    r['createElement'](
                      'li',
                      t,
                      r['createElement'](c['a'], { checked: s, disabled: u || l.disabled }),
                      i,
                    ));
              },
            )
          );
        },
        R = r['memo'](z);
      function F(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function H(e, t) {
        if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
      }
      function W(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function B(e, t, n) {
        return t && W(e.prototype, t), n && W(e, n), e;
      }
      function V(e, t) {
        if ('function' !== typeof t && null !== t)
          throw new TypeError('Super expression must either be null or a function');
        (e.prototype = Object.create(t && t.prototype, {
          constructor: { value: e, writable: !0, configurable: !0 },
        })),
          t && U(e, t);
      }
      function U(e, t) {
        return (
          (U =
            Object.setPrototypeOf ||
            function (e, t) {
              return (e.__proto__ = t), e;
            }),
          U(e, t)
        );
      }
      function K(e) {
        var t = Y();
        return function () {
          var n,
            r = Z(e);
          if (t) {
            var i = Z(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return q(this, n);
        };
      }
      function q(e, t) {
        return !t || ('object' !== X(t) && 'function' !== typeof t) ? G(e) : t;
      }
      function G(e) {
        if (void 0 === e)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e;
      }
      function Y() {
        if ('undefined' === typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ('function' === typeof Proxy) return !0;
        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }
      function Z(e) {
        return (
          (Z = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e);
              }),
          Z(e)
        );
      }
      function $() {
        return (
          ($ =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          $.apply(this, arguments)
        );
      }
      function X(e) {
        return (
          (X =
            'function' === typeof Symbol && 'symbol' === typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    'function' === typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? 'symbol'
                    : typeof e;
                }),
          X(e)
        );
      }
      var J = Object(M['a'])('handleFilter', 'handleClear', 'checkedKeys');
      function Q(e) {
        if (!e) return null;
        var t = { pageSize: 10 };
        return 'object' === X(e) ? $($({}, t), e) : t;
      }
      var ee = (function (e) {
          V(n, e);
          var t = K(n);
          function n() {
            var e;
            return (
              H(this, n),
              (e = t.apply(this, arguments)),
              (e.state = { current: 1 }),
              (e.onItemSelect = function (t) {
                var n = e.props,
                  r = n.onItemSelect,
                  i = n.selectedKeys,
                  o = i.indexOf(t.key) >= 0;
                r(t.key, !o);
              }),
              (e.onItemRemove = function (t) {
                var n = e.props.onItemRemove;
                null === n || void 0 === n || n([t.key]);
              }),
              (e.onPageChange = function (t) {
                e.setState({ current: t });
              }),
              (e.getItems = function () {
                var t = e.state.current,
                  n = e.props,
                  r = n.pagination,
                  i = n.filteredRenderItems,
                  o = Q(r),
                  a = i;
                return o && (a = i.slice((t - 1) * o.pageSize, t * o.pageSize)), a;
              }),
              e
            );
          }
          return (
            B(
              n,
              [
                {
                  key: 'render',
                  value: function () {
                    var e = this,
                      t = this.state.current,
                      n = this.props,
                      i = n.prefixCls,
                      a = n.onScroll,
                      l = n.filteredRenderItems,
                      s = n.selectedKeys,
                      c = n.disabled,
                      u = n.showRemove,
                      f = n.pagination,
                      p = Q(f),
                      d = null;
                    return (
                      p &&
                        (d = r['createElement'](A['a'], {
                          simple: !0,
                          className: ''.concat(i, '-pagination'),
                          total: l.length,
                          pageSize: p.pageSize,
                          current: t,
                          onChange: this.onPageChange,
                        })),
                      r['createElement'](
                        r['Fragment'],
                        null,
                        r['createElement'](
                          'ul',
                          {
                            className: o()(
                              ''.concat(i, '-content'),
                              F({}, ''.concat(i, '-content-show-remove'), u),
                            ),
                            onScroll: a,
                          },
                          this.getItems().map(function (t) {
                            var n = t.renderedEl,
                              o = t.renderedText,
                              a = t.item,
                              l = a.disabled,
                              f = s.indexOf(a.key) >= 0;
                            return r['createElement'](R, {
                              disabled: c || l,
                              key: a.key,
                              item: a,
                              renderedText: o,
                              renderedEl: n,
                              checked: f,
                              prefixCls: i,
                              onClick: e.onItemSelect,
                              onRemove: e.onItemRemove,
                              showRemove: u,
                            });
                          }),
                        ),
                        d,
                      )
                    );
                  },
                },
              ],
              [
                {
                  key: 'getDerivedStateFromProps',
                  value: function (e, t) {
                    var n = e.filteredRenderItems,
                      r = e.pagination,
                      i = t.current,
                      o = Q(r);
                    if (o) {
                      var a = Math.ceil(n.length / o.pageSize);
                      if (i > a) return { current: a };
                    }
                    return null;
                  },
                },
              ],
            ),
            n
          );
        })(r['Component']),
        te = ee,
        ne = n('0n0R');
      function re(e) {
        return (
          (re =
            'function' === typeof Symbol && 'symbol' === typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    'function' === typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? 'symbol'
                    : typeof e;
                }),
          re(e)
        );
      }
      function ie(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function oe() {
        return (
          (oe =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          oe.apply(this, arguments)
        );
      }
      function ae(e, t) {
        if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
      }
      function le(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function se(e, t, n) {
        return t && le(e.prototype, t), n && le(e, n), e;
      }
      function ce(e, t) {
        if ('function' !== typeof t && null !== t)
          throw new TypeError('Super expression must either be null or a function');
        (e.prototype = Object.create(t && t.prototype, {
          constructor: { value: e, writable: !0, configurable: !0 },
        })),
          t && ue(e, t);
      }
      function ue(e, t) {
        return (
          (ue =
            Object.setPrototypeOf ||
            function (e, t) {
              return (e.__proto__ = t), e;
            }),
          ue(e, t)
        );
      }
      function fe(e) {
        var t = he();
        return function () {
          var n,
            r = me(e);
          if (t) {
            var i = me(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return pe(this, n);
        };
      }
      function pe(e, t) {
        return !t || ('object' !== re(t) && 'function' !== typeof t) ? de(e) : t;
      }
      function de(e) {
        if (void 0 === e)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e;
      }
      function he() {
        if ('undefined' === typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ('function' === typeof Proxy) return !0;
        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }
      function me(e) {
        return (
          (me = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e);
              }),
          me(e)
        );
      }
      var ge = function () {
        return null;
      };
      function ve(e) {
        return e && !Object(ne['b'])(e) && '[object Object]' === Object.prototype.toString.call(e);
      }
      function ye(e) {
        return e
          .filter(function (e) {
            return !e.disabled;
          })
          .map(function (e) {
            return e.key;
          });
      }
      var be = (function () {
          var e = (function (e) {
            ce(n, e);
            var t = fe(n);
            function n(e) {
              var i;
              return (
                ae(this, n),
                (i = t.call(this, e)),
                (i.defaultListBodyRef = r['createRef']()),
                (i.handleFilter = function (e) {
                  var t = i.props.handleFilter,
                    n = e.target.value;
                  i.setState({ filterValue: n }), t(e);
                }),
                (i.handleClear = function () {
                  var e = i.props.handleClear;
                  i.setState({ filterValue: '' }), e();
                }),
                (i.matchFilter = function (e, t) {
                  var n = i.state.filterValue,
                    r = i.props.filterOption;
                  return r ? r(n, t) : e.indexOf(n) >= 0;
                }),
                (i.getCurrentPageItems = function () {}),
                (i.renderListBody = function (e, t) {
                  var n = e ? e(t) : null,
                    o = !!n;
                  return (
                    o || (n = r['createElement'](te, oe({ ref: i.defaultListBodyRef }, t))),
                    { customize: o, bodyContent: n }
                  );
                }),
                (i.renderItem = function (e) {
                  var t = i.props.render,
                    n = void 0 === t ? ge : t,
                    r = n(e),
                    o = ve(r);
                  return { renderedText: o ? r.value : r, renderedEl: o ? r.label : r, item: e };
                }),
                (i.getSelectAllLabel = function (e, t) {
                  var n = i.props,
                    o = n.itemsUnit,
                    a = n.itemUnit,
                    l = n.selectAllLabel;
                  if (l)
                    return 'function' === typeof l ? l({ selectedCount: e, totalCount: t }) : l;
                  var s = t > 1 ? o : a;
                  return r['createElement'](
                    r['Fragment'],
                    null,
                    (e > 0 ? ''.concat(e, '/') : '') + t,
                    ' ',
                    s,
                  );
                }),
                (i.state = { filterValue: '' }),
                i
              );
            }
            return (
              se(n, [
                {
                  key: 'componentWillUnmount',
                  value: function () {
                    clearTimeout(this.triggerScrollTimer);
                  },
                },
                {
                  key: 'getCheckStatus',
                  value: function (e) {
                    var t = this.props.checkedKeys;
                    return 0 === t.length
                      ? 'none'
                      : e.every(function (e) {
                          return t.indexOf(e.key) >= 0 || !!e.disabled;
                        })
                      ? 'all'
                      : 'part';
                  },
                },
                {
                  key: 'getFilteredItems',
                  value: function (e, t) {
                    var n = this,
                      r = [],
                      i = [];
                    return (
                      e.forEach(function (e) {
                        var o = n.renderItem(e),
                          a = o.renderedText;
                        if (t && t.trim() && !n.matchFilter(a, e)) return null;
                        r.push(e), i.push(o);
                      }),
                      { filteredItems: r, filteredRenderItems: i }
                    );
                  },
                },
                {
                  key: 'getListBody',
                  value: function (e, t, n, i, l, s, c, u, f, p) {
                    var d,
                      h = f
                        ? r['createElement'](
                            'div',
                            { className: ''.concat(e, '-body-search-wrapper') },
                            r['createElement'](N, {
                              prefixCls: ''.concat(e, '-search'),
                              onChange: this.handleFilter,
                              handleClear: this.handleClear,
                              placeholder: t,
                              value: n,
                              disabled: p,
                            }),
                          )
                        : null,
                      m = this.renderListBody(
                        u,
                        oe(oe({}, Object(a['a'])(this.props, J)), {
                          filteredItems: i,
                          filteredRenderItems: s,
                          selectedKeys: c,
                        }),
                      ),
                      g = m.bodyContent,
                      v = m.customize;
                    return (
                      (d = v
                        ? r['createElement'](
                            'div',
                            { className: ''.concat(e, '-body-customize-wrapper') },
                            g,
                          )
                        : i.length
                        ? g
                        : r['createElement'](
                            'div',
                            { className: ''.concat(e, '-body-not-found') },
                            l,
                          )),
                      r['createElement'](
                        'div',
                        {
                          className: o()(
                            f
                              ? ''.concat(e, '-body ').concat(e, '-body-with-search')
                              : ''.concat(e, '-body'),
                          ),
                        },
                        h,
                        d,
                      )
                    );
                  },
                },
                {
                  key: 'getCheckBox',
                  value: function (e, t, n, i) {
                    var o = this.getCheckStatus(e),
                      a = 'all' === o,
                      l =
                        !1 !== n &&
                        r['createElement'](c['a'], {
                          disabled: i,
                          checked: a,
                          indeterminate: 'part' === o,
                          onChange: function () {
                            t(
                              e
                                .filter(function (e) {
                                  return !e.disabled;
                                })
                                .map(function (e) {
                                  var t = e.key;
                                  return t;
                                }),
                              !a,
                            );
                          },
                        });
                    return l;
                  },
                },
                {
                  key: 'render',
                  value: function () {
                    var e,
                      t = this,
                      n = this.state.filterValue,
                      i = this.props,
                      a = i.prefixCls,
                      l = i.dataSource,
                      c = i.titleText,
                      p = i.checkedKeys,
                      d = i.disabled,
                      h = i.footer,
                      m = i.showSearch,
                      g = i.style,
                      v = i.searchPlaceholder,
                      y = i.notFoundContent,
                      b = i.selectAll,
                      w = i.selectCurrent,
                      x = i.selectInvert,
                      C = i.removeAll,
                      S = i.removeCurrent,
                      k = i.renderList,
                      E = i.onItemSelectAll,
                      O = i.onItemRemove,
                      L = i.showSelectAll,
                      T = i.showRemove,
                      N = i.pagination,
                      M = h && h(this.props),
                      A = o()(
                        a,
                        ((e = {}),
                        ie(e, ''.concat(a, '-with-pagination'), N),
                        ie(e, ''.concat(a, '-with-footer'), M),
                        e),
                      ),
                      j = this.getFilteredItems(l, n),
                      P = j.filteredItems,
                      I = j.filteredRenderItems,
                      D = this.getListBody(a, v, n, P, y, I, p, k, m, d),
                      _ = M
                        ? r['createElement']('div', { className: ''.concat(a, '-footer') }, M)
                        : null,
                      z = !T && !N && this.getCheckBox(P, E, L, d),
                      R = null;
                    R = T
                      ? r['createElement'](
                          u['default'],
                          null,
                          N &&
                            r['createElement'](
                              u['default'].Item,
                              {
                                onClick: function () {
                                  var e,
                                    n = ye(
                                      (
                                        (null === (e = t.defaultListBodyRef.current) || void 0 === e
                                          ? void 0
                                          : e.getItems()) || []
                                      ).map(function (e) {
                                        return e.item;
                                      }),
                                    );
                                  null === O || void 0 === O || O(n);
                                },
                              },
                              S,
                            ),
                          r['createElement'](
                            u['default'].Item,
                            {
                              onClick: function () {
                                null === O || void 0 === O || O(ye(P));
                              },
                            },
                            C,
                          ),
                        )
                      : r['createElement'](
                          u['default'],
                          null,
                          r['createElement'](
                            u['default'].Item,
                            {
                              onClick: function () {
                                var e = ye(P);
                                E(e, e.length !== p.length);
                              },
                            },
                            b,
                          ),
                          N &&
                            r['createElement'](
                              u['default'].Item,
                              {
                                onClick: function () {
                                  var e,
                                    n =
                                      (null === (e = t.defaultListBodyRef.current) || void 0 === e
                                        ? void 0
                                        : e.getItems()) || [];
                                  E(
                                    ye(
                                      n.map(function (e) {
                                        return e.item;
                                      }),
                                    ),
                                    !0,
                                  );
                                },
                              },
                              w,
                            ),
                          r['createElement'](
                            u['default'].Item,
                            {
                              onClick: function () {
                                var e, n;
                                n = ye(
                                  N
                                    ? (
                                        (null === (e = t.defaultListBodyRef.current) || void 0 === e
                                          ? void 0
                                          : e.getItems()) || []
                                      ).map(function (e) {
                                        return e.item;
                                      })
                                    : P,
                                );
                                var r = new Set(p),
                                  i = [],
                                  o = [];
                                n.forEach(function (e) {
                                  r.has(e) ? o.push(e) : i.push(e);
                                }),
                                  E(i, !0),
                                  E(o, !1);
                              },
                            },
                            x,
                          ),
                        );
                    var F = r['createElement'](
                      f['default'],
                      { className: ''.concat(a, '-header-dropdown'), overlay: R, disabled: d },
                      r['createElement'](s.a, null),
                    );
                    return r['createElement'](
                      'div',
                      { className: A, style: g },
                      r['createElement'](
                        'div',
                        { className: ''.concat(a, '-header') },
                        z,
                        F,
                        r['createElement'](
                          'span',
                          { className: ''.concat(a, '-header-selected') },
                          this.getSelectAllLabel(p.length, P.length),
                        ),
                        r['createElement']('span', { className: ''.concat(a, '-header-title') }, c),
                      ),
                      D,
                      _,
                    );
                  },
                },
              ]),
              n
            );
          })(r['PureComponent']);
          return (e.defaultProps = { dataSource: [], titleText: '', showSearch: !1 }), e;
        })(),
        we = be,
        xe = n('DFhj'),
        Ce = n.n(xe),
        Se = n('fEPi'),
        ke = n.n(Se),
        Ee = n('2/Rp'),
        Oe = function (e) {
          var t = e.disabled,
            n = e.moveToLeft,
            i = e.moveToRight,
            o = e.leftArrowText,
            a = void 0 === o ? '' : o,
            l = e.rightArrowText,
            s = void 0 === l ? '' : l,
            c = e.leftActive,
            u = e.rightActive,
            f = e.className,
            p = e.style,
            d = e.direction,
            h = e.oneWay;
          return r['createElement'](
            'div',
            { className: f, style: p },
            r['createElement'](
              Ee['default'],
              {
                type: 'primary',
                size: 'small',
                disabled: t || !u,
                onClick: i,
                icon: 'rtl' !== d ? r['createElement'](ke.a, null) : r['createElement'](Ce.a, null),
              },
              s,
            ),
            !h &&
              r['createElement'](
                Ee['default'],
                {
                  type: 'primary',
                  size: 'small',
                  disabled: t || !c,
                  onClick: n,
                  icon:
                    'rtl' !== d ? r['createElement'](Ce.a, null) : r['createElement'](ke.a, null),
                },
                a,
              ),
          );
        },
        Le = Oe,
        Te = n('H84U'),
        Ne = n('uaoM');
      function Me(e) {
        return (
          (Me =
            'function' === typeof Symbol && 'symbol' === typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    'function' === typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? 'symbol'
                    : typeof e;
                }),
          Me(e)
        );
      }
      function Ae(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function je(e) {
        return _e(e) || De(e) || Ie(e) || Pe();
      }
      function Pe() {
        throw new TypeError(
          'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      function Ie(e, t) {
        if (e) {
          if ('string' === typeof e) return ze(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? ze(e, t)
              : void 0
          );
        }
      }
      function De(e) {
        if ('undefined' !== typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e);
      }
      function _e(e) {
        if (Array.isArray(e)) return ze(e);
      }
      function ze(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function Re() {
        return (
          (Re =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          Re.apply(this, arguments)
        );
      }
      function Fe(e, t) {
        if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
      }
      function He(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function We(e, t, n) {
        return t && He(e.prototype, t), n && He(e, n), e;
      }
      function Be(e, t) {
        if ('function' !== typeof t && null !== t)
          throw new TypeError('Super expression must either be null or a function');
        (e.prototype = Object.create(t && t.prototype, {
          constructor: { value: e, writable: !0, configurable: !0 },
        })),
          t && Ve(e, t);
      }
      function Ve(e, t) {
        return (
          (Ve =
            Object.setPrototypeOf ||
            function (e, t) {
              return (e.__proto__ = t), e;
            }),
          Ve(e, t)
        );
      }
      function Ue(e) {
        var t = Ge();
        return function () {
          var n,
            r = Ye(e);
          if (t) {
            var i = Ye(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return Ke(this, n);
        };
      }
      function Ke(e, t) {
        return !t || ('object' !== Me(t) && 'function' !== typeof t) ? qe(e) : t;
      }
      function qe(e) {
        if (void 0 === e)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e;
      }
      function Ge() {
        if ('undefined' === typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ('function' === typeof Proxy) return !0;
        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }
      function Ye(e) {
        return (
          (Ye = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e);
              }),
          Ye(e)
        );
      }
      var Ze = (function () {
        var e = (function (e) {
          Be(n, e);
          var t = Ue(n);
          function n(e) {
            var i;
            Fe(this, n),
              (i = t.call(this, e)),
              (i.separatedDataSource = null),
              (i.setStateKeys = function (e, t) {
                'left' === e
                  ? i.setState(function (e) {
                      var n = e.sourceSelectedKeys;
                      return { sourceSelectedKeys: 'function' === typeof t ? t(n || []) : t };
                    })
                  : i.setState(function (e) {
                      var n = e.targetSelectedKeys;
                      return { targetSelectedKeys: 'function' === typeof t ? t(n || []) : t };
                    });
              }),
              (i.getLocale = function (e, t) {
                return Re(Re(Re({}, e), { notFoundContent: t('Transfer') }), i.props.locale);
              }),
              (i.moveTo = function (e) {
                var t = i.props,
                  n = t.targetKeys,
                  r = void 0 === n ? [] : n,
                  o = t.dataSource,
                  a = void 0 === o ? [] : o,
                  l = t.onChange,
                  s = i.state,
                  c = s.sourceSelectedKeys,
                  u = s.targetSelectedKeys,
                  f = 'right' === e ? c : u,
                  p = f.filter(function (e) {
                    return !a.some(function (t) {
                      return !(e !== t.key || !t.disabled);
                    });
                  }),
                  d =
                    'right' === e
                      ? p.concat(r)
                      : r.filter(function (e) {
                          return -1 === p.indexOf(e);
                        }),
                  h = 'right' === e ? 'left' : 'right';
                i.setStateKeys(h, []), i.handleSelectChange(h, []), l && l(d, e, p);
              }),
              (i.moveToLeft = function () {
                return i.moveTo('left');
              }),
              (i.moveToRight = function () {
                return i.moveTo('right');
              }),
              (i.onItemSelectAll = function (e, t, n) {
                i.setStateKeys(e, function (r) {
                  var o = [];
                  return (
                    (o = n
                      ? Array.from(new Set([].concat(je(r), je(t))))
                      : r.filter(function (e) {
                          return -1 === t.indexOf(e);
                        })),
                    i.handleSelectChange(e, o),
                    o
                  );
                });
              }),
              (i.onLeftItemSelectAll = function (e, t) {
                return i.onItemSelectAll('left', e, t);
              }),
              (i.onRightItemSelectAll = function (e, t) {
                return i.onItemSelectAll('right', e, t);
              }),
              (i.handleFilter = function (e, t) {
                var n = i.props.onSearch,
                  r = t.target.value;
                n && n(e, r);
              }),
              (i.handleLeftFilter = function (e) {
                return i.handleFilter('left', e);
              }),
              (i.handleRightFilter = function (e) {
                return i.handleFilter('right', e);
              }),
              (i.handleClear = function (e) {
                var t = i.props.onSearch;
                t && t(e, '');
              }),
              (i.handleLeftClear = function () {
                return i.handleClear('left');
              }),
              (i.handleRightClear = function () {
                return i.handleClear('right');
              }),
              (i.onItemSelect = function (e, t, n) {
                var r = i.state,
                  o = r.sourceSelectedKeys,
                  a = r.targetSelectedKeys,
                  l = je('left' === e ? o : a),
                  s = l.indexOf(t);
                s > -1 && l.splice(s, 1),
                  n && l.push(t),
                  i.handleSelectChange(e, l),
                  i.props.selectedKeys || i.setStateKeys(e, l);
              }),
              (i.onLeftItemSelect = function (e, t) {
                return i.onItemSelect('left', e, t);
              }),
              (i.onRightItemSelect = function (e, t) {
                return i.onItemSelect('right', e, t);
              }),
              (i.onRightItemRemove = function (e) {
                var t = i.props,
                  n = t.targetKeys,
                  r = void 0 === n ? [] : n,
                  o = t.onChange;
                i.setStateKeys('right', []),
                  o &&
                    o(
                      r.filter(function (t) {
                        return !e.includes(t);
                      }),
                      'left',
                      je(e),
                    );
              }),
              (i.handleScroll = function (e, t) {
                var n = i.props.onScroll;
                n && n(e, t);
              }),
              (i.handleLeftScroll = function (e) {
                return i.handleScroll('left', e);
              }),
              (i.handleRightScroll = function (e) {
                return i.handleScroll('right', e);
              }),
              (i.handleListStyle = function (e, t) {
                return 'function' === typeof e ? e({ direction: t }) : e;
              }),
              (i.renderTransfer = function (e) {
                return r['createElement'](Te['a'], null, function (t) {
                  var n,
                    a = t.getPrefixCls,
                    l = t.renderEmpty,
                    s = t.direction,
                    c = i.props,
                    u = c.prefixCls,
                    f = c.className,
                    p = c.disabled,
                    d = c.operations,
                    h = void 0 === d ? [] : d,
                    m = c.showSearch,
                    g = c.footer,
                    v = c.style,
                    y = c.listStyle,
                    b = c.operationStyle,
                    w = c.filterOption,
                    x = c.render,
                    C = c.children,
                    S = c.showSelectAll,
                    k = c.oneWay,
                    E = c.pagination,
                    O = a('transfer', u),
                    L = i.getLocale(e, l),
                    T = i.state,
                    N = T.sourceSelectedKeys,
                    M = T.targetSelectedKeys,
                    A = !C && E,
                    j = i.separateDataSource(),
                    P = j.leftDataSource,
                    I = j.rightDataSource,
                    D = M.length > 0,
                    _ = N.length > 0,
                    z = o()(
                      f,
                      O,
                      ((n = {}),
                      Ae(n, ''.concat(O, '-disabled'), p),
                      Ae(n, ''.concat(O, '-customize-list'), !!C),
                      Ae(n, ''.concat(O, '-rtl'), 'rtl' === s),
                      n),
                    ),
                    R = i.getTitles(L),
                    F = i.props.selectAllLabels || [];
                  return r['createElement'](
                    'div',
                    { className: z, style: v },
                    r['createElement'](
                      we,
                      Re(
                        {
                          prefixCls: ''.concat(O, '-list'),
                          titleText: R[0],
                          dataSource: P,
                          filterOption: w,
                          style: i.handleListStyle(y, 'left'),
                          checkedKeys: N,
                          handleFilter: i.handleLeftFilter,
                          handleClear: i.handleLeftClear,
                          onItemSelect: i.onLeftItemSelect,
                          onItemSelectAll: i.onLeftItemSelectAll,
                          render: x,
                          showSearch: m,
                          renderList: C,
                          footer: g,
                          onScroll: i.handleLeftScroll,
                          disabled: p,
                          direction: 'left',
                          showSelectAll: S,
                          selectAllLabel: F[0],
                          pagination: A,
                        },
                        L,
                      ),
                    ),
                    r['createElement'](Le, {
                      className: ''.concat(O, '-operation'),
                      rightActive: _,
                      rightArrowText: h[0],
                      moveToRight: i.moveToRight,
                      leftActive: D,
                      leftArrowText: h[1],
                      moveToLeft: i.moveToLeft,
                      style: b,
                      disabled: p,
                      direction: s,
                      oneWay: k,
                    }),
                    r['createElement'](
                      we,
                      Re(
                        {
                          prefixCls: ''.concat(O, '-list'),
                          titleText: R[1],
                          dataSource: I,
                          filterOption: w,
                          style: i.handleListStyle(y, 'right'),
                          checkedKeys: M,
                          handleFilter: i.handleRightFilter,
                          handleClear: i.handleRightClear,
                          onItemSelect: i.onRightItemSelect,
                          onItemSelectAll: i.onRightItemSelectAll,
                          onItemRemove: i.onRightItemRemove,
                          render: x,
                          showSearch: m,
                          renderList: C,
                          footer: g,
                          onScroll: i.handleRightScroll,
                          disabled: p,
                          direction: 'right',
                          showSelectAll: S,
                          selectAllLabel: F[1],
                          showRemove: k,
                          pagination: A,
                        },
                        L,
                      ),
                    ),
                  );
                });
              });
            var a = e.selectedKeys,
              l = void 0 === a ? [] : a,
              s = e.targetKeys,
              c = void 0 === s ? [] : s;
            return (
              (i.state = {
                sourceSelectedKeys: l.filter(function (e) {
                  return -1 === c.indexOf(e);
                }),
                targetSelectedKeys: l.filter(function (e) {
                  return c.indexOf(e) > -1;
                }),
              }),
              i
            );
          }
          return (
            We(
              n,
              [
                {
                  key: 'getTitles',
                  value: function (e) {
                    var t = this.props.titles;
                    return t || e.titles;
                  },
                },
                {
                  key: 'handleSelectChange',
                  value: function (e, t) {
                    var n = this.state,
                      r = n.sourceSelectedKeys,
                      i = n.targetSelectedKeys,
                      o = this.props.onSelectChange;
                    o && ('left' === e ? o(t, i) : o(r, t));
                  },
                },
                {
                  key: 'separateDataSource',
                  value: function () {
                    var e = this.props,
                      t = e.dataSource,
                      n = e.rowKey,
                      r = e.targetKeys,
                      i = void 0 === r ? [] : r,
                      o = [],
                      a = new Array(i.length);
                    return (
                      t.forEach(function (e) {
                        n && (e.key = n(e));
                        var t = i.indexOf(e.key);
                        -1 !== t ? (a[t] = e) : o.push(e);
                      }),
                      { leftDataSource: o, rightDataSource: a }
                    );
                  },
                },
                {
                  key: 'render',
                  value: function () {
                    return r['createElement'](
                      D['a'],
                      { componentName: 'Transfer', defaultLocale: P['a'].Transfer },
                      this.renderTransfer,
                    );
                  },
                },
              ],
              [
                {
                  key: 'getDerivedStateFromProps',
                  value: function (e) {
                    var t = e.selectedKeys,
                      n = e.targetKeys,
                      r = e.pagination,
                      i = e.children;
                    if (t) {
                      var o = n || [];
                      return {
                        sourceSelectedKeys: t.filter(function (e) {
                          return !o.includes(e);
                        }),
                        targetSelectedKeys: t.filter(function (e) {
                          return o.includes(e);
                        }),
                      };
                    }
                    return (
                      Object(Ne['a'])(
                        !r || !i,
                        'Transfer',
                        '`pagination` not support customize render list.',
                      ),
                      null
                    );
                  },
                },
              ],
            ),
            n
          );
        })(r['Component']);
        return (
          (e.List = we),
          (e.Operation = Le),
          (e.Search = N),
          (e.defaultProps = {
            dataSource: [],
            locale: {},
            showSearch: !1,
            listStyle: function () {},
          }),
          e
        );
      })();
      t['a'] = Ze;
    },
    bogI: function (e, t, n) {
      'use strict';
      n.d(t, 'a', function () {
        return r;
      });
      var r = function (e) {
        if (!e) return null;
        var t = 'function' === typeof e;
        return t ? e() : e;
      };
    },
    cK6b: function (e, t, n) {
      (function (e) {
        function t(e, t, n) {
          var r;
          return (
            t &&
              'object' == typeof t &&
              (void 0 !== t[e]
                ? (r = t[e])
                : n && t.get && 'function' == typeof t.get && (r = t.get(e))),
            r
          );
        }
        function n(e, t, n, r, i, o) {
          function a() {}
          function l() {}
          var s;
          (a.prototype = e), (l.prototype = e.subs);
          var c = new a();
          for (s in ((c.subs = new l()),
          (c.subsText = {}),
          (c.buf = ''),
          (r = r || {}),
          (c.stackSubs = r),
          (c.subsText = o),
          t))
            r[s] || (r[s] = t[s]);
          for (s in r) c.subs[s] = r[s];
          for (s in ((i = i || {}), (c.stackPartials = i), n)) i[s] || (i[s] = n[s]);
          for (s in i) c.partials[s] = i[s];
          return c;
        }
        (e.Template = function (e, t, n, r) {
          (e = e || {}),
            (this.r = e.code || this.r),
            (this.c = n),
            (this.options = r || {}),
            (this.text = t || ''),
            (this.partials = e.partials || {}),
            (this.subs = e.subs || {}),
            (this.buf = '');
        }),
          (e.Template.prototype = {
            r: function (e, t, n) {
              return '';
            },
            v: u,
            t: c,
            render: function (e, t, n) {
              return this.ri([e], t || {}, n);
            },
            ri: function (e, t, n) {
              return this.r(e, t, n);
            },
            ep: function (e, t) {
              var r = this.partials[e],
                i = t[r.name];
              if (r.instance && r.base == i) return r.instance;
              if ('string' == typeof i) {
                if (!this.c) throw new Error('No compiler available.');
                i = this.c.compile(i, this.options);
              }
              if (!i) return null;
              if (((this.partials[e].base = i), r.subs)) {
                for (key in (t.stackText || (t.stackText = {}), r.subs))
                  t.stackText[key] ||
                    (t.stackText[key] =
                      void 0 !== this.activeSub && t.stackText[this.activeSub]
                        ? t.stackText[this.activeSub]
                        : this.text);
                i = n(i, r.subs, r.partials, this.stackSubs, this.stackPartials, t.stackText);
              }
              return (this.partials[e].instance = i), i;
            },
            rp: function (e, t, n, r) {
              var i = this.ep(e, n);
              return i ? i.ri(t, n, r) : '';
            },
            rs: function (e, t, n) {
              var r = e[e.length - 1];
              if (f(r)) for (var i = 0; i < r.length; i++) e.push(r[i]), n(e, t, this), e.pop();
              else n(e, t, this);
            },
            s: function (e, t, n, r, i, o, a) {
              var l;
              return (
                (!f(e) || 0 !== e.length) &&
                ('function' == typeof e && (e = this.ms(e, t, n, r, i, o, a)),
                (l = !!e),
                !r && l && t && t.push('object' == typeof e ? e : t[t.length - 1]),
                l)
              );
            },
            d: function (e, n, r, i) {
              var o,
                a = e.split('.'),
                l = this.f(a[0], n, r, i),
                s = this.options.modelGet,
                c = null;
              if ('.' === e && f(n[n.length - 2])) l = n[n.length - 1];
              else
                for (var u = 1; u < a.length; u++)
                  (o = t(a[u], l, s)), void 0 !== o ? ((c = l), (l = o)) : (l = '');
              return (
                !(i && !l) &&
                (i || 'function' != typeof l || (n.push(c), (l = this.mv(l, n, r)), n.pop()), l)
              );
            },
            f: function (e, n, r, i) {
              for (
                var o = !1, a = null, l = !1, s = this.options.modelGet, c = n.length - 1;
                c >= 0;
                c--
              )
                if (((a = n[c]), (o = t(e, a, s)), void 0 !== o)) {
                  l = !0;
                  break;
                }
              return l ? (i || 'function' != typeof o || (o = this.mv(o, n, r)), o) : !i && '';
            },
            ls: function (e, t, n, r, i) {
              var o = this.options.delimiters;
              return (
                (this.options.delimiters = i),
                this.b(this.ct(c(e.call(t, r)), t, n)),
                (this.options.delimiters = o),
                !1
              );
            },
            ct: function (e, t, n) {
              if (this.options.disableLambda) throw new Error('Lambda features disabled.');
              return this.c.compile(e, this.options).render(t, n);
            },
            b: function (e) {
              this.buf += e;
            },
            fl: function () {
              var e = this.buf;
              return (this.buf = ''), e;
            },
            ms: function (e, t, n, r, i, o, a) {
              var l,
                s = t[t.length - 1],
                c = e.call(s);
              return 'function' == typeof c
                ? !!r ||
                    ((l =
                      this.activeSub && this.subsText && this.subsText[this.activeSub]
                        ? this.subsText[this.activeSub]
                        : this.text),
                    this.ls(c, s, n, l.substring(i, o), a))
                : c;
            },
            mv: function (e, t, n) {
              var r = t[t.length - 1],
                i = e.call(r);
              return 'function' == typeof i ? this.ct(c(i.call(r)), r, n) : i;
            },
            sub: function (e, t, n, r) {
              var i = this.subs[e];
              i && ((this.activeSub = e), i(t, n, this, r), (this.activeSub = !1));
            },
          });
        var r = /&/g,
          i = /</g,
          o = />/g,
          a = /\'/g,
          l = /\"/g,
          s = /[&<>\"\']/;
        function c(e) {
          return String(null === e || void 0 === e ? '' : e);
        }
        function u(e) {
          return (
            (e = c(e)),
            s.test(e)
              ? e
                  .replace(r, '&amp;')
                  .replace(i, '&lt;')
                  .replace(o, '&gt;')
                  .replace(a, '&#39;')
                  .replace(l, '&quot;')
              : e
          );
        }
        var f =
          Array.isArray ||
          function (e) {
            return '[object Array]' === Object.prototype.toString.call(e);
          };
      })(t);
    },
    'fce+': function (e, t, n) {
      'use strict';
      n.d(t, 'a', function () {
        return s;
      }),
        n.d(t, 'c', function () {
          return u;
        }),
        n.d(t, 'b', function () {
          return p;
        }),
        n.d(t, 'd', function () {
          return h;
        });
      var r = n('WmNS'),
        i = n.n(r),
        o = n('9og8'),
        a = n('t3Un'),
        l = n('Qyje');
      function s() {
        return c.apply(this, arguments);
      }
      function c() {
        return (
          (c = Object(o['a'])(
            i.a.mark(function e() {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt('return', Object(a['a'])('/api/admin/pprof/dep/check'));
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          c.apply(this, arguments)
        );
      }
      function u(e) {
        return f.apply(this, arguments);
      }
      function f() {
        return (
          (f = Object(o['a'])(
            i.a.mark(function e(t) {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        'return',
                        Object(a['a'])(
                          '/api/admin/pprof/dep/install?'.concat(Object(l['stringify'])(t)),
                        ),
                      );
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          f.apply(this, arguments)
        );
      }
      function p(e) {
        return d.apply(this, arguments);
      }
      function d() {
        return (
          (d = Object(o['a'])(
            i.a.mark(function e(t) {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        'return',
                        Object(a['a'])(
                          '/api/admin/pprof/config/list?'.concat(Object(l['stringify'])(t)),
                        ),
                      );
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          d.apply(this, arguments)
        );
      }
      function h(e) {
        return m.apply(this, arguments);
      }
      function m() {
        return (
          (m = Object(o['a'])(
            i.a.mark(function e(t) {
              return i.a.wrap(function (e) {
                while (1)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        'return',
                        Object(a['a'])(
                          '/api/admin/pprof/config/update?'.concat(Object(l['stringify'])(t)),
                        ),
                      );
                    case 1:
                    case 'end':
                      return e.stop();
                  }
              }, e);
            }),
          )),
          m.apply(this, arguments)
        );
      }
    },
    fidV: function (e, t, n) {},
    jhiw: function (e, t, n) {},
    kLXV: function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = n('QbLZ'),
        o = n.n(i),
        a = n('iCc5'),
        l = n.n(a),
        s = n('FYw3'),
        c = n.n(s),
        u = n('mRg0'),
        f = n.n(u),
        p = n('i8i4'),
        d = n('4IlW'),
        h = n('l4aY'),
        m = n('MFj2'),
        g = function (e, t) {
          var n = {};
          for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
          if (null != e && 'function' === typeof Object.getOwnPropertySymbols) {
            var i = 0;
            for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
              t.indexOf(r[i]) < 0 && (n[r[i]] = e[r[i]]);
          }
          return n;
        },
        v = (function (e) {
          function t() {
            return l()(this, t), c()(this, e.apply(this, arguments));
          }
          return (
            f()(t, e),
            (t.prototype.shouldComponentUpdate = function (e) {
              return !!e.forceRender || !!e.hiddenClassName || !!e.visible;
            }),
            (t.prototype.render = function () {
              var e = this.props,
                t = e.className,
                n = e.hiddenClassName,
                i = e.visible,
                a =
                  (e.forceRender, g(e, ['className', 'hiddenClassName', 'visible', 'forceRender'])),
                l = t;
              return (
                n && !i && (l += ' ' + n), r['createElement']('div', o()({}, a, { className: l }))
              );
            }),
            t
          );
        })(r['Component']),
        y = v,
        b = 0;
      function w(e, t) {
        var n = e['page' + (t ? 'Y' : 'X') + 'Offset'],
          r = 'scroll' + (t ? 'Top' : 'Left');
        if ('number' !== typeof n) {
          var i = e.document;
          (n = i.documentElement[r]), 'number' !== typeof n && (n = i.body[r]);
        }
        return n;
      }
      function x(e, t) {
        var n = e.style;
        ['Webkit', 'Moz', 'Ms', 'ms'].forEach(function (e) {
          n[e + 'TransformOrigin'] = t;
        }),
          (n['transformOrigin'] = t);
      }
      function C(e) {
        var t = e.getBoundingClientRect(),
          n = { left: t.left, top: t.top },
          r = e.ownerDocument,
          i = r.defaultView || r.parentWindow;
        return (n.left += w(i)), (n.top += w(i, !0)), n;
      }
      var S = (function (e) {
          function t(n) {
            l()(this, t);
            var i = c()(this, e.call(this, n));
            return (
              (i.inTransition = !1),
              (i.onAnimateLeave = function () {
                var e = i.props.afterClose;
                i.wrap && (i.wrap.style.display = 'none'),
                  (i.inTransition = !1),
                  i.switchScrollingEffect(),
                  e && e();
              }),
              (i.onDialogMouseDown = function () {
                i.dialogMouseDown = !0;
              }),
              (i.onMaskMouseUp = function () {
                i.dialogMouseDown &&
                  (i.timeoutId = setTimeout(function () {
                    i.dialogMouseDown = !1;
                  }, 0));
              }),
              (i.onMaskClick = function (e) {
                Date.now() - i.openTime < 300 ||
                  e.target !== e.currentTarget ||
                  i.dialogMouseDown ||
                  i.close(e);
              }),
              (i.onKeyDown = function (e) {
                var t = i.props;
                if (t.keyboard && e.keyCode === d['a'].ESC)
                  return e.stopPropagation(), void i.close(e);
                if (t.visible && e.keyCode === d['a'].TAB) {
                  var n = document.activeElement,
                    r = i.sentinelStart;
                  e.shiftKey ? n === r && i.sentinelEnd.focus() : n === i.sentinelEnd && r.focus();
                }
              }),
              (i.getDialogElement = function () {
                var e = i.props,
                  t = e.closable,
                  n = e.prefixCls,
                  a = {};
                void 0 !== e.width && (a.width = e.width),
                  void 0 !== e.height && (a.height = e.height);
                var l = void 0;
                e.footer &&
                  (l = r['createElement'](
                    'div',
                    { className: n + '-footer', ref: i.saveRef('footer') },
                    e.footer,
                  ));
                var s = void 0;
                e.title &&
                  (s = r['createElement'](
                    'div',
                    { className: n + '-header', ref: i.saveRef('header') },
                    r['createElement']('div', { className: n + '-title', id: i.titleId }, e.title),
                  ));
                var c = void 0;
                t &&
                  (c = r['createElement'](
                    'button',
                    {
                      type: 'button',
                      onClick: i.close,
                      'aria-label': 'Close',
                      className: n + '-close',
                    },
                    e.closeIcon || r['createElement']('span', { className: n + '-close-x' }),
                  ));
                var u = o()({}, e.style, a),
                  f = { width: 0, height: 0, overflow: 'hidden', outline: 'none' },
                  p = i.getTransitionName(),
                  d = r['createElement'](
                    y,
                    {
                      key: 'dialog-element',
                      role: 'document',
                      ref: i.saveRef('dialog'),
                      style: u,
                      className: n + ' ' + (e.className || ''),
                      visible: e.visible,
                      forceRender: e.forceRender,
                      onMouseDown: i.onDialogMouseDown,
                    },
                    r['createElement']('div', {
                      tabIndex: 0,
                      ref: i.saveRef('sentinelStart'),
                      style: f,
                      'aria-hidden': 'true',
                    }),
                    r['createElement'](
                      'div',
                      { className: n + '-content' },
                      c,
                      s,
                      r['createElement'](
                        'div',
                        o()(
                          { className: n + '-body', style: e.bodyStyle, ref: i.saveRef('body') },
                          e.bodyProps,
                        ),
                        e.children,
                      ),
                      l,
                    ),
                    r['createElement']('div', {
                      tabIndex: 0,
                      ref: i.saveRef('sentinelEnd'),
                      style: f,
                      'aria-hidden': 'true',
                    }),
                  );
                return r['createElement'](
                  m['a'],
                  {
                    key: 'dialog',
                    showProp: 'visible',
                    onLeave: i.onAnimateLeave,
                    transitionName: p,
                    component: '',
                    transitionAppear: !0,
                  },
                  e.visible || !e.destroyOnClose ? d : null,
                );
              }),
              (i.getZIndexStyle = function () {
                var e = {},
                  t = i.props;
                return void 0 !== t.zIndex && (e.zIndex = t.zIndex), e;
              }),
              (i.getWrapStyle = function () {
                return o()({}, i.getZIndexStyle(), i.props.wrapStyle);
              }),
              (i.getMaskStyle = function () {
                return o()({}, i.getZIndexStyle(), i.props.maskStyle);
              }),
              (i.getMaskElement = function () {
                var e = i.props,
                  t = void 0;
                if (e.mask) {
                  var n = i.getMaskTransitionName();
                  (t = r['createElement'](
                    y,
                    o()(
                      {
                        style: i.getMaskStyle(),
                        key: 'mask',
                        className: e.prefixCls + '-mask',
                        hiddenClassName: e.prefixCls + '-mask-hidden',
                        visible: e.visible,
                      },
                      e.maskProps,
                    ),
                  )),
                    n &&
                      (t = r['createElement'](
                        m['a'],
                        {
                          key: 'mask',
                          showProp: 'visible',
                          transitionAppear: !0,
                          component: '',
                          transitionName: n,
                        },
                        t,
                      ));
                }
                return t;
              }),
              (i.getMaskTransitionName = function () {
                var e = i.props,
                  t = e.maskTransitionName,
                  n = e.maskAnimation;
                return !t && n && (t = e.prefixCls + '-' + n), t;
              }),
              (i.getTransitionName = function () {
                var e = i.props,
                  t = e.transitionName,
                  n = e.animation;
                return !t && n && (t = e.prefixCls + '-' + n), t;
              }),
              (i.close = function (e) {
                var t = i.props.onClose;
                t && t(e);
              }),
              (i.saveRef = function (e) {
                return function (t) {
                  i[e] = t;
                };
              }),
              (i.titleId = 'rcDialogTitle' + b++),
              (i.switchScrollingEffect = n.switchScrollingEffect || function () {}),
              i
            );
          }
          return (
            f()(t, e),
            (t.prototype.componentDidMount = function () {
              this.componentDidUpdate({}),
                (this.props.forceRender ||
                  (!1 === this.props.getContainer && !this.props.visible)) &&
                  this.wrap &&
                  (this.wrap.style.display = 'none');
            }),
            (t.prototype.componentDidUpdate = function (e) {
              var t = this.props,
                n = t.visible,
                r = t.mask,
                i = t.focusTriggerAfterClose,
                o = this.props.mousePosition;
              if (n) {
                if (!e.visible) {
                  (this.openTime = Date.now()), this.switchScrollingEffect(), this.tryFocus();
                  var a = p['findDOMNode'](this.dialog);
                  if (o) {
                    var l = C(a);
                    x(a, o.x - l.left + 'px ' + (o.y - l.top) + 'px');
                  } else x(a, '');
                }
              } else if (
                e.visible &&
                ((this.inTransition = !0), r && this.lastOutSideFocusNode && i)
              ) {
                try {
                  this.lastOutSideFocusNode.focus();
                } catch (s) {
                  this.lastOutSideFocusNode = null;
                }
                this.lastOutSideFocusNode = null;
              }
            }),
            (t.prototype.componentWillUnmount = function () {
              var e = this.props,
                t = e.visible,
                n = e.getOpenCount;
              (!t && !this.inTransition) || n() || this.switchScrollingEffect(),
                clearTimeout(this.timeoutId);
            }),
            (t.prototype.tryFocus = function () {
              Object(h['a'])(this.wrap, document.activeElement) ||
                ((this.lastOutSideFocusNode = document.activeElement), this.sentinelStart.focus());
            }),
            (t.prototype.render = function () {
              var e = this.props,
                t = e.prefixCls,
                n = e.maskClosable,
                i = this.getWrapStyle();
              return (
                e.visible && (i.display = null),
                r['createElement'](
                  'div',
                  { className: t + '-root' },
                  this.getMaskElement(),
                  r['createElement'](
                    'div',
                    o()(
                      {
                        tabIndex: -1,
                        onKeyDown: this.onKeyDown,
                        className: t + '-wrap ' + (e.wrapClassName || ''),
                        ref: this.saveRef('wrap'),
                        onClick: n ? this.onMaskClick : null,
                        onMouseUp: n ? this.onMaskMouseUp : null,
                        role: 'dialog',
                        'aria-labelledby': e.title ? this.titleId : null,
                        style: i,
                      },
                      e.wrapProps,
                    ),
                    this.getDialogElement(),
                  ),
                )
              );
            }),
            t
          );
        })(r['Component']),
        k = S;
      S.defaultProps = {
        className: '',
        mask: !0,
        visible: !1,
        keyboard: !0,
        closable: !0,
        maskClosable: !0,
        destroyOnClose: !1,
        prefixCls: 'rc-dialog',
        focusTriggerAfterClose: !0,
      };
      var E = n('1W/9'),
        O = function (e) {
          var t = e.visible,
            n = e.getContainer,
            i = e.forceRender;
          return !1 === n
            ? r['createElement'](
                k,
                o()({}, e, {
                  getOpenCount: function () {
                    return 2;
                  },
                }),
              )
            : r['createElement'](E['a'], { visible: t, forceRender: i, getContainer: n }, function (
                t,
              ) {
                return r['createElement'](k, o()({}, e, t));
              });
        },
        L = n('TSYQ'),
        T = n.n(L),
        N = n('zT1h'),
        M = n('V/uB'),
        A = n.n(M);
      function j(e) {
        return D(e) || I(e) || R(e) || P();
      }
      function P() {
        throw new TypeError(
          'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      function I(e) {
        if ('undefined' !== typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e);
      }
      function D(e) {
        if (Array.isArray(e)) return F(e);
      }
      function _(e, t) {
        return W(e) || H(e, t) || R(e, t) || z();
      }
      function z() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      function R(e, t) {
        if (e) {
          if ('string' === typeof e) return F(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? F(e, t)
              : void 0
          );
        }
      }
      function F(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function H(e, t) {
        if ('undefined' !== typeof Symbol && Symbol.iterator in Object(e)) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (var a, l = e[Symbol.iterator](); !(r = (a = l.next()).done); r = !0)
              if ((n.push(a.value), t && n.length === t)) break;
          } catch (s) {
            (i = !0), (o = s);
          } finally {
            try {
              r || null == l['return'] || l['return']();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        }
      }
      function W(e) {
        if (Array.isArray(e)) return e;
      }
      function B() {
        var e = r['useState']([]),
          t = _(e, 2),
          n = t[0],
          i = t[1];
        function o(e) {
          return (
            i(function (t) {
              return [].concat(j(t), [e]);
            }),
            function () {
              i(function (t) {
                return t.filter(function (t) {
                  return t !== e;
                });
              });
            }
          );
        }
        return [n, o];
      }
      var V = n('2/Rp'),
        U = n('zvFY');
      function K() {
        return (
          (K =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          K.apply(this, arguments)
        );
      }
      function q(e, t) {
        return X(e) || $(e, t) || Y(e, t) || G();
      }
      function G() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      function Y(e, t) {
        if (e) {
          if ('string' === typeof e) return Z(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? Z(e, t)
              : void 0
          );
        }
      }
      function Z(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function $(e, t) {
        if ('undefined' !== typeof Symbol && Symbol.iterator in Object(e)) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (var a, l = e[Symbol.iterator](); !(r = (a = l.next()).done); r = !0)
              if ((n.push(a.value), t && n.length === t)) break;
          } catch (s) {
            (i = !0), (o = s);
          } finally {
            try {
              r || null == l['return'] || l['return']();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        }
      }
      function X(e) {
        if (Array.isArray(e)) return e;
      }
      var J = function (e) {
          var t = r['useRef'](!1),
            n = r['useRef'](),
            i = r['useState'](!1),
            o = q(i, 2),
            a = o[0],
            l = o[1];
          r['useEffect'](function () {
            var t;
            if (e.autoFocus) {
              var r = n.current;
              t = setTimeout(function () {
                return r.focus();
              });
            }
            return function () {
              t && clearTimeout(t);
            };
          }, []);
          var s = function (n) {
              var r = e.closeModal;
              n &&
                n.then &&
                (l(!0),
                n.then(
                  function () {
                    r.apply(void 0, arguments);
                  },
                  function (e) {
                    console.error(e), l(!1), (t.current = !1);
                  },
                ));
            },
            c = function () {
              var n = e.actionFn,
                r = e.closeModal;
              if (!t.current)
                if (((t.current = !0), n)) {
                  var i;
                  if (n.length) (i = n(r)), (t.current = !1);
                  else if (((i = n()), !i)) return void r();
                  s(i);
                } else r();
            },
            u = e.type,
            f = e.children,
            p = e.buttonProps;
          return r['createElement'](
            V['default'],
            K({}, Object(U['a'])(u), { onClick: c, loading: a }, p, { ref: n }),
            f,
          );
        },
        Q = J,
        ee = n('uaoM');
      function te(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      var ne = function (e) {
          var t = e.icon,
            n = e.onCancel,
            i = e.onOk,
            o = e.close,
            a = e.zIndex,
            l = e.afterClose,
            s = e.visible,
            c = e.keyboard,
            u = e.centered,
            f = e.getContainer,
            p = e.maskStyle,
            d = e.okText,
            h = e.okButtonProps,
            m = e.cancelText,
            g = e.cancelButtonProps;
          Object(ee['a'])(
            !('string' === typeof t && t.length > 2),
            'Modal',
            '`icon` is using ReactNode instead of string naming in v4. Please check `'.concat(
              t,
              '` at https://ant.design/components/icon',
            ),
          );
          var v = e.okType || 'primary',
            y = e.prefixCls || 'ant-modal',
            b = ''.concat(y, '-confirm'),
            w = !('okCancel' in e) || e.okCancel,
            x = e.width || 416,
            C = e.style || {},
            S = void 0 === e.mask || e.mask,
            k = void 0 !== e.maskClosable && e.maskClosable,
            E = null !== e.autoFocusButton && (e.autoFocusButton || 'ok'),
            O = e.transitionName || 'zoom',
            L = e.maskTransitionName || 'fade',
            N = T()(b, ''.concat(b, '-').concat(e.type), e.className),
            M =
              w &&
              r['createElement'](
                Q,
                { actionFn: n, closeModal: o, autoFocus: 'cancel' === E, buttonProps: g },
                m,
              );
          return r['createElement'](
            Ye,
            {
              prefixCls: y,
              className: N,
              wrapClassName: T()(te({}, ''.concat(b, '-centered'), !!e.centered)),
              onCancel: function () {
                return o({ triggerCancel: !0 });
              },
              visible: s,
              title: '',
              transitionName: O,
              footer: '',
              maskTransitionName: L,
              mask: S,
              maskClosable: k,
              maskStyle: p,
              style: C,
              width: x,
              zIndex: a,
              afterClose: l,
              keyboard: c,
              centered: u,
              getContainer: f,
            },
            r['createElement'](
              'div',
              { className: ''.concat(b, '-body-wrapper') },
              r['createElement'](
                'div',
                { className: ''.concat(b, '-body') },
                t,
                void 0 === e.title
                  ? null
                  : r['createElement']('span', { className: ''.concat(b, '-title') }, e.title),
                r['createElement']('div', { className: ''.concat(b, '-content') }, e.content),
              ),
              r['createElement'](
                'div',
                { className: ''.concat(b, '-btns') },
                M,
                r['createElement'](
                  Q,
                  { type: v, actionFn: i, closeModal: o, autoFocus: 'ok' === E, buttonProps: h },
                  d,
                ),
              ),
            ),
          );
        },
        re = ne,
        ie = n('ZvpZ'),
        oe = n('YMnH');
      function ae() {
        return (
          (ae =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          ae.apply(this, arguments)
        );
      }
      function le(e, t) {
        return pe(e) || fe(e, t) || ce(e, t) || se();
      }
      function se() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      function ce(e, t) {
        if (e) {
          if ('string' === typeof e) return ue(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? ue(e, t)
              : void 0
          );
        }
      }
      function ue(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function fe(e, t) {
        if ('undefined' !== typeof Symbol && Symbol.iterator in Object(e)) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (var a, l = e[Symbol.iterator](); !(r = (a = l.next()).done); r = !0)
              if ((n.push(a.value), t && n.length === t)) break;
          } catch (s) {
            (i = !0), (o = s);
          } finally {
            try {
              r || null == l['return'] || l['return']();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        }
      }
      function pe(e) {
        if (Array.isArray(e)) return e;
      }
      var de = function (e, t) {
          var n = e.afterClose,
            i = e.config,
            o = r['useState'](!0),
            a = le(o, 2),
            l = a[0],
            s = a[1],
            c = r['useState'](i),
            u = le(c, 2),
            f = u[0],
            p = u[1];
          function d() {
            s(!1);
          }
          return (
            r['useImperativeHandle'](t, function () {
              return {
                destroy: d,
                update: function (e) {
                  p(function (t) {
                    return ae(ae({}, t), e);
                  });
                },
              };
            }),
            r['createElement'](
              oe['a'],
              { componentName: 'Modal', defaultLocale: ie['a'].Modal },
              function (e) {
                return r['createElement'](
                  re,
                  ae({}, f, {
                    close: d,
                    visible: l,
                    afterClose: n,
                    okText: f.okText || (f.okCancel ? e.okText : e.justOkText),
                    cancelText: f.cancelText || e.cancelText,
                  }),
                );
              },
            )
          );
        },
        he = r['forwardRef'](de),
        me = n('ESPI'),
        ge = n.n(me),
        ve = n('0G8d'),
        ye = n.n(ve),
        be = n('Z/ur'),
        we = n.n(be),
        xe = n('xddM'),
        Ce = n.n(xe),
        Se = n('ul5b');
      function ke() {
        return (
          (ke =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          ke.apply(this, arguments)
        );
      }
      var Ee = function (e, t) {
        var n = {};
        for (var r in e)
          Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
        if (null != e && 'function' === typeof Object.getOwnPropertySymbols) {
          var i = 0;
          for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
            t.indexOf(r[i]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
              (n[r[i]] = e[r[i]]);
        }
        return n;
      };
      function Oe(e) {
        var t = document.createElement('div');
        document.body.appendChild(t);
        var n = ke(ke({}, e), { close: a, visible: !0 });
        function i() {
          var n = p['unmountComponentAtNode'](t);
          n && t.parentNode && t.parentNode.removeChild(t);
          for (var r = arguments.length, i = new Array(r), o = 0; o < r; o++) i[o] = arguments[o];
          var l = i.some(function (e) {
            return e && e.triggerCancel;
          });
          e.onCancel && l && e.onCancel.apply(e, i);
          for (var s = 0; s < Ke.length; s++) {
            var c = Ke[s];
            if (c === a) {
              Ke.splice(s, 1);
              break;
            }
          }
        }
        function o(e) {
          var n = e.okText,
            i = e.cancelText,
            o = Ee(e, ['okText', 'cancelText']);
          setTimeout(function () {
            var e = Object(Se['b'])();
            p['render'](
              r['createElement'](
                re,
                ke({}, o, {
                  okText: n || (o.okCancel ? e.okText : e.justOkText),
                  cancelText: i || e.cancelText,
                }),
              ),
              t,
            );
          });
        }
        function a() {
          for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
          (n = ke(ke({}, n), { visible: !1, afterClose: i.bind.apply(i, [this].concat(t)) })), o(n);
        }
        function l(e) {
          (n = ke(ke({}, n), e)), o(n);
        }
        return o(n), Ke.push(a), { destroy: a, update: l };
      }
      function Le(e) {
        return ke({ type: 'warning', icon: r['createElement'](Ce.a, null), okCancel: !1 }, e);
      }
      function Te(e) {
        return ke({ type: 'info', icon: r['createElement'](ge.a, null), okCancel: !1 }, e);
      }
      function Ne(e) {
        return ke({ type: 'success', icon: r['createElement'](ye.a, null), okCancel: !1 }, e);
      }
      function Me(e) {
        return ke({ type: 'error', icon: r['createElement'](we.a, null), okCancel: !1 }, e);
      }
      function Ae(e) {
        return ke({ type: 'confirm', okCancel: !0 }, e);
      }
      function je(e, t) {
        return ze(e) || _e(e, t) || Ie(e, t) || Pe();
      }
      function Pe() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      function Ie(e, t) {
        if (e) {
          if ('string' === typeof e) return De(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? De(e, t)
              : void 0
          );
        }
      }
      function De(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function _e(e, t) {
        if ('undefined' !== typeof Symbol && Symbol.iterator in Object(e)) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (var a, l = e[Symbol.iterator](); !(r = (a = l.next()).done); r = !0)
              if ((n.push(a.value), t && n.length === t)) break;
          } catch (s) {
            (i = !0), (o = s);
          } finally {
            try {
              r || null == l['return'] || l['return']();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        }
      }
      function ze(e) {
        if (Array.isArray(e)) return e;
      }
      var Re = 0;
      function Fe() {
        var e = B(),
          t = je(e, 2),
          n = t[0],
          i = t[1];
        function o(e) {
          return function (t) {
            Re += 1;
            var n,
              o = r['createRef'](),
              a = r['createElement'](he, {
                key: 'modal-'.concat(Re),
                config: e(t),
                ref: o,
                afterClose: function () {
                  n();
                },
              });
            return (
              (n = i(a)),
              {
                destroy: function () {
                  o.current && o.current.destroy();
                },
                update: function (e) {
                  o.current && o.current.update(e);
                },
              }
            );
          };
        }
        return [
          { info: o(Te), success: o(Ne), error: o(Me), warning: o(Le), confirm: o(Ae) },
          r['createElement'](r['Fragment'], null, n),
        ];
      }
      var He = n('H84U');
      function We(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function Be() {
        return (
          (Be =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          Be.apply(this, arguments)
        );
      }
      var Ve,
        Ue = function (e, t) {
          var n = {};
          for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
          if (null != e && 'function' === typeof Object.getOwnPropertySymbols) {
            var i = 0;
            for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
              t.indexOf(r[i]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
                (n[r[i]] = e[r[i]]);
          }
          return n;
        },
        Ke = [],
        qe = function (e) {
          (Ve = { x: e.pageX, y: e.pageY }),
            setTimeout(function () {
              return (Ve = null);
            }, 100);
        };
      'undefined' !== typeof window &&
        window.document &&
        window.document.documentElement &&
        Object(N['a'])(document.documentElement, 'click', qe);
      var Ge = function (e) {
        var t,
          n = r['useContext'](He['b']),
          i = n.getPopupContainer,
          o = n.getPrefixCls,
          a = n.direction,
          l = function (t) {
            var n = e.onCancel;
            n && n(t);
          },
          s = function (t) {
            var n = e.onOk;
            n && n(t);
          },
          c = function (t) {
            var n = e.okText,
              i = e.okType,
              o = e.cancelText,
              a = e.confirmLoading;
            return r['createElement'](
              r['Fragment'],
              null,
              r['createElement'](
                V['default'],
                Be({ onClick: l }, e.cancelButtonProps),
                o || t.cancelText,
              ),
              r['createElement'](
                V['default'],
                Be({}, Object(U['a'])(i), { loading: a, onClick: s }, e.okButtonProps),
                n || t.okText,
              ),
            );
          },
          u = e.prefixCls,
          f = e.footer,
          p = e.visible,
          d = e.wrapClassName,
          h = e.centered,
          m = e.getContainer,
          g = e.closeIcon,
          v = Ue(e, [
            'prefixCls',
            'footer',
            'visible',
            'wrapClassName',
            'centered',
            'getContainer',
            'closeIcon',
          ]),
          y = o('modal', u),
          b = r['createElement'](
            oe['a'],
            { componentName: 'Modal', defaultLocale: Object(Se['b'])() },
            c,
          ),
          w = r['createElement'](
            'span',
            { className: ''.concat(y, '-close-x') },
            g || r['createElement'](A.a, { className: ''.concat(y, '-close-icon') }),
          ),
          x = T()(
            d,
            ((t = {}),
            We(t, ''.concat(y, '-centered'), !!h),
            We(t, ''.concat(y, '-wrap-rtl'), 'rtl' === a),
            t),
          );
        return r['createElement'](
          O,
          Be({}, v, {
            getContainer: void 0 === m ? i : m,
            prefixCls: y,
            wrapClassName: x,
            footer: void 0 === f ? b : f,
            visible: p,
            mousePosition: Ve,
            onClose: l,
            closeIcon: w,
          }),
        );
      };
      (Ge.useModal = Fe),
        (Ge.defaultProps = {
          width: 520,
          transitionName: 'zoom',
          maskTransitionName: 'fade',
          confirmLoading: !1,
          visible: !1,
          okType: 'primary',
        });
      var Ye = Ge;
      function Ze(e) {
        return Oe(Le(e));
      }
      var $e = Ye;
      ($e.info = function (e) {
        return Oe(Te(e));
      }),
        ($e.success = function (e) {
          return Oe(Ne(e));
        }),
        ($e.error = function (e) {
          return Oe(Me(e));
        }),
        ($e.warning = Ze),
        ($e.warn = Ze),
        ($e.confirm = function (e) {
          return Oe(Ae(e));
        }),
        ($e.destroyAll = function () {
          while (Ke.length) {
            var e = Ke.pop();
            e && e();
          }
        });
      t['a'] = $e;
    },
    mI1j: function (e, t, n) {
      e.exports = { container: 'container___1pNU6', lay: 'lay___1nCx0' };
    },
    mLbZ: function (e, t) {
      e.exports = (function () {
        function e(e, t) {
          function n() {
            this.constructor = e;
          }
          (n.prototype = t.prototype), (e.prototype = new n());
        }
        function t(e, t, n, r, i, o) {
          (this.message = e),
            (this.expected = t),
            (this.found = n),
            (this.offset = r),
            (this.line = i),
            (this.column = o),
            (this.name = 'SyntaxError');
        }
        function n(e) {
          var n,
            r = arguments.length > 1 ? arguments[1] : {},
            i = {},
            o = { start: It },
            a = It,
            l = function () {
              return Mn;
            },
            s = i,
            c = '#',
            u = { type: 'literal', value: '#', description: '"#"' },
            f = void 0,
            p = { type: 'any', description: 'any character' },
            d = '[',
            h = { type: 'literal', value: '[', description: '"["' },
            m = ']',
            g = { type: 'literal', value: ']', description: '"]"' },
            v = function (e) {
              jn(Pn('ObjectPath', e, Nt, Mt));
            },
            y = function (e) {
              jn(Pn('ArrayPath', e, Nt, Mt));
            },
            b = function (e, t) {
              return e.concat(t);
            },
            w = function (e) {
              return [e];
            },
            x = function (e) {
              return e;
            },
            C = '.',
            S = { type: 'literal', value: '.', description: '"."' },
            k = '=',
            E = { type: 'literal', value: '=', description: '"="' },
            O = function (e, t) {
              jn(Pn('Assign', t, Nt, Mt, e));
            },
            L = function (e) {
              return e.join('');
            },
            T = function (e) {
              return e.value;
            },
            N = '"""',
            M = { type: 'literal', value: '"""', description: '"\\"\\"\\""' },
            A = null,
            j = function (e) {
              return Pn('String', e.join(''), Nt, Mt);
            },
            P = '"',
            I = { type: 'literal', value: '"', description: '"\\""' },
            D = "'''",
            _ = { type: 'literal', value: "'''", description: "\"'''\"" },
            z = "'",
            R = { type: 'literal', value: "'", description: '"\'"' },
            F = function (e) {
              return e;
            },
            H = function (e) {
              return e;
            },
            W = '\\',
            B = { type: 'literal', value: '\\', description: '"\\\\"' },
            V = function () {
              return '';
            },
            U = 'e',
            K = { type: 'literal', value: 'e', description: '"e"' },
            q = 'E',
            G = { type: 'literal', value: 'E', description: '"E"' },
            Y = function (e, t) {
              return Pn('Float', parseFloat(e + 'e' + t), Nt, Mt);
            },
            Z = function (e) {
              return Pn('Float', parseFloat(e), Nt, Mt);
            },
            $ = '+',
            X = { type: 'literal', value: '+', description: '"+"' },
            J = function (e) {
              return e.join('');
            },
            Q = '-',
            ee = { type: 'literal', value: '-', description: '"-"' },
            te = function (e) {
              return '-' + e.join('');
            },
            ne = function (e) {
              return Pn('Integer', parseInt(e, 10), Nt, Mt);
            },
            re = 'true',
            ie = { type: 'literal', value: 'true', description: '"true"' },
            oe = function () {
              return Pn('Boolean', !0, Nt, Mt);
            },
            ae = 'false',
            le = { type: 'literal', value: 'false', description: '"false"' },
            se = function () {
              return Pn('Boolean', !1, Nt, Mt);
            },
            ce = function () {
              return Pn('Array', [], Nt, Mt);
            },
            ue = function (e) {
              return Pn('Array', e ? [e] : [], Nt, Mt);
            },
            fe = function (e) {
              return Pn('Array', e, Nt, Mt);
            },
            pe = function (e, t) {
              return Pn('Array', e.concat(t), Nt, Mt);
            },
            de = function (e) {
              return e;
            },
            he = ',',
            me = { type: 'literal', value: ',', description: '","' },
            ge = '{',
            ve = { type: 'literal', value: '{', description: '"{"' },
            ye = '}',
            be = { type: 'literal', value: '}', description: '"}"' },
            we = function (e) {
              return Pn('InlineTable', e, Nt, Mt);
            },
            xe = function (e, t) {
              return Pn('InlineTableValue', t, Nt, Mt, e);
            },
            Ce = function (e) {
              return '.' + e;
            },
            Se = function (e) {
              return e.join('');
            },
            ke = ':',
            Ee = { type: 'literal', value: ':', description: '":"' },
            Oe = function (e) {
              return e.join('');
            },
            Le = 'T',
            Te = { type: 'literal', value: 'T', description: '"T"' },
            Ne = 'Z',
            Me = { type: 'literal', value: 'Z', description: '"Z"' },
            Ae = function (e, t) {
              return Pn('Date', new Date(e + 'T' + t + 'Z'), Nt, Mt);
            },
            je = function (e, t) {
              return Pn('Date', new Date(e + 'T' + t), Nt, Mt);
            },
            Pe = /^[ \t]/,
            Ie = { type: 'class', value: '[ \\t]', description: '[ \\t]' },
            De = '\n',
            _e = { type: 'literal', value: '\n', description: '"\\n"' },
            ze = '\r',
            Re = { type: 'literal', value: '\r', description: '"\\r"' },
            Fe = /^[0-9a-f]/i,
            He = { type: 'class', value: '[0-9a-f]i', description: '[0-9a-f]i' },
            We = /^[0-9]/,
            Be = { type: 'class', value: '[0-9]', description: '[0-9]' },
            Ve = '_',
            Ue = { type: 'literal', value: '_', description: '"_"' },
            Ke = function () {
              return '';
            },
            qe = /^[A-Za-z0-9_\-]/,
            Ge = { type: 'class', value: '[A-Za-z0-9_\\-]', description: '[A-Za-z0-9_\\-]' },
            Ye = function (e) {
              return e.join('');
            },
            Ze = '\\"',
            $e = { type: 'literal', value: '\\"', description: '"\\\\\\""' },
            Xe = function () {
              return '"';
            },
            Je = '\\\\',
            Qe = { type: 'literal', value: '\\\\', description: '"\\\\\\\\"' },
            et = function () {
              return '\\';
            },
            tt = '\\b',
            nt = { type: 'literal', value: '\\b', description: '"\\\\b"' },
            rt = function () {
              return '\b';
            },
            it = '\\t',
            ot = { type: 'literal', value: '\\t', description: '"\\\\t"' },
            at = function () {
              return '\t';
            },
            lt = '\\n',
            st = { type: 'literal', value: '\\n', description: '"\\\\n"' },
            ct = function () {
              return '\n';
            },
            ut = '\\f',
            ft = { type: 'literal', value: '\\f', description: '"\\\\f"' },
            pt = function () {
              return '\f';
            },
            dt = '\\r',
            ht = { type: 'literal', value: '\\r', description: '"\\\\r"' },
            mt = function () {
              return '\r';
            },
            gt = '\\U',
            vt = { type: 'literal', value: '\\U', description: '"\\\\U"' },
            yt = function (e) {
              return In(e.join(''));
            },
            bt = '\\u',
            wt = { type: 'literal', value: '\\u', description: '"\\\\u"' },
            xt = 0,
            Ct = 0,
            St = 0,
            kt = { line: 1, column: 1, seenCR: !1 },
            Et = 0,
            Ot = [],
            Lt = 0,
            Tt = {};
          if ('startRule' in r) {
            if (!(r.startRule in o))
              throw new Error('Can\'t start parsing from rule "' + r.startRule + '".');
            a = o[r.startRule];
          }
          function Nt() {
            return At(Ct).line;
          }
          function Mt() {
            return At(Ct).column;
          }
          function At(t) {
            function n(t, n, r) {
              var i, o;
              for (i = n; i < r; i++)
                (o = e.charAt(i)),
                  '\n' === o
                    ? (t.seenCR || t.line++, (t.column = 1), (t.seenCR = !1))
                    : '\r' === o || '\u2028' === o || '\u2029' === o
                    ? (t.line++, (t.column = 1), (t.seenCR = !0))
                    : (t.column++, (t.seenCR = !1));
            }
            return (
              St !== t &&
                (St > t && ((St = 0), (kt = { line: 1, column: 1, seenCR: !1 })),
                n(kt, St, t),
                (St = t)),
              kt
            );
          }
          function jt(e) {
            xt < Et || (xt > Et && ((Et = xt), (Ot = [])), Ot.push(e));
          }
          function Pt(n, r, i) {
            function o(e) {
              var t = 1;
              e.sort(function (e, t) {
                return e.description < t.description ? -1 : e.description > t.description ? 1 : 0;
              });
              while (t < e.length) e[t - 1] === e[t] ? e.splice(t, 1) : t++;
            }
            function a(e, t) {
              function n(e) {
                function t(e) {
                  return e.charCodeAt(0).toString(16).toUpperCase();
                }
                return e
                  .replace(/\\/g, '\\\\')
                  .replace(/"/g, '\\"')
                  .replace(/\x08/g, '\\b')
                  .replace(/\t/g, '\\t')
                  .replace(/\n/g, '\\n')
                  .replace(/\f/g, '\\f')
                  .replace(/\r/g, '\\r')
                  .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (e) {
                    return '\\x0' + t(e);
                  })
                  .replace(/[\x10-\x1F\x80-\xFF]/g, function (e) {
                    return '\\x' + t(e);
                  })
                  .replace(/[\u0180-\u0FFF]/g, function (e) {
                    return '\\u0' + t(e);
                  })
                  .replace(/[\u1080-\uFFFF]/g, function (e) {
                    return '\\u' + t(e);
                  });
              }
              var r,
                i,
                o,
                a = new Array(e.length);
              for (o = 0; o < e.length; o++) a[o] = e[o].description;
              return (
                (r = e.length > 1 ? a.slice(0, -1).join(', ') + ' or ' + a[e.length - 1] : a[0]),
                (i = t ? '"' + n(t) + '"' : 'end of input'),
                'Expected ' + r + ' but ' + i + ' found.'
              );
            }
            var l = At(i),
              s = i < e.length ? e.charAt(i) : null;
            return null !== r && o(r), new t(null !== n ? n : a(r, s), r, s, i, l.line, l.column);
          }
          function It() {
            var e,
              t,
              n,
              r = 49 * xt + 0,
              o = Tt[r];
            if (o) return (xt = o.nextPos), o.result;
            (e = xt), (t = []), (n = Dt());
            while (n !== i) t.push(n), (n = Dt());
            return (
              t !== i && ((Ct = e), (t = l())), (e = t), (Tt[r] = { nextPos: xt, result: e }), e
            );
          }
          function Dt() {
            var e,
              t,
              n,
              r,
              o,
              a,
              l,
              c = 49 * xt + 1,
              u = Tt[c];
            if (u) return (xt = u.nextPos), u.result;
            (e = xt), (t = []), (n = wn());
            while (n !== i) t.push(n), (n = wn());
            if (t !== i)
              if (((n = _t()), n !== i)) {
                (r = []), (o = wn());
                while (o !== i) r.push(o), (o = wn());
                if (r !== i) {
                  (o = []), (a = zt());
                  while (a !== i) o.push(a), (a = zt());
                  if (o !== i) {
                    if (((a = []), (l = xn()), l !== i)) while (l !== i) a.push(l), (l = xn());
                    else a = s;
                    a === i && (a = Sn()),
                      a !== i ? ((t = [t, n, r, o, a]), (e = t)) : ((xt = e), (e = s));
                  } else (xt = e), (e = s);
                } else (xt = e), (e = s);
              } else (xt = e), (e = s);
            else (xt = e), (e = s);
            if (e === i) {
              if (((e = xt), (t = []), (n = wn()), n !== i)) while (n !== i) t.push(n), (n = wn());
              else t = s;
              if (t !== i) {
                if (((n = []), (r = xn()), r !== i)) while (r !== i) n.push(r), (r = xn());
                else n = s;
                n === i && (n = Sn()), n !== i ? ((t = [t, n]), (e = t)) : ((xt = e), (e = s));
              } else (xt = e), (e = s);
              e === i && (e = xn());
            }
            return (Tt[c] = { nextPos: xt, result: e }), e;
          }
          function _t() {
            var e,
              t = 49 * xt + 2,
              n = Tt[t];
            return n
              ? ((xt = n.nextPos), n.result)
              : ((e = zt()),
                e === i && ((e = Rt()), e === i && ((e = Ft()), e === i && (e = Vt()))),
                (Tt[t] = { nextPos: xt, result: e }),
                e);
          }
          function zt() {
            var t,
              n,
              r,
              o,
              a,
              l,
              d = 49 * xt + 3,
              h = Tt[d];
            if (h) return (xt = h.nextPos), h.result;
            if (
              ((t = xt),
              35 === e.charCodeAt(xt) ? ((n = c), xt++) : ((n = i), 0 === Lt && jt(u)),
              n !== i)
            ) {
              (r = []),
                (o = xt),
                (a = xt),
                Lt++,
                (l = xn()),
                l === i && (l = Sn()),
                Lt--,
                l === i ? (a = f) : ((xt = a), (a = s)),
                a !== i
                  ? (e.length > xt ? ((l = e.charAt(xt)), xt++) : ((l = i), 0 === Lt && jt(p)),
                    l !== i ? ((a = [a, l]), (o = a)) : ((xt = o), (o = s)))
                  : ((xt = o), (o = s));
              while (o !== i)
                r.push(o),
                  (o = xt),
                  (a = xt),
                  Lt++,
                  (l = xn()),
                  l === i && (l = Sn()),
                  Lt--,
                  l === i ? (a = f) : ((xt = a), (a = s)),
                  a !== i
                    ? (e.length > xt ? ((l = e.charAt(xt)), xt++) : ((l = i), 0 === Lt && jt(p)),
                      l !== i ? ((a = [a, l]), (o = a)) : ((xt = o), (o = s)))
                    : ((xt = o), (o = s));
              r !== i ? ((n = [n, r]), (t = n)) : ((xt = t), (t = s));
            } else (xt = t), (t = s);
            return (Tt[d] = { nextPos: xt, result: t }), t;
          }
          function Rt() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c = 49 * xt + 4,
              u = Tt[c];
            if (u) return (xt = u.nextPos), u.result;
            if (
              ((t = xt),
              91 === e.charCodeAt(xt) ? ((n = d), xt++) : ((n = i), 0 === Lt && jt(h)),
              n !== i)
            ) {
              (r = []), (o = wn());
              while (o !== i) r.push(o), (o = wn());
              if (r !== i)
                if (((o = Ht()), o !== i)) {
                  (a = []), (l = wn());
                  while (l !== i) a.push(l), (l = wn());
                  a !== i
                    ? (93 === e.charCodeAt(xt) ? ((l = m), xt++) : ((l = i), 0 === Lt && jt(g)),
                      l !== i ? ((Ct = t), (n = v(o)), (t = n)) : ((xt = t), (t = s)))
                    : ((xt = t), (t = s));
                } else (xt = t), (t = s);
              else (xt = t), (t = s);
            } else (xt = t), (t = s);
            return (Tt[c] = { nextPos: xt, result: t }), t;
          }
          function Ft() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c,
              u,
              f = 49 * xt + 5,
              p = Tt[f];
            if (p) return (xt = p.nextPos), p.result;
            if (
              ((t = xt),
              91 === e.charCodeAt(xt) ? ((n = d), xt++) : ((n = i), 0 === Lt && jt(h)),
              n !== i)
            )
              if (
                (91 === e.charCodeAt(xt) ? ((r = d), xt++) : ((r = i), 0 === Lt && jt(h)), r !== i)
              ) {
                (o = []), (a = wn());
                while (a !== i) o.push(a), (a = wn());
                if (o !== i)
                  if (((a = Ht()), a !== i)) {
                    (l = []), (c = wn());
                    while (c !== i) l.push(c), (c = wn());
                    l !== i
                      ? (93 === e.charCodeAt(xt) ? ((c = m), xt++) : ((c = i), 0 === Lt && jt(g)),
                        c !== i
                          ? (93 === e.charCodeAt(xt)
                              ? ((u = m), xt++)
                              : ((u = i), 0 === Lt && jt(g)),
                            u !== i ? ((Ct = t), (n = y(a)), (t = n)) : ((xt = t), (t = s)))
                          : ((xt = t), (t = s)))
                      : ((xt = t), (t = s));
                  } else (xt = t), (t = s);
                else (xt = t), (t = s);
              } else (xt = t), (t = s);
            else (xt = t), (t = s);
            return (Tt[f] = { nextPos: xt, result: t }), t;
          }
          function Ht() {
            var e,
              t,
              n,
              r = 49 * xt + 6,
              o = Tt[r];
            if (o) return (xt = o.nextPos), o.result;
            if (((e = xt), (t = []), (n = Bt()), n !== i)) while (n !== i) t.push(n), (n = Bt());
            else t = s;
            return (
              t !== i
                ? ((n = Wt()), n !== i ? ((Ct = e), (t = b(t, n)), (e = t)) : ((xt = e), (e = s)))
                : ((xt = e), (e = s)),
              e === i && ((e = xt), (t = Wt()), t !== i && ((Ct = e), (t = w(t))), (e = t)),
              (Tt[r] = { nextPos: xt, result: e }),
              e
            );
          }
          function Wt() {
            var e,
              t,
              n,
              r,
              o,
              a = 49 * xt + 7,
              l = Tt[a];
            if (l) return (xt = l.nextPos), l.result;
            (e = xt), (t = []), (n = wn());
            while (n !== i) t.push(n), (n = wn());
            if (t !== i)
              if (((n = Ut()), n !== i)) {
                (r = []), (o = wn());
                while (o !== i) r.push(o), (o = wn());
                r !== i ? ((Ct = e), (t = x(n)), (e = t)) : ((xt = e), (e = s));
              } else (xt = e), (e = s);
            else (xt = e), (e = s);
            if (e === i) {
              (e = xt), (t = []), (n = wn());
              while (n !== i) t.push(n), (n = wn());
              if (t !== i)
                if (((n = Kt()), n !== i)) {
                  (r = []), (o = wn());
                  while (o !== i) r.push(o), (o = wn());
                  r !== i ? ((Ct = e), (t = x(n)), (e = t)) : ((xt = e), (e = s));
                } else (xt = e), (e = s);
              else (xt = e), (e = s);
            }
            return (Tt[a] = { nextPos: xt, result: e }), e;
          }
          function Bt() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c,
              u = 49 * xt + 8,
              f = Tt[u];
            if (f) return (xt = f.nextPos), f.result;
            (t = xt), (n = []), (r = wn());
            while (r !== i) n.push(r), (r = wn());
            if (n !== i)
              if (((r = Ut()), r !== i)) {
                (o = []), (a = wn());
                while (a !== i) o.push(a), (a = wn());
                if (o !== i)
                  if (
                    (46 === e.charCodeAt(xt) ? ((a = C), xt++) : ((a = i), 0 === Lt && jt(S)),
                    a !== i)
                  ) {
                    (l = []), (c = wn());
                    while (c !== i) l.push(c), (c = wn());
                    l !== i ? ((Ct = t), (n = x(r)), (t = n)) : ((xt = t), (t = s));
                  } else (xt = t), (t = s);
                else (xt = t), (t = s);
              } else (xt = t), (t = s);
            else (xt = t), (t = s);
            if (t === i) {
              (t = xt), (n = []), (r = wn());
              while (r !== i) n.push(r), (r = wn());
              if (n !== i)
                if (((r = Kt()), r !== i)) {
                  (o = []), (a = wn());
                  while (a !== i) o.push(a), (a = wn());
                  if (o !== i)
                    if (
                      (46 === e.charCodeAt(xt) ? ((a = C), xt++) : ((a = i), 0 === Lt && jt(S)),
                      a !== i)
                    ) {
                      (l = []), (c = wn());
                      while (c !== i) l.push(c), (c = wn());
                      l !== i ? ((Ct = t), (n = x(r)), (t = n)) : ((xt = t), (t = s));
                    } else (xt = t), (t = s);
                  else (xt = t), (t = s);
                } else (xt = t), (t = s);
              else (xt = t), (t = s);
            }
            return (Tt[u] = { nextPos: xt, result: t }), t;
          }
          function Vt() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c = 49 * xt + 9,
              u = Tt[c];
            if (u) return (xt = u.nextPos), u.result;
            if (((t = xt), (n = Ut()), n !== i)) {
              (r = []), (o = wn());
              while (o !== i) r.push(o), (o = wn());
              if (r !== i)
                if (
                  (61 === e.charCodeAt(xt) ? ((o = k), xt++) : ((o = i), 0 === Lt && jt(E)),
                  o !== i)
                ) {
                  (a = []), (l = wn());
                  while (l !== i) a.push(l), (l = wn());
                  a !== i
                    ? ((l = qt()),
                      l !== i ? ((Ct = t), (n = O(n, l)), (t = n)) : ((xt = t), (t = s)))
                    : ((xt = t), (t = s));
                } else (xt = t), (t = s);
              else (xt = t), (t = s);
            } else (xt = t), (t = s);
            if (t === i)
              if (((t = xt), (n = Kt()), n !== i)) {
                (r = []), (o = wn());
                while (o !== i) r.push(o), (o = wn());
                if (r !== i)
                  if (
                    (61 === e.charCodeAt(xt) ? ((o = k), xt++) : ((o = i), 0 === Lt && jt(E)),
                    o !== i)
                  ) {
                    (a = []), (l = wn());
                    while (l !== i) a.push(l), (l = wn());
                    a !== i
                      ? ((l = qt()),
                        l !== i ? ((Ct = t), (n = O(n, l)), (t = n)) : ((xt = t), (t = s)))
                      : ((xt = t), (t = s));
                  } else (xt = t), (t = s);
                else (xt = t), (t = s);
              } else (xt = t), (t = s);
            return (Tt[c] = { nextPos: xt, result: t }), t;
          }
          function Ut() {
            var e,
              t,
              n,
              r = 49 * xt + 10,
              o = Tt[r];
            if (o) return (xt = o.nextPos), o.result;
            if (((e = xt), (t = []), (n = On()), n !== i)) while (n !== i) t.push(n), (n = On());
            else t = s;
            return (
              t !== i && ((Ct = e), (t = L(t))), (e = t), (Tt[r] = { nextPos: xt, result: e }), e
            );
          }
          function Kt() {
            var e,
              t,
              n = 49 * xt + 11,
              r = Tt[n];
            return r
              ? ((xt = r.nextPos), r.result)
              : ((e = xt),
                (t = Zt()),
                t !== i && ((Ct = e), (t = T(t))),
                (e = t),
                e === i && ((e = xt), (t = Xt()), t !== i && ((Ct = e), (t = T(t))), (e = t)),
                (Tt[n] = { nextPos: xt, result: e }),
                e);
          }
          function qt() {
            var e,
              t = 49 * xt + 12,
              n = Tt[t];
            return n
              ? ((xt = n.nextPos), n.result)
              : ((e = Gt()),
                e === i &&
                  ((e = bn()),
                  e === i &&
                    ((e = rn()),
                    e === i &&
                      ((e = an()),
                      e === i && ((e = sn()), e === i && ((e = cn()), e === i && (e = dn())))))),
                (Tt[t] = { nextPos: xt, result: e }),
                e);
          }
          function Gt() {
            var e,
              t = 49 * xt + 13,
              n = Tt[t];
            return n
              ? ((xt = n.nextPos), n.result)
              : ((e = Yt()),
                e === i && ((e = Zt()), e === i && ((e = $t()), e === i && (e = Xt()))),
                (Tt[t] = { nextPos: xt, result: e }),
                e);
          }
          function Yt() {
            var t,
              n,
              r,
              o,
              a,
              l = 49 * xt + 14,
              c = Tt[l];
            if (c) return (xt = c.nextPos), c.result;
            if (
              ((t = xt),
              e.substr(xt, 3) === N ? ((n = N), (xt += 3)) : ((n = i), 0 === Lt && jt(M)),
              n !== i)
            )
              if (((r = xn()), r === i && (r = A), r !== i)) {
                (o = []), (a = en());
                while (a !== i) o.push(a), (a = en());
                o !== i
                  ? (e.substr(xt, 3) === N ? ((a = N), (xt += 3)) : ((a = i), 0 === Lt && jt(M)),
                    a !== i ? ((Ct = t), (n = j(o)), (t = n)) : ((xt = t), (t = s)))
                  : ((xt = t), (t = s));
              } else (xt = t), (t = s);
            else (xt = t), (t = s);
            return (Tt[l] = { nextPos: xt, result: t }), t;
          }
          function Zt() {
            var t,
              n,
              r,
              o,
              a = 49 * xt + 15,
              l = Tt[a];
            if (l) return (xt = l.nextPos), l.result;
            if (
              ((t = xt),
              34 === e.charCodeAt(xt) ? ((n = P), xt++) : ((n = i), 0 === Lt && jt(I)),
              n !== i)
            ) {
              (r = []), (o = Jt());
              while (o !== i) r.push(o), (o = Jt());
              r !== i
                ? (34 === e.charCodeAt(xt) ? ((o = P), xt++) : ((o = i), 0 === Lt && jt(I)),
                  o !== i ? ((Ct = t), (n = j(r)), (t = n)) : ((xt = t), (t = s)))
                : ((xt = t), (t = s));
            } else (xt = t), (t = s);
            return (Tt[a] = { nextPos: xt, result: t }), t;
          }
          function $t() {
            var t,
              n,
              r,
              o,
              a,
              l = 49 * xt + 16,
              c = Tt[l];
            if (c) return (xt = c.nextPos), c.result;
            if (
              ((t = xt),
              e.substr(xt, 3) === D ? ((n = D), (xt += 3)) : ((n = i), 0 === Lt && jt(_)),
              n !== i)
            )
              if (((r = xn()), r === i && (r = A), r !== i)) {
                (o = []), (a = nn());
                while (a !== i) o.push(a), (a = nn());
                o !== i
                  ? (e.substr(xt, 3) === D ? ((a = D), (xt += 3)) : ((a = i), 0 === Lt && jt(_)),
                    a !== i ? ((Ct = t), (n = j(o)), (t = n)) : ((xt = t), (t = s)))
                  : ((xt = t), (t = s));
              } else (xt = t), (t = s);
            else (xt = t), (t = s);
            return (Tt[l] = { nextPos: xt, result: t }), t;
          }
          function Xt() {
            var t,
              n,
              r,
              o,
              a = 49 * xt + 17,
              l = Tt[a];
            if (l) return (xt = l.nextPos), l.result;
            if (
              ((t = xt),
              39 === e.charCodeAt(xt) ? ((n = z), xt++) : ((n = i), 0 === Lt && jt(R)),
              n !== i)
            ) {
              (r = []), (o = Qt());
              while (o !== i) r.push(o), (o = Qt());
              r !== i
                ? (39 === e.charCodeAt(xt) ? ((o = z), xt++) : ((o = i), 0 === Lt && jt(R)),
                  o !== i ? ((Ct = t), (n = j(r)), (t = n)) : ((xt = t), (t = s)))
                : ((xt = t), (t = s));
            } else (xt = t), (t = s);
            return (Tt[a] = { nextPos: xt, result: t }), t;
          }
          function Jt() {
            var t,
              n,
              r,
              o = 49 * xt + 18,
              a = Tt[o];
            return a
              ? ((xt = a.nextPos), a.result)
              : ((t = Tn()),
                t === i &&
                  ((t = xt),
                  (n = xt),
                  Lt++,
                  34 === e.charCodeAt(xt) ? ((r = P), xt++) : ((r = i), 0 === Lt && jt(I)),
                  Lt--,
                  r === i ? (n = f) : ((xt = n), (n = s)),
                  n !== i
                    ? (e.length > xt ? ((r = e.charAt(xt)), xt++) : ((r = i), 0 === Lt && jt(p)),
                      r !== i ? ((Ct = t), (n = F(r)), (t = n)) : ((xt = t), (t = s)))
                    : ((xt = t), (t = s))),
                (Tt[o] = { nextPos: xt, result: t }),
                t);
          }
          function Qt() {
            var t,
              n,
              r,
              o = 49 * xt + 19,
              a = Tt[o];
            return a
              ? ((xt = a.nextPos), a.result)
              : ((t = xt),
                (n = xt),
                Lt++,
                39 === e.charCodeAt(xt) ? ((r = z), xt++) : ((r = i), 0 === Lt && jt(R)),
                Lt--,
                r === i ? (n = f) : ((xt = n), (n = s)),
                n !== i
                  ? (e.length > xt ? ((r = e.charAt(xt)), xt++) : ((r = i), 0 === Lt && jt(p)),
                    r !== i ? ((Ct = t), (n = F(r)), (t = n)) : ((xt = t), (t = s)))
                  : ((xt = t), (t = s)),
                (Tt[o] = { nextPos: xt, result: t }),
                t);
          }
          function en() {
            var t,
              n,
              r,
              o = 49 * xt + 20,
              a = Tt[o];
            return a
              ? ((xt = a.nextPos), a.result)
              : ((t = Tn()),
                t === i &&
                  ((t = tn()),
                  t === i &&
                    ((t = xt),
                    (n = xt),
                    Lt++,
                    e.substr(xt, 3) === N ? ((r = N), (xt += 3)) : ((r = i), 0 === Lt && jt(M)),
                    Lt--,
                    r === i ? (n = f) : ((xt = n), (n = s)),
                    n !== i
                      ? (e.length > xt ? ((r = e.charAt(xt)), xt++) : ((r = i), 0 === Lt && jt(p)),
                        r !== i ? ((Ct = t), (n = H(r)), (t = n)) : ((xt = t), (t = s)))
                      : ((xt = t), (t = s)))),
                (Tt[o] = { nextPos: xt, result: t }),
                t);
          }
          function tn() {
            var t,
              n,
              r,
              o,
              a,
              l = 49 * xt + 21,
              c = Tt[l];
            if (c) return (xt = c.nextPos), c.result;
            if (
              ((t = xt),
              92 === e.charCodeAt(xt) ? ((n = W), xt++) : ((n = i), 0 === Lt && jt(B)),
              n !== i)
            )
              if (((r = xn()), r !== i)) {
                (o = []), (a = Cn());
                while (a !== i) o.push(a), (a = Cn());
                o !== i ? ((Ct = t), (n = V()), (t = n)) : ((xt = t), (t = s));
              } else (xt = t), (t = s);
            else (xt = t), (t = s);
            return (Tt[l] = { nextPos: xt, result: t }), t;
          }
          function nn() {
            var t,
              n,
              r,
              o = 49 * xt + 22,
              a = Tt[o];
            return a
              ? ((xt = a.nextPos), a.result)
              : ((t = xt),
                (n = xt),
                Lt++,
                e.substr(xt, 3) === D ? ((r = D), (xt += 3)) : ((r = i), 0 === Lt && jt(_)),
                Lt--,
                r === i ? (n = f) : ((xt = n), (n = s)),
                n !== i
                  ? (e.length > xt ? ((r = e.charAt(xt)), xt++) : ((r = i), 0 === Lt && jt(p)),
                    r !== i ? ((Ct = t), (n = F(r)), (t = n)) : ((xt = t), (t = s)))
                  : ((xt = t), (t = s)),
                (Tt[o] = { nextPos: xt, result: t }),
                t);
          }
          function rn() {
            var t,
              n,
              r,
              o,
              a = 49 * xt + 23,
              l = Tt[a];
            return l
              ? ((xt = l.nextPos), l.result)
              : ((t = xt),
                (n = on()),
                n === i && (n = ln()),
                n !== i
                  ? (101 === e.charCodeAt(xt) ? ((r = U), xt++) : ((r = i), 0 === Lt && jt(K)),
                    r === i &&
                      (69 === e.charCodeAt(xt) ? ((r = q), xt++) : ((r = i), 0 === Lt && jt(G))),
                    r !== i
                      ? ((o = ln()),
                        o !== i ? ((Ct = t), (n = Y(n, o)), (t = n)) : ((xt = t), (t = s)))
                      : ((xt = t), (t = s)))
                  : ((xt = t), (t = s)),
                t === i && ((t = xt), (n = on()), n !== i && ((Ct = t), (n = Z(n))), (t = n)),
                (Tt[a] = { nextPos: xt, result: t }),
                t);
          }
          function on() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c = 49 * xt + 24,
              u = Tt[c];
            return u
              ? ((xt = u.nextPos), u.result)
              : ((t = xt),
                43 === e.charCodeAt(xt) ? ((n = $), xt++) : ((n = i), 0 === Lt && jt(X)),
                n === i && (n = A),
                n !== i
                  ? ((r = xt),
                    (o = Ln()),
                    o !== i
                      ? (46 === e.charCodeAt(xt) ? ((a = C), xt++) : ((a = i), 0 === Lt && jt(S)),
                        a !== i
                          ? ((l = Ln()), l !== i ? ((o = [o, a, l]), (r = o)) : ((xt = r), (r = s)))
                          : ((xt = r), (r = s)))
                      : ((xt = r), (r = s)),
                    r !== i ? ((Ct = t), (n = J(r)), (t = n)) : ((xt = t), (t = s)))
                  : ((xt = t), (t = s)),
                t === i &&
                  ((t = xt),
                  45 === e.charCodeAt(xt) ? ((n = Q), xt++) : ((n = i), 0 === Lt && jt(ee)),
                  n !== i
                    ? ((r = xt),
                      (o = Ln()),
                      o !== i
                        ? (46 === e.charCodeAt(xt) ? ((a = C), xt++) : ((a = i), 0 === Lt && jt(S)),
                          a !== i
                            ? ((l = Ln()),
                              l !== i ? ((o = [o, a, l]), (r = o)) : ((xt = r), (r = s)))
                            : ((xt = r), (r = s)))
                        : ((xt = r), (r = s)),
                      r !== i ? ((Ct = t), (n = te(r)), (t = n)) : ((xt = t), (t = s)))
                    : ((xt = t), (t = s))),
                (Tt[c] = { nextPos: xt, result: t }),
                t);
          }
          function an() {
            var e,
              t,
              n = 49 * xt + 25,
              r = Tt[n];
            return r
              ? ((xt = r.nextPos), r.result)
              : ((e = xt),
                (t = ln()),
                t !== i && ((Ct = e), (t = ne(t))),
                (e = t),
                (Tt[n] = { nextPos: xt, result: e }),
                e);
          }
          function ln() {
            var t,
              n,
              r,
              o,
              a,
              l = 49 * xt + 26,
              c = Tt[l];
            if (c) return (xt = c.nextPos), c.result;
            if (
              ((t = xt),
              43 === e.charCodeAt(xt) ? ((n = $), xt++) : ((n = i), 0 === Lt && jt(X)),
              n === i && (n = A),
              n !== i)
            ) {
              if (((r = []), (o = En()), o !== i)) while (o !== i) r.push(o), (o = En());
              else r = s;
              r !== i
                ? ((o = xt),
                  Lt++,
                  46 === e.charCodeAt(xt) ? ((a = C), xt++) : ((a = i), 0 === Lt && jt(S)),
                  Lt--,
                  a === i ? (o = f) : ((xt = o), (o = s)),
                  o !== i ? ((Ct = t), (n = J(r)), (t = n)) : ((xt = t), (t = s)))
                : ((xt = t), (t = s));
            } else (xt = t), (t = s);
            if (t === i)
              if (
                ((t = xt),
                45 === e.charCodeAt(xt) ? ((n = Q), xt++) : ((n = i), 0 === Lt && jt(ee)),
                n !== i)
              ) {
                if (((r = []), (o = En()), o !== i)) while (o !== i) r.push(o), (o = En());
                else r = s;
                r !== i
                  ? ((o = xt),
                    Lt++,
                    46 === e.charCodeAt(xt) ? ((a = C), xt++) : ((a = i), 0 === Lt && jt(S)),
                    Lt--,
                    a === i ? (o = f) : ((xt = o), (o = s)),
                    o !== i ? ((Ct = t), (n = te(r)), (t = n)) : ((xt = t), (t = s)))
                  : ((xt = t), (t = s));
              } else (xt = t), (t = s);
            return (Tt[l] = { nextPos: xt, result: t }), t;
          }
          function sn() {
            var t,
              n,
              r = 49 * xt + 27,
              o = Tt[r];
            return o
              ? ((xt = o.nextPos), o.result)
              : ((t = xt),
                e.substr(xt, 4) === re ? ((n = re), (xt += 4)) : ((n = i), 0 === Lt && jt(ie)),
                n !== i && ((Ct = t), (n = oe())),
                (t = n),
                t === i &&
                  ((t = xt),
                  e.substr(xt, 5) === ae ? ((n = ae), (xt += 5)) : ((n = i), 0 === Lt && jt(le)),
                  n !== i && ((Ct = t), (n = se())),
                  (t = n)),
                (Tt[r] = { nextPos: xt, result: t }),
                t);
          }
          function cn() {
            var t,
              n,
              r,
              o,
              a,
              l = 49 * xt + 28,
              c = Tt[l];
            if (c) return (xt = c.nextPos), c.result;
            if (
              ((t = xt),
              91 === e.charCodeAt(xt) ? ((n = d), xt++) : ((n = i), 0 === Lt && jt(h)),
              n !== i)
            ) {
              (r = []), (o = pn());
              while (o !== i) r.push(o), (o = pn());
              r !== i
                ? (93 === e.charCodeAt(xt) ? ((o = m), xt++) : ((o = i), 0 === Lt && jt(g)),
                  o !== i ? ((Ct = t), (n = ce()), (t = n)) : ((xt = t), (t = s)))
                : ((xt = t), (t = s));
            } else (xt = t), (t = s);
            if (
              t === i &&
              ((t = xt),
              91 === e.charCodeAt(xt) ? ((n = d), xt++) : ((n = i), 0 === Lt && jt(h)),
              n !== i
                ? ((r = un()),
                  r === i && (r = A),
                  r !== i
                    ? (93 === e.charCodeAt(xt) ? ((o = m), xt++) : ((o = i), 0 === Lt && jt(g)),
                      o !== i ? ((Ct = t), (n = ue(r)), (t = n)) : ((xt = t), (t = s)))
                    : ((xt = t), (t = s)))
                : ((xt = t), (t = s)),
              t === i)
            ) {
              if (
                ((t = xt),
                91 === e.charCodeAt(xt) ? ((n = d), xt++) : ((n = i), 0 === Lt && jt(h)),
                n !== i)
              ) {
                if (((r = []), (o = fn()), o !== i)) while (o !== i) r.push(o), (o = fn());
                else r = s;
                r !== i
                  ? (93 === e.charCodeAt(xt) ? ((o = m), xt++) : ((o = i), 0 === Lt && jt(g)),
                    o !== i ? ((Ct = t), (n = fe(r)), (t = n)) : ((xt = t), (t = s)))
                  : ((xt = t), (t = s));
              } else (xt = t), (t = s);
              if (t === i)
                if (
                  ((t = xt),
                  91 === e.charCodeAt(xt) ? ((n = d), xt++) : ((n = i), 0 === Lt && jt(h)),
                  n !== i)
                ) {
                  if (((r = []), (o = fn()), o !== i)) while (o !== i) r.push(o), (o = fn());
                  else r = s;
                  r !== i
                    ? ((o = un()),
                      o !== i
                        ? (93 === e.charCodeAt(xt) ? ((a = m), xt++) : ((a = i), 0 === Lt && jt(g)),
                          a !== i ? ((Ct = t), (n = pe(r, o)), (t = n)) : ((xt = t), (t = s)))
                        : ((xt = t), (t = s)))
                    : ((xt = t), (t = s));
                } else (xt = t), (t = s);
            }
            return (Tt[l] = { nextPos: xt, result: t }), t;
          }
          function un() {
            var e,
              t,
              n,
              r,
              o,
              a = 49 * xt + 29,
              l = Tt[a];
            if (l) return (xt = l.nextPos), l.result;
            (e = xt), (t = []), (n = pn());
            while (n !== i) t.push(n), (n = pn());
            if (t !== i)
              if (((n = qt()), n !== i)) {
                (r = []), (o = pn());
                while (o !== i) r.push(o), (o = pn());
                r !== i ? ((Ct = e), (t = de(n)), (e = t)) : ((xt = e), (e = s));
              } else (xt = e), (e = s);
            else (xt = e), (e = s);
            return (Tt[a] = { nextPos: xt, result: e }), e;
          }
          function fn() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c,
              u = 49 * xt + 30,
              f = Tt[u];
            if (f) return (xt = f.nextPos), f.result;
            (t = xt), (n = []), (r = pn());
            while (r !== i) n.push(r), (r = pn());
            if (n !== i)
              if (((r = qt()), r !== i)) {
                (o = []), (a = pn());
                while (a !== i) o.push(a), (a = pn());
                if (o !== i)
                  if (
                    (44 === e.charCodeAt(xt) ? ((a = he), xt++) : ((a = i), 0 === Lt && jt(me)),
                    a !== i)
                  ) {
                    (l = []), (c = pn());
                    while (c !== i) l.push(c), (c = pn());
                    l !== i ? ((Ct = t), (n = de(r)), (t = n)) : ((xt = t), (t = s));
                  } else (xt = t), (t = s);
                else (xt = t), (t = s);
              } else (xt = t), (t = s);
            else (xt = t), (t = s);
            return (Tt[u] = { nextPos: xt, result: t }), t;
          }
          function pn() {
            var e,
              t = 49 * xt + 31,
              n = Tt[t];
            return n
              ? ((xt = n.nextPos), n.result)
              : ((e = wn()),
                e === i && ((e = xn()), e === i && (e = zt())),
                (Tt[t] = { nextPos: xt, result: e }),
                e);
          }
          function dn() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c = 49 * xt + 32,
              u = Tt[c];
            if (u) return (xt = u.nextPos), u.result;
            if (
              ((t = xt),
              123 === e.charCodeAt(xt) ? ((n = ge), xt++) : ((n = i), 0 === Lt && jt(ve)),
              n !== i)
            ) {
              (r = []), (o = wn());
              while (o !== i) r.push(o), (o = wn());
              if (r !== i) {
                (o = []), (a = hn());
                while (a !== i) o.push(a), (a = hn());
                if (o !== i) {
                  (a = []), (l = wn());
                  while (l !== i) a.push(l), (l = wn());
                  a !== i
                    ? (125 === e.charCodeAt(xt) ? ((l = ye), xt++) : ((l = i), 0 === Lt && jt(be)),
                      l !== i ? ((Ct = t), (n = we(o)), (t = n)) : ((xt = t), (t = s)))
                    : ((xt = t), (t = s));
                } else (xt = t), (t = s);
              } else (xt = t), (t = s);
            } else (xt = t), (t = s);
            return (Tt[c] = { nextPos: xt, result: t }), t;
          }
          function hn() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c,
              u,
              f,
              p,
              d,
              h = 49 * xt + 33,
              m = Tt[h];
            if (m) return (xt = m.nextPos), m.result;
            (t = xt), (n = []), (r = wn());
            while (r !== i) n.push(r), (r = wn());
            if (n !== i)
              if (((r = Ut()), r !== i)) {
                (o = []), (a = wn());
                while (a !== i) o.push(a), (a = wn());
                if (o !== i)
                  if (
                    (61 === e.charCodeAt(xt) ? ((a = k), xt++) : ((a = i), 0 === Lt && jt(E)),
                    a !== i)
                  ) {
                    (l = []), (c = wn());
                    while (c !== i) l.push(c), (c = wn());
                    if (l !== i)
                      if (((c = qt()), c !== i)) {
                        (u = []), (f = wn());
                        while (f !== i) u.push(f), (f = wn());
                        if (u !== i)
                          if (
                            (44 === e.charCodeAt(xt)
                              ? ((f = he), xt++)
                              : ((f = i), 0 === Lt && jt(me)),
                            f !== i)
                          ) {
                            (p = []), (d = wn());
                            while (d !== i) p.push(d), (d = wn());
                            p !== i ? ((Ct = t), (n = xe(r, c)), (t = n)) : ((xt = t), (t = s));
                          } else (xt = t), (t = s);
                        else (xt = t), (t = s);
                      } else (xt = t), (t = s);
                    else (xt = t), (t = s);
                  } else (xt = t), (t = s);
                else (xt = t), (t = s);
              } else (xt = t), (t = s);
            else (xt = t), (t = s);
            if (t === i) {
              (t = xt), (n = []), (r = wn());
              while (r !== i) n.push(r), (r = wn());
              if (n !== i)
                if (((r = Ut()), r !== i)) {
                  (o = []), (a = wn());
                  while (a !== i) o.push(a), (a = wn());
                  if (o !== i)
                    if (
                      (61 === e.charCodeAt(xt) ? ((a = k), xt++) : ((a = i), 0 === Lt && jt(E)),
                      a !== i)
                    ) {
                      (l = []), (c = wn());
                      while (c !== i) l.push(c), (c = wn());
                      l !== i
                        ? ((c = qt()),
                          c !== i ? ((Ct = t), (n = xe(r, c)), (t = n)) : ((xt = t), (t = s)))
                        : ((xt = t), (t = s));
                    } else (xt = t), (t = s);
                  else (xt = t), (t = s);
                } else (xt = t), (t = s);
              else (xt = t), (t = s);
            }
            return (Tt[h] = { nextPos: xt, result: t }), t;
          }
          function mn() {
            var t,
              n,
              r,
              o = 49 * xt + 34,
              a = Tt[o];
            return a
              ? ((xt = a.nextPos), a.result)
              : ((t = xt),
                46 === e.charCodeAt(xt) ? ((n = C), xt++) : ((n = i), 0 === Lt && jt(S)),
                n !== i
                  ? ((r = Ln()), r !== i ? ((Ct = t), (n = Ce(r)), (t = n)) : ((xt = t), (t = s)))
                  : ((xt = t), (t = s)),
                (Tt[o] = { nextPos: xt, result: t }),
                t);
          }
          function gn() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c,
              u,
              f,
              p,
              d,
              h,
              m = 49 * xt + 35,
              g = Tt[m];
            return g
              ? ((xt = g.nextPos), g.result)
              : ((t = xt),
                (n = xt),
                (r = En()),
                r !== i
                  ? ((o = En()),
                    o !== i
                      ? ((a = En()),
                        a !== i
                          ? ((l = En()),
                            l !== i
                              ? (45 === e.charCodeAt(xt)
                                  ? ((c = Q), xt++)
                                  : ((c = i), 0 === Lt && jt(ee)),
                                c !== i
                                  ? ((u = En()),
                                    u !== i
                                      ? ((f = En()),
                                        f !== i
                                          ? (45 === e.charCodeAt(xt)
                                              ? ((p = Q), xt++)
                                              : ((p = i), 0 === Lt && jt(ee)),
                                            p !== i
                                              ? ((d = En()),
                                                d !== i
                                                  ? ((h = En()),
                                                    h !== i
                                                      ? ((r = [r, o, a, l, c, u, f, p, d, h]),
                                                        (n = r))
                                                      : ((xt = n), (n = s)))
                                                  : ((xt = n), (n = s)))
                                              : ((xt = n), (n = s)))
                                          : ((xt = n), (n = s)))
                                      : ((xt = n), (n = s)))
                                  : ((xt = n), (n = s)))
                              : ((xt = n), (n = s)))
                          : ((xt = n), (n = s)))
                      : ((xt = n), (n = s)))
                  : ((xt = n), (n = s)),
                n !== i && ((Ct = t), (n = Se(n))),
                (t = n),
                (Tt[m] = { nextPos: xt, result: t }),
                t);
          }
          function vn() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c,
              u,
              f,
              p,
              d,
              h = 49 * xt + 36,
              m = Tt[h];
            return m
              ? ((xt = m.nextPos), m.result)
              : ((t = xt),
                (n = xt),
                (r = En()),
                r !== i
                  ? ((o = En()),
                    o !== i
                      ? (58 === e.charCodeAt(xt) ? ((a = ke), xt++) : ((a = i), 0 === Lt && jt(Ee)),
                        a !== i
                          ? ((l = En()),
                            l !== i
                              ? ((c = En()),
                                c !== i
                                  ? (58 === e.charCodeAt(xt)
                                      ? ((u = ke), xt++)
                                      : ((u = i), 0 === Lt && jt(Ee)),
                                    u !== i
                                      ? ((f = En()),
                                        f !== i
                                          ? ((p = En()),
                                            p !== i
                                              ? ((d = mn()),
                                                d === i && (d = A),
                                                d !== i
                                                  ? ((r = [r, o, a, l, c, u, f, p, d]), (n = r))
                                                  : ((xt = n), (n = s)))
                                              : ((xt = n), (n = s)))
                                          : ((xt = n), (n = s)))
                                      : ((xt = n), (n = s)))
                                  : ((xt = n), (n = s)))
                              : ((xt = n), (n = s)))
                          : ((xt = n), (n = s)))
                      : ((xt = n), (n = s)))
                  : ((xt = n), (n = s)),
                n !== i && ((Ct = t), (n = Oe(n))),
                (t = n),
                (Tt[h] = { nextPos: xt, result: t }),
                t);
          }
          function yn() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c,
              u,
              f,
              p,
              d,
              h,
              m,
              g,
              v,
              y,
              b,
              w = 49 * xt + 37,
              x = Tt[w];
            return x
              ? ((xt = x.nextPos), x.result)
              : ((t = xt),
                (n = xt),
                (r = En()),
                r !== i
                  ? ((o = En()),
                    o !== i
                      ? (58 === e.charCodeAt(xt) ? ((a = ke), xt++) : ((a = i), 0 === Lt && jt(Ee)),
                        a !== i
                          ? ((l = En()),
                            l !== i
                              ? ((c = En()),
                                c !== i
                                  ? (58 === e.charCodeAt(xt)
                                      ? ((u = ke), xt++)
                                      : ((u = i), 0 === Lt && jt(Ee)),
                                    u !== i
                                      ? ((f = En()),
                                        f !== i
                                          ? ((p = En()),
                                            p !== i
                                              ? ((d = mn()),
                                                d === i && (d = A),
                                                d !== i
                                                  ? (45 === e.charCodeAt(xt)
                                                      ? ((h = Q), xt++)
                                                      : ((h = i), 0 === Lt && jt(ee)),
                                                    h === i &&
                                                      (43 === e.charCodeAt(xt)
                                                        ? ((h = $), xt++)
                                                        : ((h = i), 0 === Lt && jt(X))),
                                                    h !== i
                                                      ? ((m = En()),
                                                        m !== i
                                                          ? ((g = En()),
                                                            g !== i
                                                              ? (58 === e.charCodeAt(xt)
                                                                  ? ((v = ke), xt++)
                                                                  : ((v = i), 0 === Lt && jt(Ee)),
                                                                v !== i
                                                                  ? ((y = En()),
                                                                    y !== i
                                                                      ? ((b = En()),
                                                                        b !== i
                                                                          ? ((r = [
                                                                              r,
                                                                              o,
                                                                              a,
                                                                              l,
                                                                              c,
                                                                              u,
                                                                              f,
                                                                              p,
                                                                              d,
                                                                              h,
                                                                              m,
                                                                              g,
                                                                              v,
                                                                              y,
                                                                              b,
                                                                            ]),
                                                                            (n = r))
                                                                          : ((xt = n), (n = s)))
                                                                      : ((xt = n), (n = s)))
                                                                  : ((xt = n), (n = s)))
                                                              : ((xt = n), (n = s)))
                                                          : ((xt = n), (n = s)))
                                                      : ((xt = n), (n = s)))
                                                  : ((xt = n), (n = s)))
                                              : ((xt = n), (n = s)))
                                          : ((xt = n), (n = s)))
                                      : ((xt = n), (n = s)))
                                  : ((xt = n), (n = s)))
                              : ((xt = n), (n = s)))
                          : ((xt = n), (n = s)))
                      : ((xt = n), (n = s)))
                  : ((xt = n), (n = s)),
                n !== i && ((Ct = t), (n = Oe(n))),
                (t = n),
                (Tt[w] = { nextPos: xt, result: t }),
                t);
          }
          function bn() {
            var t,
              n,
              r,
              o,
              a,
              l = 49 * xt + 38,
              c = Tt[l];
            return c
              ? ((xt = c.nextPos), c.result)
              : ((t = xt),
                (n = gn()),
                n !== i
                  ? (84 === e.charCodeAt(xt) ? ((r = Le), xt++) : ((r = i), 0 === Lt && jt(Te)),
                    r !== i
                      ? ((o = vn()),
                        o !== i
                          ? (90 === e.charCodeAt(xt)
                              ? ((a = Ne), xt++)
                              : ((a = i), 0 === Lt && jt(Me)),
                            a !== i ? ((Ct = t), (n = Ae(n, o)), (t = n)) : ((xt = t), (t = s)))
                          : ((xt = t), (t = s)))
                      : ((xt = t), (t = s)))
                  : ((xt = t), (t = s)),
                t === i &&
                  ((t = xt),
                  (n = gn()),
                  n !== i
                    ? (84 === e.charCodeAt(xt) ? ((r = Le), xt++) : ((r = i), 0 === Lt && jt(Te)),
                      r !== i
                        ? ((o = yn()),
                          o !== i ? ((Ct = t), (n = je(n, o)), (t = n)) : ((xt = t), (t = s)))
                        : ((xt = t), (t = s)))
                    : ((xt = t), (t = s))),
                (Tt[l] = { nextPos: xt, result: t }),
                t);
          }
          function wn() {
            var t,
              n = 49 * xt + 39,
              r = Tt[n];
            return r
              ? ((xt = r.nextPos), r.result)
              : (Pe.test(e.charAt(xt)) ? ((t = e.charAt(xt)), xt++) : ((t = i), 0 === Lt && jt(Ie)),
                (Tt[n] = { nextPos: xt, result: t }),
                t);
          }
          function xn() {
            var t,
              n,
              r,
              o = 49 * xt + 40,
              a = Tt[o];
            return a
              ? ((xt = a.nextPos), a.result)
              : (10 === e.charCodeAt(xt) ? ((t = De), xt++) : ((t = i), 0 === Lt && jt(_e)),
                t === i &&
                  ((t = xt),
                  13 === e.charCodeAt(xt) ? ((n = ze), xt++) : ((n = i), 0 === Lt && jt(Re)),
                  n !== i
                    ? (10 === e.charCodeAt(xt) ? ((r = De), xt++) : ((r = i), 0 === Lt && jt(_e)),
                      r !== i ? ((n = [n, r]), (t = n)) : ((xt = t), (t = s)))
                    : ((xt = t), (t = s))),
                (Tt[o] = { nextPos: xt, result: t }),
                t);
          }
          function Cn() {
            var e,
              t = 49 * xt + 41,
              n = Tt[t];
            return n
              ? ((xt = n.nextPos), n.result)
              : ((e = xn()), e === i && (e = wn()), (Tt[t] = { nextPos: xt, result: e }), e);
          }
          function Sn() {
            var t,
              n,
              r = 49 * xt + 42,
              o = Tt[r];
            return o
              ? ((xt = o.nextPos), o.result)
              : ((t = xt),
                Lt++,
                e.length > xt ? ((n = e.charAt(xt)), xt++) : ((n = i), 0 === Lt && jt(p)),
                Lt--,
                n === i ? (t = f) : ((xt = t), (t = s)),
                (Tt[r] = { nextPos: xt, result: t }),
                t);
          }
          function kn() {
            var t,
              n = 49 * xt + 43,
              r = Tt[n];
            return r
              ? ((xt = r.nextPos), r.result)
              : (Fe.test(e.charAt(xt)) ? ((t = e.charAt(xt)), xt++) : ((t = i), 0 === Lt && jt(He)),
                (Tt[n] = { nextPos: xt, result: t }),
                t);
          }
          function En() {
            var t,
              n,
              r = 49 * xt + 44,
              o = Tt[r];
            return o
              ? ((xt = o.nextPos), o.result)
              : (We.test(e.charAt(xt)) ? ((t = e.charAt(xt)), xt++) : ((t = i), 0 === Lt && jt(Be)),
                t === i &&
                  ((t = xt),
                  95 === e.charCodeAt(xt) ? ((n = Ve), xt++) : ((n = i), 0 === Lt && jt(Ue)),
                  n !== i && ((Ct = t), (n = Ke())),
                  (t = n)),
                (Tt[r] = { nextPos: xt, result: t }),
                t);
          }
          function On() {
            var t,
              n = 49 * xt + 45,
              r = Tt[n];
            return r
              ? ((xt = r.nextPos), r.result)
              : (qe.test(e.charAt(xt)) ? ((t = e.charAt(xt)), xt++) : ((t = i), 0 === Lt && jt(Ge)),
                (Tt[n] = { nextPos: xt, result: t }),
                t);
          }
          function Ln() {
            var e,
              t,
              n,
              r = 49 * xt + 46,
              o = Tt[r];
            if (o) return (xt = o.nextPos), o.result;
            if (((e = xt), (t = []), (n = En()), n !== i)) while (n !== i) t.push(n), (n = En());
            else t = s;
            return (
              t !== i && ((Ct = e), (t = Ye(t))), (e = t), (Tt[r] = { nextPos: xt, result: e }), e
            );
          }
          function Tn() {
            var t,
              n,
              r = 49 * xt + 47,
              o = Tt[r];
            return o
              ? ((xt = o.nextPos), o.result)
              : ((t = xt),
                e.substr(xt, 2) === Ze ? ((n = Ze), (xt += 2)) : ((n = i), 0 === Lt && jt($e)),
                n !== i && ((Ct = t), (n = Xe())),
                (t = n),
                t === i &&
                  ((t = xt),
                  e.substr(xt, 2) === Je ? ((n = Je), (xt += 2)) : ((n = i), 0 === Lt && jt(Qe)),
                  n !== i && ((Ct = t), (n = et())),
                  (t = n),
                  t === i &&
                    ((t = xt),
                    e.substr(xt, 2) === tt ? ((n = tt), (xt += 2)) : ((n = i), 0 === Lt && jt(nt)),
                    n !== i && ((Ct = t), (n = rt())),
                    (t = n),
                    t === i &&
                      ((t = xt),
                      e.substr(xt, 2) === it
                        ? ((n = it), (xt += 2))
                        : ((n = i), 0 === Lt && jt(ot)),
                      n !== i && ((Ct = t), (n = at())),
                      (t = n),
                      t === i &&
                        ((t = xt),
                        e.substr(xt, 2) === lt
                          ? ((n = lt), (xt += 2))
                          : ((n = i), 0 === Lt && jt(st)),
                        n !== i && ((Ct = t), (n = ct())),
                        (t = n),
                        t === i &&
                          ((t = xt),
                          e.substr(xt, 2) === ut
                            ? ((n = ut), (xt += 2))
                            : ((n = i), 0 === Lt && jt(ft)),
                          n !== i && ((Ct = t), (n = pt())),
                          (t = n),
                          t === i &&
                            ((t = xt),
                            e.substr(xt, 2) === dt
                              ? ((n = dt), (xt += 2))
                              : ((n = i), 0 === Lt && jt(ht)),
                            n !== i && ((Ct = t), (n = mt())),
                            (t = n),
                            t === i && (t = Nn()))))))),
                (Tt[r] = { nextPos: xt, result: t }),
                t);
          }
          function Nn() {
            var t,
              n,
              r,
              o,
              a,
              l,
              c,
              u,
              f,
              p,
              d,
              h = 49 * xt + 48,
              m = Tt[h];
            return m
              ? ((xt = m.nextPos), m.result)
              : ((t = xt),
                e.substr(xt, 2) === gt ? ((n = gt), (xt += 2)) : ((n = i), 0 === Lt && jt(vt)),
                n !== i
                  ? ((r = xt),
                    (o = kn()),
                    o !== i
                      ? ((a = kn()),
                        a !== i
                          ? ((l = kn()),
                            l !== i
                              ? ((c = kn()),
                                c !== i
                                  ? ((u = kn()),
                                    u !== i
                                      ? ((f = kn()),
                                        f !== i
                                          ? ((p = kn()),
                                            p !== i
                                              ? ((d = kn()),
                                                d !== i
                                                  ? ((o = [o, a, l, c, u, f, p, d]), (r = o))
                                                  : ((xt = r), (r = s)))
                                              : ((xt = r), (r = s)))
                                          : ((xt = r), (r = s)))
                                      : ((xt = r), (r = s)))
                                  : ((xt = r), (r = s)))
                              : ((xt = r), (r = s)))
                          : ((xt = r), (r = s)))
                      : ((xt = r), (r = s)),
                    r !== i ? ((Ct = t), (n = yt(r)), (t = n)) : ((xt = t), (t = s)))
                  : ((xt = t), (t = s)),
                t === i &&
                  ((t = xt),
                  e.substr(xt, 2) === bt ? ((n = bt), (xt += 2)) : ((n = i), 0 === Lt && jt(wt)),
                  n !== i
                    ? ((r = xt),
                      (o = kn()),
                      o !== i
                        ? ((a = kn()),
                          a !== i
                            ? ((l = kn()),
                              l !== i
                                ? ((c = kn()),
                                  c !== i ? ((o = [o, a, l, c]), (r = o)) : ((xt = r), (r = s)))
                                : ((xt = r), (r = s)))
                            : ((xt = r), (r = s)))
                        : ((xt = r), (r = s)),
                      r !== i ? ((Ct = t), (n = yt(r)), (t = n)) : ((xt = t), (t = s)))
                    : ((xt = t), (t = s))),
                (Tt[h] = { nextPos: xt, result: t }),
                t);
          }
          var Mn = [];
          function An(e, t, n) {
            var r = new Error(e);
            throw ((r.line = t), (r.column = n), r);
          }
          function jn(e) {
            Mn.push(e);
          }
          function Pn(e, t, n, r, i) {
            var o = { type: e, value: t, line: n(), column: r() };
            return i && (o.key = i), o;
          }
          function In(e, t, n) {
            var r = parseInt('0x' + e);
            if (
              !(
                !isFinite(r) ||
                Math.floor(r) != r ||
                r < 0 ||
                r > 1114111 ||
                (r > 55295 && r < 57344)
              )
            )
              return Dn(r);
            An('Invalid Unicode escape code: ' + e, t, n);
          }
          function Dn() {
            var e,
              t,
              n = 16384,
              r = [],
              i = -1,
              o = arguments.length;
            if (!o) return '';
            var a = '';
            while (++i < o) {
              var l = Number(arguments[i]);
              l <= 65535
                ? r.push(l)
                : ((l -= 65536), (e = 55296 + (l >> 10)), (t = (l % 1024) + 56320), r.push(e, t)),
                (i + 1 == o || r.length > n) &&
                  ((a += String.fromCharCode.apply(null, r)), (r.length = 0));
            }
            return a;
          }
          if (((n = a()), n !== i && xt === e.length)) return n;
          throw (
            (n !== i && xt < e.length && jt({ type: 'end', description: 'end of input' }),
            Pt(null, Ot, Et))
          );
        }
        return e(t, Error), { SyntaxError: t, parse: n };
      })();
    },
    nBsq: function (e, t, n) {},
    'p77/': function (e, t, n) {},
    q0kf: function (e, t, n) {
      var r = n('mLbZ'),
        i = n('XPNs');
      e.exports = {
        parse: function (e) {
          var t = r.parse(e.toString());
          return i.compile(t);
        },
      };
    },
    qVjC: function (e, t, n) {
      (function () {
        var e,
          r,
          i,
          o,
          a,
          l,
          s,
          c,
          u,
          f,
          p,
          d,
          h,
          m,
          g,
          v,
          y,
          b,
          w,
          x,
          C,
          S =
            [].indexOf ||
            function (e) {
              for (var t = 0, n = this.length; t < n; t++) if (t in this && this[t] === e) return t;
              return -1;
            };
        (c = Math.floor),
          (f = Math.max),
          (p = Math.min),
          (r = n('F1pL')),
          (l = n('9lTW')),
          (y = function (e, t) {
            return t ? (2 * e) / t : 1;
          }),
          (v = function (e, t) {
            var n, r, i, o, a, l;
            for (
              a = [e.length, t.length], r = a[0], i = a[1], n = o = 0, l = p(r, i);
              0 <= l ? o < l : o > l;
              n = 0 <= l ? ++o : --o
            ) {
              if (e[n] < t[n]) return -1;
              if (e[n] > t[n]) return 1;
            }
            return r - i;
          }),
          (C = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }),
          (g = function (e) {
            var t, n, r;
            for (n = 0, r = e.length; n < r; n++) if (((t = e[n]), t)) return !0;
            return !1;
          }),
          (a = (function () {
            function e(e, t, n, r) {
              (this.isjunk = e),
                null == t && (t = ''),
                null == n && (n = ''),
                (this.autojunk = null == r || r),
                (this.a = this.b = null),
                this.setSeqs(t, n);
            }
            return (
              (e.name = 'SequenceMatcher'),
              (e.prototype.setSeqs = function (e, t) {
                return this.setSeq1(e), this.setSeq2(t);
              }),
              (e.prototype.setSeq1 = function (e) {
                if (e !== this.a) return (this.a = e), (this.matchingBlocks = this.opcodes = null);
              }),
              (e.prototype.setSeq2 = function (e) {
                if (e !== this.b)
                  return (
                    (this.b = e),
                    (this.matchingBlocks = this.opcodes = null),
                    (this.fullbcount = null),
                    this._chainB()
                  );
              }),
              (e.prototype._chainB = function () {
                var e, t, n, r, i, o, a, l, s, u, f, p, d, h, m, g;
                for (e = this.b, this.b2j = t = {}, r = p = 0, h = e.length; p < h; r = ++p)
                  (n = e[r]), (o = C(t, n) ? t[n] : (t[n] = [])), o.push(r);
                if (((l = {}), (a = this.isjunk), a))
                  for (g = Object.keys(t), d = 0, m = g.length; d < m; d++)
                    (n = g[d]), a(n) && ((l[n] = !0), delete t[n]);
                if (((f = {}), (s = e.length), this.autojunk && s >= 200))
                  for (n in ((u = c(s / 100) + 1), t))
                    (i = t[n]), i.length > u && ((f[n] = !0), delete t[n]);
                return (
                  (this.isbjunk = function (e) {
                    return C(l, e);
                  }),
                  (this.isbpopular = function (e) {
                    return C(f, e);
                  })
                );
              }),
              (e.prototype.findLongestMatch = function (e, t, n, r) {
                var i, o, a, l, s, c, u, f, p, d, h, m, g, v, y, b, w, x, S, k, E;
                for (
                  b = [this.a, this.b, this.b2j, this.isbjunk],
                    i = b[0],
                    o = b[1],
                    a = b[2],
                    f = b[3],
                    w = [e, n, 0],
                    l = w[0],
                    s = w[1],
                    c = w[2],
                    d = {},
                    u = g = e;
                  e <= t ? g < t : g > t;
                  u = e <= t ? ++g : --g
                ) {
                  for (m = {}, x = C(a, i[u]) ? a[i[u]] : [], v = 0, y = x.length; v < y; v++)
                    if (((p = x[v]), !(p < n))) {
                      if (p >= r) break;
                      (h = m[p] = (d[p - 1] || 0) + 1),
                        h > c &&
                          ((S = [u - h + 1, p - h + 1, h]), (l = S[0]), (s = S[1]), (c = S[2]));
                    }
                  d = m;
                }
                while (l > e && s > n && !f(o[s - 1]) && i[l - 1] === o[s - 1])
                  (k = [l - 1, s - 1, c + 1]), (l = k[0]), (s = k[1]), (c = k[2]);
                while (l + c < t && s + c < r && !f(o[s + c]) && i[l + c] === o[s + c]) c++;
                while (l > e && s > n && f(o[s - 1]) && i[l - 1] === o[s - 1])
                  (E = [l - 1, s - 1, c + 1]), (l = E[0]), (s = E[1]), (c = E[2]);
                while (l + c < t && s + c < r && f(o[s + c]) && i[l + c] === o[s + c]) c++;
                return [l, s, c];
              }),
              (e.prototype.getMatchingBlocks = function () {
                var e, t, n, r, i, o, a, l, s, c, u, f, p, d, h, m, g, y, b, w, x, C, S, k, E, O;
                if (this.matchingBlocks) return this.matchingBlocks;
                (C = [this.a.length, this.b.length]),
                  (d = C[0]),
                  (h = C[1]),
                  (y = [[0, d, 0, h]]),
                  (m = []);
                while (y.length)
                  (S = y.pop()),
                    (t = S[0]),
                    (e = S[1]),
                    (r = S[2]),
                    (n = S[3]),
                    (k = b = this.findLongestMatch(t, e, r, n)),
                    (i = k[0]),
                    (l = k[1]),
                    (u = k[2]),
                    u &&
                      (m.push(b),
                      t < i && r < l && y.push([t, i, r, l]),
                      i + u < e && l + u < n && y.push([i + u, e, l + u, n]));
                for (m.sort(v), o = s = f = 0, g = [], w = 0, x = m.length; w < x; w++)
                  (E = m[w]),
                    (a = E[0]),
                    (c = E[1]),
                    (p = E[2]),
                    o + f === a && s + f === c
                      ? (f += p)
                      : (f && g.push([o, s, f]),
                        (O = [a, c, p]),
                        (o = O[0]),
                        (s = O[1]),
                        (f = O[2]));
                return f && g.push([o, s, f]), g.push([d, h, 0]), (this.matchingBlocks = g);
              }),
              (e.prototype.getOpcodes = function () {
                var e, t, n, r, i, o, a, l, s, c, u, f;
                if (this.opcodes) return this.opcodes;
                for (
                  r = i = 0,
                    this.opcodes = t = [],
                    c = this.getMatchingBlocks(),
                    l = 0,
                    s = c.length;
                  l < s;
                  l++
                )
                  (u = c[l]),
                    (e = u[0]),
                    (n = u[1]),
                    (o = u[2]),
                    (a = ''),
                    r < e && i < n
                      ? (a = 'replace')
                      : r < e
                      ? (a = 'delete')
                      : i < n && (a = 'insert'),
                    a && t.push([a, r, e, i, n]),
                    (f = [e + o, n + o]),
                    (r = f[0]),
                    (i = f[1]),
                    o && t.push(['equal', e, r, n, i]);
                return t;
              }),
              (e.prototype.getGroupedOpcodes = function (e) {
                var t, n, r, i, o, a, l, s, c, u, d, h, m, g, v;
                for (
                  null == e && (e = 3),
                    t = this.getOpcodes(),
                    t.length || (t = [['equal', 0, 1, 0, 1]]),
                    'equal' === t[0][0] &&
                      ((h = t[0]),
                      (c = h[0]),
                      (i = h[1]),
                      (o = h[2]),
                      (a = h[3]),
                      (l = h[4]),
                      (t[0] = [c, f(i, o - e), o, f(a, l - e), l])),
                    'equal' === t[t.length - 1][0] &&
                      ((m = t[t.length - 1]),
                      (c = m[0]),
                      (i = m[1]),
                      (o = m[2]),
                      (a = m[3]),
                      (l = m[4]),
                      (t[t.length - 1] = [c, i, p(o, i + e), a, p(l, a + e)])),
                    s = e + e,
                    r = [],
                    n = [],
                    u = 0,
                    d = t.length;
                  u < d;
                  u++
                )
                  (g = t[u]),
                    (c = g[0]),
                    (i = g[1]),
                    (o = g[2]),
                    (a = g[3]),
                    (l = g[4]),
                    'equal' === c &&
                      o - i > s &&
                      (n.push([c, i, p(o, i + e), a, p(l, a + e)]),
                      r.push(n),
                      (n = []),
                      (v = [f(i, o - e), f(a, l - e)]),
                      (i = v[0]),
                      (a = v[1])),
                    n.push([c, i, o, a, l]);
                return !n.length || (1 === n.length && 'equal' === n[0][0]) || r.push(n), r;
              }),
              (e.prototype.ratio = function () {
                var e, t, n, r, i;
                for (t = 0, i = this.getMatchingBlocks(), n = 0, r = i.length; n < r; n++)
                  (e = i[n]), (t += e[2]);
                return y(t, this.a.length + this.b.length);
              }),
              (e.prototype.quickRatio = function () {
                var e, t, n, r, i, o, a, l, s, c, u;
                if (!this.fullbcount)
                  for (this.fullbcount = n = {}, c = this.b, o = 0, l = c.length; o < l; o++)
                    (t = c[o]), (n[t] = (n[t] || 0) + 1);
                for (
                  n = this.fullbcount, e = {}, r = 0, u = this.a, a = 0, s = u.length;
                  a < s;
                  a++
                )
                  (t = u[a]), (i = C(e, t) ? e[t] : n[t] || 0), (e[t] = i - 1), i > 0 && r++;
                return y(r, this.a.length + this.b.length);
              }),
              (e.prototype.realQuickRatio = function () {
                var e, t, n;
                return (
                  (n = [this.a.length, this.b.length]), (e = n[0]), (t = n[1]), y(p(e, t), e + t)
                );
              }),
              e
            );
          })()),
          (u = function (e, t, n, i) {
            var o, l, s, c, u, f, p, d, h;
            if ((null == n && (n = 3), null == i && (i = 0.6), !(n > 0)))
              throw new Error('n must be > 0: (' + n + ')');
            if (!(0 <= i && i <= 1)) throw new Error('cutoff must be in [0.0, 1.0]: (' + i + ')');
            for (o = [], l = new a(), l.setSeq2(e), c = 0, f = t.length; c < f; c++)
              (s = t[c]),
                l.setSeq1(s),
                l.realQuickRatio() >= i &&
                  l.quickRatio() >= i &&
                  l.ratio() >= i &&
                  o.push([l.ratio(), s]);
            for (o = r.nlargest(o, n, v), h = [], u = 0, p = o.length; u < p; u++)
              (d = o[u]), d[0], (s = d[1]), h.push(s);
            return h;
          }),
          (b = function (e, t) {
            var n, r, i;
            (i = [0, e.length]), (n = i[0]), (r = i[1]);
            while (n < r && e[n] === t) n++;
            return n;
          }),
          (e = (function () {
            function e(e, t) {
              (this.linejunk = e), (this.charjunk = t);
            }
            return (
              (e.name = 'Differ'),
              (e.prototype.compare = function (e, t) {
                var n, r, i, o, l, s, c, u, f, p, d, h, m, g, v;
                for (
                  l = new a(this.linejunk, e, t), u = [], g = l.getOpcodes(), p = 0, h = g.length;
                  p < h;
                  p++
                ) {
                  switch (
                    ((v = g[p]), (f = v[0]), (r = v[1]), (n = v[2]), (o = v[3]), (i = v[4]), f)
                  ) {
                    case 'replace':
                      s = this._fancyReplace(e, r, n, t, o, i);
                      break;
                    case 'delete':
                      s = this._dump('-', e, r, n);
                      break;
                    case 'insert':
                      s = this._dump('+', t, o, i);
                      break;
                    case 'equal':
                      s = this._dump(' ', e, r, n);
                      break;
                    default:
                      throw new Error('unknow tag (' + f + ')');
                  }
                  for (d = 0, m = s.length; d < m; d++) (c = s[d]), u.push(c);
                }
                return u;
              }),
              (e.prototype._dump = function (e, t, n, r) {
                var i, o, a;
                for (a = [], i = o = n; n <= r ? o < r : o > r; i = n <= r ? ++o : --o)
                  a.push(e + ' ' + t[i]);
                return a;
              }),
              (e.prototype._plainReplace = function (e, t, n, r, i, o) {
                var a, s, c, u, f, p, d, h, m, g;
                for (
                  l(t < n && i < o),
                    o - i < n - t
                      ? ((a = this._dump('+', r, i, o)), (f = this._dump('-', e, t, n)))
                      : ((a = this._dump('-', e, t, n)), (f = this._dump('+', r, i, o))),
                    u = [],
                    g = [a, f],
                    p = 0,
                    h = g.length;
                  p < h;
                  p++
                )
                  for (s = g[p], d = 0, m = s.length; d < m; d++) (c = s[d]), u.push(c);
                return u;
              }),
              (e.prototype._fancyReplace = function (e, t, n, r, i, o) {
                var l,
                  s,
                  c,
                  u,
                  f,
                  p,
                  d,
                  h,
                  m,
                  g,
                  v,
                  y,
                  b,
                  w,
                  x,
                  C,
                  S,
                  k,
                  E,
                  O,
                  L,
                  T,
                  N,
                  M,
                  A,
                  j,
                  P,
                  I,
                  D,
                  _,
                  z,
                  R,
                  F,
                  H,
                  W,
                  B,
                  V,
                  U,
                  K,
                  q,
                  G,
                  Y,
                  Z,
                  $,
                  X,
                  J,
                  Q,
                  ee,
                  te;
                for (
                  V = [0.74, 0.75],
                    d = V[0],
                    x = V[1],
                    w = new a(this.charjunk),
                    U = [null, null],
                    C = U[0],
                    S = U[1],
                    N = [],
                    E = A = i;
                  i <= o ? A < o : A > o;
                  E = i <= o ? ++A : --A
                )
                  for (
                    g = r[E], w.setSeq2(g), k = j = t;
                    t <= n ? j < n : j > n;
                    k = t <= n ? ++j : --j
                  )
                    (s = e[k]),
                      s !== g
                        ? (w.setSeq1(s),
                          w.realQuickRatio() > d &&
                            w.quickRatio() > d &&
                            w.ratio() > d &&
                            ((Z = [w.ratio(), k, E]), (d = Z[0]), (h = Z[1]), (m = Z[2])))
                        : null === C && ((Y = [k, E]), (C = Y[0]), (S = Y[1]));
                if (d < x) {
                  if (null === C) {
                    for ($ = this._plainReplace(e, t, n, r, i, o), P = 0, D = $.length; P < D; P++)
                      (T = $[P]), N.push(T);
                    return N;
                  }
                  (X = [C, S, 1]), (h = X[0]), (m = X[1]), (d = X[2]);
                } else C = null;
                for (J = this._fancyHelper(e, t, h, r, i, m), I = 0, _ = J.length; I < _; I++)
                  (T = J[I]), N.push(T);
                if (((Q = [e[h], r[m]]), (l = Q[0]), (p = Q[1]), null === C)) {
                  for (
                    f = b = '', w.setSeqs(l, p), ee = w.getOpcodes(), H = 0, z = ee.length;
                    H < z;
                    H++
                  )
                    switch (
                      ((te = ee[H]),
                      (M = te[0]),
                      (c = te[1]),
                      (u = te[2]),
                      (v = te[3]),
                      (y = te[4]),
                      (K = [u - c, y - v]),
                      (O = K[0]),
                      (L = K[1]),
                      M)
                    ) {
                      case 'replace':
                        (f += Array(O + 1).join('^')), (b += Array(L + 1).join('^'));
                        break;
                      case 'delete':
                        f += Array(O + 1).join('-');
                        break;
                      case 'insert':
                        b += Array(L + 1).join('+');
                        break;
                      case 'equal':
                        (f += Array(O + 1).join(' ')), (b += Array(L + 1).join(' '));
                        break;
                      default:
                        throw new Error('unknow tag (' + M + ')');
                    }
                  for (q = this._qformat(l, p, f, b), W = 0, R = q.length; W < R; W++)
                    (T = q[W]), N.push(T);
                } else N.push('  ' + l);
                for (
                  G = this._fancyHelper(e, h + 1, n, r, m + 1, o), B = 0, F = G.length;
                  B < F;
                  B++
                )
                  (T = G[B]), N.push(T);
                return N;
              }),
              (e.prototype._fancyHelper = function (e, t, n, r, i, o) {
                var a;
                return (
                  (a = []),
                  t < n
                    ? (a = i < o ? this._fancyReplace(e, t, n, r, i, o) : this._dump('-', e, t, n))
                    : i < o && (a = this._dump('+', r, i, o)),
                  a
                );
              }),
              (e.prototype._qformat = function (e, t, n, r) {
                var i, o;
                return (
                  (o = []),
                  (i = p(b(e, '\t'), b(t, '\t'))),
                  (i = p(i, b(n.slice(0, i), ' '))),
                  (i = p(i, b(r.slice(0, i), ' '))),
                  (n = n.slice(i).replace(/\s+$/, '')),
                  (r = r.slice(i).replace(/\s+$/, '')),
                  o.push('- ' + e),
                  n.length && o.push('? ' + Array(i + 1).join('\t') + n + '\n'),
                  o.push('+ ' + t),
                  r.length && o.push('? ' + Array(i + 1).join('\t') + r + '\n'),
                  o
                );
              }),
              e
            );
          })()),
          (o = function (e, t) {
            return null == t && (t = /^\s*#?\s*$/), t.test(e);
          }),
          (i = function (e, t) {
            return null == t && (t = ' \t'), S.call(t, e) >= 0;
          }),
          (x = function (e, t) {
            var n, r;
            return (n = e + 1), (r = t - e), 1 === r ? '' + n : (r || n--, n + ',' + r);
          }),
          (m = function (e, t, n) {
            var r,
              i,
              o,
              l,
              s,
              c,
              u,
              f,
              p,
              d,
              h,
              m,
              g,
              v,
              y,
              b,
              w,
              C,
              S,
              k,
              E,
              O,
              L,
              T,
              N,
              M,
              A,
              j,
              P,
              I,
              D,
              _,
              z,
              R,
              F,
              H,
              W,
              B;
            for (
              _ = null != n ? n : {},
                s = _.fromfile,
                k = _.tofile,
                c = _.fromfiledate,
                E = _.tofiledate,
                b = _.n,
                y = _.lineterm,
                null == s && (s = ''),
                null == k && (k = ''),
                null == c && (c = ''),
                null == E && (E = ''),
                null == b && (b = 3),
                null == y && (y = '\n'),
                v = [],
                w = !1,
                z = new a(null, e, t).getGroupedOpcodes(),
                O = 0,
                M = z.length;
              O < M;
              O++
            )
              for (
                u = z[O],
                  w ||
                    ((w = !0),
                    (l = c ? '\t' + c : ''),
                    (S = E ? '\t' + E : ''),
                    v.push('--- ' + s + l + y),
                    v.push('+++ ' + k + S + y)),
                  R = [u[0], u[u.length - 1]],
                  o = R[0],
                  m = R[1],
                  r = x(o[1], m[2]),
                  i = x(o[3], m[4]),
                  v.push('@@ -' + r + ' +' + i + ' @@' + y),
                  L = 0,
                  A = u.length;
                L < A;
                L++
              )
                if (
                  ((F = u[L]),
                  (C = F[0]),
                  (f = F[1]),
                  (p = F[2]),
                  (d = F[3]),
                  (h = F[4]),
                  'equal' !== C)
                ) {
                  if ('replace' === C || 'delete' === C)
                    for (W = e.slice(f, p), N = 0, P = W.length; N < P; N++)
                      (g = W[N]), v.push('-' + g);
                  if ('replace' === C || 'insert' === C)
                    for (B = t.slice(d, h), D = 0, I = B.length; D < I; D++)
                      (g = B[D]), v.push('+' + g);
                } else
                  for (H = e.slice(f, p), T = 0, j = H.length; T < j; T++)
                    (g = H[T]), v.push(' ' + g);
            return v;
          }),
          (w = function (e, t) {
            var n, r;
            return (n = e + 1), (r = t - e), r || n--, r <= 1 ? '' + n : n + ',' + (n + r - 1);
          }),
          (s = function (e, t, n) {
            var r,
              i,
              o,
              l,
              s,
              c,
              u,
              f,
              p,
              d,
              h,
              m,
              v,
              y,
              b,
              x,
              C,
              S,
              k,
              E,
              O,
              L,
              T,
              N,
              M,
              A,
              j,
              P,
              I,
              D,
              _,
              z,
              R,
              F,
              H,
              W,
              B,
              V,
              U;
            for (
              R = null != n ? n : {},
                s = R.fromfile,
                O = R.tofile,
                c = R.fromfiledate,
                L = R.tofiledate,
                x = R.n,
                b = R.lineterm,
                null == s && (s = ''),
                null == O && (O = ''),
                null == c && (c = ''),
                null == L && (L = ''),
                null == x && (x = 3),
                null == b && (b = '\n'),
                C = { insert: '+ ', delete: '- ', replace: '! ', equal: '  ' },
                S = !1,
                y = [],
                F = new a(null, e, t).getGroupedOpcodes(),
                T = 0,
                j = F.length;
              T < j;
              T++
            )
              if (((u = F[T]), !S)) {
                if (
                  ((S = !0),
                  (l = c ? '\t' + c : ''),
                  (E = L ? '\t' + L : ''),
                  y.push('*** ' + s + l + b),
                  y.push('--- ' + O + E + b),
                  (H = [u[0], u[u.length - 1]]),
                  (o = H[0]),
                  (m = H[1]),
                  y.push('***************' + b),
                  (r = w(o[1], m[2])),
                  y.push('*** ' + r + ' ****' + b),
                  g(
                    (function () {
                      var e, t, n, r;
                      for (r = [], e = 0, t = u.length; e < t; e++)
                        (n = u[e]),
                          (k = n[0]),
                          n[1],
                          n[2],
                          n[3],
                          n[4],
                          r.push('replace' === k || 'delete' === k);
                      return r;
                    })(),
                  ))
                )
                  for (N = 0, P = u.length; N < P; N++)
                    if (
                      ((W = u[N]), (k = W[0]), (f = W[1]), (p = W[2]), W[3], W[4], 'insert' !== k)
                    )
                      for (B = e.slice(f, p), M = 0, I = B.length; M < I; M++)
                        (v = B[M]), y.push(C[k] + v);
                if (
                  ((i = w(o[3], m[4])),
                  y.push('--- ' + i + ' ----' + b),
                  g(
                    (function () {
                      var e, t, n, r;
                      for (r = [], e = 0, t = u.length; e < t; e++)
                        (n = u[e]),
                          (k = n[0]),
                          n[1],
                          n[2],
                          n[3],
                          n[4],
                          r.push('replace' === k || 'insert' === k);
                      return r;
                    })(),
                  ))
                )
                  for (A = 0, D = u.length; A < D; A++)
                    if (
                      ((V = u[A]), (k = V[0]), V[1], V[2], (d = V[3]), (h = V[4]), 'delete' !== k)
                    )
                      for (U = t.slice(d, h), z = 0, _ = U.length; z < _; z++)
                        (v = U[z]), y.push(C[k] + v);
              }
            return y;
          }),
          (d = function (t, n, r, o) {
            return null == o && (o = i), new e(r, o).compare(t, n);
          }),
          (h = function (e, t) {
            var n, r, i, o, a, l, s;
            if (((o = { 1: '- ', 2: '+ ' }[t]), !o))
              throw new Error('unknow delta choice (must be 1 or 2): ' + t);
            for (i = ['  ', o], r = [], a = 0, l = e.length; a < l; a++)
              (n = e[a]), (s = n.slice(0, 2)), S.call(i, s) >= 0 && r.push(n.slice(2));
            return r;
          }),
          (t._arrayCmp = v),
          (t.SequenceMatcher = a),
          (t.getCloseMatches = u),
          (t._countLeading = b),
          (t.Differ = e),
          (t.IS_LINE_JUNK = o),
          (t.IS_CHARACTER_JUNK = i),
          (t._formatRangeUnified = x),
          (t.unifiedDiff = m),
          (t._formatRangeContext = w),
          (t.contextDiff = s),
          (t.ndiff = d),
          (t.restore = h);
      }.call(this));
    },
    rn2K: function (e, t, n) {
      'use strict';
      var r;
      n.r(t),
        n.d(t, 'defaultDiff2HtmlConfig', function () {
          return pe;
        }),
        n.d(t, 'parse', function () {
          return de;
        }),
        n.d(t, 'html', function () {
          return he;
        }),
        (function (e) {
          (e['INSERT'] = 'insert'), (e['DELETE'] = 'delete'), (e['CONTEXT'] = 'context');
        })(r || (r = {}));
      var i = { LINE_BY_LINE: 'line-by-line', SIDE_BY_SIDE: 'side-by-side' },
        o = { LINES: 'lines', WORDS: 'words', NONE: 'none' },
        a = { WORD: 'word', CHAR: 'char' },
        l = ['-', '[', ']', '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|'],
        s = RegExp('[' + l.join('\\') + ']', 'g');
      function c(e) {
        return e.replace(s, '\\$&');
      }
      function u(e) {
        return e ? e.replace(/\\/g, '/') : e;
      }
      function f(e) {
        var t,
          n,
          r,
          i = 0;
        for (t = 0, r = e.length; t < r; t++)
          (n = e.charCodeAt(t)), (i = (i << 5) - i + n), (i |= 0);
        return i;
      }
      var p = function () {
        for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
        var r = Array(e),
          i = 0;
        for (t = 0; t < n; t++)
          for (var o = arguments[t], a = 0, l = o.length; a < l; a++, i++) r[i] = o[a];
        return r;
      };
      function d(e, t) {
        var n = e.split('.');
        return n.length > 1 ? n[n.length - 1] : t;
      }
      function h(e, t) {
        return t.reduce(function (t, n) {
          return t || e.startsWith(n);
        }, !1);
      }
      var m = ['a/', 'b/', 'i/', 'w/', 'c/', 'o/'];
      function g(e, t, n) {
        var r = void 0 !== n ? p(m, [n]) : m,
          i = t ? new RegExp('^' + c(t) + ' "?(.+?)"?$') : new RegExp('^"?(.+?)"?$'),
          o = i.exec(e) || [],
          a = o[1],
          l = void 0 === a ? '' : a,
          s = r.find(function (e) {
            return 0 === l.indexOf(e);
          }),
          u = s ? l.slice(s.length) : l;
        return u.replace(/\s+\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)? [+-]\d{4}.*$/, '');
      }
      function v(e, t) {
        return g(e, '---', t);
      }
      function y(e, t) {
        return g(e, '+++', t);
      }
      function b(e, t) {
        void 0 === t && (t = {});
        var n = [],
          i = null,
          o = null,
          a = null,
          l = null,
          s = null,
          c = null,
          u = null,
          f = '--- ',
          p = '+++ ',
          m = '@@',
          b = /^old mode (\d{6})/,
          w = /^new mode (\d{6})/,
          x = /^deleted file mode (\d{6})/,
          C = /^new file mode (\d{6})/,
          S = /^copy from "?(.+)"?/,
          k = /^copy to "?(.+)"?/,
          E = /^rename from "?(.+)"?/,
          O = /^rename to "?(.+)"?/,
          L = /^similarity index (\d+)%/,
          T = /^dissimilarity index (\d+)%/,
          N = /^index ([\da-z]+)\.\.([\da-z]+)\s*(\d{6})?/,
          M = /^Binary files (.*) and (.*) differ/,
          A = /^GIT binary patch/,
          j = /^index ([\da-z]+),([\da-z]+)\.\.([\da-z]+)/,
          P = /^mode (\d{6}),(\d{6})\.\.(\d{6})/,
          I = /^new file mode (\d{6})/,
          D = /^deleted file mode (\d{6}),(\d{6})/,
          _ = e
            .replace(/\\ No newline at end of file/g, '')
            .replace(/\r\n?/g, '\n')
            .split('\n');
        function z() {
          null !== o && null !== i && (i.blocks.push(o), (o = null));
        }
        function R() {
          null !== i &&
            (i.oldName || null === c || (i.oldName = c),
            i.newName || null === u || (i.newName = u),
            i.newName && (n.push(i), (i = null))),
            (c = null),
            (u = null);
        }
        function F() {
          z(), R(), (i = { blocks: [], deletedLines: 0, addedLines: 0 });
        }
        function H(e) {
          var t;
          z(),
            null !== i &&
              ((t = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@.*/.exec(e))
                ? ((i.isCombined = !1), (a = parseInt(t[1], 10)), (s = parseInt(t[2], 10)))
                : (t = /^@@@ -(\d+)(?:,\d+)? -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@@.*/.exec(e))
                ? ((i.isCombined = !0),
                  (a = parseInt(t[1], 10)),
                  (l = parseInt(t[2], 10)),
                  (s = parseInt(t[3], 10)))
                : (e.startsWith(m) && console.error('Failed to parse lines, starting in 0!'),
                  (a = 0),
                  (s = 0),
                  (i.isCombined = !1))),
            (o = { lines: [], oldStartLine: a, oldStartLine2: l, newStartLine: s, header: e });
        }
        function W(e) {
          if (null !== i && null !== o && null !== a && null !== s) {
            var t = { content: e },
              n = i.isCombined ? ['+ ', ' +', '++'] : ['+'],
              l = i.isCombined ? ['- ', ' -', '--'] : ['-'];
            h(e, n)
              ? (i.addedLines++, (t.type = r.INSERT), (t.oldNumber = void 0), (t.newNumber = s++))
              : h(e, l)
              ? (i.deletedLines++, (t.type = r.DELETE), (t.oldNumber = a++), (t.newNumber = void 0))
              : ((t.type = r.CONTEXT), (t.oldNumber = a++), (t.newNumber = s++)),
              o.lines.push(t);
          }
        }
        function B(e, t) {
          var n = t;
          while (n < _.length - 3) {
            if (e.startsWith('diff')) return !1;
            if (_[n].startsWith(f) && _[n + 1].startsWith(p) && _[n + 2].startsWith(m)) return !0;
            n++;
          }
          return !1;
        }
        return (
          _.forEach(function (e, n) {
            if (e && !e.startsWith('*')) {
              var r,
                a = _[n - 1],
                l = _[n + 1],
                s = _[n + 2];
              if (e.startsWith('diff')) {
                F();
                var h = /^diff --git "?(.+)"? "?(.+)"?/;
                if (
                  ((r = h.exec(e)) &&
                    ((c = g(r[1], void 0, t.dstPrefix)), (u = g(r[2], void 0, t.srcPrefix))),
                  null === i)
                )
                  throw new Error('Where is my file !!!');
                i.isGitDiff = !0;
              } else {
                if (
                  ((!i ||
                    (!i.isGitDiff && i && e.startsWith(f) && l.startsWith(p) && s.startsWith(m))) &&
                    F(),
                  (e.startsWith(f) && l.startsWith(p)) || (e.startsWith(p) && a.startsWith(f)))
                ) {
                  if (i && !i.oldName && e.startsWith('--- ') && (r = v(e, t.srcPrefix)))
                    return (i.oldName = r), void (i.language = d(i.oldName, i.language));
                  if (i && !i.newName && e.startsWith('+++ ') && (r = y(e, t.dstPrefix)))
                    return (i.newName = r), void (i.language = d(i.newName, i.language));
                }
                if (i && (e.startsWith(m) || (i.isGitDiff && i.oldName && i.newName && !o))) H(e);
                else if (o && (e.startsWith('+') || e.startsWith('-') || e.startsWith(' '))) W(e);
                else {
                  var z = !B(e, n);
                  if (null === i) throw new Error('Where is my file !!!');
                  (r = b.exec(e))
                    ? (i.oldMode = r[1])
                    : (r = w.exec(e))
                    ? (i.newMode = r[1])
                    : (r = x.exec(e))
                    ? ((i.deletedFileMode = r[1]), (i.isDeleted = !0))
                    : (r = C.exec(e))
                    ? ((i.newFileMode = r[1]), (i.isNew = !0))
                    : (r = S.exec(e))
                    ? (z && (i.oldName = r[1]), (i.isCopy = !0))
                    : (r = k.exec(e))
                    ? (z && (i.newName = r[1]), (i.isCopy = !0))
                    : (r = E.exec(e))
                    ? (z && (i.oldName = r[1]), (i.isRename = !0))
                    : (r = O.exec(e))
                    ? (z && (i.newName = r[1]), (i.isRename = !0))
                    : (r = M.exec(e))
                    ? ((i.isBinary = !0),
                      (i.oldName = g(r[1], void 0, t.srcPrefix)),
                      (i.newName = g(r[2], void 0, t.dstPrefix)),
                      H('Binary file'))
                    : A.test(e)
                    ? ((i.isBinary = !0), H(e))
                    : (r = L.exec(e))
                    ? (i.unchangedPercentage = parseInt(r[1], 10))
                    : (r = T.exec(e))
                    ? (i.changedPercentage = parseInt(r[1], 10))
                    : (r = N.exec(e))
                    ? ((i.checksumBefore = r[1]), (i.checksumAfter = r[2]), r[3] && (i.mode = r[3]))
                    : (r = j.exec(e))
                    ? ((i.checksumBefore = [r[2], r[3]]), (i.checksumAfter = r[1]))
                    : (r = P.exec(e))
                    ? ((i.oldMode = [r[2], r[3]]), (i.newMode = r[1]))
                    : (r = I.exec(e))
                    ? ((i.newFileMode = r[1]), (i.isNew = !0))
                    : (r = D.exec(e)) && ((i.deletedFileMode = r[1]), (i.isDeleted = !0));
                }
              }
            }
          }),
          z(),
          R(),
          n
        );
      }
      var w = n('v2jn');
      function x(e, t) {
        if (0 === e.length) return t.length;
        if (0 === t.length) return e.length;
        var n,
          r,
          i = [];
        for (n = 0; n <= t.length; n++) i[n] = [n];
        for (r = 0; r <= e.length; r++) i[0][r] = r;
        for (n = 1; n <= t.length; n++)
          for (r = 1; r <= e.length; r++)
            t.charAt(n - 1) === e.charAt(r - 1)
              ? (i[n][r] = i[n - 1][r - 1])
              : (i[n][r] = Math.min(
                  i[n - 1][r - 1] + 1,
                  Math.min(i[n][r - 1] + 1, i[n - 1][r] + 1),
                ));
        return i[t.length][e.length];
      }
      function C(e) {
        return function (t, n) {
          var r = e(t).trim(),
            i = e(n).trim(),
            o = x(r, i);
          return o / (r.length + i.length);
        };
      }
      function S(e) {
        function t(t, n, r) {
          void 0 === r && (r = new Map());
          for (var i, o = 1 / 0, a = 0; a < t.length; ++a)
            for (var l = 0; l < n.length; ++l) {
              var s = JSON.stringify([t[a], n[l]]),
                c = void 0;
              (r.has(s) && (c = r.get(s))) || ((c = e(t[a], n[l])), r.set(s, c)),
                c < o && ((o = c), (i = { indexA: a, indexB: l, score: o }));
            }
          return i;
        }
        function n(e, r, i, o) {
          void 0 === i && (i = 0), void 0 === o && (o = new Map());
          var a = t(e, r, o);
          if (!a || e.length + r.length < 3) return [[e, r]];
          var l = e.slice(0, a.indexA),
            s = r.slice(0, a.indexB),
            c = [e[a.indexA]],
            u = [r[a.indexB]],
            f = a.indexA + 1,
            p = a.indexB + 1,
            d = e.slice(f),
            h = r.slice(p),
            m = n(l, s, i + 1, o),
            g = n(c, u, i + 1, o),
            v = n(d, h, i + 1, o),
            y = g;
          return (
            (a.indexA > 0 || a.indexB > 0) && (y = m.concat(y)),
            (e.length > f || r.length > p) && (y = y.concat(v)),
            y
          );
        }
        return n;
      }
      var k = function () {
          return (
            (k =
              Object.assign ||
              function (e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                  for (var i in ((t = arguments[n]), t))
                    Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e;
              }),
            k.apply(this, arguments)
          );
        },
        E = {
          INSERTS: 'd2h-ins',
          DELETES: 'd2h-del',
          CONTEXT: 'd2h-cntx',
          INFO: 'd2h-info',
          INSERT_CHANGES: 'd2h-ins d2h-change',
          DELETE_CHANGES: 'd2h-del d2h-change',
        },
        O = {
          matching: o.NONE,
          matchWordsThreshold: 0.25,
          maxLineLengthHighlight: 1e4,
          diffStyle: a.WORD,
        },
        L = '/',
        T = C(function (e) {
          return e.value;
        }),
        N = S(T);
      function M(e) {
        return -1 !== e.indexOf('dev/null');
      }
      function A(e) {
        return e.replace(/(<ins[^>]*>((.|\n)*?)<\/ins>)/g, '');
      }
      function j(e) {
        return e.replace(/(<del[^>]*>((.|\n)*?)<\/del>)/g, '');
      }
      function P(e) {
        switch (e) {
          case r.CONTEXT:
            return E.CONTEXT;
          case r.INSERT:
            return E.INSERTS;
          case r.DELETE:
            return E.DELETES;
        }
      }
      function I(e) {
        return e ? 2 : 1;
      }
      function D(e) {
        return e
          .slice(0)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
      function _(e, t, n) {
        void 0 === n && (n = !0);
        var r = I(t);
        return { prefix: e.substring(0, r), content: n ? D(e.substring(r)) : e.substring(r) };
      }
      function z(e) {
        var t = u(e.oldName),
          n = u(e.newName);
        if (t === n || M(t) || M(n)) return M(n) ? t : n;
        var r = [],
          i = [],
          o = t.split(L),
          a = n.split(L),
          l = o.length,
          s = a.length,
          c = 0,
          f = l - 1,
          p = s - 1;
        while (c < f && c < p) {
          if (o[c] !== a[c]) break;
          r.push(a[c]), (c += 1);
        }
        while (f > c && p > c) {
          if (o[f] !== a[p]) break;
          i.unshift(a[p]), (f -= 1), (p -= 1);
        }
        var d = r.join(L),
          h = i.join(L),
          m = o.slice(c, f + 1).join(L),
          g = a.slice(c, p + 1).join(L);
        return d.length && h.length
          ? d + L + '{' + m + ' \u2192 ' + g + '}' + L + h
          : d.length
          ? d + L + '{' + m + ' \u2192 ' + g + '}'
          : h.length
          ? '{' + m + ' \u2192 ' + g + '}' + L + h
          : t + ' \u2192 ' + n;
      }
      function R(e) {
        return 'd2h-' + f(z(e)).toString().slice(-6);
      }
      function F(e) {
        var t = 'file-changed';
        return (
          e.isRename || e.isCopy
            ? (t = 'file-renamed')
            : e.isNew
            ? (t = 'file-added')
            : e.isDeleted
            ? (t = 'file-deleted')
            : e.newName !== e.oldName && (t = 'file-renamed'),
          t
        );
      }
      function H(e, t, n, r) {
        void 0 === r && (r = {});
        var i = k(k({}, O), r),
          o = i.matching,
          a = i.maxLineLengthHighlight,
          l = i.matchWordsThreshold,
          s = i.diffStyle,
          c = _(e, n, !1),
          u = _(t, n, !1);
        if (c.content.length > a || u.content.length > a)
          return {
            oldLine: { prefix: c.prefix, content: c.content },
            newLine: { prefix: u.prefix, content: u.content },
          };
        var f =
            'char' === s
              ? w['diffChars'](c.content, u.content)
              : w['diffWordsWithSpace'](c.content, u.content),
          p = [];
        if ('word' === s && 'words' === o) {
          var d = f.filter(function (e) {
              return e.removed;
            }),
            h = f.filter(function (e) {
              return e.added;
            }),
            m = N(h, d);
          m.forEach(function (e) {
            if (1 === e[0].length && 1 === e[1].length) {
              var t = T(e[0][0], e[1][0]);
              t < l && (p.push(e[0][0]), p.push(e[1][0]));
            }
          });
        }
        var g = f.reduce(function (e, t) {
          var n = t.added ? 'ins' : t.removed ? 'del' : null,
            r = p.indexOf(t) > -1 ? ' class="d2h-change"' : '',
            i = D(t.value);
          return null !== n ? e + '<' + n + r + '>' + i + '</' + n + '>' : '' + e + i;
        }, '');
        return {
          oldLine: { prefix: c.prefix, content: A(g) },
          newLine: { prefix: u.prefix, content: j(g) },
        };
      }
      var W = 'file-summary',
        B = 'icon';
      function V(e, t) {
        var n = e
          .map(function (e) {
            return t.render(
              W,
              'line',
              {
                fileHtmlId: R(e),
                oldName: e.oldName,
                newName: e.newName,
                fileName: z(e),
                deletedLines: '-' + e.deletedLines,
                addedLines: '+' + e.addedLines,
              },
              { fileIcon: t.template(B, F(e)) },
            );
          })
          .join('\n');
        return t.render(W, 'wrapper', { filesNumber: e.length, files: n });
      }
      var U = function () {
          return (
            (U =
              Object.assign ||
              function (e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                  for (var i in ((t = arguments[n]), t))
                    Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e;
              }),
            U.apply(this, arguments)
          );
        },
        K = U(U({}, O), {
          renderNothingWhenEmpty: !1,
          matchingMaxComparisons: 2500,
          maxLineSizeInBlockForComparison: 200,
        }),
        q = 'generic',
        G = 'line-by-line',
        Y = 'icon',
        Z = 'tag',
        $ = (function () {
          function e(e, t) {
            void 0 === t && (t = {}), (this.hoganUtils = e), (this.config = U(U({}, K), t));
          }
          return (
            (e.prototype.render = function (e) {
              var t = this,
                n = e
                  .map(function (e) {
                    var n;
                    return (
                      (n = e.blocks.length ? t.generateFileHtml(e) : t.generateEmptyDiff()),
                      t.makeFileDiffHtml(e, n)
                    );
                  })
                  .join('\n');
              return this.hoganUtils.render(q, 'wrapper', { content: n });
            }),
            (e.prototype.makeFileDiffHtml = function (e, t) {
              if (
                this.config.renderNothingWhenEmpty &&
                Array.isArray(e.blocks) &&
                0 === e.blocks.length
              )
                return '';
              var n = this.hoganUtils.template(G, 'file-diff'),
                r = this.hoganUtils.template(q, 'file-path'),
                i = this.hoganUtils.template(Y, 'file'),
                o = this.hoganUtils.template(Z, F(e));
              return n.render({
                file: e,
                fileHtmlId: R(e),
                diffs: t,
                filePath: r.render({ fileDiffName: z(e) }, { fileIcon: i, fileTag: o }),
              });
            }),
            (e.prototype.generateEmptyDiff = function () {
              return this.hoganUtils.render(q, 'empty-diff', {
                contentClass: 'd2h-code-line',
                CSSLineClass: E,
              });
            }),
            (e.prototype.generateFileHtml = function (e) {
              var t = this,
                n = S(
                  C(function (t) {
                    return _(t.content, e.isCombined).content;
                  }),
                );
              return e.blocks
                .map(function (r) {
                  var i = t.hoganUtils.render(q, 'block-header', {
                    CSSLineClass: E,
                    blockHeader: r.header,
                    lineClass: 'd2h-code-linenumber',
                    contentClass: 'd2h-code-line',
                  });
                  return (
                    t.applyLineGroupping(r).forEach(function (r) {
                      var o = r[0],
                        a = r[1],
                        l = r[2];
                      if (a.length && l.length && !o.length)
                        t.applyRematchMatching(a, l, n).map(function (n) {
                          var r = n[0],
                            o = n[1],
                            a = t.processChangedLines(e.isCombined, r, o),
                            l = a.left,
                            s = a.right;
                          (i += l), (i += s);
                        });
                      else if (o.length)
                        o.forEach(function (n) {
                          var r = _(n.content, e.isCombined),
                            o = r.prefix,
                            a = r.content;
                          i += t.generateSingleLineHtml({
                            type: E.CONTEXT,
                            prefix: o,
                            content: a,
                            oldNumber: n.oldNumber,
                            newNumber: n.newNumber,
                          });
                        });
                      else if (a.length || l.length) {
                        var s = t.processChangedLines(e.isCombined, a, l),
                          c = s.left,
                          u = s.right;
                        (i += c), (i += u);
                      } else
                        console.error(
                          'Unknown state reached while processing groups of lines',
                          o,
                          a,
                          l,
                        );
                    }),
                    i
                  );
                })
                .join('\n');
            }),
            (e.prototype.applyLineGroupping = function (e) {
              for (var t = [], n = [], i = [], o = 0; o < e.lines.length; o++) {
                var a = e.lines[o];
                ((a.type !== r.INSERT && i.length) || (a.type === r.CONTEXT && n.length > 0)) &&
                  (t.push([[], n, i]), (n = []), (i = [])),
                  a.type === r.CONTEXT
                    ? t.push([[a], [], []])
                    : a.type === r.INSERT && 0 === n.length
                    ? t.push([[], [], [a]])
                    : a.type === r.INSERT && n.length > 0
                    ? i.push(a)
                    : a.type === r.DELETE && n.push(a);
              }
              return (n.length || i.length) && (t.push([[], n, i]), (n = []), (i = [])), t;
            }),
            (e.prototype.applyRematchMatching = function (e, t, n) {
              var r = e.length * t.length,
                i = Math.max.apply(
                  null,
                  [0].concat(
                    e.concat(t).map(function (e) {
                      return e.content.length;
                    }),
                  ),
                ),
                o =
                  r < this.config.matchingMaxComparisons &&
                  i < this.config.maxLineSizeInBlockForComparison &&
                  ('lines' === this.config.matching || 'words' === this.config.matching);
              return o ? n(e, t) : [[e, t]];
            }),
            (e.prototype.processChangedLines = function (e, t, n) {
              for (
                var r = { right: '', left: '' }, i = Math.max(t.length, n.length), o = 0;
                o < i;
                o++
              ) {
                var a = t[o],
                  l = n[o],
                  s =
                    void 0 !== a && void 0 !== l ? H(a.content, l.content, e, this.config) : void 0,
                  c =
                    void 0 !== a && void 0 !== a.oldNumber
                      ? U(
                          U(
                            {},
                            void 0 !== s
                              ? {
                                  prefix: s.oldLine.prefix,
                                  content: s.oldLine.content,
                                  type: E.DELETE_CHANGES,
                                }
                              : U(U({}, _(a.content, e)), { type: P(a.type) }),
                          ),
                          { oldNumber: a.oldNumber, newNumber: a.newNumber },
                        )
                      : void 0,
                  u =
                    void 0 !== l && void 0 !== l.newNumber
                      ? U(
                          U(
                            {},
                            void 0 !== s
                              ? {
                                  prefix: s.newLine.prefix,
                                  content: s.newLine.content,
                                  type: E.INSERT_CHANGES,
                                }
                              : U(U({}, _(l.content, e)), { type: P(l.type) }),
                          ),
                          { oldNumber: l.oldNumber, newNumber: l.newNumber },
                        )
                      : void 0,
                  f = this.generateLineHtml(c, u),
                  p = f.left,
                  d = f.right;
                (r.left += p), (r.right += d);
              }
              return r;
            }),
            (e.prototype.generateLineHtml = function (e, t) {
              return {
                left: this.generateSingleLineHtml(e),
                right: this.generateSingleLineHtml(t),
              };
            }),
            (e.prototype.generateSingleLineHtml = function (e) {
              if (void 0 === e) return '';
              var t = this.hoganUtils.render(G, 'numbers', {
                oldNumber: e.oldNumber || '',
                newNumber: e.newNumber || '',
              });
              return this.hoganUtils.render(q, 'line', {
                type: e.type,
                lineClass: 'd2h-code-linenumber',
                contentClass: 'd2h-code-line',
                prefix: ' ' === e.prefix ? '&nbsp;' : e.prefix,
                content: e.content,
                lineNumber: t,
              });
            }),
            e
          );
        })(),
        X = $,
        J = function () {
          return (
            (J =
              Object.assign ||
              function (e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                  for (var i in ((t = arguments[n]), t))
                    Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e;
              }),
            J.apply(this, arguments)
          );
        },
        Q = J(J({}, O), {
          renderNothingWhenEmpty: !1,
          matchingMaxComparisons: 2500,
          maxLineSizeInBlockForComparison: 200,
        }),
        ee = 'generic',
        te = 'side-by-side',
        ne = 'icon',
        re = 'tag',
        ie = (function () {
          function e(e, t) {
            void 0 === t && (t = {}), (this.hoganUtils = e), (this.config = J(J({}, Q), t));
          }
          return (
            (e.prototype.render = function (e) {
              var t = this,
                n = e
                  .map(function (e) {
                    var n;
                    return (
                      (n = e.blocks.length ? t.generateFileHtml(e) : t.generateEmptyDiff()),
                      t.makeFileDiffHtml(e, n)
                    );
                  })
                  .join('\n');
              return this.hoganUtils.render(ee, 'wrapper', { content: n });
            }),
            (e.prototype.makeFileDiffHtml = function (e, t) {
              if (
                this.config.renderNothingWhenEmpty &&
                Array.isArray(e.blocks) &&
                0 === e.blocks.length
              )
                return '';
              var n = this.hoganUtils.template(te, 'file-diff'),
                r = this.hoganUtils.template(ee, 'file-path'),
                i = this.hoganUtils.template(ne, 'file'),
                o = this.hoganUtils.template(re, F(e));
              return n.render({
                file: e,
                fileHtmlId: R(e),
                diffs: t,
                filePath: r.render({ fileDiffName: z(e) }, { fileIcon: i, fileTag: o }),
              });
            }),
            (e.prototype.generateEmptyDiff = function () {
              return {
                right: '',
                left: this.hoganUtils.render(ee, 'empty-diff', {
                  contentClass: 'd2h-code-side-line',
                  CSSLineClass: E,
                }),
              };
            }),
            (e.prototype.generateFileHtml = function (e) {
              var t = this,
                n = S(
                  C(function (t) {
                    return _(t.content, e.isCombined).content;
                  }),
                );
              return e.blocks
                .map(function (r) {
                  var i = { left: t.makeHeaderHtml(r.header), right: t.makeHeaderHtml('') };
                  return (
                    t.applyLineGroupping(r).forEach(function (r) {
                      var o = r[0],
                        a = r[1],
                        l = r[2];
                      if (a.length && l.length && !o.length)
                        t.applyRematchMatching(a, l, n).map(function (n) {
                          var r = n[0],
                            o = n[1],
                            a = t.processChangedLines(e.isCombined, r, o),
                            l = a.left,
                            s = a.right;
                          (i.left += l), (i.right += s);
                        });
                      else if (o.length)
                        o.forEach(function (n) {
                          var r = _(n.content, e.isCombined),
                            o = r.prefix,
                            a = r.content,
                            l = t.generateLineHtml(
                              { type: E.CONTEXT, prefix: o, content: a, number: n.oldNumber },
                              { type: E.CONTEXT, prefix: o, content: a, number: n.newNumber },
                            ),
                            s = l.left,
                            c = l.right;
                          (i.left += s), (i.right += c);
                        });
                      else if (a.length || l.length) {
                        var s = t.processChangedLines(e.isCombined, a, l),
                          c = s.left,
                          u = s.right;
                        (i.left += c), (i.right += u);
                      } else
                        console.error(
                          'Unknown state reached while processing groups of lines',
                          o,
                          a,
                          l,
                        );
                    }),
                    i
                  );
                })
                .reduce(
                  function (e, t) {
                    return { left: e.left + t.left, right: e.right + t.right };
                  },
                  { left: '', right: '' },
                );
            }),
            (e.prototype.applyLineGroupping = function (e) {
              for (var t = [], n = [], i = [], o = 0; o < e.lines.length; o++) {
                var a = e.lines[o];
                ((a.type !== r.INSERT && i.length) || (a.type === r.CONTEXT && n.length > 0)) &&
                  (t.push([[], n, i]), (n = []), (i = [])),
                  a.type === r.CONTEXT
                    ? t.push([[a], [], []])
                    : a.type === r.INSERT && 0 === n.length
                    ? t.push([[], [], [a]])
                    : a.type === r.INSERT && n.length > 0
                    ? i.push(a)
                    : a.type === r.DELETE && n.push(a);
              }
              return (n.length || i.length) && (t.push([[], n, i]), (n = []), (i = [])), t;
            }),
            (e.prototype.applyRematchMatching = function (e, t, n) {
              var r = e.length * t.length,
                i = Math.max.apply(
                  null,
                  [0].concat(
                    e.concat(t).map(function (e) {
                      return e.content.length;
                    }),
                  ),
                ),
                o =
                  r < this.config.matchingMaxComparisons &&
                  i < this.config.maxLineSizeInBlockForComparison &&
                  ('lines' === this.config.matching || 'words' === this.config.matching);
              return o ? n(e, t) : [[e, t]];
            }),
            (e.prototype.makeHeaderHtml = function (e) {
              return this.hoganUtils.render(ee, 'block-header', {
                CSSLineClass: E,
                blockHeader: e,
                lineClass: 'd2h-code-side-linenumber',
                contentClass: 'd2h-code-side-line',
              });
            }),
            (e.prototype.processChangedLines = function (e, t, n) {
              for (
                var r = { right: '', left: '' }, i = Math.max(t.length, n.length), o = 0;
                o < i;
                o++
              ) {
                var a = t[o],
                  l = n[o],
                  s =
                    void 0 !== a && void 0 !== l ? H(a.content, l.content, e, this.config) : void 0,
                  c =
                    void 0 !== a && void 0 !== a.oldNumber
                      ? J(
                          J(
                            {},
                            void 0 !== s
                              ? {
                                  prefix: s.oldLine.prefix,
                                  content: s.oldLine.content,
                                  type: E.DELETE_CHANGES,
                                }
                              : J(J({}, _(a.content, e)), { type: P(a.type) }),
                          ),
                          { number: a.oldNumber },
                        )
                      : void 0,
                  u =
                    void 0 !== l && void 0 !== l.newNumber
                      ? J(
                          J(
                            {},
                            void 0 !== s
                              ? {
                                  prefix: s.newLine.prefix,
                                  content: s.newLine.content,
                                  type: E.INSERT_CHANGES,
                                }
                              : J(J({}, _(l.content, e)), { type: P(l.type) }),
                          ),
                          { number: l.newNumber },
                        )
                      : void 0,
                  f = this.generateLineHtml(c, u),
                  p = f.left,
                  d = f.right;
                (r.left += p), (r.right += d);
              }
              return r;
            }),
            (e.prototype.generateLineHtml = function (e, t) {
              return { left: this.generateSingleHtml(e), right: this.generateSingleHtml(t) };
            }),
            (e.prototype.generateSingleHtml = function (e) {
              var t = 'd2h-code-side-linenumber',
                n = 'd2h-code-side-line';
              return this.hoganUtils.render(ee, 'line', {
                type:
                  (null === e || void 0 === e ? void 0 : e.type) ||
                  E.CONTEXT + ' d2h-emptyplaceholder',
                lineClass: void 0 !== e ? t : t + ' d2h-code-side-emptyplaceholder',
                contentClass: void 0 !== e ? n : n + ' d2h-code-side-emptyplaceholder',
                prefix:
                  ' ' === (null === e || void 0 === e ? void 0 : e.prefix)
                    ? '&nbsp;'
                    : null === e || void 0 === e
                    ? void 0
                    : e.prefix,
                content: null === e || void 0 === e ? void 0 : e.content,
                lineNumber: null === e || void 0 === e ? void 0 : e.number,
              });
            }),
            e
          );
        })(),
        oe = ie,
        ae = n('Ruv9'),
        le = {};
      (le['file-summary-line'] = new ae['Template']({
        code: function (e, t, n) {
          var r = this;
          return (
            r.b((n = n || '')),
            r.b('<li class="d2h-file-list-line">'),
            r.b('\n' + n),
            r.b('    <span class="d2h-file-name-wrapper">'),
            r.b('\n' + n),
            r.b(r.rp('<fileIcon0', e, t, '      ')),
            r.b('      <a href="#'),
            r.b(r.v(r.f('fileHtmlId', e, t, 0))),
            r.b('" class="d2h-file-name">'),
            r.b(r.v(r.f('fileName', e, t, 0))),
            r.b('</a>'),
            r.b('\n' + n),
            r.b('      <span class="d2h-file-stats">'),
            r.b('\n' + n),
            r.b('          <span class="d2h-lines-added">'),
            r.b(r.v(r.f('addedLines', e, t, 0))),
            r.b('</span>'),
            r.b('\n' + n),
            r.b('          <span class="d2h-lines-deleted">'),
            r.b(r.v(r.f('deletedLines', e, t, 0))),
            r.b('</span>'),
            r.b('\n' + n),
            r.b('      </span>'),
            r.b('\n' + n),
            r.b('    </span>'),
            r.b('\n' + n),
            r.b('</li>'),
            r.fl()
          );
        },
        partials: { '<fileIcon0': { name: 'fileIcon', partials: {}, subs: {} } },
        subs: {},
      })),
        (le['file-summary-wrapper'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<div class="d2h-file-list-wrapper">'),
              r.b('\n' + n),
              r.b('    <div class="d2h-file-list-header">'),
              r.b('\n' + n),
              r.b('        <span class="d2h-file-list-title">Files changed ('),
              r.b(r.v(r.f('filesNumber', e, t, 0))),
              r.b(')</span>'),
              r.b('\n' + n),
              r.b('        <a class="d2h-file-switch d2h-hide">hide</a>'),
              r.b('\n' + n),
              r.b('        <a class="d2h-file-switch d2h-show">show</a>'),
              r.b('\n' + n),
              r.b('    </div>'),
              r.b('\n' + n),
              r.b('    <ol class="d2h-file-list">'),
              r.b('\n' + n),
              r.b('    '),
              r.b(r.t(r.f('files', e, t, 0))),
              r.b('\n' + n),
              r.b('    </ol>'),
              r.b('\n' + n),
              r.b('</div>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['generic-block-header'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<tr>'),
              r.b('\n' + n),
              r.b('    <td class="'),
              r.b(r.v(r.f('lineClass', e, t, 0))),
              r.b(' '),
              r.b(r.v(r.d('CSSLineClass.INFO', e, t, 0))),
              r.b('"></td>'),
              r.b('\n' + n),
              r.b('    <td class="'),
              r.b(r.v(r.d('CSSLineClass.INFO', e, t, 0))),
              r.b('">'),
              r.b('\n' + n),
              r.b('        <div class="'),
              r.b(r.v(r.f('contentClass', e, t, 0))),
              r.b(' '),
              r.b(r.v(r.d('CSSLineClass.INFO', e, t, 0))),
              r.b('">'),
              r.b(r.t(r.f('blockHeader', e, t, 0))),
              r.b('</div>'),
              r.b('\n' + n),
              r.b('    </td>'),
              r.b('\n' + n),
              r.b('</tr>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['generic-empty-diff'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<tr>'),
              r.b('\n' + n),
              r.b('    <td class="'),
              r.b(r.v(r.d('CSSLineClass.INFO', e, t, 0))),
              r.b('">'),
              r.b('\n' + n),
              r.b('        <div class="'),
              r.b(r.v(r.f('contentClass', e, t, 0))),
              r.b(' '),
              r.b(r.v(r.d('CSSLineClass.INFO', e, t, 0))),
              r.b('">'),
              r.b('\n' + n),
              r.b('            File without changes'),
              r.b('\n' + n),
              r.b('        </div>'),
              r.b('\n' + n),
              r.b('    </td>'),
              r.b('\n' + n),
              r.b('</tr>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['generic-file-path'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<span class="d2h-file-name-wrapper">'),
              r.b('\n' + n),
              r.b(r.rp('<fileIcon0', e, t, '    ')),
              r.b('    <span class="d2h-file-name">'),
              r.b(r.v(r.f('fileDiffName', e, t, 0))),
              r.b('</span>'),
              r.b('\n' + n),
              r.b(r.rp('<fileTag1', e, t, '    ')),
              r.b('</span>'),
              r.fl()
            );
          },
          partials: {
            '<fileIcon0': { name: 'fileIcon', partials: {}, subs: {} },
            '<fileTag1': { name: 'fileTag', partials: {}, subs: {} },
          },
          subs: {},
        })),
        (le['generic-line'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<tr>'),
              r.b('\n' + n),
              r.b('    <td class="'),
              r.b(r.v(r.f('lineClass', e, t, 0))),
              r.b(' '),
              r.b(r.v(r.f('type', e, t, 0))),
              r.b('">'),
              r.b('\n' + n),
              r.b('      '),
              r.b(r.t(r.f('lineNumber', e, t, 0))),
              r.b('\n' + n),
              r.b('    </td>'),
              r.b('\n' + n),
              r.b('    <td class="'),
              r.b(r.v(r.f('type', e, t, 0))),
              r.b('">'),
              r.b('\n' + n),
              r.b('        <div class="'),
              r.b(r.v(r.f('contentClass', e, t, 0))),
              r.b(' '),
              r.b(r.v(r.f('type', e, t, 0))),
              r.b('">'),
              r.b('\n' + n),
              r.s(r.f('prefix', e, t, 1), e, t, 0, 171, 247, '{{ }}') &&
                (r.rs(e, t, function (e, t, r) {
                  r.b('            <span class="d2h-code-line-prefix">'),
                    r.b(r.t(r.f('prefix', e, t, 0))),
                    r.b('</span>'),
                    r.b('\n' + n);
                }),
                e.pop()),
              r.s(r.f('prefix', e, t, 1), e, t, 1, 0, 0, '') ||
                (r.b('            <span class="d2h-code-line-prefix">&nbsp;</span>'),
                r.b('\n' + n)),
              r.s(r.f('content', e, t, 1), e, t, 0, 380, 454, '{{ }}') &&
                (r.rs(e, t, function (e, t, r) {
                  r.b('            <span class="d2h-code-line-ctn">'),
                    r.b(r.t(r.f('content', e, t, 0))),
                    r.b('</span>'),
                    r.b('\n' + n);
                }),
                e.pop()),
              r.s(r.f('content', e, t, 1), e, t, 1, 0, 0, '') ||
                (r.b('            <span class="d2h-code-line-ctn"><br></span>'), r.b('\n' + n)),
              r.b('        </div>'),
              r.b('\n' + n),
              r.b('    </td>'),
              r.b('\n' + n),
              r.b('</tr>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['generic-wrapper'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<div class="d2h-wrapper">'),
              r.b('\n' + n),
              r.b('    '),
              r.b(r.t(r.f('content', e, t, 0))),
              r.b('\n' + n),
              r.b('</div>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['icon-file-added'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b(
                '<svg aria-hidden="true" class="d2h-icon d2h-added" height="16" title="added" version="1.1" viewBox="0 0 14 16"',
              ),
              r.b('\n' + n),
              r.b('     width="14">'),
              r.b('\n' + n),
              r.b(
                '    <path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM6 9H3V7h3V4h2v3h3v2H8v3H6V9z"></path>',
              ),
              r.b('\n' + n),
              r.b('</svg>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['icon-file-changed'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b(
                '<svg aria-hidden="true" class="d2h-icon d2h-changed" height="16" title="modified" version="1.1"',
              ),
              r.b('\n' + n),
              r.b('     viewBox="0 0 14 16" width="14">'),
              r.b('\n' + n),
              r.b(
                '    <path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM4 8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"></path>',
              ),
              r.b('\n' + n),
              r.b('</svg>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['icon-file-deleted'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b(
                '<svg aria-hidden="true" class="d2h-icon d2h-deleted" height="16" title="removed" version="1.1"',
              ),
              r.b('\n' + n),
              r.b('     viewBox="0 0 14 16" width="14">'),
              r.b('\n' + n),
              r.b(
                '    <path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM11 9H3V7h8v2z"></path>',
              ),
              r.b('\n' + n),
              r.b('</svg>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['icon-file-renamed'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b(
                '<svg aria-hidden="true" class="d2h-icon d2h-moved" height="16" title="renamed" version="1.1"',
              ),
              r.b('\n' + n),
              r.b('     viewBox="0 0 14 16" width="14">'),
              r.b('\n' + n),
              r.b(
                '    <path d="M6 9H3V7h3V4l5 4-5 4V9z m8-7v12c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h12c0.55 0 1 0.45 1 1z m-1 0H1v12h12V2z"></path>',
              ),
              r.b('\n' + n),
              r.b('</svg>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['icon-file'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b(
                '<svg aria-hidden="true" class="d2h-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12">',
              ),
              r.b('\n' + n),
              r.b(
                '    <path d="M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z"></path>',
              ),
              r.b('\n' + n),
              r.b('</svg>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['line-by-line-file-diff'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<div id="'),
              r.b(r.v(r.f('fileHtmlId', e, t, 0))),
              r.b('" class="d2h-file-wrapper" data-lang="'),
              r.b(r.v(r.d('file.language', e, t, 0))),
              r.b('">'),
              r.b('\n' + n),
              r.b('    <div class="d2h-file-header">'),
              r.b('\n' + n),
              r.b('    '),
              r.b(r.t(r.f('filePath', e, t, 0))),
              r.b('\n' + n),
              r.b('    </div>'),
              r.b('\n' + n),
              r.b('    <div class="d2h-file-diff">'),
              r.b('\n' + n),
              r.b('        <div class="d2h-code-wrapper">'),
              r.b('\n' + n),
              r.b('            <table class="d2h-diff-table">'),
              r.b('\n' + n),
              r.b('                <tbody class="d2h-diff-tbody">'),
              r.b('\n' + n),
              r.b('                '),
              r.b(r.t(r.f('diffs', e, t, 0))),
              r.b('\n' + n),
              r.b('                </tbody>'),
              r.b('\n' + n),
              r.b('            </table>'),
              r.b('\n' + n),
              r.b('        </div>'),
              r.b('\n' + n),
              r.b('    </div>'),
              r.b('\n' + n),
              r.b('</div>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['line-by-line-numbers'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<div class="line-num1">'),
              r.b(r.v(r.f('oldNumber', e, t, 0))),
              r.b('</div>'),
              r.b('\n' + n),
              r.b('<div class="line-num2">'),
              r.b(r.v(r.f('newNumber', e, t, 0))),
              r.b('</div>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['side-by-side-file-diff'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<div id="'),
              r.b(r.v(r.f('fileHtmlId', e, t, 0))),
              r.b('" class="d2h-file-wrapper" data-lang="'),
              r.b(r.v(r.d('file.language', e, t, 0))),
              r.b('">'),
              r.b('\n' + n),
              r.b('    <div class="d2h-file-header">'),
              r.b('\n' + n),
              r.b('      '),
              r.b(r.t(r.f('filePath', e, t, 0))),
              r.b('\n' + n),
              r.b('    </div>'),
              r.b('\n' + n),
              r.b('    <div class="d2h-files-diff">'),
              r.b('\n' + n),
              r.b('        <div class="d2h-file-side-diff">'),
              r.b('\n' + n),
              r.b('            <div class="d2h-code-wrapper">'),
              r.b('\n' + n),
              r.b('                <table class="d2h-diff-table">'),
              r.b('\n' + n),
              r.b('                    <tbody class="d2h-diff-tbody">'),
              r.b('\n' + n),
              r.b('                    '),
              r.b(r.t(r.d('diffs.left', e, t, 0))),
              r.b('\n' + n),
              r.b('                    </tbody>'),
              r.b('\n' + n),
              r.b('                </table>'),
              r.b('\n' + n),
              r.b('            </div>'),
              r.b('\n' + n),
              r.b('        </div>'),
              r.b('\n' + n),
              r.b('        <div class="d2h-file-side-diff">'),
              r.b('\n' + n),
              r.b('            <div class="d2h-code-wrapper">'),
              r.b('\n' + n),
              r.b('                <table class="d2h-diff-table">'),
              r.b('\n' + n),
              r.b('                    <tbody class="d2h-diff-tbody">'),
              r.b('\n' + n),
              r.b('                    '),
              r.b(r.t(r.d('diffs.right', e, t, 0))),
              r.b('\n' + n),
              r.b('                    </tbody>'),
              r.b('\n' + n),
              r.b('                </table>'),
              r.b('\n' + n),
              r.b('            </div>'),
              r.b('\n' + n),
              r.b('        </div>'),
              r.b('\n' + n),
              r.b('    </div>'),
              r.b('\n' + n),
              r.b('</div>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['tag-file-added'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<span class="d2h-tag d2h-added d2h-added-tag">ADDED</span>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['tag-file-changed'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<span class="d2h-tag d2h-changed d2h-changed-tag">CHANGED</span>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['tag-file-deleted'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<span class="d2h-tag d2h-deleted d2h-deleted-tag">DELETED</span>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        })),
        (le['tag-file-renamed'] = new ae['Template']({
          code: function (e, t, n) {
            var r = this;
            return (
              r.b((n = n || '')),
              r.b('<span class="d2h-tag d2h-moved d2h-moved-tag">RENAMED</span>'),
              r.fl()
            );
          },
          partials: {},
          subs: {},
        }));
      var se = function () {
          return (
            (se =
              Object.assign ||
              function (e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                  for (var i in ((t = arguments[n]), t))
                    Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e;
              }),
            se.apply(this, arguments)
          );
        },
        ce = (function () {
          function e(e) {
            var t = e.compiledTemplates,
              n = void 0 === t ? {} : t,
              r = e.rawTemplates,
              i = void 0 === r ? {} : r,
              o = Object.entries(i).reduce(function (e, t) {
                var n,
                  r = t[0],
                  i = t[1],
                  o = ae['compile'](i, { asString: !1 });
                return se(se({}, e), ((n = {}), (n[r] = o), n));
              }, {});
            this.preCompiledTemplates = se(se(se({}, le), n), o);
          }
          return (
            (e.compile = function (e) {
              return ae['compile'](e, { asString: !1 });
            }),
            (e.prototype.render = function (e, t, n, r, i) {
              var o = this.templateKey(e, t);
              try {
                var a = this.preCompiledTemplates[o];
                return a.render(n, r, i);
              } catch (l) {
                throw new Error("Could not find template to render '" + o + "'");
              }
            }),
            (e.prototype.template = function (e, t) {
              return this.preCompiledTemplates[this.templateKey(e, t)];
            }),
            (e.prototype.templateKey = function (e, t) {
              return e + '-' + t;
            }),
            e
          );
        })(),
        ue = ce,
        fe = function () {
          return (
            (fe =
              Object.assign ||
              function (e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                  for (var i in ((t = arguments[n]), t))
                    Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e;
              }),
            fe.apply(this, arguments)
          );
        },
        pe = fe(fe(fe({}, K), Q), { outputFormat: i.LINE_BY_LINE, drawFileList: !0 });
      function de(e, t) {
        return void 0 === t && (t = {}), b(e, fe(fe({}, pe), t));
      }
      function he(e, t) {
        void 0 === t && (t = {});
        var n = fe(fe({}, pe), t),
          r = 'string' === typeof e ? b(e, n) : e,
          i = new ue(n),
          o = n.drawFileList ? V(r, i) : '',
          a = 'side-by-side' === n.outputFormat ? new oe(i, n).render(r) : new X(i, n).render(r);
        return o + a;
      }
    },
    rzV7: function (e, t, n) {
      'use strict';
      var r = Object.prototype.hasOwnProperty;
      function i(e, t) {
        return e === t ? 0 !== e || 0 !== t || 1 / e === 1 / t : e !== e && t !== t;
      }
      function o(e, t) {
        if (i(e, t)) return !0;
        if ('object' !== typeof e || null === e || 'object' !== typeof t || null === t) return !1;
        var n = Object.keys(e),
          o = Object.keys(t);
        if (n.length !== o.length) return !1;
        for (var a = 0; a < n.length; a++) if (!r.call(t, n[a]) || !i(e[n[a]], t[n[a]])) return !1;
        return !0;
      }
      e.exports = o;
    },
    tvlV: function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = {
          icon: {
            tag: 'svg',
            attrs: { viewBox: '64 64 896 896', focusable: 'false' },
            children: [
              {
                tag: 'path',
                attrs: {
                  d:
                    'M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM496 208H312c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 544h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H312c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm328 244a40 40 0 1080 0 40 40 0 10-80 0z',
                },
              },
            ],
          },
          name: 'hdd',
          theme: 'outlined',
        },
        o = i,
        a = n('6VBw'),
        l = function (e, t) {
          return r['createElement'](a['a'], Object.assign({}, e, { ref: t, icon: o }));
        };
      l.displayName = 'HddOutlined';
      t['a'] = r['forwardRef'](l);
    },
    uWVv: function (e, t, n) {
      !(function (t, r) {
        e.exports = r(n('17x9'), n('q1tI'), n('VrN/'));
      })(window, function (e, t, n) {
        return (function (e) {
          var t = {};
          function n(r) {
            if (t[r]) return t[r].exports;
            var i = (t[r] = { i: r, l: !1, exports: {} });
            return e[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
          }
          return (
            (n.m = e),
            (n.c = t),
            (n.d = function (e, t, r) {
              n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
            }),
            (n.r = function (e) {
              'undefined' != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
                Object.defineProperty(e, '__esModule', { value: !0 });
            }),
            (n.t = function (e, t) {
              if ((1 & t && (e = n(e)), 8 & t)) return e;
              if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
              var r = Object.create(null);
              if (
                (n.r(r),
                Object.defineProperty(r, 'default', { enumerable: !0, value: e }),
                2 & t && 'string' != typeof e)
              )
                for (var i in e)
                  n.d(
                    r,
                    i,
                    function (t) {
                      return e[t];
                    }.bind(null, i),
                  );
              return r;
            }),
            (n.n = function (e) {
              var t =
                e && e.__esModule
                  ? function () {
                      return e.default;
                    }
                  : function () {
                      return e;
                    };
              return n.d(t, 'a', t), t;
            }),
            (n.o = function (e, t) {
              return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (n.p = ''),
            n((n.s = 8))
          );
        })([
          function (e, t) {
            e.exports = function (e) {
              var t = 'undefined' != typeof window && window.location;
              if (!t) throw new Error('fixUrls requires window.location');
              if (!e || 'string' != typeof e) return e;
              var n = t.protocol + '//' + t.host,
                r = n + t.pathname.replace(/\/[^\/]*$/, '/');
              return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (
                e,
                t,
              ) {
                var i,
                  o = t
                    .trim()
                    .replace(/^"(.*)"$/, function (e, t) {
                      return t;
                    })
                    .replace(/^'(.*)'$/, function (e, t) {
                      return t;
                    });
                return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o)
                  ? e
                  : ((i =
                      0 === o.indexOf('//')
                        ? o
                        : 0 === o.indexOf('/')
                        ? n + o
                        : r + o.replace(/^\.\//, '')),
                    'url(' + JSON.stringify(i) + ')');
              });
            };
          },
          function (e, t, n) {
            var r,
              i,
              o = {},
              a =
                ((r = function () {
                  return window && document && document.all && !window.atob;
                }),
                function () {
                  return void 0 === i && (i = r.apply(this, arguments)), i;
                }),
              l = (function (e) {
                var t = {};
                return function (e) {
                  return (
                    void 0 === t[e] &&
                      (t[e] = function (e) {
                        return document.querySelector(e);
                      }.call(this, e)),
                    t[e]
                  );
                };
              })(),
              s = null,
              c = 0,
              u = [],
              f = n(0);
            function p(e, t) {
              for (var n = 0; n < e.length; n++) {
                var r = e[n],
                  i = o[r.id];
                if (i) {
                  i.refs++;
                  for (var a = 0; a < i.parts.length; a++) i.parts[a](r.parts[a]);
                  for (; a < r.parts.length; a++) i.parts.push(y(r.parts[a], t));
                } else {
                  var l = [];
                  for (a = 0; a < r.parts.length; a++) l.push(y(r.parts[a], t));
                  o[r.id] = { id: r.id, refs: 1, parts: l };
                }
              }
            }
            function d(e, t) {
              for (var n = [], r = {}, i = 0; i < e.length; i++) {
                var o = e[i],
                  a = t.base ? o[0] + t.base : o[0],
                  l = { css: o[1], media: o[2], sourceMap: o[3] };
                r[a] ? r[a].parts.push(l) : n.push((r[a] = { id: a, parts: [l] }));
              }
              return n;
            }
            function h(e, t) {
              var n = l(e.insertInto);
              if (!n)
                throw new Error(
                  "Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.",
                );
              var r = u[u.length - 1];
              if ('top' === e.insertAt)
                r
                  ? r.nextSibling
                    ? n.insertBefore(t, r.nextSibling)
                    : n.appendChild(t)
                  : n.insertBefore(t, n.firstChild),
                  u.push(t);
              else {
                if ('bottom' !== e.insertAt)
                  throw new Error(
                    "Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.",
                  );
                n.appendChild(t);
              }
            }
            function m(e) {
              if (null === e.parentNode) return !1;
              e.parentNode.removeChild(e);
              var t = u.indexOf(e);
              t >= 0 && u.splice(t, 1);
            }
            function g(e) {
              var t = document.createElement('style');
              return (e.attrs.type = 'text/css'), v(t, e.attrs), h(e, t), t;
            }
            function v(e, t) {
              Object.keys(t).forEach(function (n) {
                e.setAttribute(n, t[n]);
              });
            }
            function y(e, t) {
              var n, r, i, o;
              if (t.transform && e.css) {
                if (!(o = t.transform(e.css))) return function () {};
                e.css = o;
              }
              if (t.singleton) {
                var a = c++;
                (n = s || (s = g(t))), (r = x.bind(null, n, a, !1)), (i = x.bind(null, n, a, !0));
              } else
                e.sourceMap &&
                'function' == typeof URL &&
                'function' == typeof URL.createObjectURL &&
                'function' == typeof URL.revokeObjectURL &&
                'function' == typeof Blob &&
                'function' == typeof btoa
                  ? ((n = (function (e) {
                      var t = document.createElement('link');
                      return (
                        (e.attrs.type = 'text/css'),
                        (e.attrs.rel = 'stylesheet'),
                        v(t, e.attrs),
                        h(e, t),
                        t
                      );
                    })(t)),
                    (r = function (e, t, n) {
                      var r = n.css,
                        i = n.sourceMap,
                        o = void 0 === t.convertToAbsoluteUrls && i;
                      (t.convertToAbsoluteUrls || o) && (r = f(r)),
                        i &&
                          (r +=
                            '\n/*# sourceMappingURL=data:application/json;base64,' +
                            btoa(unescape(encodeURIComponent(JSON.stringify(i)))) +
                            ' */');
                      var a = new Blob([r], { type: 'text/css' }),
                        l = e.href;
                      (e.href = URL.createObjectURL(a)), l && URL.revokeObjectURL(l);
                    }.bind(null, n, t)),
                    (i = function () {
                      m(n), n.href && URL.revokeObjectURL(n.href);
                    }))
                  : ((n = g(t)),
                    (r = function (e, t) {
                      var n = t.css,
                        r = t.media;
                      if ((r && e.setAttribute('media', r), e.styleSheet)) e.styleSheet.cssText = n;
                      else {
                        for (; e.firstChild; ) e.removeChild(e.firstChild);
                        e.appendChild(document.createTextNode(n));
                      }
                    }.bind(null, n)),
                    (i = function () {
                      m(n);
                    }));
              return (
                r(e),
                function (t) {
                  if (t) {
                    if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap)
                      return;
                    r((e = t));
                  } else i();
                }
              );
            }
            e.exports = function (e, t) {
              if ('undefined' != typeof DEBUG && DEBUG && 'object' != typeof document)
                throw new Error('The style-loader cannot be used in a non-browser environment');
              ((t = t || {}).attrs = 'object' == typeof t.attrs ? t.attrs : {}),
                t.singleton || (t.singleton = a()),
                t.insertInto || (t.insertInto = 'head'),
                t.insertAt || (t.insertAt = 'bottom');
              var n = d(e, t);
              return (
                p(n, t),
                function (e) {
                  for (var r = [], i = 0; i < n.length; i++) {
                    var a = n[i];
                    (l = o[a.id]).refs--, r.push(l);
                  }
                  for (e && p(d(e, t), t), i = 0; i < r.length; i++) {
                    var l;
                    if (0 === (l = r[i]).refs) {
                      for (var s = 0; s < l.parts.length; s++) l.parts[s]();
                      delete o[l.id];
                    }
                  }
                }
              );
            };
            var b,
              w =
                ((b = []),
                function (e, t) {
                  return (b[e] = t), b.filter(Boolean).join('\n');
                });
            function x(e, t, n, r) {
              var i = n ? '' : r.css;
              if (e.styleSheet) e.styleSheet.cssText = w(t, i);
              else {
                var o = document.createTextNode(i),
                  a = e.childNodes;
                a[t] && e.removeChild(a[t]), a.length ? e.insertBefore(o, a[t]) : e.appendChild(o);
              }
            }
          },
          function (e, t) {
            e.exports = function (e) {
              var t = [];
              return (
                (t.toString = function () {
                  return this.map(function (t) {
                    var n = (function (e, t) {
                      var n,
                        r = e[1] || '',
                        i = e[3];
                      if (!i) return r;
                      if (t && 'function' == typeof btoa) {
                        var o =
                            ((n = i),
                            '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
                              btoa(unescape(encodeURIComponent(JSON.stringify(n)))) +
                              ' */'),
                          a = i.sources.map(function (e) {
                            return '/*# sourceURL=' + i.sourceRoot + e + ' */';
                          });
                        return [r].concat(a).concat([o]).join('\n');
                      }
                      return [r].join('\n');
                    })(t, e);
                    return t[2] ? '@media ' + t[2] + '{' + n + '}' : n;
                  }).join('');
                }),
                (t.i = function (e, n) {
                  'string' == typeof e && (e = [[null, e, '']]);
                  for (var r = {}, i = 0; i < this.length; i++) {
                    var o = this[i][0];
                    'number' == typeof o && (r[o] = !0);
                  }
                  for (i = 0; i < e.length; i++) {
                    var a = e[i];
                    ('number' == typeof a[0] && r[a[0]]) ||
                      (n && !a[2] ? (a[2] = n) : n && (a[2] = '(' + a[2] + ') and (' + n + ')'),
                      t.push(a));
                  }
                }),
                t
              );
            };
          },
          function (e, t, n) {
            (e.exports = n(2)(!1)).push([
              e.i,
              "/* BASICS */\n\n.CodeMirror {\n  /* Set height, width, borders, and global font properties here */\n  font-family: monospace;\n  height: 300px;\n  color: black;\n  direction: ltr;\n}\n\n/* PADDING */\n\n.CodeMirror-lines {\n  padding: 4px 0; /* Vertical padding around content */\n}\n.CodeMirror pre {\n  padding: 0 4px; /* Horizontal padding of content */\n}\n\n.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  background-color: white; /* The little square between H and V scrollbars */\n}\n\n/* GUTTER */\n\n.CodeMirror-gutters {\n  border-right: 1px solid #ddd;\n  background-color: #f7f7f7;\n  white-space: nowrap;\n}\n.CodeMirror-linenumbers {}\n.CodeMirror-linenumber {\n  padding: 0 3px 0 5px;\n  min-width: 20px;\n  text-align: right;\n  color: #999;\n  white-space: nowrap;\n}\n\n.CodeMirror-guttermarker { color: black; }\n.CodeMirror-guttermarker-subtle { color: #999; }\n\n/* CURSOR */\n\n.CodeMirror-cursor {\n  border-left: 1px solid black;\n  border-right: none;\n  width: 0;\n}\n/* Shown when moving in bi-directional text */\n.CodeMirror div.CodeMirror-secondarycursor {\n  border-left: 1px solid silver;\n}\n.cm-fat-cursor .CodeMirror-cursor {\n  width: auto;\n  border: 0 !important;\n  background: #7e7;\n}\n.cm-fat-cursor div.CodeMirror-cursors {\n  z-index: 1;\n}\n.cm-fat-cursor-mark {\n  background-color: rgba(20, 255, 20, 0.5);\n  -webkit-animation: blink 1.06s steps(1) infinite;\n  -moz-animation: blink 1.06s steps(1) infinite;\n  animation: blink 1.06s steps(1) infinite;\n}\n.cm-animate-fat-cursor {\n  width: auto;\n  border: 0;\n  -webkit-animation: blink 1.06s steps(1) infinite;\n  -moz-animation: blink 1.06s steps(1) infinite;\n  animation: blink 1.06s steps(1) infinite;\n  background-color: #7e7;\n}\n@-moz-keyframes blink {\n  0% {}\n  50% { background-color: transparent; }\n  100% {}\n}\n@-webkit-keyframes blink {\n  0% {}\n  50% { background-color: transparent; }\n  100% {}\n}\n@keyframes blink {\n  0% {}\n  50% { background-color: transparent; }\n  100% {}\n}\n\n/* Can style cursor different in overwrite (non-insert) mode */\n.CodeMirror-overwrite .CodeMirror-cursor {}\n\n.cm-tab { display: inline-block; text-decoration: inherit; }\n\n.CodeMirror-rulers {\n  position: absolute;\n  left: 0; right: 0; top: -50px; bottom: -20px;\n  overflow: hidden;\n}\n.CodeMirror-ruler {\n  border-left: 1px solid #ccc;\n  top: 0; bottom: 0;\n  position: absolute;\n}\n\n/* DEFAULT THEME */\n\n.cm-s-default .cm-header {color: blue;}\n.cm-s-default .cm-quote {color: #090;}\n.cm-negative {color: #d44;}\n.cm-positive {color: #292;}\n.cm-header, .cm-strong {font-weight: bold;}\n.cm-em {font-style: italic;}\n.cm-link {text-decoration: underline;}\n.cm-strikethrough {text-decoration: line-through;}\n\n.cm-s-default .cm-keyword {color: #708;}\n.cm-s-default .cm-atom {color: #219;}\n.cm-s-default .cm-number {color: #164;}\n.cm-s-default .cm-def {color: #00f;}\n.cm-s-default .cm-variable,\n.cm-s-default .cm-punctuation,\n.cm-s-default .cm-property,\n.cm-s-default .cm-operator {}\n.cm-s-default .cm-variable-2 {color: #05a;}\n.cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}\n.cm-s-default .cm-comment {color: #a50;}\n.cm-s-default .cm-string {color: #a11;}\n.cm-s-default .cm-string-2 {color: #f50;}\n.cm-s-default .cm-meta {color: #555;}\n.cm-s-default .cm-qualifier {color: #555;}\n.cm-s-default .cm-builtin {color: #30a;}\n.cm-s-default .cm-bracket {color: #997;}\n.cm-s-default .cm-tag {color: #170;}\n.cm-s-default .cm-attribute {color: #00c;}\n.cm-s-default .cm-hr {color: #999;}\n.cm-s-default .cm-link {color: #00c;}\n\n.cm-s-default .cm-error {color: #f00;}\n.cm-invalidchar {color: #f00;}\n\n.CodeMirror-composing { border-bottom: 2px solid; }\n\n/* Default styles for common addons */\n\ndiv.CodeMirror span.CodeMirror-matchingbracket {color: #0b0;}\ndiv.CodeMirror span.CodeMirror-nonmatchingbracket {color: #a22;}\n.CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }\n.CodeMirror-activeline-background {background: #e8f2ff;}\n\n/* STOP */\n\n/* The rest of this file contains styles related to the mechanics of\n   the editor. You probably shouldn't touch them. */\n\n.CodeMirror {\n  position: relative;\n  overflow: hidden;\n  background: white;\n}\n\n.CodeMirror-scroll {\n  overflow: scroll !important; /* Things will break if this is overridden */\n  /* 30px is the magic margin used to hide the element's real scrollbars */\n  /* See overflow: hidden in .CodeMirror */\n  margin-bottom: -30px; margin-right: -30px;\n  padding-bottom: 30px;\n  height: 100%;\n  outline: none; /* Prevent dragging from highlighting the element */\n  position: relative;\n}\n.CodeMirror-sizer {\n  position: relative;\n  border-right: 30px solid transparent;\n}\n\n/* The fake, visible scrollbars. Used to force redraw during scrolling\n   before actual scrolling happens, thus preventing shaking and\n   flickering artifacts. */\n.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  position: absolute;\n  z-index: 6;\n  display: none;\n}\n.CodeMirror-vscrollbar {\n  right: 0; top: 0;\n  overflow-x: hidden;\n  overflow-y: scroll;\n}\n.CodeMirror-hscrollbar {\n  bottom: 0; left: 0;\n  overflow-y: hidden;\n  overflow-x: scroll;\n}\n.CodeMirror-scrollbar-filler {\n  right: 0; bottom: 0;\n}\n.CodeMirror-gutter-filler {\n  left: 0; bottom: 0;\n}\n\n.CodeMirror-gutters {\n  position: absolute; left: 0; top: 0;\n  min-height: 100%;\n  z-index: 3;\n}\n.CodeMirror-gutter {\n  white-space: normal;\n  height: 100%;\n  display: inline-block;\n  vertical-align: top;\n  margin-bottom: -30px;\n}\n.CodeMirror-gutter-wrapper {\n  position: absolute;\n  z-index: 4;\n  background: none !important;\n  border: none !important;\n}\n.CodeMirror-gutter-background {\n  position: absolute;\n  top: 0; bottom: 0;\n  z-index: 4;\n}\n.CodeMirror-gutter-elt {\n  position: absolute;\n  cursor: default;\n  z-index: 4;\n}\n.CodeMirror-gutter-wrapper ::selection { background-color: transparent }\n.CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }\n\n.CodeMirror-lines {\n  cursor: text;\n  min-height: 1px; /* prevents collapsing before first draw */\n}\n.CodeMirror pre {\n  /* Reset some styles that the rest of the page might have set */\n  -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;\n  border-width: 0;\n  background: transparent;\n  font-family: inherit;\n  font-size: inherit;\n  margin: 0;\n  white-space: pre;\n  word-wrap: normal;\n  line-height: inherit;\n  color: inherit;\n  z-index: 2;\n  position: relative;\n  overflow: visible;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-font-variant-ligatures: contextual;\n  font-variant-ligatures: contextual;\n}\n.CodeMirror-wrap pre {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  word-break: normal;\n}\n\n.CodeMirror-linebackground {\n  position: absolute;\n  left: 0; right: 0; top: 0; bottom: 0;\n  z-index: 0;\n}\n\n.CodeMirror-linewidget {\n  position: relative;\n  z-index: 2;\n  padding: 0.1px; /* Force widget margins to stay inside of the container */\n}\n\n.CodeMirror-widget {}\n\n.CodeMirror-rtl pre { direction: rtl; }\n\n.CodeMirror-code {\n  outline: none;\n}\n\n/* Force content-box sizing for the elements where we expect it */\n.CodeMirror-scroll,\n.CodeMirror-sizer,\n.CodeMirror-gutter,\n.CodeMirror-gutters,\n.CodeMirror-linenumber {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n\n.CodeMirror-measure {\n  position: absolute;\n  width: 100%;\n  height: 0;\n  overflow: hidden;\n  visibility: hidden;\n}\n\n.CodeMirror-cursor {\n  position: absolute;\n  pointer-events: none;\n}\n.CodeMirror-measure pre { position: static; }\n\ndiv.CodeMirror-cursors {\n  visibility: hidden;\n  position: relative;\n  z-index: 3;\n}\ndiv.CodeMirror-dragcursors {\n  visibility: visible;\n}\n\n.CodeMirror-focused div.CodeMirror-cursors {\n  visibility: visible;\n}\n\n.CodeMirror-selected { background: #d9d9d9; }\n.CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }\n.CodeMirror-crosshair { cursor: crosshair; }\n.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }\n.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }\n\n.cm-searching {\n  background-color: #ffa;\n  background-color: rgba(255, 255, 0, .4);\n}\n\n/* Used to force a border model for a node */\n.cm-force-border { padding-right: .1px; }\n\n@media print {\n  /* Hide the cursor when printing */\n  .CodeMirror div.CodeMirror-cursors {\n    visibility: hidden;\n  }\n}\n\n/* See issue #2901 */\n.cm-tab-wrap-hack:after { content: ''; }\n\n/* Help users use markselection to safely style text background */\nspan.CodeMirror-selectedtext { background: none; }\n",
              '',
            ]);
          },
          function (e, t, n) {
            var r = n(3);
            'string' == typeof r && (r = [[e.i, r, '']]);
            var i = { transform: void 0 };
            n(1)(r, i), r.locals && (e.exports = r.locals);
          },
          function (t, n) {
            t.exports = e;
          },
          function (e, n) {
            e.exports = t;
          },
          function (e, t) {
            e.exports = n;
          },
          function (e, t, n) {
            'use strict';
            Object.defineProperty(t, '__esModule', { value: !0 });
            var r =
                'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e &&
                        'function' == typeof Symbol &&
                        e.constructor === Symbol &&
                        e !== Symbol.prototype
                        ? 'symbol'
                        : typeof e;
                    },
              i = (function () {
                function e(e, t) {
                  for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    (r.enumerable = r.enumerable || !1),
                      (r.configurable = !0),
                      'value' in r && (r.writable = !0),
                      Object.defineProperty(e, r.key, r);
                  }
                }
                return function (t, n, r) {
                  return n && e(t.prototype, n), r && e(t, r), t;
                };
              })(),
              o = c(n(7)),
              a = n(6),
              l = c(a),
              s = c(n(5));
            function c(e) {
              return e && e.__esModule ? e : { default: e };
            }
            n(4);
            var u = (function (e) {
              function t(e) {
                !(function (e, t) {
                  if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
                })(this, t);
                var n = (function (e, t) {
                  if (!e)
                    throw new ReferenceError(
                      "this hasn't been initialised - super() hasn't been called",
                    );
                  return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
                })(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                return (
                  (n.getEventHandleFromProps = function () {
                    var e = {};
                    return (
                      Object.keys(n.props)
                        .filter(function (e) {
                          return /^on+/.test(e);
                        })
                        .forEach(function (t) {
                          e[t] = t.replace(/^on[A-Z]/g, function (e) {
                            return e.slice(2).toLowerCase();
                          });
                        }),
                      e
                    );
                  }),
                  (n.codemirror = null),
                  (n.editor = null),
                  n
                );
              }
              return (
                (function (e, t) {
                  if ('function' != typeof t && null !== t)
                    throw new TypeError(
                      'Super expression must either be null or a function, not ' + typeof t,
                    );
                  (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                  })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
                })(t, a.Component),
                i(t, [
                  {
                    key: 'componentDidMount',
                    value: function () {
                      var e = this;
                      (this.editor = o.default.fromTextArea(this.textarea, this.props.options)),
                        (this.codemirror = o.default);
                      var t = this.getEventHandleFromProps();
                      Object.keys(t).forEach(function (n) {
                        e.editor.on(t[n], e.props[n]);
                      });
                      var n = this.props,
                        r = n.value,
                        i = n.width,
                        a = n.height;
                      this.editor.setValue(r || ''), (i || a) && this.editor.setSize(i, a);
                    },
                  },
                  {
                    key: 'componentWillReceiveProps',
                    value: function (e) {
                      var t = this,
                        n = this.editor.getValue(),
                        i = e.value;
                      void 0 !== i &&
                        i !== this.props.value &&
                        i !== n &&
                        this.editor.setValue(e.value);
                      var o = e.options,
                        a = e.width,
                        l = e.height;
                      'object' === (void 0 === o ? 'undefined' : r(o)) &&
                        Object.keys(o).forEach(function (e) {
                          JSON.stringify(t.props.options[e]) !== JSON.stringify(o[e]) &&
                            t.editor.setOption(e, o[e]);
                        }),
                        (a === this.props.width && l === this.props.height) ||
                          this.editor.setSize(a, l);
                    },
                  },
                  {
                    key: 'componentWillUnmount',
                    value: function () {
                      this.editor && this.editor.toTextArea();
                    },
                  },
                  {
                    key: 'render',
                    value: function () {
                      var e = this;
                      return l.default.createElement('textarea', {
                        ref: function (t) {
                          e.textarea = t;
                        },
                      });
                    },
                  },
                ]),
                t
              );
            })();
            (u.defaultProps = { value: '', options: {}, width: null, height: null }),
              (u.propTypes = {
                value: s.default.string,
                options: s.default.object,
                width: function (e, t, n) {
                  var r = e[t];
                  if (null !== r && 'number' != typeof r && 'string' != typeof r)
                    return new Error(
                      'Invalid prop `' + t + '` supplied to `' + n + '`. Validation failed.',
                    );
                },
                height: function (e, t, n) {
                  var r = e[t];
                  if (null !== r && 'number' != typeof r && 'string' != typeof r)
                    return new Error(
                      'Invalid prop `' + t + '` supplied to `' + n + '`. Validation failed.',
                    );
                },
              }),
              (t.default = u),
              (e.exports = t.default);
          },
        ]);
      });
    },
    v2jn: function (e, t, n) {
      (function (e, n) {
        n(t);
      })(0, function (e) {
        'use strict';
        function t() {}
        function n(e, t, n, r, i) {
          for (var o = 0, a = t.length, l = 0, s = 0; o < a; o++) {
            var c = t[o];
            if (c.removed) {
              if (
                ((c.value = e.join(r.slice(s, s + c.count))), (s += c.count), o && t[o - 1].added)
              ) {
                var u = t[o - 1];
                (t[o - 1] = t[o]), (t[o] = u);
              }
            } else {
              if (!c.added && i) {
                var f = n.slice(l, l + c.count);
                (f = f.map(function (e, t) {
                  var n = r[s + t];
                  return n.length > e.length ? n : e;
                })),
                  (c.value = e.join(f));
              } else c.value = e.join(n.slice(l, l + c.count));
              (l += c.count), c.added || (s += c.count);
            }
          }
          var p = t[a - 1];
          return (
            a > 1 &&
              'string' === typeof p.value &&
              (p.added || p.removed) &&
              e.equals('', p.value) &&
              ((t[a - 2].value += p.value), t.pop()),
            t
          );
        }
        function r(e) {
          return { newPos: e.newPos, components: e.components.slice(0) };
        }
        t.prototype = {
          diff: function (e, t) {
            var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
              o = i.callback;
            'function' === typeof i && ((o = i), (i = {})), (this.options = i);
            var a = this;
            function l(e) {
              return o
                ? (setTimeout(function () {
                    o(void 0, e);
                  }, 0),
                  !0)
                : e;
            }
            (e = this.castInput(e)),
              (t = this.castInput(t)),
              (e = this.removeEmpty(this.tokenize(e))),
              (t = this.removeEmpty(this.tokenize(t)));
            var s = t.length,
              c = e.length,
              u = 1,
              f = s + c,
              p = [{ newPos: -1, components: [] }],
              d = this.extractCommon(p[0], t, e, 0);
            if (p[0].newPos + 1 >= s && d + 1 >= c)
              return l([{ value: this.join(t), count: t.length }]);
            function h() {
              for (var i = -1 * u; i <= u; i += 2) {
                var o = void 0,
                  f = p[i - 1],
                  d = p[i + 1],
                  h = (d ? d.newPos : 0) - i;
                f && (p[i - 1] = void 0);
                var m = f && f.newPos + 1 < s,
                  g = d && 0 <= h && h < c;
                if (m || g) {
                  if (
                    (!m || (g && f.newPos < d.newPos)
                      ? ((o = r(d)), a.pushComponent(o.components, void 0, !0))
                      : ((o = f), o.newPos++, a.pushComponent(o.components, !0, void 0)),
                    (h = a.extractCommon(o, t, e, i)),
                    o.newPos + 1 >= s && h + 1 >= c)
                  )
                    return l(n(a, o.components, t, e, a.useLongestToken));
                  p[i] = o;
                } else p[i] = void 0;
              }
              u++;
            }
            if (o)
              (function e() {
                setTimeout(function () {
                  if (u > f) return o();
                  h() || e();
                }, 0);
              })();
            else
              while (u <= f) {
                var m = h();
                if (m) return m;
              }
          },
          pushComponent: function (e, t, n) {
            var r = e[e.length - 1];
            r && r.added === t && r.removed === n
              ? (e[e.length - 1] = { count: r.count + 1, added: t, removed: n })
              : e.push({ count: 1, added: t, removed: n });
          },
          extractCommon: function (e, t, n, r) {
            var i = t.length,
              o = n.length,
              a = e.newPos,
              l = a - r,
              s = 0;
            while (a + 1 < i && l + 1 < o && this.equals(t[a + 1], n[l + 1])) a++, l++, s++;
            return s && e.components.push({ count: s }), (e.newPos = a), l;
          },
          equals: function (e, t) {
            return this.options.comparator
              ? this.options.comparator(e, t)
              : e === t || (this.options.ignoreCase && e.toLowerCase() === t.toLowerCase());
          },
          removeEmpty: function (e) {
            for (var t = [], n = 0; n < e.length; n++) e[n] && t.push(e[n]);
            return t;
          },
          castInput: function (e) {
            return e;
          },
          tokenize: function (e) {
            return e.split('');
          },
          join: function (e) {
            return e.join('');
          },
        };
        var i = new t();
        function o(e, t, n) {
          return i.diff(e, t, n);
        }
        function a(e, t) {
          if ('function' === typeof e) t.callback = e;
          else if (e) for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
          return t;
        }
        var l = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/,
          s = /\S/,
          c = new t();
        function u(e, t, n) {
          return (n = a(n, { ignoreWhitespace: !0 })), c.diff(e, t, n);
        }
        function f(e, t, n) {
          return c.diff(e, t, n);
        }
        (c.equals = function (e, t) {
          return (
            this.options.ignoreCase && ((e = e.toLowerCase()), (t = t.toLowerCase())),
            e === t || (this.options.ignoreWhitespace && !s.test(e) && !s.test(t))
          );
        }),
          (c.tokenize = function (e) {
            for (var t = e.split(/(\s+|[()[\]{}'"]|\b)/), n = 0; n < t.length - 1; n++)
              !t[n + 1] &&
                t[n + 2] &&
                l.test(t[n]) &&
                l.test(t[n + 2]) &&
                ((t[n] += t[n + 2]), t.splice(n + 1, 2), n--);
            return t;
          });
        var p = new t();
        function d(e, t, n) {
          return p.diff(e, t, n);
        }
        function h(e, t, n) {
          var r = a(n, { ignoreWhitespace: !0 });
          return p.diff(e, t, r);
        }
        p.tokenize = function (e) {
          var t = [],
            n = e.split(/(\n|\r\n)/);
          n[n.length - 1] || n.pop();
          for (var r = 0; r < n.length; r++) {
            var i = n[r];
            r % 2 && !this.options.newlineIsToken
              ? (t[t.length - 1] += i)
              : (this.options.ignoreWhitespace && (i = i.trim()), t.push(i));
          }
          return t;
        };
        var m = new t();
        function g(e, t, n) {
          return m.diff(e, t, n);
        }
        m.tokenize = function (e) {
          return e.split(/(\S.+?[.!?])(?=\s+|$)/);
        };
        var v = new t();
        function y(e, t, n) {
          return v.diff(e, t, n);
        }
        function b(e) {
          return (
            (b =
              'function' === typeof Symbol && 'symbol' === typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      'function' === typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? 'symbol'
                      : typeof e;
                  }),
            b(e)
          );
        }
        function w(e) {
          return x(e) || C(e) || S();
        }
        function x(e) {
          if (Array.isArray(e)) {
            for (var t = 0, n = new Array(e.length); t < e.length; t++) n[t] = e[t];
            return n;
          }
        }
        function C(e) {
          if (
            Symbol.iterator in Object(e) ||
            '[object Arguments]' === Object.prototype.toString.call(e)
          )
            return Array.from(e);
        }
        function S() {
          throw new TypeError('Invalid attempt to spread non-iterable instance');
        }
        v.tokenize = function (e) {
          return e.split(/([{}:;,]|\s+)/);
        };
        var k = Object.prototype.toString,
          E = new t();
        function O(e, t, n) {
          return E.diff(e, t, n);
        }
        function L(e, t, n, r, i) {
          var o, a;
          for (t = t || [], n = n || [], r && (e = r(i, e)), o = 0; o < t.length; o += 1)
            if (t[o] === e) return n[o];
          if ('[object Array]' === k.call(e)) {
            for (t.push(e), a = new Array(e.length), n.push(a), o = 0; o < e.length; o += 1)
              a[o] = L(e[o], t, n, r, i);
            return t.pop(), n.pop(), a;
          }
          if ((e && e.toJSON && (e = e.toJSON()), 'object' === b(e) && null !== e)) {
            t.push(e), (a = {}), n.push(a);
            var l,
              s = [];
            for (l in e) e.hasOwnProperty(l) && s.push(l);
            for (s.sort(), o = 0; o < s.length; o += 1) (l = s[o]), (a[l] = L(e[l], t, n, r, l));
            t.pop(), n.pop();
          } else a = e;
          return a;
        }
        (E.useLongestToken = !0),
          (E.tokenize = p.tokenize),
          (E.castInput = function (e) {
            var t = this.options,
              n = t.undefinedReplacement,
              r = t.stringifyReplacer,
              i =
                void 0 === r
                  ? function (e, t) {
                      return 'undefined' === typeof t ? n : t;
                    }
                  : r;
            return 'string' === typeof e ? e : JSON.stringify(L(e, null, null, i), i, '  ');
          }),
          (E.equals = function (e, n) {
            return t.prototype.equals.call(
              E,
              e.replace(/,([\r\n])/g, '$1'),
              n.replace(/,([\r\n])/g, '$1'),
            );
          });
        var T = new t();
        function N(e, t, n) {
          return T.diff(e, t, n);
        }
        function M(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            n = e.split(/\r\n|[\n\v\f\r\x85]/),
            r = e.match(/\r\n|[\n\v\f\r\x85]/g) || [],
            i = [],
            o = 0;
          function a() {
            var e = {};
            i.push(e);
            while (o < n.length) {
              var r = n[o];
              if (/^(\-\-\-|\+\+\+|@@)\s/.test(r)) break;
              var a = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(r);
              a && (e.index = a[1]), o++;
            }
            l(e), l(e), (e.hunks = []);
            while (o < n.length) {
              var c = n[o];
              if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(c)) break;
              if (/^@@/.test(c)) e.hunks.push(s());
              else {
                if (c && t.strict)
                  throw new Error('Unknown line ' + (o + 1) + ' ' + JSON.stringify(c));
                o++;
              }
            }
          }
          function l(e) {
            var t = /^(---|\+\+\+)\s+(.*)$/.exec(n[o]);
            if (t) {
              var r = '---' === t[1] ? 'old' : 'new',
                i = t[2].split('\t', 2),
                a = i[0].replace(/\\\\/g, '\\');
              /^".*"$/.test(a) && (a = a.substr(1, a.length - 2)),
                (e[r + 'FileName'] = a),
                (e[r + 'Header'] = (i[1] || '').trim()),
                o++;
            }
          }
          function s() {
            for (
              var e = o,
                i = n[o++],
                a = i.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/),
                l = {
                  oldStart: +a[1],
                  oldLines: +a[2] || 1,
                  newStart: +a[3],
                  newLines: +a[4] || 1,
                  lines: [],
                  linedelimiters: [],
                },
                s = 0,
                c = 0;
              o < n.length;
              o++
            ) {
              if (
                0 === n[o].indexOf('--- ') &&
                o + 2 < n.length &&
                0 === n[o + 1].indexOf('+++ ') &&
                0 === n[o + 2].indexOf('@@')
              )
                break;
              var u = 0 == n[o].length && o != n.length - 1 ? ' ' : n[o][0];
              if ('+' !== u && '-' !== u && ' ' !== u && '\\' !== u) break;
              l.lines.push(n[o]),
                l.linedelimiters.push(r[o] || '\n'),
                '+' === u ? s++ : '-' === u ? c++ : ' ' === u && (s++, c++);
            }
            if (
              (s || 1 !== l.newLines || (l.newLines = 0),
              c || 1 !== l.oldLines || (l.oldLines = 0),
              t.strict)
            ) {
              if (s !== l.newLines)
                throw new Error('Added line count did not match for hunk at line ' + (e + 1));
              if (c !== l.oldLines)
                throw new Error('Removed line count did not match for hunk at line ' + (e + 1));
            }
            return l;
          }
          while (o < n.length) a();
          return i;
        }
        function A(e, t, n) {
          var r = !0,
            i = !1,
            o = !1,
            a = 1;
          return function l() {
            if (r && !o) {
              if ((i ? a++ : (r = !1), e + a <= n)) return a;
              o = !0;
            }
            if (!i) return o || (r = !0), t <= e - a ? -a++ : ((i = !0), l());
          };
        }
        function j(e, t) {
          var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          if (('string' === typeof t && (t = M(t)), Array.isArray(t))) {
            if (t.length > 1) throw new Error('applyPatch only works with a single input.');
            t = t[0];
          }
          var r,
            i,
            o = e.split(/\r\n|[\n\v\f\r\x85]/),
            a = e.match(/\r\n|[\n\v\f\r\x85]/g) || [],
            l = t.hunks,
            s =
              n.compareLine ||
              function (e, t, n, r) {
                return t === r;
              },
            c = 0,
            u = n.fuzzFactor || 0,
            f = 0,
            p = 0;
          function d(e, t) {
            for (var n = 0; n < e.lines.length; n++) {
              var r = e.lines[n],
                i = r.length > 0 ? r[0] : ' ',
                a = r.length > 0 ? r.substr(1) : r;
              if (' ' === i || '-' === i) {
                if (!s(t + 1, o[t], i, a) && (c++, c > u)) return !1;
                t++;
              }
            }
            return !0;
          }
          for (var h = 0; h < l.length; h++) {
            for (
              var m = l[h],
                g = o.length - m.oldLines,
                v = 0,
                y = p + m.oldStart - 1,
                b = A(y, f, g);
              void 0 !== v;
              v = b()
            )
              if (d(m, y + v)) {
                m.offset = p += v;
                break;
              }
            if (void 0 === v) return !1;
            f = m.offset + m.oldStart + m.oldLines;
          }
          for (var w = 0, x = 0; x < l.length; x++) {
            var C = l[x],
              S = C.oldStart + C.offset + w - 1;
            (w += C.newLines - C.oldLines), S < 0 && (S = 0);
            for (var k = 0; k < C.lines.length; k++) {
              var E = C.lines[k],
                O = E.length > 0 ? E[0] : ' ',
                L = E.length > 0 ? E.substr(1) : E,
                T = C.linedelimiters[k];
              if (' ' === O) S++;
              else if ('-' === O) o.splice(S, 1), a.splice(S, 1);
              else if ('+' === O) o.splice(S, 0, L), a.splice(S, 0, T), S++;
              else if ('\\' === O) {
                var N = C.lines[k - 1] ? C.lines[k - 1][0] : null;
                '+' === N ? (r = !0) : '-' === N && (i = !0);
              }
            }
          }
          if (r) while (!o[o.length - 1]) o.pop(), a.pop();
          else i && (o.push(''), a.push('\n'));
          for (var j = 0; j < o.length - 1; j++) o[j] = o[j] + a[j];
          return o.join('');
        }
        function P(e, t) {
          'string' === typeof e && (e = M(e));
          var n = 0;
          function r() {
            var i = e[n++];
            if (!i) return t.complete();
            t.loadFile(i, function (e, n) {
              if (e) return t.complete(e);
              var o = j(n, i, t);
              t.patched(i, o, function (e) {
                if (e) return t.complete(e);
                r();
              });
            });
          }
          r();
        }
        function I(e, t, n, r, i, o, a) {
          a || (a = {}), 'undefined' === typeof a.context && (a.context = 4);
          var l = d(n, r, a);
          function s(e) {
            return e.map(function (e) {
              return ' ' + e;
            });
          }
          l.push({ value: '', lines: [] });
          for (
            var c = [],
              u = 0,
              f = 0,
              p = [],
              h = 1,
              m = 1,
              g = function (e) {
                var t = l[e],
                  i = t.lines || t.value.replace(/\n$/, '').split('\n');
                if (((t.lines = i), t.added || t.removed)) {
                  var o;
                  if (!u) {
                    var d = l[e - 1];
                    (u = h),
                      (f = m),
                      d &&
                        ((p = a.context > 0 ? s(d.lines.slice(-a.context)) : []),
                        (u -= p.length),
                        (f -= p.length));
                  }
                  (o = p).push.apply(
                    o,
                    w(
                      i.map(function (e) {
                        return (t.added ? '+' : '-') + e;
                      }),
                    ),
                  ),
                    t.added ? (m += i.length) : (h += i.length);
                } else {
                  if (u)
                    if (i.length <= 2 * a.context && e < l.length - 2) {
                      var g;
                      (g = p).push.apply(g, w(s(i)));
                    } else {
                      var v,
                        y = Math.min(i.length, a.context);
                      (v = p).push.apply(v, w(s(i.slice(0, y))));
                      var b = {
                        oldStart: u,
                        oldLines: h - u + y,
                        newStart: f,
                        newLines: m - f + y,
                        lines: p,
                      };
                      if (e >= l.length - 2 && i.length <= a.context) {
                        var x = /\n$/.test(n),
                          C = /\n$/.test(r),
                          S = 0 == i.length && p.length > b.oldLines;
                        !x && S && p.splice(b.oldLines, 0, '\\ No newline at end of file'),
                          ((x || S) && C) || p.push('\\ No newline at end of file');
                      }
                      c.push(b), (u = 0), (f = 0), (p = []);
                    }
                  (h += i.length), (m += i.length);
                }
              },
              v = 0;
            v < l.length;
            v++
          )
            g(v);
          return { oldFileName: e, newFileName: t, oldHeader: i, newHeader: o, hunks: c };
        }
        function D(e, t, n, r, i, o, a) {
          var l = I(e, t, n, r, i, o, a),
            s = [];
          e == t && s.push('Index: ' + e),
            s.push('==================================================================='),
            s.push(
              '--- ' +
                l.oldFileName +
                ('undefined' === typeof l.oldHeader ? '' : '\t' + l.oldHeader),
            ),
            s.push(
              '+++ ' +
                l.newFileName +
                ('undefined' === typeof l.newHeader ? '' : '\t' + l.newHeader),
            );
          for (var c = 0; c < l.hunks.length; c++) {
            var u = l.hunks[c];
            s.push(
              '@@ -' + u.oldStart + ',' + u.oldLines + ' +' + u.newStart + ',' + u.newLines + ' @@',
            ),
              s.push.apply(s, u.lines);
          }
          return s.join('\n') + '\n';
        }
        function _(e, t, n, r, i, o) {
          return D(e, e, t, n, r, i, o);
        }
        function z(e, t) {
          return e.length === t.length && R(e, t);
        }
        function R(e, t) {
          if (t.length > e.length) return !1;
          for (var n = 0; n < t.length; n++) if (t[n] !== e[n]) return !1;
          return !0;
        }
        function F(e) {
          var t = ne(e.lines),
            n = t.oldLines,
            r = t.newLines;
          void 0 !== n ? (e.oldLines = n) : delete e.oldLines,
            void 0 !== r ? (e.newLines = r) : delete e.newLines;
        }
        function H(e, t, n) {
          (e = W(e, n)), (t = W(t, n));
          var r = {};
          (e.index || t.index) && (r.index = e.index || t.index),
            (e.newFileName || t.newFileName) &&
              (B(e)
                ? B(t)
                  ? ((r.oldFileName = V(r, e.oldFileName, t.oldFileName)),
                    (r.newFileName = V(r, e.newFileName, t.newFileName)),
                    (r.oldHeader = V(r, e.oldHeader, t.oldHeader)),
                    (r.newHeader = V(r, e.newHeader, t.newHeader)))
                  : ((r.oldFileName = e.oldFileName),
                    (r.newFileName = e.newFileName),
                    (r.oldHeader = e.oldHeader),
                    (r.newHeader = e.newHeader))
                : ((r.oldFileName = t.oldFileName || e.oldFileName),
                  (r.newFileName = t.newFileName || e.newFileName),
                  (r.oldHeader = t.oldHeader || e.oldHeader),
                  (r.newHeader = t.newHeader || e.newHeader))),
            (r.hunks = []);
          var i = 0,
            o = 0,
            a = 0,
            l = 0;
          while (i < e.hunks.length || o < t.hunks.length) {
            var s = e.hunks[i] || { oldStart: 1 / 0 },
              c = t.hunks[o] || { oldStart: 1 / 0 };
            if (U(s, c)) r.hunks.push(K(s, a)), i++, (l += s.newLines - s.oldLines);
            else if (U(c, s)) r.hunks.push(K(c, l)), o++, (a += c.newLines - c.oldLines);
            else {
              var u = {
                oldStart: Math.min(s.oldStart, c.oldStart),
                oldLines: 0,
                newStart: Math.min(s.newStart + a, c.oldStart + l),
                newLines: 0,
                lines: [],
              };
              q(u, s.oldStart, s.lines, c.oldStart, c.lines), o++, i++, r.hunks.push(u);
            }
          }
          return r;
        }
        function W(e, t) {
          if ('string' === typeof e) {
            if (/^@@/m.test(e) || /^Index:/m.test(e)) return M(e)[0];
            if (!t) throw new Error('Must provide a base reference or pass in a patch');
            return I(void 0, void 0, t, e);
          }
          return e;
        }
        function B(e) {
          return e.newFileName && e.newFileName !== e.oldFileName;
        }
        function V(e, t, n) {
          return t === n ? t : ((e.conflict = !0), { mine: t, theirs: n });
        }
        function U(e, t) {
          return e.oldStart < t.oldStart && e.oldStart + e.oldLines < t.oldStart;
        }
        function K(e, t) {
          return {
            oldStart: e.oldStart,
            oldLines: e.oldLines,
            newStart: e.newStart + t,
            newLines: e.newLines,
            lines: e.lines,
          };
        }
        function q(e, t, n, r, i) {
          var o = { offset: t, lines: n, index: 0 },
            a = { offset: r, lines: i, index: 0 };
          $(e, o, a), $(e, a, o);
          while (o.index < o.lines.length && a.index < a.lines.length) {
            var l = o.lines[o.index],
              s = a.lines[a.index];
            if (('-' !== l[0] && '+' !== l[0]) || ('-' !== s[0] && '+' !== s[0]))
              if ('+' === l[0] && ' ' === s[0]) {
                var c;
                (c = e.lines).push.apply(c, w(J(o)));
              } else if ('+' === s[0] && ' ' === l[0]) {
                var u;
                (u = e.lines).push.apply(u, w(J(a)));
              } else
                '-' === l[0] && ' ' === s[0]
                  ? Y(e, o, a)
                  : '-' === s[0] && ' ' === l[0]
                  ? Y(e, a, o, !0)
                  : l === s
                  ? (e.lines.push(l), o.index++, a.index++)
                  : Z(e, J(o), J(a));
            else G(e, o, a);
          }
          X(e, o), X(e, a), F(e);
        }
        function G(e, t, n) {
          var r = J(t),
            i = J(n);
          if (ee(r) && ee(i)) {
            var o, a;
            if (R(r, i) && te(n, r, r.length - i.length))
              return void (o = e.lines).push.apply(o, w(r));
            if (R(i, r) && te(t, i, i.length - r.length))
              return void (a = e.lines).push.apply(a, w(i));
          } else if (z(r, i)) {
            var l;
            return void (l = e.lines).push.apply(l, w(r));
          }
          Z(e, r, i);
        }
        function Y(e, t, n, r) {
          var i,
            o = J(t),
            a = Q(n, o);
          a.merged ? (i = e.lines).push.apply(i, w(a.merged)) : Z(e, r ? a : o, r ? o : a);
        }
        function Z(e, t, n) {
          (e.conflict = !0), e.lines.push({ conflict: !0, mine: t, theirs: n });
        }
        function $(e, t, n) {
          while (t.offset < n.offset && t.index < t.lines.length) {
            var r = t.lines[t.index++];
            e.lines.push(r), t.offset++;
          }
        }
        function X(e, t) {
          while (t.index < t.lines.length) {
            var n = t.lines[t.index++];
            e.lines.push(n);
          }
        }
        function J(e) {
          var t = [],
            n = e.lines[e.index][0];
          while (e.index < e.lines.length) {
            var r = e.lines[e.index];
            if (('-' === n && '+' === r[0] && (n = '+'), n !== r[0])) break;
            t.push(r), e.index++;
          }
          return t;
        }
        function Q(e, t) {
          var n = [],
            r = [],
            i = 0,
            o = !1,
            a = !1;
          while (i < t.length && e.index < e.lines.length) {
            var l = e.lines[e.index],
              s = t[i];
            if ('+' === s[0]) break;
            if (((o = o || ' ' !== l[0]), r.push(s), i++, '+' === l[0])) {
              a = !0;
              while ('+' === l[0]) n.push(l), (l = e.lines[++e.index]);
            }
            s.substr(1) === l.substr(1) ? (n.push(l), e.index++) : (a = !0);
          }
          if (('+' === (t[i] || '')[0] && o && (a = !0), a)) return n;
          while (i < t.length) r.push(t[i++]);
          return { merged: r, changes: n };
        }
        function ee(e) {
          return e.reduce(function (e, t) {
            return e && '-' === t[0];
          }, !0);
        }
        function te(e, t, n) {
          for (var r = 0; r < n; r++) {
            var i = t[t.length - n + r].substr(1);
            if (e.lines[e.index + r] !== ' ' + i) return !1;
          }
          return (e.index += n), !0;
        }
        function ne(e) {
          var t = 0,
            n = 0;
          return (
            e.forEach(function (e) {
              if ('string' !== typeof e) {
                var r = ne(e.mine),
                  i = ne(e.theirs);
                void 0 !== t && (r.oldLines === i.oldLines ? (t += r.oldLines) : (t = void 0)),
                  void 0 !== n && (r.newLines === i.newLines ? (n += r.newLines) : (n = void 0));
              } else void 0 === n || ('+' !== e[0] && ' ' !== e[0]) || n++, void 0 === t || ('-' !== e[0] && ' ' !== e[0]) || t++;
            }),
            { oldLines: t, newLines: n }
          );
        }
        function re(e) {
          for (var t, n, r = [], i = 0; i < e.length; i++)
            (t = e[i]), (n = t.added ? 1 : t.removed ? -1 : 0), r.push([n, t.value]);
          return r;
        }
        function ie(e) {
          for (var t = [], n = 0; n < e.length; n++) {
            var r = e[n];
            r.added ? t.push('<ins>') : r.removed && t.push('<del>'),
              t.push(oe(r.value)),
              r.added ? t.push('</ins>') : r.removed && t.push('</del>');
          }
          return t.join('');
        }
        function oe(e) {
          var t = e;
          return (
            (t = t.replace(/&/g, '&amp;')),
            (t = t.replace(/</g, '&lt;')),
            (t = t.replace(/>/g, '&gt;')),
            (t = t.replace(/"/g, '&quot;')),
            t
          );
        }
        (T.tokenize = function (e) {
          return e.slice();
        }),
          (T.join = T.removeEmpty = function (e) {
            return e;
          }),
          (e.Diff = t),
          (e.diffChars = o),
          (e.diffWords = u),
          (e.diffWordsWithSpace = f),
          (e.diffLines = d),
          (e.diffTrimmedLines = h),
          (e.diffSentences = g),
          (e.diffCss = y),
          (e.diffJson = O),
          (e.diffArrays = N),
          (e.structuredPatch = I),
          (e.createTwoFilesPatch = D),
          (e.createPatch = _),
          (e.applyPatch = j),
          (e.applyPatches = P),
          (e.parsePatch = M),
          (e.merge = H),
          (e.convertChangesToDMP = re),
          (e.convertChangesToXML = ie),
          (e.canonicalize = L),
          Object.defineProperty(e, '__esModule', { value: !0 });
      });
    },
    w5pM: function (e, t, n) {
      'use strict';
      var r = n('q1tI'),
        i = {
          icon: {
            tag: 'svg',
            attrs: { viewBox: '64 64 896 896', focusable: 'false' },
            children: [
              {
                tag: 'path',
                attrs: {
                  d:
                    'M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z',
                },
              },
              {
                tag: 'path',
                attrs: {
                  d:
                    'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z',
                },
              },
            ],
          },
          name: 'plus-circle',
          theme: 'outlined',
        },
        o = i,
        a = n('6VBw'),
        l = function (e, t) {
          return r['createElement'](a['a'], Object.assign({}, e, { ref: t, icon: o }));
        };
      l.displayName = 'PlusCircleOutlined';
      t['a'] = r['forwardRef'](l);
    },
    xmmm: function (e, t, n) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      t.createChangeEmitter = function () {
        var e = [],
          t = e;
        function n() {
          t === e && (t = e.slice());
        }
        function r(e) {
          if ('function' !== typeof e) throw new Error('Expected listener to be a function.');
          var r = !0;
          return (
            n(),
            t.push(e),
            function () {
              if (r) {
                (r = !1), n();
                var i = t.indexOf(e);
                t.splice(i, 1);
              }
            }
          );
        }
        function i() {
          e = t;
          for (var n = e, r = 0; r < n.length; r++) n[r].apply(n, arguments);
        }
        return { listen: r, emit: i };
      };
    },
    yfLh: function (e, t, n) {},
  },
]);
