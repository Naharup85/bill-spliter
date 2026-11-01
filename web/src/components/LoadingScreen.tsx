import { TopBar } from './TopBar'

export function LoadingScreen() {
  return (
    <main className="app-shell">
      <TopBar />

      <section className="workspace">
        <div className="setup-card">
          <div className="card-icon">⌛</div>
          <div className="card-heading">
            <span className="section-label">LOADING</span>
            <h2>Restoring your home…</h2>
            <p>Fetching your data from the server.</p>
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
