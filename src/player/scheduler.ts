export type Scheduler = {
  play(): void
  pause(): void
  step(n?: number): void
  seek(idx: number): void
  setSpeed(mult: number): void
  isPlaying(): boolean
  getCursor(): number
  onTick(cb: (cursor: number) => void): () => void
}

export function createScheduler(length: number, onUpdate: (cursor: number) => void): Scheduler {
  let cursor = -1
  let playing = false
  let speed = 1
  let timer: any = null
  const listeners = new Set<(c: number) => void>()

  function emit() {
    onUpdate(cursor)
    listeners.forEach((l) => l(cursor))
  }

  function tick() {
    if (!playing) return
    cursor = Math.min(cursor + 1, length - 1)
    emit()
    if (cursor >= length - 1) pause()
  }

  function play() {
    if (playing) return
    playing = true
    const interval = Math.max(8, 1000 / (30 * speed))
    timer = setInterval(tick, interval)
  }
  function pause() {
    playing = false
    if (timer) clearInterval(timer)
    timer = null
  }
  function step(n = 1) {
    pause()
    cursor = Math.max(-1, Math.min(cursor + n, length - 1))
    emit()
  }
  function seek(idx: number) {
    cursor = Math.max(-1, Math.min(idx, length - 1))
    emit()
  }
  function setSpeed(mult: number) {
    speed = Math.max(0.1, Math.min(mult, 20))
    if (playing) {
      pause()
      play()
    }
  }
  function isPlaying() {
    return playing
  }
  function getCursor() {
    return cursor
  }
  function onTick(cb: (cursor: number) => void) {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }

  return { play, pause, step, seek, setSpeed, isPlaying, getCursor, onTick }
}
