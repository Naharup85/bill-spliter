import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CreateHomeCard } from '../components/CreateHomeCard'
import { TopBar } from '../components/TopBar'
import { api } from '../lib/api'

export const Route = createFileRoute('/')({
  component: HomeCreation,
})

function HomeCreation() {
  const navigate = useNavigate()
  const [homeName, setHomeName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateHome(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const createdHome = await api.createHome(homeName.trim())
      navigate({ to: '/home/$homeId', params: { homeId: createdHome.id } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <TopBar />

      <section className="workspace">
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <CreateHomeCard
          homeName={homeName}
          loading={loading}
          onHomeNameChange={setHomeName}
          onSubmit={handleCreateHome}
        />
      </section>

      <footer className="footer">
        <span>Made for sharing, not stressing.</span>
        <span>SHARED BILL SPLITTER</span>
      </footer>
    </main>
  )
}
