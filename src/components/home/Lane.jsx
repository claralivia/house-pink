import { cx } from '../../lib/cx.js'

export default function Lane({ pro, label, tone }) {
  return (
    <>
      <div className="who">
        <span>{pro.first}</span>
        <span>{pro.area}</span>
      </div>
      <div className={cx('lane', tone)}>
        <b>{label}</b>
      </div>
    </>
  )
}
