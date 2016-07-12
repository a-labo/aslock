/**
 * Async lock
 * @module aslock
 */

'use strict';

var create = require('./create');
var AsLock = require('./aslock');

var lib = create({});

Object.assign(lib, AsLock, {
  create: create,
  AsLock: AsLock
});

module.exports = lib;