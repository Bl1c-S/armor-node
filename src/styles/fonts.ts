import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";

export const fontSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * Combined CSS variable class names to keep layout.tsx clean
 */
export const fontVariables = `${fontSans.variable} ${fontMono.variable}`;
