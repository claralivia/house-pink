import { cx } from '../../lib/cx.js'
import Kicker from './Kicker.jsx'

export default function SectionHeading({
  kicker,
  title,
  light,
  as: Title = 'h2',
  titleClassName,
  children,
}) {
  return (
    <>
      <Kicker light={light}>{kicker}</Kicker>
      <Title className={cx('h2', titleClassName)}>{title}</Title>
      {children}
    </>
  )
}
