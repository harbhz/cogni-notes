import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import NoteProvider from "@/providers/NoteProvider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cogni Notes"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NoteProvider>
            <div className="app-shell grid min-h-screen lg:grid-cols-[272px_minmax(0,1fr)]">
              <aside className="app-sidebar">
                <AppSidebar />
              </aside>
              
              <div className="app-main flex min-w-0 flex-col">
                <Header />
                <main className="flex-1 overflow-auto px-4 py-5 sm:px-8 sm:py-8">
                  {children}
                </main>
              </div>
            </div>

            <Toaster />
          </NoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
