import * as path from 'path'
import { TemplateBlock, StyleBlock, SFCBlock } from './sfc'

export interface SFCOutput {
  fileName: string
  content: string
}

export function template(sourceName: string, source: TemplateBlock): SFCOutput {
  const p = path.parse(sourceName)

  if (!source.render) {
    return {
      fileName: path.join(p.dir, p.name + '.template.' + source.lang),
      content: source.code
    }
  }

  return {
    fileName: path.join(p.dir, p.name + '.template.js'),
    content: exportRender(source)
  }
}

function exportRender(block: TemplateBlock): string {
  return [
    'export var render = ' + wrapFunction(block.render!) + ';',
    'export var staticRenderFns = [' + block.staticRenderFns!.map(wrapFunction).join(',') + '];'
  ].join('\n')
}

function wrapFunction(code: string): string {
  return 'function(){' + code + '}'
}

export function script(sourceName: string, source: SFCBlock): SFCOutput {
  const p = path.parse(sourceName)

  return {
    fileName: path.join(p.dir, p.name + '.' + source.lang),
    content: source.code
  }
}

export function style(sourceName: string, source: StyleBlock): SFCOutput {
  const p = path.parse(sourceName)

  return {
    fileName: path.join(p.dir, p.name + '.style.' + source.lang),
    content: source.code
  }
}

export function reduce(styles: SFCOutput[]): SFCOutput[] {
  function loop(result: SFCOutput[], rest: SFCOutput[]): SFCOutput[] {
    if (rest.length === 0) return result

    const [head, ...tail] = rest
    const reducible = findReducible(head, result)

    if (reducible) {
      reducible.content += '\n' + head.content
      return loop(result, tail)
    } else {
      return loop(result.concat(head), tail)
    }
  }
  return loop([], styles)
}

function findReducible(target: SFCOutput, list: SFCOutput[]): SFCOutput | null {
  return list.find(item => item.fileName === target.fileName) || null
}
