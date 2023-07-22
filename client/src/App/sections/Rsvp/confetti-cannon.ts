import { logger } from '@app/log'

const log = logger('confetti-cannon')

export const load_confetti_canon_cdn = () => {
  const script = document.createElement('script')
  script.async = true

  const onload = () => {
    log.debug('confetti-cannon loaded')
    script.removeEventListener('load', onload)
  }
  script.addEventListener('load', onload)

  script.src =
    'https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.11.0/tsparticles.confetti.bundle.min.js'
  document.body.appendChild(script)
}

/* "I give up" */
function confetti(...args: any[]) {
  // @ts-ignore
  if (!window.confetti) {
    return
  }

  // @ts-ignore
  const _confetti: any = window.confetti
  return _confetti(...args)
}

function shoot_stars() {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
  }

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'],
    })

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle'],
    })
  }

  setTimeout(shoot, 0)
  setTimeout(shoot, 100)
  setTimeout(shoot, 200)
}

export function shoot_hearts() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['heart'],
    colors: ['FFC0CB', 'FF69B4', 'FF1493', 'C71585'],
  }

  confetti({
    ...defaults,
    particleCount: 50,
    scalar: 2,
  })

  confetti({
    ...defaults,
    particleCount: 25,
    scalar: 3,
  })

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 4,
  })
}

function shoot_rainbows_and_unicorns() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
  }

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 30,
      scalar: 1.2,
      shapes: ['circle', 'square'],
      colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
    })

    confetti({
      ...defaults,
      particleCount: 20,
      scalar: 2,
      shapes: ['text'],
      shapeOptions: {
        text: {
          value: ['🦄', '🌈'],
        },
      },
    })
  }

  setTimeout(shoot, 0)
  setTimeout(shoot, 100)
  setTimeout(shoot, 200)
}

let i = 0
export const shoot_confetti = () => {
  if (i % 3 === 0) {
    shoot_stars()
  } else if (i % 3 === 1) {
    shoot_hearts()
  } else {
    shoot_rainbows_and_unicorns()
  }
  i += 1
}
