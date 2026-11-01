import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CreateHomeCard } from '../components/CreateHomeCard'
import { Dashboard } from '../components/Dashboard'
import { LoadingScreen } from '../components/LoadingScreen'
import { TopBar } from '../components/TopBar'
import { api, type Balance, type Bill, type Home as HomeData, type Member } from '../lib/api'

const STORAGE_KEY = 'bill-splitter-home-id'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [home, setHome] = useState<HomeData | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [homeName, setHomeName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [bills, setBills] = useState<Bill[]>([])
  const [billTitle, setBillTitle] = useState('')
  const [billAmount, setBillAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [error, setError] = useState('')
  const [balances, setBalances] = useState<Balance[]>([])

  // On mount: restore home from localStorage.
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY)
    if (!savedId) {
      setInitializing(false)
      return
    }

    api
      .getHome(savedId)
      .then(async (details) => {
        const balancesResult = await api.getBalances(details.id)
        setHome({ id: details.id, name: details.name })
        setMembers(details.members)
        setBills(details.bills)
        setBalances(balancesResult.balances)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : ''
        if (message === 'Home not found') {
          localStorage.removeItem(STORAGE_KEY)
        } else {
          setError('Could not restore your home. Please try refreshing.')
        }
      })
      .finally(() => {
        setInitializing(false)
      })
  }, [])

  async function refreshHome(homeId: string) {
    const [details, balancesResult] = await Promise.all([
      api.getHome(homeId),
      api.getBalances(homeId),
    ])
    setHome({ id: details.id, name: details.name })
    setMembers(details.members)
    setBills(details.bills)
    setBalances(balancesResult.balances)
  }

  async function handleCreateHome(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const createdHome = await api.createHome(homeName.trim())
      localStorage.setItem(STORAGE_KEY, createdHome.id)
      setHome(createdHome)
      setMembers([])
      setBills([])
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
      await api.addMember(home.id, memberName.trim())
      await refreshHome(home.id)
      setMemberName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add member')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateBill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!home || members.length === 0) {
      setError('Add at least one member before creating a bill')
      return
    }
    const totalCents = Number(billAmount)
    if (!Number.isSafeInteger(totalCents) || totalCents <= 0) {
      setError('Enter a valid positive whole number of cents')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.createBill(home.id, billTitle.trim(), totalCents)
      await refreshHome(home.id)
      setBillTitle('')
      setBillAmount('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create bill')
    } finally {
      setLoading(false)
    }
  }

  async function handlePayShare(billId: string, shareId: string) {
    if (!home) return
    setError('')
    setLoading(true)
    try {
      await api.payShare(billId, shareId, crypto.randomUUID())
      await refreshHome(home.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return <LoadingScreen />
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

        {!home ? (
          <CreateHomeCard
            homeName={homeName}
            loading={loading}
            onHomeNameChange={setHomeName}
            onSubmit={handleCreateHome}
          />
        ) : (
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
        )}
      </section>

      <footer className="footer">
        <span>Made for sharing, not stressing.</span>
        <span>SHARED BILL SPLITTER</span>
      </footer>
    </main>
  )
}
