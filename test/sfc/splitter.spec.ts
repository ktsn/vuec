import * as assert from 'power-assert'
import { split } from '../../src/sfc/splitter'

describe('Splitter', () => {
  it('should split sfc', () => {
    const template = '<p>Hello</p>'
    const script = 'export default {}'
    const styles = [
      '.red {\n  color: red;\n}',
      '.blue {\n  color: blue;\n}'
    ]

    const sfc = [
      `<template>${template}</template>`,
      `<script>${script}</script>`,
      `<style module="test">${styles[0]}</style>`,
      `<style scoped>${styles[1]}</style>`
    ].join('\n')

      const res = split('Test.vue', sfc)

      const t = res.template!
      assert(t.lang === 'html')
      assert(t.code === template)

      const s = res.script!
      assert(s.lang === 'js')
      assert(s.code === script)

      let st = res.styles[0]
      assert(st.lang === 'css')
      assert(st.code === styles[0])
      assert(st.module === 'test')
      assert(st.scoped === false)

      st = res.styles[1]
      assert(st.lang === 'css')
      assert(st.code === styles[1])
      assert(st.module === false)
      assert(st.scoped === true)
  })
})
