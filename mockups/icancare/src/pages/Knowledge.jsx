import { Link } from 'react-router-dom'
import { ChevronRight, Clock } from 'lucide-react'
import { Card } from '../components/ui/card'
import StatusBar from '../components/StatusBar'

const topics = [
  { title: 'Newly Diagnosed', sub: 'First weeks, first questions', type: 'newly', emoji: '🩺' },
  { title: 'Treatment Options', sub: 'Therapies & side-effects', type: 'treatment', emoji: '💊' },
  { title: 'Nutrition & Rest', sub: 'Eating well during care', type: 'nutrition', emoji: '🥗' },
  { title: 'Life After Treatment', sub: 'Recovery & follow-up', type: 'after', emoji: '🌱' },
]

const gradients = {
  newly: 'from-[#60A5FA] to-[#2563EB]',
  treatment: 'from-[#38BDF8] to-[#0284C7]',
  nutrition: 'from-[#7DD3FC] to-[#0EA5E9]',
  after: 'from-[#93C5FD] to-[#1D4ED8]',
}

export default function Knowledge() {
  return (
    <div className="pb-5">
      <div className="hero-blue rounded-b-[36px] px-5 pb-7">
        <StatusBar light />
        <h1 className="text-[28px] font-extrabold text-white tracking-[-0.03em] mt-1">Learn</h1>
        <p className="text-white/80 text-[14px] mt-1">Clinician-reviewed guidance</p>

        <Link to="/article" className="block mt-5 bg-white rounded-2xl overflow-hidden card-soft">
          <div className="relative h-28">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=240&fit=crop"
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/80 to-transparent" />
            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
              Featured
            </span>
          </div>
          <div className="p-4">
            <p className="text-[15px] font-bold text-ink leading-snug">Preparing for your first oncology appointment</p>
            <div className="flex items-center gap-1.5 mt-2 text-muted">
              <Clock size={13} />
              <span className="text-[12px]">8 min read</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="px-5 mt-5">
        <h2 className="section-label mb-3">Browse topics</h2>
        <div className="grid grid-cols-2 gap-3">
          {topics.map(({ title, sub, type, emoji }, i) => (
            <Link key={title} to="/article" className={`animate-enter delay-${i + 1}`}>
              <div className={`bg-gradient-to-br ${gradients[type]} rounded-2xl p-4 h-[128px] flex flex-col justify-between relative overflow-hidden`}>
                <span className="text-2xl relative z-10" aria-hidden="true">{emoji}</span>
                <div className="relative z-10">
                  <p className="text-[13px] font-bold text-white leading-tight">{title}</p>
                  <p className="text-[11px] text-white/80 mt-1">{sub}</p>
                </div>
                <div className="absolute -right-3 -bottom-3 w-20 h-20 rounded-full bg-white/10" />
              </div>
            </Link>
          ))}
        </div>

        <Card className="mt-5 animate-enter delay-4">
          <div className="divide-y divide-slate-100">
            {[
              { label: 'Common questions', icon: '❓' },
              { label: 'For carers & family', icon: '🤝' },
              { label: 'Drug interactions', icon: '⚠️' },
            ].map(({ label, icon }) => (
              <Link key={label} to="/article" className="flex items-center gap-3 px-4 py-3.5 min-h-[48px]">
                <span className="text-base w-8 text-center" aria-hidden="true">{icon}</span>
                <span className="text-[14px] font-medium text-ink flex-1">{label}</span>
                <ChevronRight size={16} className="text-slate-300" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
