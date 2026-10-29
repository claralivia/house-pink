import { cx } from '../../lib/cx.js'

const initialsOf = (name) =>
  (name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export default function Avatar({ src, name, size = 'md', className }) {
  return src ? (
    <img className={cx('app-avatar', size, className)} src={src} alt="" />
  ) : (
    <span className={cx('app-avatar initials', size, className)} aria-hidden="true">
      {initialsOf(name) || '?'}
    </span>
  )
}
