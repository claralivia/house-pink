import { cx } from '../../lib/cx.js'

export default function Chip({ active, className, children, ...rest }) {
  return (
    <button
      type="button"
      className={cx('chip', active && 'on', className)}
      aria-pressed={Boolean(active)}
      {...rest}
    >
      {children}
    </button>
  )
}
