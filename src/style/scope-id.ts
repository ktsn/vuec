import * as assert from 'assert'
import { plugin, Plugin } from 'postcss'
import * as selectorParser from 'postcss-selector-parser'

export interface PluginOptions {
  scopeId: string
}

function getTargetNode(selector) {
  let node = null
  selector.each(n => {
    if (n.type !== 'pseudo' && n.type !== 'combinator') {
      node = n
    }
  })
  return node
}

export const postcssPlugin = plugin<PluginOptions>('scope-id', options => {
  assert(options)

  const scopeId = options!.scopeId

  const selectorTransformer = selectorParser(selectors => {
    selectors.each(selector => {
      const target = getTargetNode(selector)

      selector.insertAfter(target, selectorParser.attribute({
        attribute: scopeId
      }))
    })
  })

  return root => {
    root.walkRules(rule => {
      rule.selector = selectorTransformer.process(rule.selector).result
    })
  }
})
