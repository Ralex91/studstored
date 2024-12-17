import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import TanstackProvider from "@/providers/TanStackProvider"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "StudStored",
  description: "StudStored est une application de gestion d'élèves",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 mx-auto max-w-6xl w-full py-4 flex flex-col">
              {children}
            </main>
          </div>
          <Toaster />
        </TanstackProvider>
      </body>
    </html>
  )
}
