import { Link } from 'react-router-dom'
import { Plus, Check, Clock, Pill, Video } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import StatusBar from '../components/StatusBar'

export default function Reminders() {
  return (
    <div className="pb-5">
      <div className="hero-blue rounded-b-[36px] px-5 pb-6">
        <StatusBar light />
        <div className="flex items-center justify-between mt-1 mb-5">
          <div>
            <h1 className="text-[26px] font-extrabold text-white tracking-[-0.03em]">Reminders</h1>
            <p className="text-[13px] text-white/80 mt-0.5">Wednesday, 19 August</p>
          </div>
          <Link to="/add-medicine" className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md" aria-label="Add medicine">
            <Plus size={20} className="text-blue-deep" />
          </Link>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-semibold text-white">Today's progress</p>
            <span className="text-[20px] font-extrabold text-white tabular-nums">2/3</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-2.5 rounded-full bg-white" />
            <div className="flex-1 h-2.5 rounded-full bg-white" />
            <div className="flex-1 h-2.5 rounded-full bg-white/25" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <h2 className="section-label mb-3">Due now</h2>
        <Card className="overflow-hidden mb-5 animate-enter">
          <div className="h-1.5 bg-blue" />
          <CardContent className="pt-4">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-soft flex items-center justify-center">
                <Pill size={22} className="text-blue" />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-ink">Aggrenox 200 mg</p>
                <p className="text-[13px] text-muted mt-0.5">1 capsule · with food · 10:00 AM</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" className="flex-1">
                <Check size={16} className="mr-1.5" /> Taken
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Clock size={16} className="mr-1.5" /> Later
              </Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="section-label mb-3">Later today</h2>
        <Card className="animate-enter delay-1">
          <div className="divide-y divide-slate-100">
            {[
              { name: 'Aggrenox 200 mg', note: '1 capsule', time: '2:00 PM', Icon: Pill, tint: 'bg-blue-soft', ink: 'text-blue' },
              { name: 'Telehealth check-in', note: 'Video call', time: '4:00 PM', Icon: Video, tint: 'bg-sky-50', ink: 'text-sky-600' },
              { name: 'Vitamin D', note: 'With dinner', time: '7:30 PM', Icon: Pill, tint: 'bg-blue-soft', ink: 'text-blue' },
            ].map(({ name, note, time, Icon, tint, ink }) => (
              <div key={name + time} className="flex items-center gap-3.5 px-4 py-3.5">
                <div className={`w-10 h-10 rounded-xl ${tint} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={ink} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink">{name}</p>
                  <p className="text-[12px] text-muted">{note}</p>
                </div>
                <span className="text-[13px] text-muted tabular-nums flex-shrink-0">{time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
