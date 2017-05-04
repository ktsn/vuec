import * as assert from 'power-assert'
import { template, script, style, reduce } from '../../src/sfc/output'

describe('SFC output', () => {
  it('should generate template output', () => {
    const res = template('test.vue', {
      code: '<p>Hello</p>',
      lang: 'html',
      render: null,
      staticRenderFns: null
    })

    assert.deepStrictEqual(res, {
      fileName: 'test.template.html',
      content: '<p>Hello</p>'
    })
  })

  it('should generate render function output', () => {
    const render = 'with(this){return _c(\'p\',[_v(\"Hello\")])}'

    const res = template('test.vue', {
      code: '<p>Hellp</p>',
      lang: 'html',
      render,
      staticRenderFns: []
    })

    assert.deepStrictEqual(res, {
      fileName: 'test.template.js',
      content: [
        `export var render = function(){${render}};`,
        'export var staticRenderFns = [];'
      ].join('\n')
    })
  })

  it('should generate script output', () => {
    const res = script('test.vue', {
      code: 'export default {}',
      lang: 'js'
    })

    assert.deepStrictEqual(res, {
      fileName: 'test.js',
      content: 'export default {}'
    })
  })

  it('should generate style output', () => {
    const res = style('test.vue', {
      code: '.red { color: red; }',
      lang: 'css',
      scoped: false,
      module: false
    })

    assert.deepStrictEqual(res, {
      fileName: 'test.style.css',
      content: '.red { color: red; }'
    })
  })

  it('should reduce outputs having same file name', () => {
    const outputs = [
      {
        content: '.red[data-v-12345] { color: red; }',
        fileName: 'test.style.css'
      },
      {
        content: '.blue { color: blue; }',
        fileName: 'test.style.css'
      },
      {
        content: 'Test__green { color: green; }',
        fileName: 'test.style.css'
      },
      {
        content: '.test { font-size: 1.2rem; }',
        fileName: 'test.style.scss'
      }
    ]

    const res = reduce(outputs)

    assert.deepStrictEqual(res, [
      {
        content: [
          '.red[data-v-12345] { color: red; }',
          '.blue { color: blue; }',
          'Test__green { color: green; }'
        ].join('\n'),
        fileName: 'test.style.css'
      },
      {
        content: '.test { font-size: 1.2rem; }',
        fileName: 'test.style.scss'
      }
    ])
  })
})
