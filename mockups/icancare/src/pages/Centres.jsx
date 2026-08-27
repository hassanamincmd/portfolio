import { Search, ChevronRight, Star, MapPin } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import StatusBar from '../components/StatusBar'
import { HospitalPhoto } from '../components/Visuals'

const centres = [
  { name: 'Subang Jaya Medical Centre', dept: 'Oncology & Haematology', distance: '2.4 km', rating: '4.8', seed: 'sj' },
  { name: 'Sunway Medical Centre', dept: 'Radiotherapy & Support', distance: '4.1 km', rating: '4.7', seed: 'sm' },
  { name: 'Beacon Hospital', dept: 'Specialist Oncology', distance: '5.8 km', rating: '4.9', seed: 'bh' },
  { name: 'University Malaya MC', dept: 'Teaching Hospital', distance: '8.2 km', rating: '4.6', seed: 'um' },
]

const filters = ['Nearby', 'Oncology', 'Open now']

export default function Centres() {
  return (
    <div className="pb-5">
      <div className="hero-blue rounded-b-[36px] px-5 pb-6">
        <StatusBar light />
        <div className="flex items-center gap-2 mt-1 mb-1">
          <MapPin size={18} className="text-white/90" />
          <h1 className="text-[26px] font-extrabold text-white tracking-[-0.03em]">Nearby</h1>
        </div>
        <p className="text-white/80 text-[13px]">Care centres close to you</p>

        <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl shadow-lg shadow-blue-deep/15 mt-5">
          <Search size={18} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search by name or specialty"
            className="flex-1 text-[14px] bg-transparent outline-none text-ink placeholder:text-slate-400"
            aria-label="Search centres"
          />
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`px-3.5 py-2 rounded-full text-[12px] font-semibold flex-shrink-0 ${
                i === 0 ? 'bg-blue text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {centres.map(({ name, dept, distance, rating, seed }, i) => (
            <Card key={name} className={`animate-enter delay-${i + 1}`}>
              <CardContent className="flex items-center gap-3.5">
                <HospitalPhoto seed={seed} className="w-14 h-14" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-ink">{name}</p>
                  <p className="text-[12px] text-muted mt-0.5">{dept}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-0.5">
                      <Star size={11} className="text-amber-400" fill="currentColor" />
                      <span className="text-[11px] font-bold text-slate-700">{rating}</span>
                    </div>
                    <span className="text-[11px] text-slate-300">·</span>
                    <span className="text-[11px] text-muted font-medium">{distance}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
