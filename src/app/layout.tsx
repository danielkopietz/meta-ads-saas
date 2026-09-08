import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kampagnenwerk | Meta Ads für Agenturen",
    template: "%s | Kampagnenwerk",
  },
  description: "Kampagnen schneller planen, prüfen und verwalten.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
