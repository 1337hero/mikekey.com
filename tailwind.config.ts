export default {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: 'var(--font-family-display)',
        base: 'var(--font-family-base)',
        mono: 'var(--font-family-mono)',
      },
      fontSize: {
        'step-min-3': 'var(--size-step-min-3)',
        'step-min-2': 'var(--size-step-min-2)',
        'step-min-1': 'var(--size-step-min-1)',
        'step-0': 'var(--size-step-0)',
        'step-1': 'var(--size-step-1)',
        'step-2': 'var(--size-step-2)',
        'step-3': 'var(--size-step-3)',
        'step-4': 'var(--size-step-4)',
        'step-code': 'var(--size-step-code)',
      },
      lineHeight: {
        flat: 'var(--leading-flat)',
        fine: 'var(--leading-fine)',
        standard: 'var(--leading-standard)',
        loose: 'var(--leading-loose)',
      },
      letterSpacing: {
        normal: 'var(--tracking)',
        tight: 'var(--tracking-s)',
        wide: 'var(--tracking-wide)',
      },
    },
  },
} satisfies import('tailwindcss').Config;
