import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from './utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-[15px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 min-h-[48px] active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary: 'bg-blue text-white shadow-lg shadow-blue/25',
        soft: 'bg-blue-soft text-blue-deep',
        outline: 'border-2 border-slate-200 bg-white text-ink',
        ghost: 'text-muted',
        white: 'bg-white text-blue-deep shadow-md shadow-blue/10',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-11 px-5 text-[13px] rounded-xl',
        full: 'h-14 px-6 w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
)

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'
export { Button, buttonVariants }
