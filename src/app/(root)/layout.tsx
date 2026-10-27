import "@/styles/globals.css";

// Layout raiz mínimo da página "/" (só redireciona para o idioma do navegador).
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
