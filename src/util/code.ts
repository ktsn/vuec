export function code(strings: TemplateStringsArray, ...values: string[]): string {
  const source = strings.reduce((acc, s, i) => {
    return acc + values[i - 1] + s
  })

  let lines = source.split(/\r?\n/)
  lines = trimEmpty(lines)
  lines = trimLines(lines)
  lines = deindent(lines, minIndent(lines))

  // Always have trailing empty line
  return lines.concat('').join('\n')
}

function minIndent(lines: string[]): number {
  return lines.reduce((min, line) => {
    const match = line.match(/^( *)[^\s$]/)
    if (!match) return min

    return Math.min(min, match[1].length)
  }, Infinity)
}

function deindent(lines: string[], indent: number): string[] {
  return lines.map(line => line.slice(indent))
}

function trimEmpty(lines: string[]): string[] {
  return lines.map(line => /^\s*$/.test(line) ? '' : line)
}

function trimLines(lines: string[]): string[] {
  let head, tail

  for (let i = head = 0; i < lines.length; ++i) {
    if (!/^\s*$/.test(lines[i])) {
      head = i
      break
    }
  }

  for (let i = tail = lines.length - 1; i >= 0; --i) {
    if (!/^\s*$/.test(lines[i])) {
      tail = i
      break
    }
  }

  return lines.slice(head, tail + 1)
}
