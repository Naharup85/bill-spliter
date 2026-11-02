import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { Dashboard } from '../components/Dashboard'
import { LoadingScreen } from '../components/LoadingScreen'
import { TopBar } from '../components/TopBar'
import { api, type Balance, type Bill, type Home, type Member } from '../lib/api'

export const Route = createFileRoute('/home/$homeId')({
  component: HomeDashboardRoute,
})

type ErrorState = {
  type: 'not_found' | 'network'
  message: string
}

function HomeDashboardRoute() {
  const { homeId } = Route.useParams()
  const navigate = useNavigate()

  const [home, setHome] = useState<Home | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [balances, setBalances] = useState<Balance[]>([])

  const [memberName, setMemberName] = useState('')
  const [billTitle, setBillTitle] = useState('')
  const [billAmount, setBillAmount] = useState('')

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [errorState, setErrorState] = useState<ErrorState | null>(null)
  const [actionError, setActionError] = useState('')

  const loadHome = useCallback(async (id: string) => {
    const trimmedId = id?.trim()
    if (!trimmedId) {
      setErrorState({
        type: 'not_found',
        message: 'Invalid home ID.',
      })
      setInitialLoading(false)
      return
    }

    setInitialLoading(true)
    setErrorState(null)
    setActionError('')

    try {
      const [details, balancesResult] = await Promise.all([
        api.getHome(trimmedId),
        api.getBalances(trimmedId),
      ])
      setHome({ id: details.id, name: details.name })
      setMembers(details.members)
      setBills(details.bills)
      setBalances(balancesResult.balances)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load home'
      if (message === 'Home not found' || message.toLowerCase().includes('not found')) {
        setErrorState({
          type: 'not_found',
          message: 'The requested home could not be found.',
        })
      } else {
        setErrorState({
          type: 'network',
          message:
            message || 'Could not connect to the server. Please check your network and try again.',
        })
      }
    } finally {
      setInitialLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHome(homeId)
  }, [homeId, loadHome])

  async function refreshHome(id: string) {
    const [details, balancesResult] = await Promise.all([api.getHome(id), api.getBalances(id)])
    setHome({ id: details.id, name: details.name })
    setMembers(details.members)
    setBills(details.bills)
    setBalances(balancesResult.balances)
  }

  async function handleAddMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!home) return
    setActionError('')
    setLoading(true)
    try {
      await api.addMember(home.id, memberName.trim())
      await refreshHome(home.id)
      setMemberName('')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not add member')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateBill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!home || members.length === 0) {
      setActionError('Add at least one member before creating a bill')
      return
    }
    const totalCents = Number(billAmount)
    if (!Number.isSafeInteger(totalCents) || totalCents <= 0) {
      setActionError('Enter a valid positive whole number of cents')
      return
    }
    setActionError('')
    setLoading(true)
    try {
      await api.createBill(home.id, billTitle.trim(), totalCents)
      await refreshHome(home.id)
      setBillTitle('')
      setBillAmount('')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not create bill')
    } finally {
      setLoading(false)
    }
  }

  async function handlePayShare(billId: string, shareId: string) {
    if (!home) return
    setActionError('')
    setLoading(true)
    try {
      await api.payShare(billId, shareId, crypto.randomUUID())
      await refreshHome(home.id)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <LoadingScreen />
  }

  if (errorState?.type === 'not_found') {
    return (
      <main className="app-shell">
        <TopBar />

        <section className="workspace">
          <div className="setup-card" role="alert">
            <div className="card-icon">⚠</div>
            <div className="card-heading">
              <span className="section-label">ERROR</span>
              <h2>Home not found</h2>
              <p>The home with ID &ldquo;{homeId}&rdquo; does not exist or has been removed.</p>
            </div>
            <div className="form">
              <button type="button" onClick={() => navigate({ to: '/' })}>
                Return to home creation
                <span aria-hidden="true">→</span>
              </button>
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

  if (errorState?.type === 'network') {
    return (
      <main className="app-shell">
        <TopBar />

        <section className="workspace">
          <div className="setup-card" role="alert">
            <div className="card-icon">⚡</div>
            <div className="card-heading">
              <span className="section-label">NETWORK ERROR</span>
              <h2>Failed to load home</h2>
              <p>{errorState.message}</p>
            </div>
            <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button type="button" onClick={() => loadHome(homeId)}>
                Retry
                <span aria-hidden="true">↻</span>
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                style={{ background: '#485850' }}
              >
                Return to home creation
              </button>
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

  if (!home) {
    return null
  }

  return (
    <main className="app-shell">
      <TopBar />

      <section className="workspace">
        {actionError && (
          <div className="error-message" role="alert">
            {actionError}
          </div>
        )}

        <Dashboard
          home={home}
          members={members}
          bills={bills}
          balances={balances}
          memberName={memberName}
          billTitle={billTitle}
          billAmount={billAmount}
          loading={loading}
          onMemberNameChange={setMemberName}
          onBillTitleChange={setBillTitle}
          onBillAmountChange={setBillAmount}
          onAddMember={handleAddMember}
          onCreateBill={handleCreateBill}
          onPayShare={handlePayShare}
        />
      </section>

      <footer className="footer">
        <span>Made for sharing, not stressing.</span>
        <span>SHARED BILL SPLITTER</span>
      </footer>
    </main>
  )
}
