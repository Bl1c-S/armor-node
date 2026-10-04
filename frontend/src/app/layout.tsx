import { fontVariables } from "@/styles/fonts";
import "./globals.css";

const clientInitScript = `(function(){try{var t=localStorage.getItem("armor_theme");if(t==="dark"||t==="light"){document.documentElement.classList.add(t);}var l=localStorage.getItem("armor_language");if(l){document.documentElement.lang=(l==="ua"?"uk":l);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        <title>ArmorNode</title>
        <script
          dangerouslySetInnerHTML={{
            __html: clientInitScript,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
