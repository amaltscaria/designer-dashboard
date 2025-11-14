'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ScrollAnimation from '../components/ScrollAnimation'

const images = [
  {
    url: 'https://res.cloudinary.com/deveb1jqw/image/upload/v1732193941/DD/DD1_gdlq7e.png',
    width: 1400,
    height: 1521,
    alt: 'Designer Dashboard - Overview'
  },
  {
    url: 'https://res.cloudinary.com/deveb1jqw/image/upload/v1732193940/DD/DD2_fqmph4.png',
    width: 1400,
    height: 2164,
    alt: 'Designer Dashboard - Interface Customization'
  },
  {
    url: 'https://res.cloudinary.com/deveb1jqw/image/upload/v1732193940/DD/DD3_gjgwuy.png',
    width: 1400,
    height: 1344,
    alt: 'Designer Dashboard - Design System'
  },
  {
    url: 'https://res.cloudinary.com/deveb1jqw/image/upload/v1732193951/DD/DD4_i6vdxr.png',
    width: 1400,
    height: 3338,
    alt: 'Designer Dashboard - Workflow'
  },
  {
    url: 'https://res.cloudinary.com/deveb1jqw/image/upload/v1732193950/DD/DD5_kbghet.png',
    width: 1400,
    height: 3086,
    alt: 'Designer Dashboard - Implementation'
  }
]

export default function DesignerDashboard() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  const { scrollY } = useScroll()
  const orb1Y = useTransform(scrollY, [0, 1000], [0, 200])
  const orb2Y = useTransform(scrollY, [0, 1000], [0, -150])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div style={{ y: orb1Y }} className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full blur-3xl" />
        <motion.div style={{ y: orb2Y }} className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="https://aruntscaria.com" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 hover:from-orange-500/20 hover:via-amber-500/20 hover:to-yellow-500/20 backdrop-blur-sm border border-white/30 rounded-full p-2 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <svg className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <span className="hidden md:inline text-sm text-gray-300 group-hover:text-orange-400 transition-colors duration-300 font-medium">Back to Home</span>
            </a>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div className="text-xl font-bold text-white">Designer Dashboard</div>
            </div>

            <div className="w-24 hidden md:block"></div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimation>
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Designer Dashboard
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-4">A centralized dashboard designed for stakeholders and clients</p>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">Enabling effortless customization of web interfaces to meet unique requirements</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2}>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {['Figma', 'Adobe XD', 'Adobe Illustrator', 'Lucidchart', 'Zeplin', 'Prototyping', 'Wireframing', 'User Research', 'Information Architecture', 'Interaction Design'].map((tech, index) => (
                <span key={index} className="px-4 py-2 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/10 rounded-full text-sm text-gray-300 hover:border-orange-500/50 transition-all duration-300">
                  {tech}
                </span>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          {images.map((image, index) => (
            <ScrollAnimation key={index} delay={index * 0.1}>
              <div className="mb-12 group">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 transition-all duration-300 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="w-full h-auto rounded-lg"
                    unoptimized
                  />
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      <footer className="relative bg-gradient-to-br from-zinc-900 to-black text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
            Let&apos;s Create Something Amazing
          </h3>
          <p className="text-xl mb-8 text-gray-300">Available for UX design opportunities in the UK and remote projects worldwide.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:aruntharappel95@gmail.com" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-amber-600 transition-all">Get in Touch</a>
            <a href="https://aruntscaria.com" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-orange-500 text-orange-400 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all">View Portfolio</a>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-gray-500 text-sm">© 2025 Designer Dashboard. Crafted with passion for exceptional user experiences.</p>
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full hover:from-orange-600 hover:to-amber-600 transition-all" aria-label="Back to top">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        </button>
      )}
    </div>
  )
}
