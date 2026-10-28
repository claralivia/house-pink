import { Link } from 'react-router-dom'
import { cx } from '../../lib/cx.js'
import { EXTERNAL_PROPS } from '../../lib/links.js'
import Butterfly from './Butterfly.jsx'

const VARIANT_CLASS = { dark: '', outline: 'outline', light: 'light' }

export default function Button({
  to,
  href,
  external,
  variant = 'dark',
  size,
  wide,
  tone,
  className,
  children,
  ...rest
}) {
  const Component = to ? Link : 'a'
  const target = to ? { to } : { href, ...(external && EXTERNAL_PROPS) }

  return (
    <Component
      className={cx('btn', VARIANT_CLASS[variant], size, wide && 'wide', className)}
      {...target}
      {...rest}
    >
      {children}
      {tone ? <Butterfly tone={tone} className="bf" /> : null}
    </Component>
  )
}
