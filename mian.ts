import _TypeIt from 'typeit'
import { calculatePath, diff } from './src'

const TypeIt = _TypeIt as any
const inputEl = document.getElementById('input')! as HTMLInputElement
const outputEl = document.getElementById('output')! as HTMLInputElement
const typeEl = document.getElementById('typing')! as HTMLInputElement

let input = `
  describe('should', () => {
    it('exported', () => {
      expect(one).toEqual(1)
    })
  })
`

let output = `
  describe('should', () => {
    it('hi', () => {
      expect(two).toEqual(2)
      expect(one).toEqual(1)
    })
  })
`

inputEl.value = input
outputEl.value = output

let typeit: any

function start() {
  if (typeit)
    typeit.reset()

  typeit = new TypeIt(typeEl, {
    speed: 50,
    startDelay: 900,
  })

  const patches = calculatePath(diff(input, output))
  // console, log(patches)
  typeit
    .type(input, { instant: true })

  for (const patch of patches) {
    typeit
      .pause(800)

    if (patch.type === 'insert') {
      typeit
        .move(null, { to: 'START', instant: true })
        .move(patch.from, { instant: true })
        .type(patch.text, { delay: 100 })
    }

    if (patch.type === 'removal') {
      typeit
        .move(patch.from - inputEl.value.length, { instant: true })
        .delete(patch.length, { delay: 100 })
    }
  }

  typeit.go()
}

start()

inputEl.addEventListener('input', () => {
  input = inputEl.value
  start()
})

outputEl.addEventListener('input', () => {
  output = outputEl.value
  start()
})
