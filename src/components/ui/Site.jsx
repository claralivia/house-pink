import { cx } from '../../lib/cx.js'

export default function Site({ seen = true, children }) {
  return <div className={cx('site', seen && 'seen')}>{children}</div>
}
