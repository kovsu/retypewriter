import type { Diff } from 'diff-match-patch'
import { diff_match_patch as DMP } from 'diff-match-patch'
export interface InsertPatch {
  type: 'insert'
  from: number
  text: string
}

export interface RemovalPatch {
  type: 'removal'
  from: number
  length: number
}

export type Patch = InsertPatch | RemovalPatch

export function diff(a: string, b: string): Diff[] {
  const differ = new DMP()
  const delta = differ.diff_main(a, b)
  differ.diff_cleanupSemantic(delta)
  return delta
}

export function calculatePath(diffs: Diff[]): Patch[] {
  const patches: Patch[] = []
  let index = 0
  for (const diff of diffs) {
    if (diff[0] === 0) {
      index += diff[1].length
      continue
    }

    if (diff[0] === -1) {
      patches.push({
        type: 'removal',
        from: index + diff[1].length,
        length: diff[1].length,
      })
    }

    if (diff[0] === 1) {
      patches.push({
        type: 'insert',
        from: index,
        text: diff[1],
      })
      index += diff[1].length
    }
  }
  return patches
}

export function applyPatches(input: string, patches: Patch[]) {
  let output = input

  for (const patch of patches) {
    if (patch.type === 'insert') {
      output
        = output.slice(0, patch.from) + patch.text + output.slice(patch.from)
    }
    if (patch.type === 'removal') {
      output
        = output.slice(0, patch.from - patch.length) + output.slice(patch.from)
    }
  }

  return { output }
}
