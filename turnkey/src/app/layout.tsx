import { ReactQueryProvider } from "@/features/react-query";
import { Providers } from "@/providers";
import type { Metadata } from "next";
import "./globals.css";
import { WarningDialogProvider } from "@/features/warning-dialog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OneBalance Bitcoin Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>
          <ReactQueryProvider>
            <WarningDialogProvider>{children}</WarningDialogProvider>
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
