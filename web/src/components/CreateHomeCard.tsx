type Props = {
  homeName: string
  loading: boolean
  onHomeNameChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function CreateHomeCard({ homeName, loading, onHomeNameChange, onSubmit }: Props) {
  return (
    <div className="setup-card">
      <div className="card-icon">⌂</div>
      <div className="card-heading">
        <span className="section-label">GET STARTED</span>
        <h2>Create your home</h2>
        <p>
          Start by giving your shared space a name. You can add everyone who shares expenses with
          you next.
        </p>
      </div>

      <form onSubmit={onSubmit} className="form">
        <label htmlFor="homeName">Home name</label>
        <input
          id="homeName"
          value={homeName}
          onChange={(event) => onHomeNameChange(event.target.value)}
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
  )
}
