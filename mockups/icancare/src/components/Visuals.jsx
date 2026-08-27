/** Shared visual assets for the prototype */

export function BrandMark({ light = false, size = 28 }) {
  const fill = light ? '#fff' : '#2563EB'
  const bg = light ? 'rgba(255,255,255,0.18)' : '#EFF6FF'
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect width="32" height="32" rx="10" fill={bg} />
      <path d="M16 8v16M10 14h12" stroke={fill} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function DoctorAvatar({ className = 'w-14 h-14' }) {
  return (
    <img
      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop&crop=faces"
      alt="Dr. Aisha Rahman"
      className={`${className} rounded-2xl object-cover`}
    />
  )
}

export function PatientAvatar({ className = 'w-12 h-12', border = false }) {
  return (
    <img
      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=faces"
      alt="Sofia Tan"
      className={`${className} rounded-full object-cover ${border ? 'ring-2 ring-white/50' : ''}`}
    />
  )
}

export function HospitalPhoto({ seed, className = 'w-12 h-12' }) {
  const photos = {
    sj: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=160&h=160&fit=crop',
    sm: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=160&h=160&fit=crop',
    bh: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=160&h=160&fit=crop',
    um: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=160&h=160&fit=crop',
  }
  return (
    <img
      src={photos[seed] || photos.sj}
      alt=""
      className={`${className} rounded-2xl object-cover flex-shrink-0`}
      aria-hidden="true"
    />
  )
}

export function TopicArt({ type }) {
  const map = {
    newly: { bg: 'from-[#60A5FA] to-[#2563EB]', icon: '🩺' },
    treatment: { bg: 'from-[#38BDF8] to-[#0284C7]', icon: '💊' },
    nutrition: { bg: 'from-[#7DD3FC] to-[#0EA5E9]', icon: '🥗' },
    after: { bg: 'from-[#93C5FD] to-[#1D4ED8]', icon: '🌱' },
  }
  const t = map[type] || map.newly
  return (
    <div className={`bg-gradient-to-br ${t.bg} rounded-2xl h-full min-h-[120px] p-4 flex flex-col justify-between relative overflow-hidden`}>
      <span className="text-2xl relative z-10" aria-hidden="true">{t.icon}</span>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute right-6 top-4 w-10 h-10 rounded-full bg-white/10" />
    </div>
  )
}

export function FlagGB() {
  return (
    <svg viewBox="0 0 60 40" width="30" height="20" className="rounded-[3px] flex-shrink-0 shadow-sm">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="7" />
      <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}
export function FlagMY() {
  return (
    <svg viewBox="0 0 60 40" width="30" height="20" className="rounded-[3px] flex-shrink-0 shadow-sm">
      <rect width="60" height="40" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <rect key={i} y={i * 5.71} width="60" height="2.86" fill={i % 2 === 0 ? '#CC0001' : '#fff'} />
      ))}
      <rect width="30" height="23" fill="#010066" />
      <circle cx="13" cy="11.5" r="6" fill="#FC0" />
      <circle cx="15" cy="11.5" r="5" fill="#010066" />
    </svg>
  )
}
export function FlagCN() {
  return (
    <svg viewBox="0 0 60 40" width="30" height="20" className="rounded-[3px] flex-shrink-0 shadow-sm">
      <rect width="60" height="40" fill="#DE2910" />
      <path d="M12 7l2 6h6.5l-5.2 3.8 2 6.2L12 19.4 6.8 23l2-6.2L3.5 13H10z" fill="#FFDE00" />
    </svg>
  )
}
export function FlagIN() {
  return (
    <svg viewBox="0 0 60 40" width="30" height="20" className="rounded-[3px] flex-shrink-0 shadow-sm">
      <rect width="60" height="13.3" fill="#FF9933" />
      <rect y="13.3" width="60" height="13.4" fill="#fff" />
      <rect y="26.7" width="60" height="13.3" fill="#138808" />
      <circle cx="30" cy="20" r="4" fill="none" stroke="#000080" strokeWidth="0.8" />
    </svg>
  )
}
