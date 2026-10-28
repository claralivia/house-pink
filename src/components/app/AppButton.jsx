import { cx } from '../../lib/cx.js'
import { EXTERNAL_PROPS } from '../../lib/links.js'

export default function AppButton({
  variant = 'primary',
  full,
  href,
  className,
  children,
  ...rest
}) {
  const classes = cx('app-btn', variant, full && 'full', className)

  return href ? (
    <a className={classes} href={href} {...EXTERNAL_PROPS} {...rest}>
      {children}
    </a>
  ) : (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
