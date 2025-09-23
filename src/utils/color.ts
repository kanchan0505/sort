import { scaleLinear } from 'd3-scale'

export type PaletteId = 'default' | 'high-contrast' | 'colorblind'

export function createColorScale(maxValue: number, palette: PaletteId = 'default') {
  const max = Math.max(1, maxValue)
  switch (palette) {
    case 'high-contrast': {
      const s = scaleLinear<string>().domain([0, max]).range(['#22d3ee', '#f59e0b']) // cyan -> amber
      return (v: number) => s(Math.max(0, Math.min(v, max)))
    }
    case 'colorblind': {
      // Okabe-Ito palette endpoints (blue -> vermilion)
      const s = scaleLinear<string>().domain([0, max]).range(['#0072B2', '#D55E00'])
      return (v: number) => s(Math.max(0, Math.min(v, max)))
    }
    case 'default':
    default: {
      const s = scaleLinear<string>().domain([0, max]).range(['#60a5fa', '#a78bfa']) // blue -> violet
      return (v: number) => s(Math.max(0, Math.min(v, max)))
    }
  }
}

export function withAlpha(hex: string, alpha: number) {
  // accept #rrggbb
  const a = Math.round(alpha * 255)
  const aa = a.toString(16).padStart(2, '0')
  return hex + aa
}
