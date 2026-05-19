import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-4">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-display text-sm font-medium">Gandaki Graphics</span>
          <span className="text-xs font-light text-gray-400">Custom DTF Printing — Gandaki Province, Nepal</span>
        </div>

        <div className="flex gap-6 text-xs text-gray-400">
          <Link href="/#services" className="hover:text-gray-700 transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-gray-700 transition-colors">Gallery</Link>
          <Link href="/about" className="hover:text-gray-700 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gray-700 transition-colors">Contact</Link>
          <Link href="/order" className="hover:text-gray-700 transition-colors">Order</Link>
        </div>

        <p className="text-xs text-gray-300 font-light">
          © {new Date().getFullYear()} Gandaki Graphics
        </p>
      </div>
    </footer>
  )
}
