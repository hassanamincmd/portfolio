import { Outlet, NavLink } from 'react-router-dom'
import { Home, BookOpen, Bell, MapPin, User } from 'lucide-react'

const tabs = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/knowledge', icon: BookOpen, label: 'Learn' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
  { to: '/centres', icon: MapPin, label: 'Nearby' },
  { to: '/menu', icon: User, label: 'Profile' },
]

export default function AppShell() {
  return (
    <div className="iphone-device">
      <div className="phone-frame">
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <Outlet />
        </main>
        <nav aria-label="Main navigation" className="flex-shrink-0 bg-white px-1 pt-1.5 pb-6 border-t border-slate-100">
          <ul className="flex justify-around" role="tablist">
            {tabs.map(({ to, icon: Icon, label }) => (
              <li key={to} role="presentation">
                <NavLink
                  to={to}
                  role="tab"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-[3px] px-2 py-1.5 min-w-[52px] min-h-[44px] justify-center ${
                      isActive ? 'text-blue' : 'text-slate-400'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} fill={isActive ? 'currentColor' : 'none'} aria-hidden="true" />
                      <span className={`text-[10px] ${isActive ? 'font-semibold' : ''}`}>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
