/**
  https://github.com/matteobruni/tsparticles/tree/main/bundles/confetti
  TODO: use their package
*/
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

type ConfettiEvent = {
  clientX: number
  clientY: number
}

/** the `position` option to confetti requires a 0 <= n <= 100 value

  the result of this calculation is that the confetti pops out from wherever the user clicked */
function io_get_position_from_event({ clientX, clientY }: ConfettiEvent) {
  const position = {
    x: Math.round((clientX / window.innerWidth) * 100),
    y: Math.round((clientY / window.innerHeight) * 100),
  }
  return { position }
}

function shoot_stars(event: ConfettiEvent) {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
    ...io_get_position_from_event(event),
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

export function shoot_hearts(event: ConfettiEvent) {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['heart'],
    colors: ['FFC0CB', 'FF69B4', 'FF1493', 'C71585'],
    ...io_get_position_from_event(event),
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

function shoot_rainbows_and_unicorns(event: ConfettiEvent) {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    ...io_get_position_from_event(event),
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
export const shoot_confetti = (event: ConfettiEvent) => {
  const round_robbin: Record<0 | 1 | 2, (o: ConfettiEvent) => void> = {
    0: shoot_stars,
    1: shoot_hearts,
    2: shoot_rainbows_and_unicorns,
  }

  round_robbin[(i++ % 3) as 0 | 1 | 2](event)
}
