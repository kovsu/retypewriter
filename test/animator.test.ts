import { describe, expect, it } from 'vitest'
import { calculatePath, diff } from '../src'
import { craeteAnimator } from '../src/animator'

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
    const patches = calculatePath(delta)

    const animator = craeteAnimator(input, patches)
    expect([...animator]).toMatchSnapshot('animator')
  })
})
