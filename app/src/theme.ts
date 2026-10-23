// Design-Tokens für LernTok. Screens und Komponenten lesen Farben und Abstände
// ausschließlich von hier, nie als feste Werte.

export const colors = {
  bg: '#0B0C10',
  surface: '#16181F',
  surfaceAlt: '#111318',
  border: '#2A2E39',
  accent: '#C8F560',
  accentInk: '#0B0C10',
  accentSoft: '#1D2312',
  text: '#F4F5F7',
  textMuted: '#A3A8B5',
  danger: '#FF6B4A',
} as const;

export type ColorToken = keyof typeof colors;

/** Raster in 4 px. `space[4]` ist also 16 px. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  11: 44,
  12: 48,
  16: 64,
} as const;

export const gutter = space[4];

export const radius = {
  pill: 999,
  button: 999,
  card: 16,
  input: 14,
} as const;

export const layout = {
  buttonHeight: 52,
  minTouch: 44,
  tabBarHeight: 64,
} as const;

export const fonts = {
  heading: 'SpaceGrotesk_700Bold',
  headingMedium: 'SpaceGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export const typeScale = {
  display: { fontFamily: fonts.heading, fontSize: 32, lineHeight: 40 },
  h1: { fontFamily: fonts.heading, fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: fonts.heading, fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: fonts.headingMedium, fontSize: 18, lineHeight: 24 },
  merksatz: { fontFamily: fonts.heading, fontSize: 26, lineHeight: 34 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.bodySemi, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 16 },
} as const;

export const icon = {
  strokeWidth: 1.75,
  size: 22,
  small: 18,
} as const;
