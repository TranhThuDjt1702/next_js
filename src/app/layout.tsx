import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "river",
  description: "djtme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className="bg-gray-100 text-gray-900">
          {
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <ToastContainer 
                autoClose={2000}
                bodyClassName="text-sm font-medium"
                position="top-right"
                />
            </ThemeProvider>
          }
        </body>
      </html>
    </ClerkProvider>
  );
}
