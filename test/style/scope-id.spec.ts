import * as assert from 'power-assert'
import * as postcss from 'postcss'
import { postcssPlugin } from '../../src/style/scope-id'

describe('Style scope id', () => {
  it('should add scope id to the last selector', done => {
    const source = [
      '.red { color: red; }',
      '.foo .bar { font-size: 1.8rem; }'
    ].join('\n')

    const expected = [
      '.red[data-v-123] { color: red; }',
      '.foo .bar[data-v-123] { font-size: 1.8rem; }'
    ].join('\n')

    postcss([
      postcssPlugin({
        scopeId: 'data-v-123'
      })
    ]).process(source)
      .then(res => {
        assert(res.css === expected)
        done()
      })
  })
})
