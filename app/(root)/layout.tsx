import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import { ruRU } from "@clerk/localizations";

import Topbar from '@/Components/shared/Topbar';
import Bottombar from '@/Components/shared/Bottombar';
import LeftSidebar from '@/Components/shared/LeftSidebar';






const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Razum Capital',
  description: 'Razum Capital investment',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider  localization={ruRU}>

    <html lang="en">
      <body className={inter.className}>
        <Topbar  />
        <main className="flex flex-row">
          <LeftSidebar />
          <section className='main-container'>
            <div className='w-full max-w-4xl'>
              {children}
            </div>
          </section>
        </main>
        <Bottombar/>
        </body>
    </html>
    </ClerkProvider>
  )
}
