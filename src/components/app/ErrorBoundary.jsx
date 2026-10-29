import { Component } from 'react'

// Evita a tela em branco: se algo quebrar, a pessoa vê um aviso e um botão para recarregar.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main style={{ maxWidth: 420, margin: '0 auto', padding: '64px 16px', textAlign: 'center' }}>
        <h1 style={{ font: "700 24px/30px 'Syne', sans-serif" }}>Algo deu errado</h1>
        <p style={{ margin: '12px 0 24px', color: '#5f565b' }}>
          Não foi culpa sua. Toque no botão para tentar de novo.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            minHeight: 48,
            padding: '0 24px',
            border: 0,
            borderRadius: 999,
            background: '#141012',
            color: '#fff',
            font: "600 16px 'Figtree', sans-serif",
            cursor: 'pointer',
          }}
        >
          Tentar de novo
        </button>
      </main>
    )
  }
}
