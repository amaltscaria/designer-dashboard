'use client'

import Image from 'next/image'
import { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, useMotionValue, animate } from 'framer-motion'
import ScrollAnimation from '../components/ScrollAnimation'

type LightboxImage = { src: string; alt: string }
const LightboxContext = createContext<{ open: (img: LightboxImage) => void }>({ open: () => {} })
const useLightbox = () => useContext(LightboxContext)

function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<LightboxImage | null>(null)
  const open = useCallback((img: LightboxImage) => setCurrent(img), [])
  const close = useCallback(() => setCurrent(null), [])

  useEffect(() => {
    if (!current) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [current, close])

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <button
              onClick={(e) => { e.stopPropagation(); close() }}
              aria-label="Close fullscreen"
              className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-orange-500/60 transition-all backdrop-blur-md cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.3em] uppercase text-gray-400 pointer-events-none">
              ESC or click to close
            </div>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative cursor-default flex items-center justify-center"
              style={{ width: '95vw', height: '92vh' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.src}
                alt={current.alt}
                className="rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] border border-white/10"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  )
}

function ZoomableImage({ src, alt, width, height, className, wrapperClassName }: { src: string; alt: string; width: number; height: number; className?: string; wrapperClassName?: string }) {
  const { open } = useLightbox()
  return (
    <button
      type="button"
      onClick={() => open({ src, alt })}
      aria-label={`View ${alt} fullscreen`}
      className={`group relative block w-full p-0 m-0 border-0 bg-transparent cursor-zoom-in ${wrapperClassName ?? ''}`}
    >
      <Image src={src} alt={alt} width={width} height={height} className={className} />
      <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-mono tracking-wider uppercase">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          Zoom
        </span>
      </span>
    </button>
  )
}

function Counter({ to, suffix = '', duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const count = useMotionValue(0)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
    })
    return controls.stop
  }, [inView, to, duration, count])

  return <span ref={ref}>{display}{suffix}</span>
}

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

