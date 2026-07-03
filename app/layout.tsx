// app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import PublicNavbar from "@/components/shared/PublicNavbar";
import PublicFooter from "@/components/shared/PublicFooter.tsx";

export const metadata: Metadata = {
  title: "Local Guide Platform - Discover Authentic Experiences",
  description: "Connect with local guides for authentic travel experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <PublicNavbar />
            <main className="flex-1">{children}</main>
            <PublicFooter />
          </div>
        </AuthProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
