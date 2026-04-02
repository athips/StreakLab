import { motion } from 'framer-motion'

/** Decorative layer — desktop only */
export function DesktopBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden md:block"
      aria-hidden
    >
      <motion.div
        className="sl-desktop-orb absolute -left-24 top-20 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#1cb0f6]/30 via-[#ce82ff]/25 to-[#ff6b35]/20"
        style={{ filter: 'blur(60px)' }}
        animate={{ opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="sl-desktop-orb--2 absolute -right-16 bottom-24 h-[380px] w-[380px] rounded-full bg-gradient-to-tl from-[#ffd900]/25 via-[#58cc02]/20 to-[#1cb0f6]/25"
        style={{ filter: 'blur(56px)' }}
        animate={{ opacity: [0.3, 0.48, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent 0%, rgba(28,176,246,0.15) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'sl-shimmer 18s linear infinite',
        }}
      />
    </div>
  )
}
