import type { Patch } from '.'

export function* createAnimator(input: string, patches: Patch[]) {
  let output = input
  let cursor = 0

  for (const patch of patches) {
    if (patch.type === 'insert') {
      cursor = patch.from
      const head = output.slice(0, patch.from)
      const tail = output.slice(patch.from)
      let selection = ''
      for (const char of patch.text) {
        selection += char
        yield {
          cursor: cursor + selection.length,
          output: head + selection + tail,
        }
      }
      output = head + selection + tail
    }

    if (patch.type === 'removal') {
      for (let i = patch.length; i >= 0; i--) {
        yield {
          cursor: cursor - i,
          output: output.slice(0, patch.from - patch.length + i) + output.slice(patch.from),
        }
      }
      output = output.slice(0, patch.from - patch.length) + output.slice(patch.from)
    }
  }

  return {
    output,
  }
}
