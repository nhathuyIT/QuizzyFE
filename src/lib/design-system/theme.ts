export const colors = {
  purple: "#9b87f5",
  purpleDark: "#7c5cbf",
  pink: "#f4a4c0",
  pinkBg: "#f7b5c8",
  blue: "#00bcd4",
  teal: "#00c8c8",
  red: "#e63329",
  yellow: "#f5d547",
  black: "#111111",
  white: "#ffffff",
  gray: "#a0a0a8",
  grayLight: "#c8c8d0",
  bg: "#f2f0eb",
  success: "#22c55e",
} as const;

export const spacing = {
  sectionPadding: "80px 40px",
  cardRadius: "20px",
  sm: "12px",
  md: "20px",
  lg: "40px",
  xl: "80px",
} as const;

export const breakpoints = {
  xs: "480px",
  sm: "600px",
  md: "900px",
  lg: "1200px",
  xl: "1440px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 12px rgba(0,0,0,0.08)",
  lg: "0 8px 24px rgba(0,0,0,0.12)",
  xl: "0 20px 60px rgba(0,0,0,0.15)",
} as const;

export const transitions = {
  fast: "0.15s ease",
  base: "0.2s ease",
  slow: "0.3s ease",
} as const;

export type ColorKey = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type BreakpointKey = keyof typeof breakpoints;
