'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ScrollAnimation from '../components/ScrollAnimation'

type PlatformKey = 'web' | 'mobile' | 'designer'

const platforms: Record<PlatformKey, {
  name: string
  audience: string
  tagline: string
  description: string
  video: string
  features: string[]
  accent: string
  icon: React.ReactNode
  isMobile?: boolean
}> = {
  web: {
    name: 'Web Dashboard',
    audience: 'For Healthcare Providers',
    tagline: 'Real-time patient monitoring at scale',
    description: 'A comprehensive clinical interface enabling healthcare providers to monitor vitals, review patient histories, manage care plans, and respond to alerts — all from a single dashboard.',
    video: '/videos/web-dashboard.mp4',
    features: ['Vitals Monitoring', 'Patient Records', 'Care Plans', 'Alert System', 'Analytics'],
    accent: 'from-orange-500 to-amber-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <line x1="3" y1="20" x2="21" y2="20" />
        <line x1="9" y1="16" x2="9" y2="20" />
        <line x1="15" y1="16" x2="15" y2="20" />
      </svg>
    ),
  },
  mobile: {
    name: 'Mobile Application',
    audience: 'For Patients',
    tagline: 'Healthcare in the palm of your hand',
    description: 'A patient-facing mobile app for iOS and Android, supporting vital recordings, medication reminders, symptom tracking, education, chat with clinicians, and remote device pairing.',
    video: '/videos/mobile-app.mp4',
    features: ['Vitals Recording', 'Reminders', 'Symptom Diary', 'Clinician Chat', 'Device Pairing', 'Education'],
    accent: 'from-amber-500 to-yellow-500',
    isMobile: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
    ),
  },
  designer: {
    name: 'Designer Dashboard',
    audience: 'For Admins & Clients',
    tagline: 'Customize the experience without code',
    description: 'A centralized no-code platform empowering clients and stakeholders to configure web interfaces, manage branding, and tailor the patient-facing experience — all while preserving design system integrity.',
    video: '/videos/designer-dashboard.mp4',
    features: ['UI Customization', 'Branding Controls', 'Live Preview', 'Design System', 'Role Management'],
    accent: 'from-yellow-500 to-orange-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 10v6m11-11h-6M7 12H1m15.5-7.5l-4.5 4.5M7.5 16.5L3 21m0-18l4.5 4.5m9 9l4.5 4.5" />
      </svg>
    ),
  },
}

const ease = [0.16, 1, 0.3, 1] as const

