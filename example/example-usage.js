'use strict'

const aslock = require('aslock')
const co = require('co')

co(function * () {
  // Acquire a lock and do action
  yield aslock.acquire('my-exclusive-work-01', () => co(function * () {
    // Some async actions
    /* ... */
  }))

  // Non block without yield
  aslock.acquire('my-exclusive-work-01', () => co(function * () {
    return new Promise((resolve) => setTimeout(resolve, 300))
  }))

  try {
    aslock.acquire('my-exclusive-work-01', () => co(function * () {
      /* .. */
    })) // -> This throws error since the lock taken by other.
  } catch (err) {
    console.error('Failed')
  }
}).catch((err) => console.error(err))

