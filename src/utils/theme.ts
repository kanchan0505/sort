export type Theme = 'dark' | 'light'

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return (localStorage.getItem('sortflow-theme') as Theme) || 'dark'
}

export function setTheme(theme: Theme) {
  localStorage.setItem('sortflow-theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export function initializeTheme() {
  const theme = getInitialTheme()
  setTheme(theme)
  return theme
}