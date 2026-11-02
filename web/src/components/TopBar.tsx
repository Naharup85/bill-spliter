import { Link } from '@tanstack/react-router'

export function TopBar() {
  return (
    <nav className="topbar">
      <Link className="brand" to="/">
        <span className="brand-icon">$</span>
        <span>
          Splitwise<span className="brand-dot">.</span>
        </span>
      </Link>
      <span className="topbar-label">SHARED EXPENSES, SIMPLIFIED</span>
    </nav>
  )
}
