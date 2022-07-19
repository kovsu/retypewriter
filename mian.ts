import { calculatePath, createAnimator, diff } from './src'

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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let timeout: number
function debounce(func: Function, wait: number) {
  if (timeout)
    clearTimeout(timeout)
  timeout = setTimeout(func, wait)
}

async function start() {
  const _input = input
  const patches = calculatePath(diff(_input, output))
  const animator = createAnimator(_input, patches)
  // console, log(patches)
  for (const result of animator) {
    typeEl.textContent = result.output
    await sleep(100)
  }
}

start()

inputEl.addEventListener('input', () => {
  input = inputEl.value
  debounce(start, 1000)
})

outputEl.addEventListener('input', () => {
  output = outputEl.value
  debounce(start, 1000)
})
