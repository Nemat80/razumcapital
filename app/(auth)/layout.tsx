import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ruRU } from "@clerk/localizations";

import '../globals.css'

export const metadata = {
  title: "Razum capital",
  description: "Razum Capital investment",
};

const inter = Inter({subsets: ["latin"]})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return  (
    <ClerkProvider  localization={ruRU}>
        <html lang="en">
            <body className={`${inter.className} bg-dark-1`}>
                {children}
            </body>
        </html>
    </ClerkProvider>
    )
}