function PlatformIntro({ platformKey, index }: { platformKey: PlatformKey; index: number }) {
  const platform = platforms[platformKey]
  return (
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
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${platform.accent} flex items-center justify-center text-white shadow-lg`}>
              {platform.icon}
            </div>
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              {platform.name}
            </h3>
          </div>
          <p className="text-xl md:text-2xl lg:text-3xl text-orange-300 font-light italic leading-snug">
            {platform.tagline}
          </p>
        </div>
        <div className="md:max-w-md">
          <p className="text-gray-200 text-base md:text-lg leading-relaxed">
            {platform.description}
          </p>
        </div>
      </div>
    </ScrollAnimation>
  )
}

function PlatformVideo({ platformKey }: { platformKey: PlatformKey }) {
  const platform = platforms[platformKey]
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <ScrollAnimation delay={0.1}>
      <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-3 md:p-4 hover:border-orange-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            controls
            controlsList="nodownload"
          >
            <source src={platform.video} type="video/mp4" />
          </video>

          {/* Presenter rewind controls (top-right) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <motion.button
              onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Rewind 5 seconds"
              className="flex items-center gap-1.5 px-3 py-2 bg-black/70 backdrop-blur-md border border-white/20 rounded-full text-white hover:border-orange-500/50 transition-colors text-xs font-medium"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 17l-5-5 5-5" /><path d="M18 17l-5-5 5-5" /></svg>
              <span>5s</span>
            </motion.button>
            <motion.button
              onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 15) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Rewind 15 seconds"
              className="flex items-center gap-1.5 px-3 py-2 bg-black/70 backdrop-blur-md border border-white/20 rounded-full text-white hover:border-orange-500/50 transition-colors text-xs font-medium"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 17l-5-5 5-5" /><path d="M18 17l-5-5 5-5" /></svg>
              <span>15s</span>
            </motion.button>
          </div>

          {/* Live badge */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-xs font-medium tracking-wider">LIVE PROTOTYPE</span>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-5 px-1">
          {platform.features.map((feature) => (
            <span key={feature} className="text-xs md:text-sm text-gray-300 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:border-orange-500/30 hover:text-orange-400 transition-all duration-300">
              {feature}
            </span>
          ))}
        </div>
      </div>
    </ScrollAnimation>
  )
}

type Story = {
  chapter: string
  name: string
  subtitle: string
  beats: {
    quote: string
    intro: string
    boldPhrase?: string
    introTail?: string
  }
  beat1Image?: { src: string; caption: string }
  beat1Stat?: { value: string; label: string; sub?: string }
  scene: { value: string; label: string }[]
  beat3: { title: string; intro: string; type: 'downstream' | 'patient-view' | 'five-tabs'; cards?: { title: string; body: string }[]; image1?: { src: string; caption: string }; image2?: { src: string; caption: string } }
  beat4: { title: string; intro: string; type: 'depth' | 'today' | 'data-grid'; image1?: { src: string; caption: string }; image2?: { src: string; caption: string }; quote?: string; quoteBody?: string; cards?: { title: string; body: string }[]; sideImage?: { src: string; caption: string }; sideImage2?: { src: string; caption: string } }
  beat8Image?: { src: string; caption: string }
  painpoints: { eyebrow: string; text: string }[]
  beat6: { existing: { items: string[]; tagline: string }; future: { items: string[]; tagline: string } }
  explorations: { status: 'rejected' | 'shipped'; title: string; body: string; image?: string }[]
  tradeoff: string
  unlocked: { body: string; sub: string; image?: { src: string; caption: string } }
  prototypeUrl: string
}

type StoryWithKey = Story & { platformKey: PlatformKey }

const stories: StoryWithKey[] = [
  {
    chapter: '01',
    platformKey: 'web',
    name: 'Web Dashboard',
    subtitle: 'Where nurses see the complete patient picture, so no deterioration goes unnoticed',
    beats: {
      quote: '"These are premium clients. We cannot miss anything. Every patient deserves 100% care."',
      intro: 'Care@Home was serving Mayo Clinic, Novartis, and other major health systems. Their patients were not in hospital beds. They were at home, monitored remotely. ',
      boldPhrase: 'Nurses needed to spot deterioration before it became an emergency.',
      introTail: ' Missing a single signal could mean missing a life threatening event.',
    },
    beat1Image: { src: '/images/web-dashboard/03-patient-list.png', caption: 'Patient list — every patient, every vital, at a glance' },
    beat8Image: { src: '/images/web-dashboard/07-patient-list-default.png', caption: 'Patient list — what the dashboard opens to now' },
    scene: [
      { value: '2', label: 'Designers' },
      { value: '1', label: 'PM' },
      { value: '5+', label: 'Engineers' },
      { value: '100+', label: 'Sprints' },
    ],
    beat3: {
      title: '03 · THE COMPLETE PATIENT VIEW',
      intro: 'Nurses do not just need vitals. They need the entire clinical picture in one place.',
      type: 'patient-view',
      cards: [
        { title: 'Vitals', body: 'Continuous and episodic. BP, heart rate, SpO2, glucose, weight. Graphs over time.' },
        { title: 'Information', body: 'Demographics, medical history, care team, primary and secondary care paths.' },
        { title: 'Evaluations', body: 'How patients answered questionnaires. Heart failure, COPD, symptom reports.' },
        { title: 'Medications', body: 'Active and discontinued. Dosage, frequency, titration notes, tolerance issues.' },
        { title: 'Audio Samples', body: 'Cough and speech recordings for clinical analysis.' },
        { title: 'Clinical Notes', body: 'Symptom escalations, intervention notes, observations from the care team.' },
        { title: 'Care Logs', body: 'Operational history. Video calls, chart reviews, durations, outcomes.' },
        { title: 'Patient Diary', body: 'Patient generated notes. "Medication out of stock." "Feet swollen today."' },
        { title: 'Devices', body: 'Connection status, battery levels, last sync. BP cuffs, wearables, scales.' },
      ],
    },
    beat4: {
      title: '04 · STEPPING IN THEIR SHOES',
      intro: 'Watched nurses during their monitoring shifts. Saw how they triaged. What they trusted. What they ignored. Where they got pulled into noise. Heard the same concern repeatedly: "What if I miss someone getting worse?"',
      type: 'data-grid',
    },
    painpoints: [
      { eyebrow: 'CLINICIANS', text: 'Drowning in alerts, missing the urgent ones' },
      { eyebrow: 'DATA', text: 'Scattered across multiple tools and tabs' },
      { eyebrow: 'TRIAGE', text: 'No way to know which patient needs attention first' },
    ],
    beat6: {
      existing: {
        items: ['Vitals in one tool', 'Notes in another', 'Medications in a third', 'Patient calls go through email', 'Nurses jump between systems', 'Critical signals get lost'],
        tagline: 'Fragmented. Risky. Easy to miss things.',
      },
      future: {
        items: ['One patient view, all data unified', 'Vitals, evaluations, medications, notes', 'Care logs and patient diary in context', 'Device status visible at a glance', 'Nurse stays in one tool', 'No data missed, no time wasted'],
        tagline: 'Unified. Confident. Complete.',
      },
    },
    explorations: [
      { status: 'rejected', title: 'Everything on one screen', body: 'Information dense, but nurses had to scan through noise to find what mattered. Too much cognitive load.', image: '/images/web-dashboard/04-rejected-one-screen.svg' },
      { status: 'rejected', title: 'Alert centric dashboard', body: 'Showed alerts first, patients second. Nurses lost context. They needed the patient story, not just the alarm.', image: '/images/web-dashboard/05-rejected-alert-centric.svg' },
      { status: 'shipped', title: 'Categorized patient view', body: 'One patient at a time. Information organized by clinical category. Nurses see what they need, when they need it. No noise, no scrolling for the signal.', image: '/images/web-dashboard/06-patient-detail-vitals.jpeg' },
    ],
    tradeoff: 'Nurses lost the population overview by default. The dashboard now opens to a patient list, not a vitals heatmap. Power users who liked seeing all 60 patients at once had to switch views. A deliberate choice. The depth of one patient mattered more than the breadth of all of them.',
    unlocked: {
      body: 'Nurses stopped opening five tools to understand one patient. The complete patient story lives in one place. Vitals, medications, evaluations, care logs, patient diary, all visible in context. No data missed. No deterioration unnoticed.',
      sub: '100% care, the way premium clients deserve.',
      image: { src: '/images/web-dashboard/08-patient-diary.jpeg', caption: 'Patient diary — every signal the patient reports, in context' },
    },
    prototypeUrl: 'https://designer-dashboard.aruntscaria.com',
  },
  {
    chapter: '02',
    platformKey: 'mobile',
    name: 'Patient App',
    subtitle: 'Daily care for people who are unwell, without overwhelming them',
    beats: {
      quote: '"If recording vitals takes ten minutes, elderly patients give up. We need it to take two."',
      intro: 'Care@Home is remote care. Patients are at home, not in hospital. They are often elderly, often managing multiple chronic conditions. The app cannot ask too much. ',
      boldPhrase: 'Every extra tap is a missed reading. Every missed reading is a clinical risk.',
      introTail: ' Every confused patient is one who stops using it.',
    },
    beat1Image: { src: '/images/patient-app/05-todays-tasks.jpeg', caption: 'Today\'s tasks — what the patient sees the moment they open the app' },
    beat1Stat: { value: '2 min', label: 'Target time to record a vital', sub: 'Down from 10 minutes. The threshold between a habit and an abandoned app.' },
    beat8Image: { src: '/images/patient-app/06-bp-recorded.jpeg', caption: 'A vital recorded — the single next task, done' },
    scene: [
      { value: '1', label: 'Designer (sole)' },
      { value: '1', label: 'PM' },
      { value: '5+', label: 'Engineers' },
      { value: '100+', label: 'Sprints' },
    ],
    beat3: {
      title: '03 · FIVE TABS, ONE GOAL',
      intro: 'The bottom navigation is the entire product. If it does not work, nothing else matters.',
      type: 'five-tabs',
      cards: [
        { title: 'Today', body: 'What needs doing right now' },
        { title: 'Vitals', body: 'Record and review measurements' },
        { title: 'Medication', body: 'What to take, when' },
        { title: 'Activity', body: 'What you completed today' },
        { title: 'Settings', body: 'Devices, preferences, support' },
      ],
    },
    beat4: {
      title: '04 · THE TODAY SCREEN',
      intro: 'When a patient opens the app, they see one thing first: what they need to do today, in plain language, with their device status confirming everything is ready.',
      type: 'today',
      quote: '"By 11 AM, record your blood pressure. Your wearable is 100% charged. Your BP cuff is ready."',
      quoteBody: 'Not a calendar. Not a list of metrics. Not a wall of charts. Just the next task, the device they need, and the time. Recognition, not recall.',
      sideImage: { src: '/images/patient-app/05-todays-tasks.jpeg', caption: "Today's tasks" },
      sideImage2: { src: '/images/patient-app/06-bp-recorded.jpeg', caption: 'Blood pressure recorded' },
    },
    painpoints: [
      { eyebrow: 'PATIENTS', text: 'Cognitive overload from too many options' },
      { eyebrow: 'DEVICES', text: 'Pairing felt as complex as setting up a new phone' },
      { eyebrow: 'DATA', text: 'Missed readings meant clinicians lost visibility' },
    ],
    beat6: {
      existing: {
        items: ['Open app to a complex dashboard', 'Hunt for "record BP" button', 'Pair device manually each time', 'Navigate through three screens', 'Submit and confirm', 'Total time: 8-10 minutes'],
        tagline: 'Friction. Frustration. Patients give up.',
      },
      future: {
        items: ["Open app, see today's task", 'Tap "Record BP"', 'Device auto pairs (already known)', 'Reading captured automatically', 'Confirm with one tap', 'Total time: 2 minutes'],
        tagline: 'Easy. Habitual. Patients return daily.',
      },
    },
    explorations: [
      { status: 'rejected', title: 'Calendar grid view', body: 'Showed everything at once. Felt clinical and overwhelming. Elderly patients felt judged by what they had not yet done.', image: '/images/patient-app/07-rejected-calendar.svg' },
      { status: 'rejected', title: 'Long checklist', body: 'Too many items visible. Patients lost focus. The next thing they needed to do was buried.', image: '/images/patient-app/08-rejected-checklist.svg' },
      { status: 'shipped', title: 'One task card at a time', body: 'Always shows the single next thing to do. Plain language. Time stamped. Device status confirmed. No friction.', image: '/images/patient-app/09-shipped-task-card.jpeg' },
    ],
    tradeoff: 'Power users who liked seeing the whole week at a glance lost the calendar view by default. It is still available behind a setting, but the home screen now shows only the next task. The 80% of patients who were overwhelmed mattered more than the 20% who were confident.',
    unlocked: {
      body: 'Patients stopped abandoning the app in week two. Recording vitals became a 2 minute habit, not a 10 minute chore. Clinicians stopped chasing missing readings. The app became part of the daily routine, not another thing to manage.',
      sub: 'The simplest part of the platform. The most important.',
      image: { src: '/images/patient-app/06-bp-recorded.jpeg', caption: 'Two minutes. Done. The habit, not the chore.' },
    },
    prototypeUrl: 'https://designer-dashboard.aruntscaria.com',
  },
  {
    chapter: '03',
    platformKey: 'designer',
    name: 'Designer Dashboard',
    subtitle: 'One configuration tool. Three downstream products. Programs running across geographies and languages.',
    beats: {
      quote: '"Mayo Singapore needs heart failure in English, Spanish, and Chinese. Every program is a custom build."',
      intro: 'Care@Home was rolling out to ',
      boldPhrase: 'major US health systems and global pharma partners',
      introTail: '. Each program needed its own care path, its own vitals, its own questionnaires, in its own languages. Engineering kept rebuilding the same setup for every new client. Onboarding took weeks per program.',
    },
    scene: [
      { value: '1', label: 'Designer (sole)' },
      { value: '1', label: 'PM' },
      { value: '5', label: 'Engineers' },
      { value: '1', label: 'QA' },
      { value: '100+', label: 'Sprints' },
    ],
    beat3: {
      title: '03 · ONE TOOL. THREE DOWNSTREAM PRODUCTS.',
      intro: 'A single change in the dashboard reaches every product clinicians and patients use.',
      type: 'downstream',
      image1: { src: '/images/designer-dashboard/04-patient-app-vitals.png', caption: 'Patient App — what patients see' },
      image2: { src: '/images/designer-dashboard/05-web-dashboard-carelogs.png', caption: 'Web Dashboard — what nurses see' },
    },
    beat4: {
      title: '04 · WHAT THEY CONFIGURE',
      intro: 'A program for heart failure or COPD is not one screen. It is a stack of decisions.',
      type: 'depth',
      image1: { src: '/images/designer-dashboard/02-vitals-monitoring.png', caption: 'Vitals scheduling, devices, compliance' },
      image2: { src: '/images/designer-dashboard/03-multilingual-questionnaire.png', caption: 'Multilingual custom questionnaires' },
    },
    painpoints: [
      { eyebrow: 'CLIENTS', text: 'No control over their own programs' },
      { eyebrow: 'ENGINEERING', text: 'Repeating the same setup per program' },
      { eyebrow: 'SYSTEM', text: 'No safe path between custom and consistent' },
    ],
    beat6: {
      existing: {
        items: ['Client emails clinical requirements', 'PM logs engineering tickets', 'Engineers configure manually', 'QA tests against requirements', 'Release in next sprint', 'Repeat for next program'],
        tagline: 'Slow, manual, scales linearly with clients',
      },
      future: {
        items: ['Admin opens dashboard', 'Picks care path and program', 'Configures vitals, schedules, rules', 'Previews each downstream product', 'Publishes to production'],
        tagline: 'Self serve, safe, scales without engineering',
      },
    },
    explorations: [
      { status: 'rejected', title: 'One long form per program', body: 'Too many clicks, too many fields. Admins lost their place midway through.' },
      { status: 'rejected', title: 'Side by side editor with live preview', body: 'The preview pulled attention away from the configuration. Admins watched the preview instead of focusing on the work.' },
      { status: 'shipped', title: 'Nested categories, preview on demand', body: 'Drill into one category at a time. Switch tabs to preview each downstream product.', image: '/images/designer-dashboard/02-vitals-monitoring.png' },
    ],
    beat1Image: { src: '/images/designer-dashboard/01-program-creation.png', caption: 'Program creation: Mayo_Singapore + Novartis' },
    beat8Image: { src: '/images/designer-dashboard/07-program-features.png', caption: 'Program features — every toggle a deliberate exposure of depth' },
    tradeoff: 'The dashboard exposes a lot. Every vital, every schedule, every language, every rule. Admins can configure it all, but it requires training. This is not a tool a nurse picks up in five minutes. A deliberate choice. Depth for the people who run the platform, simplicity for the people downstream.',
    unlocked: {
      body: 'Hospital onboarding stopped going through the engineering queue. Admins built and updated their own programs. The same platform now serves heart failure in Singapore, COPD elsewhere, and a dozen other protocols, without a custom build for each.',
      sub: 'Built once. Configured infinitely.',
      image: { src: '/images/designer-dashboard/06-carepaths-list.png', caption: 'Multiple shipped programs running in parallel' },
    },
    prototypeUrl: 'https://designer-dashboard.aruntscaria.com',
  },
]

function StoryBeat({ eyebrow, children, className = '' }: { eyebrow: string; children: React.ReactNode; className?: string }) {
  // Split "01 · How it started" into number and label for typographic treatment
  const [num, ...rest] = eyebrow.split(/\s*[·•—]\s*/)
  const label = rest.join(' · ')
  return (
    <ScrollAnimation>
      <div className={`mb-14 md:mb-20 ${className}`}>
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-mono text-orange-400/90 text-sm tracking-wider">{num}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-orange-500/40 via-orange-500/15 to-transparent max-w-[120px]" />
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-orange-300/90">{label || eyebrow}</span>
        </div>
        {children}
      </div>
    </ScrollAnimation>
  )
}

function StoryFigure({ src, caption, alt, device = 'desktop', secondary }: { src: string; caption?: string; alt: string; device?: 'desktop' | 'mobile'; secondary?: { src: string; caption: string } }) {
  if (device === 'mobile') {
    const phones = secondary ? [{ src, alt, caption }, { src: secondary.src, alt: secondary.caption, caption: secondary.caption }] : [{ src, alt, caption }];
    return (
      <figure className="m-0">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black shadow-2xl shadow-black/40 flex items-center justify-center py-10 md:py-14 px-4">
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
            }}
          />
          <div className="absolute top-6 left-6 font-mono text-[9px] tracking-[0.3em] uppercase text-orange-400/70">iOS · Patient</div>
          <div className="absolute bottom-6 right-6 font-mono text-[9px] tracking-[0.3em] uppercase text-gray-500">Care@Home</div>
          <div className="relative flex gap-4 md:gap-6 items-center justify-center w-full">
            {phones.map((p, i) => (
              <div
                key={i}
                className={`relative rounded-[2.2rem] border-[10px] border-zinc-800 bg-zinc-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden ${
                  phones.length > 1 ? 'max-w-[180px] w-1/2' : 'max-w-[260px] w-full'
                }`}
              >
                <ZoomableImage src={p.src} alt={p.alt} width={400} height={850} className="w-full h-auto block" />
              </div>
            ))}
          </div>
          {phones.length > 1 && (
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-400/40 pointer-events-none hidden md:block"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          )}
        </div>
        {(caption || secondary) && (
          <figcaption className="font-mono text-[11px] tracking-wider text-gray-400 mt-3 pl-1">
            {secondary ? `${caption} → ${secondary.caption}` : caption}
          </figcaption>
        )}
      </figure>
    )
  }
  return (
    <figure className="m-0">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40">
        <ZoomableImage src={src} alt={alt} width={1600} height={1000} className="w-full h-auto" />
      </div>
      {caption && <figcaption className="font-mono text-[11px] tracking-wider text-gray-400 mt-3 pl-1">{caption}</figcaption>}
    </figure>
  )
}

function UXStorySection({ story }: { story: StoryWithKey }) {
  return (
    <article className="relative py-20 md:py-28 border-b border-white/5 last:border-b-0">
      {/* Story header — editorial chapter opener */}
      <ScrollAnimation>
        <div className="mb-16 md:mb-24">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-orange-400 mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-orange-400" />
            <span>The UX Story · Chapter {story.chapter}</span>
          </div>
          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
            {/* Giant chapter number as design element */}
            <div className="font-serif-display italic text-orange-500/85 leading-none select-none" style={{ fontSize: 'clamp(7rem, 18vw, 16rem)' }}>
              {story.chapter}
            </div>
            <div className="md:pt-6">
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.02] tracking-tight">
                {story.name}
              </h3>
              <p className="font-serif-display italic text-gray-200 leading-[1.4] max-w-3xl" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}>
                {story.subtitle}
              </p>
            </div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Beat 1 — How it started */}
      <StoryBeat eyebrow="01 · How it started">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
          <div className="space-y-8">
            {/* Pull quote — no box, just the words */}
            <blockquote className="relative pl-6 border-l-2 border-orange-500/70">
              <p className="font-serif-display italic text-white leading-[1.3]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
                {story.beats.quote}
              </p>
            </blockquote>
            <p className="text-gray-100 text-base md:text-lg leading-[1.8]">
              {story.beats.intro}
              {story.beats.boldPhrase && <span className="text-white font-semibold underline decoration-orange-500/60 decoration-2 underline-offset-4">{story.beats.boldPhrase}</span>}
              {story.beats.introTail}
            </p>
            {story.beat1Stat && (
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="font-serif-display italic text-orange-400 leading-none" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
                    {story.beat1Stat.value}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-gray-300 max-w-[14rem]">
                    {story.beat1Stat.label}
                  </span>
                </div>
                {story.beat1Stat.sub && (
                  <p className="font-serif-display italic text-gray-400 mt-3 leading-relaxed" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)' }}>
                    {story.beat1Stat.sub}
                  </p>
                )}
              </div>
            )}
          </div>
          {story.beat1Image && (
            <StoryFigure
              src={story.beat1Image.src}
              caption={story.beat1Image.caption}
              alt={story.beat1Image.caption}
              device={story.platformKey === 'mobile' ? 'mobile' : 'desktop'}
            />
          )}
        </div>
      </StoryBeat>

      {/* Beat 2 — Setting the scene */}
      <StoryBeat eyebrow="02 · Setting the scene">
        <div className={`grid grid-cols-2 ${story.scene.length === 5 ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-3 md:gap-4`}>
          {story.scene.map((stat) => (
            <div key={stat.label} className="bg-zinc-900/80 border border-white/15 rounded-2xl px-4 py-6 text-center hover:border-orange-500/40 hover:bg-zinc-900 transition-colors duration-300">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-[11px] tracking-wider uppercase text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </StoryBeat>

      {/* Beat 3 — varies per story */}
      <StoryBeat eyebrow={story.beat3.title}>
        <p className="text-gray-200 text-base md:text-lg leading-[1.8] mb-7 max-w-3xl">{story.beat3.intro}</p>
        {story.beat3.type === 'downstream' && story.beat3.image1 && story.beat3.image2 && (
          <div className="grid md:grid-cols-2 gap-6">
            <StoryFigure src={story.beat3.image1.src} caption={story.beat3.image1.caption} alt={story.beat3.image1.caption} />
            <StoryFigure src={story.beat3.image2.src} caption={story.beat3.image2.caption} alt={story.beat3.image2.caption} />
          </div>
        )}
        {story.beat3.type === 'five-tabs' && story.beat3.cards && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {story.beat3.cards.map((c) => (
              <div key={c.title} className="bg-zinc-900/80 border border-white/15 rounded-xl px-4 py-5 hover:border-orange-500/40 hover:bg-zinc-900 transition-colors">
                <h4 className="text-white font-semibold text-sm mb-1.5">{c.title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        )}
        {story.beat3.type === 'patient-view' && story.beat3.cards && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {story.beat3.cards.map((c) => (
              <div key={c.title} className="bg-zinc-900/80 border border-white/15 rounded-xl p-5 hover:border-orange-500/40 hover:bg-zinc-900 transition-colors">
                <h4 className="text-white font-semibold text-base mb-2">{c.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        )}
      </StoryBeat>

      {/* Beat 4 — varies per story */}
      <StoryBeat eyebrow={story.beat4.title}>
        <p className="text-gray-200 text-base md:text-lg leading-[1.8] mb-7 max-w-3xl">{story.beat4.intro}</p>
        {story.beat4.type === 'depth' && story.beat4.image1 && story.beat4.image2 && (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <StoryFigure src={story.beat4.image1.src} caption={story.beat4.image1.caption} alt={story.beat4.image1.caption} />
              {/* Stack of decisions — literal hierarchy illustrating the depth */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/15 rounded-2xl p-5 md:p-6">
                <p className="text-[10px] tracking-[0.25em] uppercase text-orange-400 font-semibold mb-4">A STACK OF DECISIONS</p>
                <ol className="space-y-2">
                  {[
                    { label: 'Care path', depth: 0 },
                    { label: 'Vital monitoring', depth: 1 },
                    { label: 'BP measurement', depth: 2 },
                    { label: 'Schedule 1', depth: 3 },
                    { label: 'Frequency: Day / Week', depth: 4 },
                    { label: 'Session start & end time', depth: 5 },
                    { label: 'Repeat pattern', depth: 6 },
                  ].map((row, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-[13px] md:text-sm leading-snug"
                      style={{ paddingLeft: `${row.depth * 14}px` }}
                    >
                      <span className="font-mono text-[10px] text-orange-400/60 w-4 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      {row.depth > 0 && (
                        <span className="text-orange-500/40 font-mono text-xs select-none" aria-hidden>└─</span>
                      )}
                      <span className={row.depth === 0 ? 'text-white font-semibold' : 'text-gray-200'}>{row.label}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-gray-400 text-xs italic mt-4 leading-relaxed border-t border-white/10 pt-3">
                  Seven levels deep, for one vital, in one care path. Every program is hundreds of these decisions, structured.
                </p>
              </div>
            </div>
            <StoryFigure src={story.beat4.image2.src} caption={story.beat4.image2.caption} alt={story.beat4.image2.caption} />
          </div>
        )}
        {story.beat4.type === 'today' && story.beat4.quote && (
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div className="space-y-6">
              <blockquote className="relative pl-6 border-l-2 border-orange-500/70">
                <p className="font-serif-display italic text-white leading-[1.3]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
                  {story.beat4.quote}
                </p>
              </blockquote>
              <p className="text-gray-100 text-base md:text-lg leading-[1.8]">{story.beat4.quoteBody}</p>
            </div>
            {story.beat4.sideImage && (
              <StoryFigure
                src={story.beat4.sideImage.src}
                caption={story.beat4.sideImage.caption}
                alt={story.beat4.sideImage.caption}
                device={story.platformKey === 'mobile' ? 'mobile' : 'desktop'}
                secondary={story.beat4.sideImage2}
              />
            )}
          </div>
        )}
      </StoryBeat>

      {/* Beat 5 — Key painpoints (editorial, no boxes) */}
      <StoryBeat eyebrow="05 · Key painpoints">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {story.painpoints.map((p, i) => (
            <div key={p.eyebrow} className="pt-6 md:pt-0 md:px-8 first:md:pl-0">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif-display italic text-orange-500/80 leading-none" style={{ fontSize: '3rem' }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-400">{p.eyebrow}</span>
              </div>
              <p className="text-white text-xl md:text-2xl font-medium leading-[1.3]">{p.text}</p>
            </div>
          ))}
        </div>
      </StoryBeat>

      {/* Beat 6 — Existing vs Future */}
      <StoryBeat eyebrow="06 · Existing vs Desirable Future">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-zinc-900/70 border border-red-500/30 rounded-2xl p-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-red-300 mb-4 font-semibold">EXISTING</p>
            <ol className="space-y-2.5 mb-5">
              {story.beat6.existing.items.map((it, i) => (
                <li key={i} className="text-gray-200 text-[15px] leading-relaxed flex gap-3">
                  <span className="text-red-400 font-mono text-xs pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <span>{it}</span>
                </li>
              ))}
            </ol>
            <p className="text-red-300 text-sm font-semibold border-t border-red-500/30 pt-4">{story.beat6.existing.tagline}</p>
          </div>
          <div className="bg-zinc-900/70 border border-emerald-500/30 rounded-2xl p-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-300 mb-4 font-semibold">DESIRABLE FUTURE</p>
            <ol className="space-y-2.5 mb-5">
              {story.beat6.future.items.map((it, i) => (
                <li key={i} className="text-gray-200 text-[15px] leading-relaxed flex gap-3">
                  <span className="text-emerald-400 font-mono text-xs pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <span>{it}</span>
                </li>
              ))}
            </ol>
            <p className="text-emerald-300 text-sm font-semibold border-t border-emerald-500/30 pt-4">{story.beat6.future.tagline}</p>
          </div>
        </div>
      </StoryBeat>

      {/* Beat 7 — Designing (3 explorations) */}
      <StoryBeat eyebrow="07 · Designing">
        <p className="text-gray-200 text-base md:text-lg leading-[1.8] mb-7 max-w-3xl">Three explorations.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {story.explorations.map((e, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 flex flex-col ${
                e.status === 'shipped'
                  ? 'bg-gradient-to-br from-emerald-950/60 to-zinc-900 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  : 'bg-zinc-900/70 border border-white/15'
              }`}
            >
              <p className={`text-[10px] tracking-[0.25em] uppercase font-bold mb-3 ${e.status === 'shipped' ? 'text-emerald-300' : 'text-red-300'}`}>
                {e.status === 'shipped' ? 'SHIPPED' : 'REJECTED'}
              </p>
              <h4 className="text-white text-lg font-semibold mb-2.5 leading-tight">{e.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{e.body}</p>
              {e.image ? (
                <div
                  className={`mt-auto rounded-lg overflow-hidden border ${
                    e.status === 'shipped' ? 'border-emerald-500/30' : 'border-red-500/25 opacity-80'
                  }`}
                >
                  <ZoomableImage src={e.image} alt={`${e.title} — ${e.status} concept`} width={1200} height={800} className="w-full h-auto" />
                </div>
              ) : (
                <div className="mt-auto py-3 px-4 bg-zinc-800/60 border border-white/10 rounded-lg text-center">
                  <p className="text-gray-400 text-xs italic">No screen archived</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </StoryBeat>

      {/* Beat 8 — Trade off */}
      <StoryBeat eyebrow="08 · The trade-off">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/15 rounded-2xl p-6 md:p-8">
            <p className="text-gray-100 text-base md:text-lg leading-[1.85]">{story.tradeoff}</p>
          </div>
          {story.beat8Image && (
            <StoryFigure src={story.beat8Image.src} caption={story.beat8Image.caption} alt={story.beat8Image.caption} device={story.platformKey === 'mobile' ? 'mobile' : 'desktop'} />
          )}
        </div>
      </StoryBeat>

      {/* Beat 9 — What it unlocked */}
      <StoryBeat eyebrow="09 · What it unlocked" className="mb-0">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-gradient-to-br from-orange-500/15 to-amber-500/5 border border-orange-500/40 rounded-2xl p-6 md:p-8">
            <p className="text-white text-base md:text-lg leading-[1.7] mb-5">{story.unlocked.body}</p>
            <p className="text-orange-200 text-sm md:text-base italic mb-6">{story.unlocked.sub}</p>
            <a
              href={story.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-semibold group transition-colors"
            >
              See the live prototype
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          {story.unlocked.image && (
            <StoryFigure src={story.unlocked.image.src} caption={story.unlocked.image.caption} alt={story.unlocked.image.caption} device={story.platformKey === 'mobile' ? 'mobile' : 'desktop'} />
          )}
        </div>
      </StoryBeat>
    </article>
  )
}

function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors duration-300"
    >
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center mb-4">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h4 className="text-white font-bold text-base md:text-lg mb-2">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
    </motion.div>
  )
}

export default function CareAtHome() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false)

  const { scrollYProgress, scrollY } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 60, damping: 30 })
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
    <LightboxProvider>
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 z-50"
      />

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
        {/* Ambient particles */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + (i % 4) * 1.5,
                height: 2 + (i % 4) * 1.5,
                left: `${(i * 37) % 100}%`,
                bottom: `-${5 + (i % 3) * 4}%`,
                background: i % 3 === 0 ? '#F97316' : i % 3 === 1 ? '#FBBF24' : '#FDE68A',
                opacity: 0.15 + (i % 5) * 0.08,
              }}
              animate={{
                y: [0, -(800 + (i % 5) * 200)],
                x: [0, (i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 15)],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 8 + (i % 6) * 3,
                repeat: Infinity,
                delay: (i % 10) * 1.2,
                ease: 'linear',
              }}
            />
          ))}
        </div>

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
              { num: 3, suffix: '', text: 'Platforms', label: 'Ecosystem' },
              { num: 1000, suffix: '+', text: 'Screens', label: 'Designed' },
              { num: 100, suffix: '+', text: 'Sprints', label: 'Delivered' },
              { num: 0, suffix: '', text: 'Healthcare', label: 'Industry' },
            ].map((stat, i) => (
              <ScrollAnimation key={stat.label} delay={i * 0.1}>
                <div className="py-8 md:py-12 px-6 md:px-10 text-center group hover:bg-white/[0.02] transition-colors duration-500">
                  <div className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors duration-500">
                    {stat.num > 0 ? <><Counter to={stat.num} suffix={stat.suffix} /> {stat.text}</> : stat.text}
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Architecture — Infographic Style */}
      <section className="relative z-10 py-24 md:py-36 px-6 overflow-hidden">
        {/* Blueprint grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-orange-500/[0.03] rounded-full blur-[200px]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <ScrollAnimation>
            <div className="mb-16 md:mb-24 text-center">
              <p className="text-orange-400 text-xs tracking-[0.3em] uppercase mb-4">System Architecture</p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
                How It All{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  Connects
                </span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Not three isolated apps — one interconnected care ecosystem where configuration, data, and actions flow between platforms in real time.
              </p>
            </div>
          </ScrollAnimation>

          {/* === DESKTOP: Infographic with live video previews === */}
          <div className="hidden lg:block">
            {/* Row 1: Designer Dashboard (center, top) */}
            <ScrollAnimation delay={0.2}>
              <div className="flex justify-center mb-0">
                <div className="relative w-[520px]">
                  <div className="absolute -inset-1 bg-gradient-to-br from-yellow-500/20 to-orange-400/20 rounded-3xl blur-xl" />
                  <div className="relative bg-zinc-950/95 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-5 shadow-2xl shadow-orange-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-400 flex items-center justify-center text-white shadow-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 10v6m11-11h-6M7 12H1m15.5-7.5l-4.5 4.5M7.5 16.5L3 21m0-18l4.5 4.5m9 9l4.5 4.5" /></svg>
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg">Designer Dashboard</div>
                          <div className="text-orange-400/80 text-xs italic">Control Plane — For Admins & Clients</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold tracking-[0.25em] text-orange-400/50 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">CONFIGURE</span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
                      <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                        <source src="/videos/designer-dashboard.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['Care Paths', 'Programs', 'Questionnaires', 'Monitoring Rules', 'Branding'].map(t => (
                        <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300/80 border border-orange-500/20">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Flow pipes: Designer → Patient & Designer → Clinician */}
            <ScrollAnimation delay={0.4}>
              <div className="flex justify-center py-2">
                <div className="relative w-[700px] h-[100px]">
                  <svg viewBox="0 0 700 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="pipe-left" x1="50%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="pipe-right" x1="50%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0.3" />
                      </linearGradient>
                      <filter id="pipeGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    {/* Left pipe: Designer → Patient */}
                    <motion.path d="M 350 0 C 350 50, 100 50, 100 100" stroke="url(#pipe-left)" strokeWidth="4" fill="none" filter="url(#pipeGlow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} />
                    {/* Right pipe: Designer → Clinician */}
                    <motion.path d="M 350 0 C 350 50, 600 50, 600 100" stroke="url(#pipe-right)" strokeWidth="4" fill="none" filter="url(#pipeGlow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} />
                    {/* Arrowheads */}
                    <polygon points="95,92 100,104 105,92" fill="#F97316" opacity="0.7" />
                    <polygon points="595,92 600,104 605,92" fill="#F97316" opacity="0.7" />
                    {/* Animated dots */}
                    <circle r="5" fill="#F97316" filter="url(#pipeGlow)">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M 350 0 C 350 50, 100 50, 100 100" />
                    </circle>
                    <circle r="5" fill="#F97316" filter="url(#pipeGlow)">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M 350 0 C 350 50, 600 50, 600 100" begin="0.5s" />
                    </circle>
                  </svg>
                  {/* Labels on pipes */}
                  <div className="absolute top-1/2 left-[18%] -translate-y-1/2">
                    <span className="text-[11px] font-semibold text-orange-300/90 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-orange-500/30 whitespace-nowrap">Configures patient flows</span>
                  </div>
                  <div className="absolute top-1/2 right-[10%] -translate-y-1/2">
                    <span className="text-[11px] font-semibold text-orange-300/90 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-orange-500/30 whitespace-nowrap">Configures clinician dashboards</span>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Row 2: Patient App (left) & Clinician Dashboard (right) */}
            <div className="grid grid-cols-2 gap-8">
              <ScrollAnimation delay={0.5}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/15 to-yellow-500/15 rounded-3xl blur-xl" />
                  <div className="relative bg-zinc-950/95 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-5 shadow-2xl shadow-amber-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg">Patient App</div>
                          <div className="text-amber-400/80 text-xs italic">Data Source — For Patients</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold tracking-[0.25em] text-amber-400/50 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">CAPTURE</span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
                      <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                        <source src="/videos/mobile-app.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['Vitals Recording', 'Reminders', 'Symptom Diary', 'Clinician Chat', 'Device Pairing'].map(t => (
                        <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300/80 border border-amber-500/20">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.6}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-orange-500/15 to-amber-500/15 rounded-3xl blur-xl" />
                  <div className="relative bg-zinc-950/95 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-5 shadow-2xl shadow-orange-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2" /><line x1="3" y1="20" x2="21" y2="20" /><line x1="9" y1="16" x2="9" y2="20" /><line x1="15" y1="16" x2="15" y2="20" /></svg>
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg">Clinician Dashboard</div>
                          <div className="text-orange-400/80 text-xs italic">Care Delivery — For Providers</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold tracking-[0.25em] text-orange-400/50 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">MONITOR</span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
                      <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                        <source src="/videos/web-dashboard.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['Vitals Monitoring', 'Patient Records', 'Care Plans', 'Alert System', 'Analytics'].map(t => (
                        <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300/80 border border-orange-500/20">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            {/* Flow pipe: Patient ↔ Clinician (bidirectional) */}
            <ScrollAnimation delay={0.7}>
              <div className="flex justify-center py-3">
                <div className="relative w-[700px] h-[70px]">
                  <svg viewBox="0 0 700 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="pipe-bidir" x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                    {/* Top line: Patient → Clinician */}
                    <motion.path d="M 80 25 Q 350 5 620 25" stroke="url(#pipe-bidir)" strokeWidth="3" fill="none" filter="url(#pipeGlow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
                    {/* Bottom line: Clinician → Patient */}
                    <motion.path d="M 620 45 Q 350 65 80 45" stroke="url(#pipe-bidir)" strokeWidth="3" fill="none" filter="url(#pipeGlow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }} />
                    {/* Arrows */}
                    <polygon points="615,18 625,25 615,32" fill="#FBBF24" opacity="0.7" />
                    <polygon points="85,38 75,45 85,52" fill="#FBBF24" opacity="0.7" />
                    {/* Animated dots */}
                    <circle r="4" fill="#FBBF24" filter="url(#pipeGlow)">
                      <animateMotion dur="2.5s" repeatCount="indefinite" path="M 80 25 Q 350 5 620 25" />
                    </circle>
                    <circle r="4" fill="#FBBF24" filter="url(#pipeGlow)">
                      <animateMotion dur="2.5s" repeatCount="indefinite" path="M 620 45 Q 350 65 80 45" begin="1.2s" />
                    </circle>
                  </svg>
                  {/* Labels */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
                    <span className="text-[11px] font-semibold text-amber-200/90 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 whitespace-nowrap">Vitals, meds & daily tasks shared in real time</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
                    <span className="text-[11px] font-semibold text-amber-200/90 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 whitespace-nowrap">Clinicians update tasks & treatment for patients</span>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* === MOBILE & TABLET: vertical flow with video previews === */}
          <div className="lg:hidden space-y-0">
            {[
              { name: 'Designer Dashboard', role: 'Control Plane', audience: 'Admins & Clients', accent: 'from-yellow-500 to-orange-400', accentBorder: 'border-orange-500/30', video: '/videos/designer-dashboard.mp4', tags: ['Care Paths', 'Programs', 'Rules', 'Branding'] },
              { name: 'Patient App', role: 'Data Source', audience: 'Patients', accent: 'from-amber-500 to-yellow-500', accentBorder: 'border-amber-500/30', video: '/videos/mobile-app.mp4', tags: ['Vitals', 'Reminders', 'Symptoms', 'Chat'] },
              { name: 'Clinician Dashboard', role: 'Care Delivery', audience: 'Healthcare Providers', accent: 'from-orange-500 to-amber-500', accentBorder: 'border-orange-500/30', video: '/videos/web-dashboard.mp4', tags: ['Alerts', 'Records', 'Analytics', 'Care Plans'] },
            ].map((node, i) => (
              <div key={node.name}>
                <ScrollAnimation delay={i * 0.15}>
                  <div className="relative">
                    <div className={`absolute -inset-0.5 bg-gradient-to-br ${node.accent} rounded-2xl opacity-10 blur-sm`} />
                    <div className={`relative bg-zinc-950/90 backdrop-blur-xl border ${node.accentBorder} rounded-2xl p-4`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${node.accent} flex items-center justify-center`}>
                          <span className="text-white font-black text-xs">0{i + 1}</span>
                        </div>
                        <div>
                          <div className="text-white font-bold">{node.name}</div>
                          <div className="text-orange-400/80 text-xs italic">{node.role} — {node.audience}</div>
                        </div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-white/10 aspect-video bg-black mb-3">
                        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                          <source src={node.video} type="video/mp4" />
                        </video>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {node.tags.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300/80 border border-orange-500/20">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
                {i < 2 && (
                  <div className="flex flex-col items-center py-3">
                    <svg width="24" height="50" viewBox="0 0 24 50">
                      <line x1="12" y1="0" x2="12" y2="40" stroke="#F97316" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                      <polygon points="6,36 12,48 18,36" fill="#F97316" opacity="0.6" />
                      <circle r="3" fill="#F97316" opacity="0.8">
                        <animateMotion dur="1.5s" repeatCount="indefinite" path="M12,0 L12,40" />
                      </circle>
                    </svg>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-orange-400/70 font-semibold mt-1">
                      {i === 0 ? 'Configures both platforms' : 'Real-time patient data'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Insight strip */}
          <div className="grid md:grid-cols-3 gap-5 mt-20 md:mt-28 max-w-5xl mx-auto">
            {[
              { title: 'Single Source of Truth', body: 'Designer Dashboard owns every care path, questionnaire, and monitoring rule — pushed to both apps without a redeploy.' },
              { title: 'Bidirectional Care Loop', body: 'Patients record vitals and complete tasks; clinicians review, adjust, and respond — all in real time.' },
              { title: 'Role-Aware Design', body: 'Tasks for patients, alerts for clinicians, controls for admins — three languages, one shared design system.' },
            ].map((card, i) => (
              <ScrollAnimation key={card.title} delay={0.3 + i * 0.15}>
                <InsightCard title={card.title} body={card.body} />
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Three Products — story + live prototype per chapter */}
      <section className="relative z-10 py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <div className="text-center mb-20 md:mb-32">
              <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-orange-400 mb-6 inline-flex items-center gap-3">
                <span className="w-8 h-px bg-orange-400" />
                <span>The Ecosystem</span>
                <span className="w-8 h-px bg-orange-400" />
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95] tracking-tight">
                Three <span className="font-serif-display italic font-normal text-orange-400">Products.</span><br />
                One <span className="font-serif-display italic font-normal text-orange-400">Mission.</span>
              </h2>
              <p className="font-serif-display italic text-gray-200 max-w-2xl mx-auto leading-[1.5]" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}>
                For each product: the story behind the pixels, then the live prototype.
              </p>
            </div>
          </ScrollAnimation>

          <div className="space-y-32 md:space-y-44">
            {stories.map((story, i) => (
              <div key={story.chapter}>
                {/* 1. Platform intro */}
                <PlatformIntro platformKey={story.platformKey} index={i} />

                {/* 2. The UX story (9 beats) */}
                <div className="mt-12 md:mt-16 max-w-6xl mx-auto">
                  <UXStorySection story={story} />
                </div>

                {/* 3. Live prototype video — the finale */}
                <div className="mt-16 md:mt-24">
                  <ScrollAnimation>
                    <div className="mb-8 md:mb-10 flex items-baseline gap-4">
                      <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-orange-300/90">10 · The Live Prototype</span>
                      <span className="h-px flex-1 bg-gradient-to-r from-orange-500/40 via-orange-500/10 to-transparent max-w-[180px]" />
                    </div>
                    <h4 className="font-serif-display italic text-white leading-[1.2] mb-8" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
                      Watch the shipped product in action.
                    </h4>
                  </ScrollAnimation>
                  <PlatformVideo platformKey={story.platformKey} />
                </div>
              </div>
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
    </LightboxProvider>
  )
}
