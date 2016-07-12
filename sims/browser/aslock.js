/**
 * Locking utility
 * @class AsLock
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid');
var co = require('co');
var asleep = require('asleep');
var defaults = require('defaults');

/** @lends AsLock */

var AsLock = function () {
  function AsLock() {
    _classCallCheck(this, AsLock);

    var s = this;
    s._locks = {};
  }

  /**
   * Check who holds lock
   * @param {string} name
   * @returns {boolean}
   */


  _createClass(AsLock, [{
    key: 'who',
    value: function who(name) {
      var s = this;
      return s._locks[name];
    }

    /**
     * Acquire a lock and execute action
     * @param {string} name - Name of lock
     * @param {Object} options - Optional settings
     * @param {number} [options.timeout=100] - Timeout to wait
     * @returns {Promise.<function>} - Unlock function
     */

  }, {
    key: 'acquire',
    value: function acquire(name) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var s = this;

      var _defaults = defaults(options, {
        timeout: 100
      });

      var timeout = _defaults.timeout;

      return co(regeneratorRuntime.mark(function _callee() {
        var startAt, isTimeout, lockingId;
        return regeneratorRuntime.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                startAt = new Date();

              case 1:
                if (!s.who(name)) {
                  _context2.next = 9;
                  break;
                }

                isTimeout = new Date() - startAt > timeout;

                if (!isTimeout) {
                  _context2.next = 5;
                  break;
                }

                throw new Error('[AsLock] Failed to acquire lock for: "' + name + '"');

              case 5:
                _context2.next = 7;
                return asleep(1);

              case 7:
                _context2.next = 1;
                break;

              case 9:
                lockingId = uuid.v4();


                s._locks[name] = lockingId;
                return _context2.abrupt('return', co.wrap(regeneratorRuntime.mark(function unlock() {
                  var byMe;
                  return regeneratorRuntime.wrap(function unlock$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          byMe = s._locks[name] === lockingId;

                          if (!byMe) {
                            _context.next = 5;
                            break;
                          }

                          _context.next = 4;
                          return s.release(name);

                        case 4:
                          return _context.abrupt('return', _context.sent);

                        case 5:
                          return _context.abrupt('return', 0);

                        case 6:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, unlock, this);
                })));

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));
    }

    /**
     * Release a lock
     * @param {string} name - Name of lock
     * @returns {Promise.<number>}
     */

  }, {
    key: 'release',
    value: function release(name) {
      var s = this;
      return co(regeneratorRuntime.mark(function _callee2() {
        var count, exists;
        return regeneratorRuntime.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                count = 0;
                exists = s._locks.hasOwnProperty(name);

                if (exists) {
                  delete s._locks[name];
                  count += 1;
                }
                return _context3.abrupt('return', count);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee2, this);
      }));
    }

    /**
     * Discard all locks
     * @returns {Promise}
     */

  }, {
    key: 'releaseAll',
    value: function releaseAll() {
      var s = this;
      return co(regeneratorRuntime.mark(function _callee3() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name;

        return regeneratorRuntime.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 3;
                _iterator = Object.keys(s._locks)[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context4.next = 12;
                  break;
                }

                name = _step.value;
                _context4.next = 9;
                return s.release(name);

              case 9:
                _iteratorNormalCompletion = true;
                _context4.next = 5;
                break;

              case 12:
                _context4.next = 18;
                break;

              case 14:
                _context4.prev = 14;
                _context4.t0 = _context4['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 18:
                _context4.prev = 18;
                _context4.prev = 19;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 21:
                _context4.prev = 21;

                if (!_didIteratorError) {
                  _context4.next = 24;
                  break;
                }

                throw _iteratorError;

              case 24:
                return _context4.finish(21);

              case 25:
                return _context4.finish(18);

              case 26:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee3, this, [[3, 14, 18, 26], [19,, 21, 25]]);
      }));
    }

    /**
     * Try to acquire and do action.
     * @param {string} name
     * @param action
     * @param {Object} options - Optional settings
     * @returns {*|Promise}
     */

  }, {
    key: 'transaction',
    value: function transaction(name, action) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var s = this;

      return co(regeneratorRuntime.mark(function _callee4() {
        var unlock, result;
        return regeneratorRuntime.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return s.acquire(name, { timeout: options.timeout });

              case 2:
                unlock = _context5.sent;
                _context5.next = 5;
                return Promise.resolve(action());

              case 5:
                result = _context5.sent;
                _context5.next = 8;
                return unlock();

              case 8:
                return _context5.abrupt('return', result);

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee4, this);
      }));
    }
  }]);

  return AsLock;
}();

module.exports = AsLock;