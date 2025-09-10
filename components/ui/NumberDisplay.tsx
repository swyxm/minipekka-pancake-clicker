'use client'

import { motion } from 'framer-motion'

interface NumberDisplayProps {
  value: number
  label?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning'
  className?: string
  animated?: boolean
}

export default function NumberDisplay({
  value,
  label,
  size = 'md',
  color = 'primary',
  className = '',
  animated = true
}: NumberDisplayProps) {
  const formatNumber = (num: number): string => {
    const tiers = [
      { v: 1e303, s: 'Cc' }, // centillion (10^303)
      { v: 1e300, s: 'Nc' }, // novemnonagintillion
      { v: 1e297, s: 'Oc' }, // octononagintillion
      { v: 1e294, s: 'Sc' }, // septennonagintillion
      { v: 1e291, s: 'Sx' }, // sexnonagintillion
      { v: 1e288, s: 'Qc' }, // quinnonagintillion
      { v: 1e285, s: 'Qa' }, // quattuornonagintillion
      { v: 1e282, s: 'Tc' }, // trenonagintillion
      { v: 1e279, s: 'Dc' }, // duononagintillion
      { v: 1e276, s: 'Uc' }, // unnonagintillion
      { v: 1e273, s: 'Nc' }, // nonagintillion
      { v: 1e270, s: 'Nc' }, // novemoctogintillion
      { v: 1e267, s: 'Oc' }, // octooctogintillion
      { v: 1e264, s: 'Sc' }, // septenoctogintillion
      { v: 1e261, s: 'Sx' }, // sexoctogintillion
      { v: 1e258, s: 'Qc' }, // quinoctogintillion
      { v: 1e255, s: 'Qa' }, // quattuoroctogintillion
      { v: 1e252, s: 'Tc' }, // treoctogintillion
      { v: 1e249, s: 'Dc' }, // duooctogintillion
      { v: 1e246, s: 'Uc' }, // unoctogintillion
      { v: 1e243, s: 'Oc' }, // octogintillion
      { v: 1e240, s: 'Nc' }, // novemseptuagintillion
      { v: 1e237, s: 'Oc' }, // octoseptuagintillion
      { v: 1e234, s: 'Sc' }, // septenseptuagintillion
      { v: 1e231, s: 'Sx' }, // sexseptuagintillion
      { v: 1e228, s: 'Qc' }, // quinseptuagintillion
      { v: 1e225, s: 'Qa' }, // quattuorseptuagintillion
      { v: 1e222, s: 'Tc' }, // treseptuagintillion
      { v: 1e219, s: 'Dc' }, // duoseptuagintillion
      { v: 1e216, s: 'Uc' }, // unseptuagintillion
      { v: 1e213, s: 'Sc' }, // septuagintillion
      { v: 1e210, s: 'Nc' }, // novemsexagintillion
      { v: 1e207, s: 'Oc' }, // octosexagintillion
      { v: 1e204, s: 'Sc' }, // septensexagintillion
      { v: 1e201, s: 'Sx' }, // sexsexagintillion
      { v: 1e198, s: 'Qc' }, // quinsexagintillion
      { v: 1e195, s: 'Qa' }, // quattuorsexagintillion
      { v: 1e192, s: 'Tc' }, // tresexagintillion
      { v: 1e189, s: 'Dc' }, // duosexagintillion
      { v: 1e186, s: 'Uc' }, // unsexagintillion
      { v: 1e183, s: 'Sx' }, // sexagintillion
      { v: 1e180, s: 'Nc' }, // novemquinquagintillion
      { v: 1e177, s: 'Oc' }, // octoquinquagintillion
      { v: 1e174, s: 'Sc' }, // septenquinquagintillion
      { v: 1e171, s: 'Sx' }, // sexquinquagintillion
      { v: 1e168, s: 'Qc' }, // quinquinquagintillion
      { v: 1e165, s: 'Qa' }, // quattuorquinquagintillion
      { v: 1e162, s: 'Tc' }, // trequinquagintillion
      { v: 1e159, s: 'Dc' }, // duoquinquagintillion
      { v: 1e156, s: 'Uc' }, // unquinquagintillion
      { v: 1e153, s: 'Qc' }, // quinquagintillion
      { v: 1e150, s: 'Nc' }, // novemquadragintillion
      { v: 1e147, s: 'Oc' }, // octoquadragintillion
      { v: 1e144, s: 'Sc' }, // septenquadragintillion
      { v: 1e141, s: 'Sx' }, // sexquadragintillion
      { v: 1e138, s: 'Qc' }, // quadragintillion
      { v: 1e135, s: 'Nc' }, // novemtrigintillion
      { v: 1e132, s: 'Oc' }, // octotrigintillion
      { v: 1e129, s: 'Sc' }, // septentrigintillion
      { v: 1e126, s: 'Sx' }, // sextrigintillion
      { v: 1e123, s: 'Qc' }, // trigintillion
      { v: 1e120, s: 'Nc' }, // novemvigintillion
      { v: 1e117, s: 'Oc' }, // octovigintillion
      { v: 1e114, s: 'Sc' }, // septenvigintillion
      { v: 1e111, s: 'Sx' }, // sexvigintillion
      { v: 1e108, s: 'Qc' }, // vigintillion
      { v: 1e105, s: 'Nc' }, // novemdecillion
      { v: 1e102, s: 'Oc' }, // octodecillion
      { v: 1e99,  s: 'Sc' }, // septendecillion
      { v: 1e96,  s: 'Sx' }, // sexdecillion
      { v: 1e93,  s: 'Qc' }, // quindecillion
      { v: 1e90,  s: 'Qa' }, // quattuordecillion
      { v: 1e87,  s: 'Tc' }, // tredecillion
      { v: 1e84,  s: 'Dc' }, // duodecillion
      { v: 1e81,  s: 'Uc' }, // undecillion
      { v: 1e78,  s: 'Dc' }, // decillion
      { v: 1e75,  s: 'Nc' }, // novemnonillion
      { v: 1e72,  s: 'Oc' }, // octononillion
      { v: 1e69,  s: 'Sc' }, // septennonillion
      { v: 1e66,  s: 'Sx' }, // sexnonillion
      { v: 1e63,  s: 'Qc' }, // quinnonillion
      { v: 1e60,  s: 'Qa' }, // quattuornonillion
      { v: 1e57,  s: 'Tc' }, // trenonillion
      { v: 1e54,  s: 'Dc' }, // duononillion
      { v: 1e51,  s: 'Uc' }, // unnonillion
      { v: 1e48,  s: 'Nc' }, // nonillion
      { v: 1e45,  s: 'Nc' }, // novemoctillion
      { v: 1e42,  s: 'Oc' }, // octooctillion
      { v: 1e39,  s: 'Sc' }, // septenoctillion
      { v: 1e36,  s: 'Sx' }, // sexoctillion
      { v: 1e33,  s: 'Qc' }, // quinoctillion
      { v: 1e30,  s: 'Nn' }, // nonillion (10^30)
      { v: 1e27,  s: 'Oc' }, // octillion
      { v: 1e24,  s: 'Sp' }, // septillion
      { v: 1e21,  s: 'Sx' }, // sextillion
      { v: 1e18,  s: 'Qi' }, // quintillion
      { v: 1e15,  s: 'Qa' }, // quadrillion
      { v: 1e12,  s: 'T' },  // trillion
      { v: 1e9,   s: 'B' },  // billion
      { v: 1e6,   s: 'M' },  // million
      { v: 1e3,   s: 'K' },  // thousand
    ]
    const abs = Math.abs(num)
    for (const t of tiers) {
      if (abs >= t.v) {
        const val = (num / t.v)
        const formatted = val >= 100 ? val.toFixed(0) : val >= 10 ? val.toFixed(1) : val.toFixed(2)
        return formatted.replace(/\.0+$/, '') + t.s
      }
    }
    return num.toLocaleString()
  }

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  const colorClasses = {
    primary: 'text-pekka-blue',
    secondary: 'text-pekka-text-secondary',
    accent: 'text-pekka-accent',
    success: 'text-pekka-success',
    warning: 'text-pekka-warning'
  }

  const Component = animated ? motion.div : 'div'
  const motionProps = animated ? {
    initial: { scale: 1.1, opacity: 0.8 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <div className={`text-center ${className}`}>
      <Component
        key={value}
        className={`orbitron-font font-bold ${sizeClasses[size]} ${colorClasses[color]} number-counter`}
        {...motionProps}
      >
        {formatNumber(value)}
      </Component>
      {label && (
        <div className="clash-font text-pekka-text-secondary text-sm mt-1">
          {label}
        </div>
      )}
    </div>
  )
}
