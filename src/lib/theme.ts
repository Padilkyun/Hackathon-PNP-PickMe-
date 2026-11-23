export const neonColors = {
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  lime: '#CCFF00',
  orange: '#FF8800',
  purple: '#A855F7',
} as const;

export const colorRoles = {
  primary: neonColors.cyan,
  secondary: neonColors.magenta,
  accent: neonColors.lime,
  warning: neonColors.orange,
  info: neonColors.purple,
} as const;

export const semanticColors = {
  bg: {
    primary: '#020617',
    secondary: '#0F172A',
    tertiary: '#172033',
    card: '#1E293B',
    hover: '#334155',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B',
    inverse: '#020617',
  },
  border: {
    default: '#334155',
    neon: '#00FFFF',
    subtle: '#1E293B',
  },
} as const;

export type NeonColorKey = keyof typeof neonColors;
export type ColorRoleKey = keyof typeof colorRoles;