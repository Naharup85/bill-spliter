import { TopBar } from './TopBar'

type Props = {
  title?: string
  message?: string
}

export function LoadingScreen({
  title = 'Loading your home…',
  message = 'Fetching your data from the server.',
}: Props) {
  return (
    <main className="app-shell">
      <TopBar />

      <section className="workspace">
        <div className="setup-card">
          <div className="card-icon">⌛</div>
          <div className="card-heading">
            <span className="section-label">LOADING</span>
            <h2>{title}</h2>
            <p>{message}</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>Made for sharing, not stressing.</span>
        <span>SHARED BILL SPLITTER</span>
      </footer>
    </main>
  )
}
