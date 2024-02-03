import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConverClientProvider } from "@/providers/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Big Board",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConverClientProvider>
          <Toaster />
          <ModalProvider />
          {children}
        </ConverClientProvider>
      </body>
    </html>
  );
}
