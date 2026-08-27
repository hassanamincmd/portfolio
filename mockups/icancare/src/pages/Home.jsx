import { Link } from 'react-router-dom'
import { Pill, Bell, Stethoscope, BookOpen, Search, Star, Video } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import StatusBar from '../components/StatusBar'
import { DoctorAvatar, PatientAvatar } from '../components/Visuals'

const categories = [
  { to: '/reminders', icon: Pill, label: 'Medicines', tint: 'bg-[#FEE2E2]', ink: 'text-rose-600' },
  { to: '/reminders', icon: Bell, label: 'Reminders', tint: 'bg-[#DBEAFE]', ink: 'text-blue-deep' },
  { to: '/centres', icon: Stethoscope, label: 'Doctors', tint: 'bg-[#E0F2FE]', ink: 'text-sky-600' },
  { to: '/knowledge', icon: BookOpen, label: 'Learn', tint: 'bg-[#E0E7FF]', ink: 'text-indigo-600' },
]

export default function Home() {
  return (
    <div className="pb-5">
      <div className="hero-blue rounded-b-[36px] px-5 pb-8">
        <StatusBar light />
        <div className="flex items-center justify-between mt-1 mb-5">
          <div>
            <p className="text-white/80 text-[13px] font-medium">Hi, Sofia</p>
            <h1 className="text-[24px] font-extrabold text-white tracking-[-0.03em] mt-0.5">
              Let's find your care
            </h1>
          </div>
          <PatientAvatar className="w-12 h-12" border />
        </div>

        <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl shadow-lg shadow-blue-deep/15">
          <Search size={18} className="text-slate-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search medicines, articles..."
            className="flex-1 text-[14px] bg-transparent outline-none text-ink placeholder:text-slate-400"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="px-5">
        {/* Categories */}
        <div className="flex justify-between -mt-5 mb-6 relative z-10">
          {categories.map(({ to, icon: Icon, label, tint, ink }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-2 w-[72px]">
              <div className={`w-14 h-14 rounded-2xl ${tint} flex items-center justify-center shadow-md shadow-slate-200/80`}>
                <Icon size={24} className={ink} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-semibold text-slate-600">{label}</span>
            </Link>
          ))}
        </div>

        {/* Next dose */}
        <div className="mb-5 animate-enter">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-label">Next dose</h2>
            <span className="text-[12px] font-bold text-blue">10:00 AM</span>
          </div>
          <Card className="overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue to-sky" />
            <CardContent className="pt-4">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-soft flex items-center justify-center">
                  <Pill size={22} className="text-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-ink">Aggrenox 200 mg</p>
                  <p className="text-[13px] text-muted mt-0.5">1 capsule · with breakfast</p>
                </div>
              </div>
              <Button variant="primary" size="sm" className="w-full">Mark as taken</Button>
            </CardContent>
          </Card>
        </div>

        {/* Doctor */}
        <div className="mb-5 animate-enter delay-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-label">Your doctor</h2>
            <Link to="/centres" className="text-[12px] font-bold text-blue">See all</Link>
          </div>
          <Card>
            <CardContent className="flex items-center gap-3.5">
              <DoctorAvatar className="w-14 h-14" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-ink">Dr. Aisha Rahman</p>
                <p className="text-[12px] text-muted mt-0.5">Oncology · SJMC</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-amber-400" fill="currentColor" />
                  <span className="text-[11px] font-bold text-slate-700">4.9</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[12px] font-bold text-ink">Fri 21</p>
                <p className="text-[11px] text-muted">2:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Later today */}
        <div className="animate-enter delay-2">
          <h2 className="section-label mb-3">Later today</h2>
          <Card>
            <div className="divide-y divide-slate-100">
              <div className="flex items-center gap-3.5 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-soft flex items-center justify-center">
                  <Pill size={16} className="text-blue" />
                </div>
                <span className="text-[14px] font-medium text-ink flex-1">Vitamin D</span>
                <span className="text-[13px] text-muted tabular-nums">2:00 PM</span>
              </div>
              <div className="flex items-center gap-3.5 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                  <Video size={16} className="text-sky-600" />
                </div>
                <span className="text-[14px] font-medium text-ink flex-1">Telehealth check-in</span>
                <span className="text-[13px] text-muted tabular-nums">4:00 PM</span>
              </div>
              <div className="flex items-center gap-3.5 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-soft flex items-center justify-center">
                  <Pill size={16} className="text-blue" />
                </div>
                <span className="text-[14px] font-medium text-ink flex-1">Aggrenox 200 mg</span>
                <span className="text-[13px] text-muted tabular-nums">7:30 PM</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