function PlatformSection({ platformKey, index }: { platformKey: PlatformKey; index: number }) {
  const platform = platforms[platformKey]
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="relative">
      {/* Section header */}
      <ScrollAnimation>
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${platform.accent} text-white text-xs font-semibold flex items-center gap-2 shadow-lg`}>
                <span className="text-[10px] tracking-wider uppercase">0{index + 1}</span>
                <span className="w-1 h-1 rounded-full bg-white/60" />
                <span>{platform.audience}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${platform.accent} flex items-center justify-center text-white shadow-lg`}>
                {platform.icon}
              </div>
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
                {platform.name}
              </h3>
            </div>
            <p className="text-lg md:text-xl text-orange-400/90 font-light italic">
              {platform.tagline}
            </p>
          </div>
          <div className="md:max-w-md">
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              {platform.description}
            </p>
          </div>
        </div>
      </ScrollAnimation>

      {/* Big video */}
      <ScrollAnimation delay={0.2}>
        <div className={`relative group rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-3 md:p-4 hover:border-orange-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10`}>
          <div className={`relative rounded-2xl overflow-hidden bg-black ${platform.isMobile ? 'max-w-md mx-auto aspect-[9/19]' : 'aspect-video'}`}>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={platform.video} type="video/mp4" />
            </video>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 md:gap-3">
              <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white hover:border-orange-500/50 transition-colors text-xs md:text-sm"
              >
                {isPlaying ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                    <span className="hidden sm:inline">Play</span>
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={toggleMute}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 backdrop-blur-md border rounded-full text-xs md:text-sm transition-all duration-300 ${
                  isMuted
                    ? 'bg-orange-500/90 border-orange-400 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-black/60 border-white/20 text-white hover:border-orange-500/50'
                }`}
              >
                {isMuted ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    <span className="hidden sm:inline font-medium">Unmute</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    <span className="hidden sm:inline">Sound On</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Live badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-medium tracking-wider">LIVE PROTOTYPE</span>
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-5 px-1">
            {platform.features.map((feature) => (
              <span key={feature} className="text-xs md:text-sm text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:border-orange-500/30 hover:text-orange-400 transition-all duration-300">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </ScrollAnimation>
    </div>
  )
}

export default function CareAtHome() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false)

  const { scrollY } = useScroll()
  const orb1Y = useTransform(scrollY, [0, 1000], [0, 200])
  const orb2Y = useTransform(scrollY, [0, 1000], [0, -150])
  const orb3Y = useTransform(scrollY, [0, 2000], [0, -300])

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Parallax orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div style={{ y: orb1Y }} className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/8 to-amber-500/8 rounded-full blur-[120px]" />
        <motion.div style={{ y: orb2Y }} className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-orange-400/6 to-yellow-500/6 rounded-full blur-[100px]" />
        <motion.div style={{ y: orb3Y }} className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/4 to-orange-600/4 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10">
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
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div className="text-xl font-bold text-white">Care@Home</div>
            </div>

            <div className="w-24 hidden md:block"></div>
          </div>
        </div>
      </nav>

      {/* Hero — Cinematic */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setHeroVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${heroVideoLoaded ? 'opacity-40' : 'opacity-0'}`}
          >
            <source src="/videos/web-dashboard.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-orange-500/30 bg-orange-500/5 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-400 text-xs tracking-[0.3em] uppercase font-medium">Healthcare UX Ecosystem</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.2 }}
              className="text-[clamp(2.5rem,10vw,8rem)] lg:text-9xl font-bold tracking-tight leading-none"
            >
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Care</span>
              <span className="text-white">@Home</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.6 }}
            className="text-xl md:text-3xl text-gray-200 max-w-3xl mx-auto mb-4 leading-relaxed font-light"
          >
            Three connected products. <span className="text-orange-400">One unified care experience.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.8 }}
            className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-12"
          >
            An integrated remote patient monitoring ecosystem — built for clinicians, patients, and admins to work in harmony.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {['Adobe XD', 'Figma', 'Illustrator', 'Agile Methodology', 'Design Systems', 'Healthcare UX', 'Prototyping', 'User Research'].map((tech) => (
              <span key={tech} className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-sm text-gray-200 hover:border-orange-500/50 hover:text-orange-400 transition-all duration-300">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Explore all 3 platforms</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], height: [6, 10, 6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-0.5 bg-orange-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Strip */}
      <section className="relative z-10 border-y border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {[
              { value: '3 Platforms', label: 'Ecosystem' },
              { value: '1000+ Screens', label: 'Designed' },
              { value: '100+ Sprints', label: 'Delivered' },
              { value: 'Healthcare', label: 'Industry' },
            ].map((stat, i) => (
              <ScrollAnimation key={stat.label} delay={i * 0.1}>
                <div className="py-8 md:py-12 px-6 md:px-10 text-center group hover:bg-white/[0.02] transition-colors duration-500">
                  <div className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors duration-500">{stat.value}</div>
                  <div className="text-xs text-gray-600 uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Three Platforms — Big Inline Videos */}
      <section className="relative z-10 py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <div className="text-center mb-16 md:mb-24">
              <p className="text-orange-400 text-xs tracking-[0.3em] uppercase mb-4">The Ecosystem</p>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Three Products. One Mission.</h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                Each prototype plays live below — with sound, interactions, and the full experience.
              </p>
            </div>
          </ScrollAnimation>

          <div className="space-y-24 md:space-y-32">
            {(Object.keys(platforms) as PlatformKey[]).map((key, i) => (
              <PlatformSection key={key} platformKey={key} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Project at Scale — All Screens */}
      <section className="relative z-10 py-24 md:py-32 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimation>
            <div className="mb-12 md:mb-16 text-center">
              <p className="text-orange-400 text-xs tracking-[0.3em] uppercase mb-4">Project at Scale</p>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">1000+ Screens. iOS & Android.</h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                Every flow. Every edge case. Every state. A complete patient mobile app designed from the ground up over 100+ sprints.
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2}>
            <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-3 md:p-5 hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="relative rounded-2xl overflow-hidden bg-black">
                <Image
                  src="/images/all-screens.png"
                  alt="All Care@Home patient mobile app screens — iOS and Android"
                  width={2400}
                  height={2000}
                  className="w-full h-auto"
                  priority
                />
              </div>

              <div className="absolute inset-3 md:inset-5 pointer-events-none">
                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-medium text-white">
                    Complete design spec
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-orange-500/90 backdrop-blur-md text-xs font-medium text-white">
                    Just a portion
                  </span>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-8">
              {['Authentication', 'Device Pairing', 'Home', 'Settings', 'Reminders', 'Questionnaire', 'Blood Pressure', 'Weight', 'ECG', 'Cough/Speech', 'Chat', 'Blood Glucose', 'Symptoms', 'Education', 'Body Temp.', 'Patient Diary'].map((category) => (
                <div key={category} className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-center text-xs text-gray-400 hover:border-orange-500/30 hover:text-orange-400 transition-all duration-300">
                  {category}
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Design Process */}
      <section className="relative z-10 py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <div className="text-center mb-16 md:mb-20">
              <p className="text-orange-400 text-xs tracking-[0.3em] uppercase mb-4">Methodology</p>
              <h2 className="text-4xl md:text-5xl font-bold">Agile Design Process</h2>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Discover', desc: 'Stakeholder workshops, clinician interviews, and patient persona development' },
              { num: '02', title: 'Define', desc: 'Information architecture, user journeys, and platform-specific requirements' },
              { num: '03', title: 'Design', desc: 'Wireframes, design systems, and high-fidelity prototypes across all platforms' },
              { num: '04', title: 'Deliver', desc: 'Prototypes, design specs, and collaborative handoff with development teams' },
            ].map((step, i) => (
              <ScrollAnimation key={step.num} delay={i * 0.1}>
                <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 hover:border-orange-500/30 hover:bg-gradient-to-br hover:from-zinc-900 hover:to-zinc-800 transition-all duration-500 h-full">
                  <div className="text-4xl md:text-5xl font-bold text-orange-500/60 mb-4">{step.num}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <p className="text-gray-500 text-sm">&copy; 2025 Care@Home. Crafted with passion for exceptional user experiences.</p>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      {showBackToTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25" aria-label="Back to top">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        </button>
      )}
    </div>
  )
}
