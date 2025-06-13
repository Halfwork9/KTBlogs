import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AppProvider } from "@/context/AppContext";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Kernel Thoughts",
  description: "A blog of insightful, technical thoughts.",
  icons: {
  icon: [{ rel: "icon", url: "/favicon.png" }],
}
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar/>
          <SidebarProvider>{children}</SidebarProvider>
        </AppProvider>
      </body>
    </html>
  );
}
