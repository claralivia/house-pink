import { cx } from '../../lib/cx.js'
import { EXTERNAL_PROPS } from '../../lib/links.js'

export default function ExternalLink({ className, children, ...rest }) {
  return (
    <a className={cx('lk', className)} {...EXTERNAL_PROPS} {...rest}>
      {children}
    </a>
  )
}
