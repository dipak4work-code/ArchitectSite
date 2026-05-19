import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#141414' }}>Terms of Service</h1>
        <div className="h-1 w-16 rounded mb-8" style={{ background: '#C9A250' }} />
        <div className="space-y-6 text-base leading-relaxed" style={{ color: '#141414CC' }}>
          <p>By engaging with Shreeji Associate for construction or interior design services, you agree to the following terms.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>Services</h2>
          <p>Shreeji Associate provides residential construction, commercial projects, interior designing, renovation, turnkey solutions, and site consultancy services in Vadodara, Gujarat. All project scopes, timelines, and costs are agreed upon in writing before work commences.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>Quotations</h2>
          <p>Online quotations are approximate estimates only. Final pricing is confirmed after an on-site inspection. No changes are accepted after the design is approved by the client.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>Payment</h2>
          <p>Payment terms are as agreed in the project contract: 30% advance, 25% after 20 days, 25% after 20 days, and 20% on final stage completion.</p>
          <h2 className="text-xl font-bold mt-8 mb-2" style={{ color: '#141414' }}>Contact</h2>
          <p>For any queries, contact us at <a href="mailto:jayshah5059@gmail.com" style={{ color: '#C9A250' }}>jayshah5059@gmail.com</a> or call <a href="tel:+919173034401" style={{ color: '#C9A250' }}>+91 9173034401</a>.</p>
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
