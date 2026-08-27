import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Bookmark, Play } from 'lucide-react'
import StatusBar from '../components/StatusBar'

export default function Article() {
  const navigate = useNavigate()

  return (
    <div className="iphone-device">
      <div className="phone-frame !pt-0">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=360&fit=crop"
              alt=""
              className="w-full h-52 object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-deep/50 via-transparent to-blue-deep/90" />
            <div className="absolute inset-x-0 top-0">
              <StatusBar light />
              <nav className="flex items-center justify-between px-5 pt-1">
                <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center" aria-label="Back">
                  <ChevronLeft size={18} className="text-white" />
                </button>
                <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center" aria-label="Save">
                  <Bookmark size={16} className="text-white" />
                </button>
              </nav>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">Knowledge</p>
              <h1 className="text-[20px] font-extrabold text-white leading-snug mt-1.5 tracking-[-0.02em]">
                Preparing for your first oncology appointment
              </h1>
              <p className="text-[12px] text-white/75 mt-2">8 min read · Aug 2026</p>
            </div>
          </div>

          <div className="mx-5 -mt-3 p-4 bg-white rounded-2xl card-soft flex items-center gap-3 relative z-10">
            <button className="w-10 h-10 rounded-full bg-blue flex items-center justify-center flex-shrink-0" aria-label="Play">
              <Play size={14} className="text-white ml-0.5" fill="currentColor" />
            </button>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-muted mb-1.5">Listen to this article</p>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue rounded-full w-[18%]" />
              </div>
            </div>
            <span className="text-[11px] text-muted tabular-nums">4:18</span>
          </div>

          <article className="px-5 py-6 space-y-4">
            <p className="text-[15px] font-semibold text-ink leading-relaxed">
              A little preparation can help you feel more in control.
            </p>
            <p className="text-[14px] text-slate-600 leading-[1.8]">
              When your doctor suggests you see an oncologist, many questions come to mind. The first visit is mainly about sharing your medical history, understanding your diagnosis, and talking about next steps.
            </p>

            <h2 className="text-[15px] font-bold text-ink pt-1">What to bring</h2>
            <ul className="space-y-2 pl-4 list-disc text-[14px] text-slate-600 leading-[1.8] marker:text-blue">
              <li>Your current medicines and supplement list</li>
              <li>Recent test results or referral letter</li>
              <li>Notes about symptoms and when they started</li>
              <li>A friend or family member for support</li>
            </ul>

            <h2 className="text-[15px] font-bold text-ink pt-1">Questions you might ask</h2>
            <ul className="space-y-2 pl-4 list-disc text-[14px] text-slate-600 leading-[1.8] marker:text-blue">
              <li>What type and stage is my cancer?</li>
              <li>What treatment options are available?</li>
              <li>What are the possible side effects?</li>
              <li>Is there a clinical trial I should consider?</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  )
}
