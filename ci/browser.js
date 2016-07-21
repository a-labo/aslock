#!/usr/bin/env node

/**
 * Compile to browser source
 */

'use strict'

process.chdir(`${__dirname}/..`)

const { runTasks } = require('ape-tasking')
const abrowserify = require('abrowserify')

runTasks('browser', [
  () => abrowserify('**/*.js', {
    cwd: 'lib',
    out: 'sims/browser'
  })
], true)
