import * as assert from 'power-assert'
import { code } from '../../src/util/code'

describe('Util code', () => {
  it('should trim heading/trailing empty lines', () => {
    const res = code`\n  foo\nbar\n\n  \n`
    assert.equal(res, '  foo\nbar\n')
  })

  it('should strip redundant indentation', () => {
    const res = code`
      function foo() {
        console.log('test')
      }
    `

    assert.equal(res, 'function foo() {\n  console.log(\'test\')\n}\n')
  })

  it('should strip empty line', () => {
    const res = code`foo\n    \n  bar`
    assert.equal(res, 'foo\n\n  bar\n')
  })

  it('should evaluate interpolate values', () => {
    const test = 'test'
    const res = code`foo${test}bar`
    assert(res === 'footestbar\n')
  })
})
