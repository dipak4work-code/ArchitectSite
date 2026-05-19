import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { Portfolio } from '@/components/Portfolio'
import { Testimonials } from '@/components/Testimonials'
import { Blog } from '@/components/Blog'
import { Quotation } from '@/components/Quotation'
import { Contact } from '@/components/Contact'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Blog />
      <Quotation />
      <Contact />
      <Footer />
    </main>
  )
}