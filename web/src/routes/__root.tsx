import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TopBar } from '../components/TopBar'

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <main className="app-shell">
      <TopBar />
      <section className="workspace">
        <div className="setup-card" role="alert">
          <div className="card-icon">⚠</div>
          <div className="card-heading">
            <span className="section-label">NOT FOUND</span>
            <h2>Page not found</h2>
            <p>The page you requested does not exist.</p>
          </div>
          <div className="form">
            <Link to="/">
              <button type="button" style={{ width: '100%' }}>
                Return to home creation
                <span aria-hidden="true">→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
      <footer className="footer">
        <span>Made for sharing, not stressing.</span>
        <span>SHARED BILL SPLITTER</span>
      </footer>
    </main>
  ),
})
