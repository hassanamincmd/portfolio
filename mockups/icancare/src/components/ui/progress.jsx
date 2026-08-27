import { cn } from './utils'

export function Progress({ value = 0, className }) {
  return (
    <div className={cn('h-1.5 w-full rounded-full bg-white/20 overflow-hidden', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-teal transition-all duration-300" style={{ width: `${value}%` }} />
    </div>
  )
}
