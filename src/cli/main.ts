#!/usr/bin/env node

import * as minimist from 'minimist'
import * as glob from 'glob'
import { run } from '../main'

const {
  _: [source]
} = minimist(process.argv.slice(2))

run(glob.sync(source))
