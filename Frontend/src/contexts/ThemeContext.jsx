import { useLayoutEffect } from 'react';

const LIGHT_VARS = {
  /* Page backgrounds */
  '--color-ivory':      '#F9F6F0',
  '--color-ivory-deep': '#F0ECE4',
  '--color-ivory-dark': '#E5DFD3',
  /* Primary text */
  '--color-ink':        '#0A0A0A',
  '--color-ink-soft':   '#1A1A1A',
  '--color-ink-muted':  '#666666',
  '--color-border':     '#D8D2C4',
  '--color-sand':       '#EFEBE1',
  /* Glass surfaces */
  '--color-glass-bg':       'rgba(0,0,0,0.03)',
  '--color-glass-bg-2':     'rgba(0,0,0,0.025)',
  '--color-glass-border':   'rgba(0,0,0,0.09)',
  '--color-glass-border-2': 'rgba(0,0,0,0.06)',
  /* Text at varying opacities */
  '--color-text-bright': 'rgba(10,10,10,0.88)',
  '--color-text-mid':    'rgba(10,10,10,0.65)',
  '--color-text-soft':   'rgba(10,10,10,0.50)',
  '--color-text-dim':    'rgba(10,10,10,0.42)',
  '--color-text-faint':  'rgba(10,10,10,0.28)',
};

function applyVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeProvider({ children }) {
  useLayoutEffect(() => {
    applyVars(LIGHT_VARS);
    document.documentElement.setAttribute('data-theme', 'light');
    // Clear any previously saved theme preference
    try { localStorage.removeItem('ls-theme'); } catch {}
  }, []);

  return children;
}
