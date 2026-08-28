import type { TextStyle } from "react-native";
import { colors } from "./colors";

export const fontFamily = {
  sans: "Poppins",
  fallback: "System",
} as const;

export const typography = {
  h1: { fontSize: 32, lineHeight: 38, fontWeight: "700", color: colors.neutral.textPrimary },
  h2: { fontSize: 24, lineHeight: 31, fontWeight: "600", color: colors.neutral.textPrimary },
  h3: { fontSize: 20, lineHeight: 26, fontWeight: "600", color: colors.neutral.textPrimary },
  h4: { fontSize: 16, lineHeight: 22, fontWeight: "500", color: colors.neutral.textPrimary },
  bodyLarge: { fontSize: 16, lineHeight: 26, fontWeight: "400", color: colors.neutral.textPrimary },
  bodyMedium: { fontSize: 14, lineHeight: 22, fontWeight: "400", color: colors.neutral.textPrimary },
  bodySmall: { fontSize: 13, lineHeight: 21, fontWeight: "400", color: colors.neutral.textSecondary },
  caption: { fontSize: 11, lineHeight: 15, fontWeight: "400", color: colors.neutral.textSecondary },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
