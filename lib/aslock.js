/**
 * Locking utility
 * @class AsLock
 */
'use strict'

const uuid = require('uuid')
const co = require('co')
const asleep = require('asleep')
const defaults = require('defaults')

/** @lends AsLock */
class AsLock {
  constructor () {
    const s = this
    s._locks = {}
  }

  /**
   * Check who holds lock
   * @param {string} name
   * @returns {boolean}
   */
  who (name) {
    const s = this
    return s._locks[ name ]
  }

  /**
   * Acquire a lock and execute action
   * @param {string} name - Name of lock
   * @param {Object} options - Optional settings
   * @param {number} [options.timeout=100] - Timeout to wait
   * @returns {Promise.<function>} - Unlock function
   */
  acquire (name, options = {}) {
    const s = this
    let { timeout } = defaults(options, {
      timeout: 100
    })
    return co(function * () {
      let startAt = new Date()
      while (s.who(name)) {
        let isTimeout = new Date() - startAt > timeout
        if (isTimeout) {
          throw new Error(`[AsLock] Failed to acquire lock for: "${name}"`)
        }
        yield asleep(1)
      }
      let lockingId = uuid.v4()

      s._locks[ name ] = lockingId
      return co.wrap(function * unlock () {
        let byMe = s._locks[ name ] === lockingId
        if (byMe) {
          return yield s.release(name)
        }
        return 0
      })
    })
  }

  /**
   * Release a lock
   * @param {string} name - Name of lock
   * @returns {Promise.<number>}
   */
  release (name) {
    const s = this
    return co(function * () {
      let count = 0
      let exists = s._locks.hasOwnProperty(name)
      if (exists) {
        delete s._locks[ name ]
        count += 1
      }
      return count
    })
  }

  /**
   * Discard all locks
   * @returns {Promise}
   */
  releaseAll () {
    const s = this
    return co(function * () {
      for (let name of Object.keys(s._locks)) {
        yield s.release(name)
      }
    })
  }

  /**
   * Try to acquire and do action.
   * @param {string} name
   * @param action
   * @param {Object} options - Optional settings
   * @returns {*|Promise}
   */
  transaction (name, action, options = {}) {
    const s = this

    return co(function * () {
      let unlock = yield s.acquire(name, { timeout: options.timeout })
      let result = yield Promise.resolve(action())
      yield unlock()
      return result
    })
  }
}

module.exports = AsLock
