export interface SFCBlock {
  code: string
  lang: string
}

export interface TemplateBlock extends SFCBlock {
  render: string | null
  staticRenderFns: string[] | null
}

export interface StyleBlock extends SFCBlock {
  module: boolean | string
  scoped: boolean
}

export interface SFC {
  fileName: string
  template: TemplateBlock | null
  script: SFCBlock | null
  styles: StyleBlock[]
}
