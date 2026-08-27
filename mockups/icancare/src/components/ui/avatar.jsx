import { cn } from './utils'

export function Avatar({ children, className, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-[11px]', md: 'w-10 h-10 text-[12px]', lg: 'w-12 h-12 text-[14px]' }
  return (
    <div className={cn('rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center flex-shrink-0', sizes[size], className)}>
      {children}
    </div>
  )
}
