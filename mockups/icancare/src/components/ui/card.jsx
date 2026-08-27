import { forwardRef } from 'react'
import { cn } from './utils'

const Card = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-2xl bg-white card-soft', className)} {...props} />
))
Card.displayName = 'Card'

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export { Card, CardContent }
