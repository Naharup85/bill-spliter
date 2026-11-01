import type { Balance } from '../lib/api'

type Props = {
  balances: Balance[]
}

export function BalanceSection({ balances }: Props) {
  return (
    <section className="balance-section">
      <div className="member-heading">
        <div>
          <h3>Outstanding balances</h3>
          <p>See how much each member still owes.</p>
        </div>
      </div>

      {balances.length === 0 ? (
        <div className="empty-members">
          <strong>No balance information yet</strong>
          <p>Create a bill to calculate outstanding balances.</p>
        </div>
      ) : (
        <div className="balance-list">
          {balances.map((balance) => (
            <div className="balance-row" key={balance.memberId}>
              <span>{balance.name}</span>
              <strong>{balance.outstandingCents.toLocaleString('en-US')} cents</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
