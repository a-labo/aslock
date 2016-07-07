/**
 * @function create
 */
'use strict'

const AsLock = require('./aslock')

/** @lends create */
function create (...args) {
  return new AsLock(...args)
}

module.exports = create
