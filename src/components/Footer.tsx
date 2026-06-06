import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/gandakigraphics' },
  { label: 'Facebook', href: 'https://facebook.com/gandakigraphics' },
  { label: 'WhatsApp', href: 'https://wa.me/9779769499307?text=Hi%20Gandaki%20Graphics!%20I%20want%20to%20start%20an%20order.' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-4">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-display text-sm font-medium">Gandaki Graphics</span>
          <span className="text-xs font-light text-gray-400">Custom DTF Printing — Gandaki Province, Nepal</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-6 text-xs text-gray-400 flex-wrap justify-center">
            <Link href="/#services" className="hover:text-gray-700 transition-colors">Services</Link>
            <Link href="/gallery" className="hover:text-gray-700 transition-colors">Gallery</Link>
            <Link href="/about" className="hover:text-gray-700 transition-colors">About</Link>
            <Link href="/track" className="hover:text-gray-700 transition-colors">Track order</Link>
            <Link href="/contact" className="hover:text-gray-700 transition-colors">Contact</Link>
            <Link href="/order" className="hover:text-gray-700 transition-colors">Order</Link>
          </div>
          <div className="flex gap-4 text-[11px] text-gray-400">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-300 font-light">
          © {new Date().getFullYear()} Gandaki Graphics
        </p>
      </div>
    </footer>
  )
}
