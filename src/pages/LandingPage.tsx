import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Testimonials from '../components/landing/Testimonials'
import Pricing from '../components/landing/Pricing'
import AIChatWidget from '../components/common/AIChatWidget'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="landing" />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />

        {/* Final CTA */}
        <section className="py-28 lg:py-36 bg-background relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), rgba(168,85,247,0.4), transparent)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/30 mb-6">
                Get Started Today
              </p>
              <h2 className="text-[clamp(2.2rem,5vw,3.75rem)] font-bold leading-[1.06] tracking-[-0.03em] text-white mb-6">
                Your next hire deserves<br />
                <span style={{
                  background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  a better first day.
                </span>
              </h2>
              <p className="text-[15px] text-white/40 font-light leading-relaxed mb-10 max-w-lg mx-auto">
                Join 500+ teams already using Prarambh to get new hires productive in 48 hours — with zero manual setup.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold px-8 py-3.5 rounded-full text-white"
                    style={{
                      background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
                      boxShadow: '0 0 40px rgba(168,85,247,0.3)',
                    }}
                  >
                    Start for free <ArrowRight size={14} />
                  </motion.div>
                </Link>
                <Link to="/admin">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold px-8 py-3.5 rounded-full border text-white/50 transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderColor: 'rgba(255,255,255,0.08)',
                    }}
                  >
                    View live demo
                  </motion.div>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5 text-[12px] text-white/25">
                {['14-day free trial', 'Setup in 15 minutes', 'Cancel anytime'].map(item => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={11} className="text-brand-secondary" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  )
}

