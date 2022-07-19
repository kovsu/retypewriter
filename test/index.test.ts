import { describe, expect, it } from 'vitest'
import { applyPatches, calculatePath, diff } from '../src'

const input = `
  describe('should', () => {
    it('exported', () => {
      expect(one).toEqual(1)
    })
  })
`

const output = `
  describe('should', () => {
    it('hi', () => {
      expect(two).toEqual(2)
      expect(one).toEqual(1)
    })
  })
`

describe('should', () => {
  it('exported', () => {
    const delta = diff(input, output)
    expect(delta).toMatchSnapshot('delta')

    const patches = calculatePath(delta)
    expect(patches).toMatchSnapshot('patches')

    const applied = applyPatches(input, patches)
    expect(applied).toMatchSnapshot('output')

    expect(applied.output).toEqual(output)
  })
})
