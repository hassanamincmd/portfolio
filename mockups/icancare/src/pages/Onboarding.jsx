import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '../components/ui/button'
import StatusBar from '../components/StatusBar'
import { useState } from 'react'
import { BrandMark, FlagGB, FlagMY, FlagCN, FlagIN } from '../components/Visuals'

const languages = [
  { code: 'en', label: 'English', Flag: FlagGB },
  { code: 'ms', label: 'Bahasa Melayu', Flag: FlagMY },
  { code: 'zh', label: '中文', Flag: FlagCN },
  { code: 'ta', label: 'தமிழ்', Flag: FlagIN },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('en')

  return (
    <div className="iphone-device">
      <div className="phone-frame !pt-0 hero-blue">
        <StatusBar light />
        <div className="flex-1 flex flex-col px-6 pb-8 overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-2.5 mt-1 mb-8">
            <BrandMark light size={32} />
            <span className="text-white text-[15px] font-semibold">ICan Care</span>
          </div>

          {/* Hero visual */}
          <div className="flex justify-center mb-6">
            <div className="relative w-[200px] h-[140px]">
              <div className="absolute inset-0 rounded-[28px] bg-white/10 border border-white/15" />
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=280&fit=crop"
                alt=""
                className="absolute inset-2 rounded-2xl object-cover w-[calc(100%-16px)] h-[calc(100%-16px)]"
                aria-hidden="true"
              />
              <div className="absolute -bottom-3 -right-2 w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                <span className="text-2xl" aria-hidden="true">💙</span>
              </div>
            </div>
          </div>

          <h1 className="text-[30px] font-extrabold text-white leading-[1.12] tracking-[-0.03em] mb-2">
            Find care that<br />fits your day.
          </h1>
          <p className="text-white/80 text-[14px] leading-relaxed mb-7">
            Medications, guidance, and nearby centres — in the language you prefer.
          </p>

          <div className="bg-white rounded-3xl p-2 space-y-0.5 mb-6 card-soft">
            {languages.map(({ code, label, Flag }) => (
              <label
                key={code}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl cursor-pointer ${
                  selected === code ? 'bg-blue-soft' : ''
                }`}
              >
                <input type="radio" name="lang" value={code} checked={selected === code} onChange={() => setSelected(code)} className="sr-only" />
                <Flag />
                <span className="text-ink text-[15px] font-medium flex-1">{label}</span>
                {selected === code && (
                  <div className="w-6 h-6 rounded-full bg-blue flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </label>
            ))}
          </div>

          <Button variant="white" size="full" onClick={() => navigate('/home')}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
