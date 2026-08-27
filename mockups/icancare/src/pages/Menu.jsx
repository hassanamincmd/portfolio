import { Pill, BookOpen, Phone, Settings, ChevronRight, Shield } from 'lucide-react'
import { Card } from '../components/ui/card'
import StatusBar from '../components/StatusBar'
import { PatientAvatar } from '../components/Visuals'

const items = [
  { icon: Pill, label: 'Medicine history', tint: 'bg-blue-soft', ink: 'text-blue' },
  { icon: BookOpen, label: 'Saved articles', tint: 'bg-indigo-50', ink: 'text-indigo-600' },
  { icon: Phone, label: 'Contact care team', tint: 'bg-sky-50', ink: 'text-sky-600' },
  { icon: Shield, label: 'Privacy & consent', tint: 'bg-slate-100', ink: 'text-slate-600' },
  { icon: Settings, label: 'Settings', tint: 'bg-slate-100', ink: 'text-slate-600' },
]

export default function Menu() {
  return (
    <div className="pb-5">
      <div className="hero-blue rounded-b-[36px] px-5 pb-8">
        <StatusBar light />
        <div className="flex flex-col items-center mt-3">
          <PatientAvatar className="w-20 h-20" border />
          <h1 className="text-[20px] font-extrabold text-white mt-3">Sofia Tan</h1>
          <p className="text-white/80 text-[13px] mt-0.5">Subang Jaya Medical Centre</p>
        </div>
      </div>

      <div className="px-5 -mt-4 relative z-10">
        <Card className="animate-enter">
          <div className="divide-y divide-slate-100">
            {items.map(({ icon: Icon, label, tint, ink }) => (
              <a key={label} href="#" className="flex items-center gap-3.5 px-4 py-4 min-h-[52px]">
                <div className={`w-10 h-10 rounded-xl ${tint} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={ink} />
                </div>
                <span className="text-[14px] font-semibold text-ink flex-1">{label}</span>
                <ChevronRight size={16} className="text-slate-300" />
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
