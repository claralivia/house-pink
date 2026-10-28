export default function Step({ number, title, children }) {
  return (
    <section className="bk-step">
      <h2 className="bk-title">
        <span className="bk-num">{number}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}
