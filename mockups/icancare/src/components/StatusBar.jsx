export default function StatusBar({ light = false }) {
  const c = light ? '#fff' : '#000'
  return (
    <div className={`status-bar ${light ? 'status-bar--light' : ''}`} aria-hidden="true">
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0.5" y="8.5" width="3" height="3.5" rx="0.75" fill={c}/>
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.75" fill={c}/>
          <rect x="9.5" y="2.5" width="3" height="9.5" rx="0.75" fill={c}/>
          <rect x="14" y="0" width="3" height="12" rx="0.75" fill={c}/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" fill={c}/>
          <path d="M5 8a4.24 4.24 0 016 0" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M2.5 5.5a7.5 7.5 0 0111 0" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke={c} strokeOpacity="0.3"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill={c}/>
          <path d="M23 4v4a2 2 0 000-4z" fill={c} fillOpacity="0.35"/>
        </svg>
      </div>
    </div>
  )
}
