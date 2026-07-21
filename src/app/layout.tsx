import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tules ITF · Explorador técnico",
  description: "Explorador visual de tules, técnicas, posturas y significados del Taekwon-Do ITF.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
