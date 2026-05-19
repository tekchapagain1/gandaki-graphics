import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gandaki Graphics — Custom DTF Printing',
  description:
    'Professional Direct-to-Film printing for t-shirts, hoodies, and custom cups in Gandaki Province. Upload your artwork and we bring it to life.',
  keywords: ['DTF printing', 'custom t-shirt', 'hoodie printing', 'cup design', 'Gandaki', 'Nepal'],
  openGraph: {
    title: 'Gandaki Graphics — Custom DTF Printing',
    description: 'Your design, perfectly printed. T-shirts, hoodies & cups.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
