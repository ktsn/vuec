import { readFileSync } from 'fs'
import * as postcss from 'postcss'
import { SFC } from './sfc/sfc'
import { Either, value } from './util/either'
import { split as splitSFC } from './sfc/splitter'
import { compile as compileTemplate } from './template/compiler'
import { postcssPlugin as addScopeId } from './style/scope-id'
import { genScopeId } from './gen-scope-id'

export function run(fileNames: string[]): void {
  Promise.all(fileNames.map(transform))
    .then(a => a.forEach(b => console.log(b)))
}

async function transform(fileName: string): Promise<SFC> {
  const source = readFileSync(fileName, 'utf8')
  const sfc = splitSFC(fileName, source)
  const scopeId = genScopeId(fileName)

  const { template, script, styles } = sfc

  if (template !== null) {
    compileTemplate(template.code).fold(
      compiled => {
        template.render = compiled.render
        template.staticRenderFns = compiled.staticRenderFns
      },
      errors => {
        errors.forEach(e => console.error(e))
      }
    )
  }

  styles.forEach(async style => {
    const plugins: postcss.Transformer[] = []

    if (style.scoped) {
      plugins.push(addScopeId({ scopeId }))
    }

    postcss(plugins)
      .process(style.code)
      .then(res => {
        style.code = res.css
      })
  })

  return sfc
}

