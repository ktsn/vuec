import { readFileSync, writeFileSync } from 'fs'
import * as postcss from 'postcss'
import { SFC } from './sfc/sfc'
import { SFCOutput, template, script, style, reduce } from './sfc/output'
import { split as splitSFC } from './sfc/splitter'
import { create as createPreamble } from './sfc/preamble'
import { Either, value } from './util/either'
import { compile as compileTemplate } from './template/compiler'
import { postcssPlugin as addScopeId } from './style/scope-id'
import { genScopeId } from './gen-scope-id'

export function run(fileNames: string[]): void {
  Promise.all(fileNames.map(transform))
    .then(items => {
      items.map(createPreamble)
        .forEach(write)

      items.map(output)
        .forEach(outputs => {
          outputs.forEach(write)
        })
    })
}

async function transform(fileName: string): Promise<SFC> {
  const source = readFileSync(fileName, 'utf8')
  const sfc = splitSFC(fileName, source)
  const scopeId = genScopeId(fileName)

  const { template, script, styles } = sfc

  if (template !== null) {
    compileTemplate(template.code, { transpile: true }).fold(
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

function output(sfc: SFC): SFCOutput[] {
  const res: SFCOutput[] = []

  if (sfc.template) {
    res.push(template(sfc.fileName, sfc.template))
  }

  if (sfc.script) {
    res.push(script(sfc.fileName, sfc.script))
  }

  res.push(...reduce(sfc.styles.map(s => style(sfc.fileName, s))))

  return res
}

function write(output: SFCOutput): void {
  writeFileSync(output.fileName, output.content)
}
