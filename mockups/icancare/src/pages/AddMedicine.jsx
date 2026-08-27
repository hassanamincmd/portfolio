import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Pill, Clock, CalendarDays } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import StatusBar from '../components/StatusBar'

const steps = ['Medicine', 'Schedule', 'Confirm']

export default function AddMedicine() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', dosage: '', frequency: 'Once daily',
    time: '08:00', startDate: '2026-08-19', endDate: '2026-11-19',
  })
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="iphone-device">
      <div className="phone-frame !pt-0" style={{ background: '#fff' }}>
        <StatusBar />
        <div className="px-5 pb-3 flex-shrink-0">
          <nav className="flex items-center justify-between mb-4">
            <button
              onClick={() => (step === 0 ? navigate('/reminders') : setStep(step - 1))}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
              aria-label="Back"
            >
              <ChevronLeft size={18} className="text-ink" />
            </button>
            <span className="text-[12px] text-muted font-medium">{step + 1} of 3</span>
          </nav>
          <h1 className="text-[22px] font-extrabold text-ink tracking-[-0.02em]">Add medicine</h1>
          <div className="flex gap-1.5 mt-4">
            {steps.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-blue' : 'bg-slate-100'}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-5">
          {step === 0 && (
            <div className="space-y-5 mt-5 animate-enter">
              <Field label="Medicine name" value={form.name} onChange={v => update('name', v)} placeholder="e.g. Aggrenox" />
              <Field label="Dosage" value={form.dosage} onChange={v => update('dosage', v)} placeholder="e.g. 200 mg" />
              <div>
                <label className="text-[12px] font-semibold text-muted block mb-2">Frequency</label>
                <select
                  value={form.frequency}
                  onChange={e => update('frequency', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-blue bg-white"
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-5 mt-5 animate-enter">
              <Field label="Time" type="time" value={form.time} onChange={v => update('time', v)} />
              <Field label="Start date" type="date" value={form.startDate} onChange={v => update('startDate', v)} />
              <Field label="End date" type="date" value={form.endDate} onChange={v => update('endDate', v)} />
            </div>
          )}
          {step === 2 && (
            <div className="mt-5 animate-enter">
              <Card className="overflow-hidden">
                <div className="h-1.5 bg-blue" />
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-soft flex items-center justify-center">
                      <Pill size={22} className="text-blue" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-ink">{form.name || 'Medicine'}</p>
                      <p className="text-[12px] text-muted">{form.dosage || 'Dosage'} · {form.frequency}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-[12px] text-slate-600">{form.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-slate-400" />
                      <span className="text-[12px] text-slate-600">{form.startDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="px-5 pb-8 pt-3 flex-shrink-0">
          {step < 2 ? (
            <Button variant="primary" size="full" onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button variant="primary" size="full" onClick={() => navigate('/reminders')}>
              <Check size={16} className="mr-2" /> Save medicine
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="text-[12px] font-semibold text-muted block mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-blue transition-colors"
      />
    </div>
  )
}
