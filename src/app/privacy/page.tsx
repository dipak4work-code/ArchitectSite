import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#141414' }}>Privacy Policy</h1>
        <div className="h-1 w-16 rounded mb-8" style={{ background: '#C9A250' }} />
        <div className="space-y-6 text-base leading-relaxed" style={{ color: '#141414CC' }}>
          <p>At Shreeji Associate, we are committed to protecting your privacy. This policy describes how we collect, use, and safeguard your personal information.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>Information We Collect</h2>
          <p>We collect information you voluntarily provide through our contact forms, including your name, email address, phone number, and project details. We do not collect any information automatically beyond standard server logs.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>How We Use Your Information</h2>
          <p>Your information is used solely to respond to your enquiries, provide project quotations, and communicate about our construction and interior design services. We do not sell or share your information with third parties.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>Contact</h2>
          <p>For any privacy-related questions, contact us at <a href="mailto:jayshah5059@gmail.com" style={{ color: '#C9A250' }}>jayshah5059@gmail.com</a> or call <a href="tel:+919173034401" style={{ color: '#C9A250' }}>+91 9173034401</a>.</p>
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
