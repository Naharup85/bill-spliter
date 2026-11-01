import type { Bill, Member } from '../lib/api'

type Props = {
  bills: Bill[]
  members: Member[]
  billTitle: string
  billAmount: string
  loading: boolean
  onBillTitleChange: (value: string) => void
  onBillAmountChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onPayShare: (billId: string, shareId: string) => void
}

export function BillSection({
  bills,
  members,
  billTitle,
  billAmount,
  loading,
  onBillTitleChange,
  onBillAmountChange,
  onSubmit,
  onPayShare,
}: Props) {
  return (
    <section className="bill-section">
      <div className="member-heading">
        <div>
          <h3>Shared expenses</h3>
          <p>Create a bill and split it among your members.</p>
        </div>
        <span className="member-count">{bills.length}</span>
      </div>

      <form onSubmit={onSubmit} className="form">
        <label htmlFor="billTitle">Bill title</label>
        <input
          id="billTitle"
          value={billTitle}
          onChange={(event) => onBillTitleChange(event.target.value)}
          placeholder="e.g. Electricity bill"
          required
          maxLength={100}
        />

        <label htmlFor="billAmount">Total amount (cents)</label>
        <input
          id="billAmount"
          type="number"
          min="1"
          step="1"
          value={billAmount}
          onChange={(event) => onBillAmountChange(event.target.value)}
          placeholder="e.g. 100000"
          required
        />

        <button type="submit" disabled={loading || !billTitle.trim() || !billAmount}>
          {loading ? 'Creating...' : 'Create and split bill'}
          <span>→</span>
        </button>
      </form>

      {bills.length === 0 ? (
        <div className="empty-members">
          <strong>No shared expenses yet</strong>
          <p>Your created bills will appear here.</p>
        </div>
      ) : (
        <div className="bill-list">
          {bills.map((bill) => (
            <article key={bill.id} className="bill-card">
              <div className="bill-heading">
                <div>
                  <h4>{bill.title}</h4>
                  <p>{bill.shares.length} member shares</p>
                </div>
                <strong>{bill.totalCents.toLocaleString('en-US')} cents</strong>
              </div>

              {bill.shares.map((share) => {
                const member = members.find((item) => item.id === share.memberId)

                return (
                  <div className="share-row" key={share.id}>
                    <span>{member?.name ?? 'Member'}</span>

                    <strong>{share.amountCents.toLocaleString('en-US')} cents</strong>

                    {share.paidAt ? (
                      <span className="paid-status">Paid</span>
                    ) : (
                      <button
                        type="button"
                        className="pay-button"
                        disabled={loading}
                        onClick={() => onPayShare(bill.id, share.id)}
                      >
                        Pay
                      </button>
                    )}
                  </div>
                )
              })}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
