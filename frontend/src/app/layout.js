import Navigation from "./components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";
import favicon from "./favicon.ico";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const key = Math.round(Math.random() * 999999999000);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation key={key} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
