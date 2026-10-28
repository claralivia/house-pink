function Underline() {
  return (
    <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M3 9C32 2 56 13 88 7S150 3 197 8"
        fill="none"
        stroke="#FF0088"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function HeroTitle() {
  return (
    <h1>
      <span className="ln">
        <span>Sua beleza</span>
      </span>
      <span className="ln">
        <span>
          <span className="ul">
            em boas mãos
            <Underline />
          </span>
        </span>
      </span>
    </h1>
  )
}
