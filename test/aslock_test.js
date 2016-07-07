/**
 * Test case for aslock.
 * Runs with mocha.
 */
'use strict'

const Aslock = require('../lib/aslock.js')
const assert = require('assert')
const co = require('co')

describe('aslock', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Aslock', () => co(function * () {
    let lock = new Aslock()
    {
      let unlock = yield lock.acquire('hoge')
      let caught
      try {
        yield lock.acquire('hoge')
      } catch (err) {
        caught = err
      }
      assert.ok(caught)
      unlock()
    }
    {
      let fuge = false
      lock.transaction('fuge', () => {
        fuge = true
        return new Promise((resolve) => setTimeout(() => resolve('fuge-result'), 180))
      }).then((result) => {
        assert.equal(result, 'fuge-result')
      })
      assert.ok(!fuge)
      let caught
      try {
        yield lock.acquire('fuge')
      } catch (err) {
        caught = err
      }
      assert.ok(caught)

      yield new Promise((resolve) => setTimeout(resolve, 200))
      assert.ok(fuge)
    }

    lock.releaseAll()
  }))
})

/* global describe, before, after, it */
