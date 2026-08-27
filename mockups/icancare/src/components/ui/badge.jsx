import { cn } from './utils'

export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    navy: 'bg-navy/10 text-navy',
    coral: 'bg-coral/10 text-coral',
    teal: 'bg-teal/10 text-teal',
    warm: 'bg-warm/10 text-amber-800',
  }
  return (
    <span className={cn('inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold', variants[variant], className)} {...props} />
  )
}
