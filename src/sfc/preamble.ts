import * as path from 'path'
import { SFC } from './sfc'
import { SFCOutput } from './output'
import { code } from '../util/code'

export function create(sfc: SFC): SFCOutput {
  const p = path.parse(sfc.fileName)
  let buf = ''

  if (sfc.script) {
    buf += code`
      import c from './${p.name}.script.js'
      var o = c
      if (typeof c === 'function') o = c.options
    `
  } else {
    buf += code`
      var c, o
      c = o = {}
    `
  }

  if (sfc.template && sfc.template.render) {
    buf += code`
      import { render, staticRenderFns } from './${p.name}.template.js'
      o.render = render
      o.staticRenderFns = staticRenderFns
    `
  }

  buf += code`
    export default c
  `

  return {
    fileName: p.name + '.js',
    content: buf
  }
}
