#!/usr/bin/env node

import * as minimist from 'minimist'
import { run } from '../main'

const {
  _: [source]
} = minimist(process.argv.slice(2))

run([source])
