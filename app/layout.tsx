import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comal Vivo — El fuego reúne.",
  description: "Comal Vivo: demostración de una taquería ficticia en Roma Norte. Carta y reservas de ejemplo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}<script src="/constructor-analytics.js" defer></script></body>
    </html>
  );
}
