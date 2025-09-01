import { Inter } from 'next/font/google'
import { AppProvider } from '@/contexts/AppContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Productivity Workspace - Notion-like App',
  description: 'A modern productivity application for organizing your thoughts and projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}