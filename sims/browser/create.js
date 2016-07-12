/**
 * @function create
 */
'use strict';

var AsLock = require('./aslock');

/** @lends create */
function create() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(AsLock, [null].concat(args)))();
}

module.exports = create;