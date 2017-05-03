import * as assert from 'power-assert'
import { compile } from '../../src/template/compiler'

describe('Template compiler', () => {
  it('should compile html template to render function', () => {
    const res = compile('<p>Hello</p>').get()

    assert(res.render === 'with(this){return _c(\'p\',[_v(\"Hello\")])}')
    assert(res.staticRenderFns.length === 0)
  })

  it('should transpile es2015 syntax to es5', () => {
    const res = compile('<div><p>Hello</p><button @click="() => test()">{{ msg }}</button></div>', { transpile: true }).get()

    assert(res.render === [
      'var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return ',
      '_c(\'div\',[_c(\'p\',[_vm._v(\"Hello\")]),_c(\'button\',{on:{\"click\":function () { return _vm.test(); }}},',
      '[_vm._v(_vm._s(_vm.msg))])])'
    ].join(''))
    assert(res.staticRenderFns.length === 0)
  })
})
