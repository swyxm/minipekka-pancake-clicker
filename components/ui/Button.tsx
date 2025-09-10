'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  title?: string
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  title
}: ButtonProps) {
  const baseClasses = 'clash-font font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pekka-blue disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'game-button',
    secondary: 'bg-pekka-dark border border-pekka-border text-pekka-text hover:bg-pekka-hover hover:border-pekka-blue',
    danger: 'bg-pekka-error border border-pekka-error text-white hover:bg-red-600',
    success: 'bg-pekka-success border border-pekka-success text-white hover:bg-green-600'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      title={title}
    >
      {children}
    </motion.button>
  )
}
