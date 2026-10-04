import { cookies, headers } from "next/headers";
import { fontVariables } from "@/styles/fonts";
import { THEME_COOKIE_NAME } from "@/types/theme";
import { LG_COOKIE } from "@/types/i18n";
import { resolveThemeClass } from "@/utils/theme";
import { resolveServerLanguage } from "@/utils/i18n";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headersList = await headers();

  const lang = resolveServerLanguage(
    cookieStore.get(LG_COOKIE)?.value,
    headersList.get("accept-language")
  );

  const themeClass = resolveThemeClass(
    cookieStore.get(THEME_COOKIE_NAME)?.value
  );

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${themeClass} ${fontVariables} h-full antialiased`.trim()}
    >
      <head>
        <title>ArmorNode</title>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
