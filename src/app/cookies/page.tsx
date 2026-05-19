import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div style={{ background: '#FDFBF8', minHeight: '100vh' }}>
      <div style={{ background: '#141414', borderBottom: '1px solid rgba(201,162,80,0.2)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg">
            <span>Shreeji</span><span style={{ color: '#C9A250' }}> Associate</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#141414' }}>Cookie Policy</h1>
        <div className="h-1 w-16 rounded mb-8" style={{ background: '#C9A250' }} />
        <div className="space-y-6 text-base leading-relaxed" style={{ color: '#141414CC' }}>
          <p>This website uses minimal cookies to ensure basic functionality. We do not use advertising or tracking cookies.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>Essential Cookies</h2>
          <p>We use a single session cookie for the admin panel authentication. This cookie is strictly necessary for security and is not used for any tracking purpose.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>Third-Party Cookies</h2>
          <p>We do not use any third-party analytics, advertising, or social media cookies on this website.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>Contact</h2>
          <p>For any queries, contact us at <a href="mailto:jayshah5059@gmail.com" style={{ color: '#C9A250' }}>jayshah5059@gmail.com</a>.</p>
        </div>
        <div className="mt-12">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm"
            style={{ background: '#141414', color: '#C9A250' }}>
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
