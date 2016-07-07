/**
 * Async lock
 * @module aslock
 */

'use strict'

const create = require('./create')
const AsLock = require('./aslock')

let lib = create({})

Object.assign(lib, AsLock, {
  create,
  AsLock
})

module.exports = lib