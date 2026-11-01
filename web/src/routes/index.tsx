
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  api,
  type Home as HomeData,
  type Member,
  type Bill,
} from '../lib/api'
import '../styles.css'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [home, setHome] = useState<HomeData | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [homeName, setHomeName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateHome(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const createdHome = await api.createHome(homeName.trim())
      setHome(createdHome)
      setHomeName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create home')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!home) return

    setError('')
    setLoading(true)

    try {
      const member = await api.addMember(home.id, memberName.trim())
      setMembers((current) => [...current, member])
      setMemberName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <nav className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">₹</span>
          <span>Splitwise<span className="brand-dot">.</span></span>
        </a>
        <span className="topbar-label">SHARED EXPENSES, SIMPLIFIED</span>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            <span className="status-dot" />
            YOUR SHARED MONEY SPACE
          </span>

          <h1>
            Good friends.
            <br />
            <span>Clear expenses.</span>
          </h1>

          <p className="hero-description">
            Keep track of shared bills, split expenses fairly, and always
            know who owes what. No awkward conversations needed.
          </p>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <div className="decoration-circle circle-one" />
          <div className="decoration-circle circle-two" />
          <div className="decoration-card">
            <span className="decoration-icon">↗</span>
            <span>Split smarter</span>
            <strong>Stay together.</strong>
          </div>
        </div>
      </section>

      <section className="workspace">
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {!home ? (
          <div className="setup-card">
            <div className="card-icon">⌂</div>
            <div className="card-heading">
              <span className="section-label">GET STARTED</span>
              <h2>Create your home</h2>
              <p>
                Start by giving your shared space a name. You can add
                everyone who shares expenses with you next.
              </p>
            </div>

            <form onSubmit={handleCreateHome} className="form">
              <label htmlFor="homeName">Home name</label>
              <input
                id="homeName"
                value={homeName}
                onChange={(event) => setHomeName(event.target.value)}
                placeholder="e.g. The Green House"
                required
                maxLength={80}
              />
              <button type="submit" disabled={loading || !homeName.trim()}>
                {loading ? 'Creating...' : 'Create your home'}
                <span aria-hidden="true">→</span>
              </button>
            </form>
            <p className="card-footnote">Free to use · No account required</p>
          </div>
        ) : (
          <div className="dashboard-card">
            <div className="dashboard-header">
              <div>
                <span className="section-label">YOUR SPACE</span>
                <h2>{home.name}</h2>
                <p>Your shared expense space is ready.</p>
              </div>
              <span className="home-badge">Active home</span>
            </div>

            <div className="member-section">
              <div className="member-heading">
                <div>
                  <h3>People in your home</h3>
                  <p>
                    {members.length}{' '}
                    {members.length === 1 ? 'member' : 'members'} added
                  </p>
                </div>
                <span className="member-count">{members.length}</span>
              </div>

              {members.length === 0 ? (
                <div className="empty-members">
                  <span className="empty-icon">♧</span>
                  <strong>Your space is a little quiet</strong>
                  <p>Add your first member to get started.</p>
                </div>
              ) : (
                <ul className="member-list">
                  {members.map((member, index) => (
                    <li key={member.id} className="member-item">
                      <span className={`avatar avatar-${index % 5}`}>
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="member-name">{member.name}</span>
                      <span className="member-tag">Member</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form onSubmit={handleAddMember} className="add-member-form">
              <label htmlFor="memberName">Add someone to your home</label>
              <div className="input-row">
                <input
                  id="memberName"
                  value={memberName}
                  onChange={(event) => setMemberName(event.target.value)}
                  placeholder="Enter their name"
                  required
                  maxLength={80}
                />
                <button
                  type="submit"
                  disabled={loading || !memberName.trim()}
                >
                  {loading ? 'Adding...' : 'Add member'}
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      <footer className="footer">
        <span>Made for sharing, not stressing.</span>
        <span>SHARED BILL SPLITTER</span>
      </footer>
    </main>
  )
}
