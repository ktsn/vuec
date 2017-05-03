import { Either, value, error } from '../util/either'
import { compile as _compile } from 'vue-template-compiler'
import * as _transpile from 'vue-template-es2015-compiler'

export interface CompiledTemplate {
  render: string
  staticRenderFns: string[]
}

export interface CompileOptions {
  transpile?: boolean
}

export function compile(code: string, options: CompileOptions = {}): Either<string[], CompiledTemplate> {
  const res = _compile(code)

  if (res.errors.length > 0) {
    return error(res.errors)
  }

  if (options.transpile) {
    res.render = transpile(res.render)
    res.staticRenderFns = res.staticRenderFns.map(transpile)
  }

  return value(res)
}

function transpile(code: string): string {
  const pre = '(function(){'
  const post = '})'
  return _transpile(pre + code + post)
    .slice(pre.length, -post.length)
}
