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
      <body>{children}<script src="/constructor-analytics.js" defer></script><script src="/constructor-brand-identity.js" defer></script><script src="/constructor-settings.js" defer></script><script src={"https://constructor-api-prod.vercel.app/v1/projects/P-349LPT/analytics/script.js"} defer></script><script src="/constructor-editor.js" defer></script></body>
    </html>
  );
}
