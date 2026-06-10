import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Gandaki Graphics',
  image: 'https://gandakigraphics.com/gallery/logo.png',
  telephone: '+9779769499307',
  email: 'gandakigraphicshome@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gandaki Province',
    addressCountry: 'NP',
  },
  description: 'Professional Direct-to-Film printing for t-shirts, hoodies, and custom cups in Gandaki Province.',
  url: 'https://gandakigraphics.com',
  areaServed: 'Gandaki Province, Nepal',
  priceRange: '₹₹',
}

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          as="style"
        />
        <link rel="preload" href="/shirt_baked.glb" as="fetch" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-gray-900">
        {children}

        {/* Mobile sticky CTA */}
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 z-50 flex gap-2">
          <a
            href="tel:+9779769499307"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-900 text-xs font-medium tracking-widest uppercase rounded-lg hover:bg-gray-50 transition-colors"
          >
            📞 Call
          </a>
          <Link
            href="/order"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-xs font-medium tracking-widest uppercase rounded-lg hover:bg-gray-700 transition-colors"
          >
            Order now →
          </Link>
        </div>
      </body>
    </html>
  )
}
