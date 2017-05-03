import { parseComponent } from 'vue-template-compiler'
import { SFC, SFCBlock, TemplateBlock, StyleBlock } from './sfc/sfc'

export function split(fileName: string, code: string): SFC {
  const result = parseComponent(code)

  return {
    fileName,
    template: extractTemplate(result),
    script: extractScript(result),
    styles: extractStyles(result)
  }
}

function extractTemplate(raw: any): TemplateBlock | null {
  if (!raw.template) return null

  const template = raw.template
  return {
    lang: template.lang || 'html',
    code: template.content,
    render: null,
    staticRenderFns: null
  }
}

function extractScript(raw: any): SFCBlock | null {
  if (!raw.script) return null

  const script = raw.script
  return {
    lang: script.lang || 'js',
    code: script.content
  }
}

function extractStyles(raw: any): StyleBlock[] {
  return raw.styles.map(s => {
    return {
      lang: s.lang || 'css',
      code: s.content,
      scoped: s.scoped || false,
      module: s.module || false
    }
  })
}
