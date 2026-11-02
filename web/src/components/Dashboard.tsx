import type { Balance, Bill, Home, Member } from '../lib/api'
import { BalanceSection } from './BalanceSection'
import { BillSection } from './BillSection'
import { MemberSection } from './MemberSection'

type Props = {
  home: Home
  members: Member[]
  bills: Bill[]
  balances: Balance[]
  memberName: string
  billTitle: string
  billAmount: string
  loading: boolean
  onMemberNameChange: (value: string) => void
  onBillTitleChange: (value: string) => void
  onBillAmountChange: (value: string) => void
  onAddMember: (event: React.FormEvent<HTMLFormElement>) => void
  onCreateBill: (event: React.FormEvent<HTMLFormElement>) => void
  onPayShare: (billId: string, shareId: string) => void
}

export function Dashboard({
  home,
  members,
  bills,
  balances,
  memberName,
  billTitle,
  billAmount,
  loading,
  onMemberNameChange,
  onBillTitleChange,
  onBillAmountChange,
  onAddMember,
  onCreateBill,
  onPayShare,
}: Props) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <div>
          <span className="section-label">YOUR SPACE</span>
          <h2>{home.name}</h2>
          <p>Your shared expense space is ready.</p>
        </div>
        <span className="home-badge">Active home</span>
      </div>

      <div className="dashboard-content">
        <MemberSection
          members={members}
          memberName={memberName}
          loading={loading}
          onMemberNameChange={onMemberNameChange}
          onSubmit={onAddMember}
        />

        <BillSection
          bills={bills}
          members={members}
          billTitle={billTitle}
          billAmount={billAmount}
          loading={loading}
          onBillTitleChange={onBillTitleChange}
          onBillAmountChange={onBillAmountChange}
          onSubmit={onCreateBill}
          onPayShare={onPayShare}
        />

        <BalanceSection balances={balances} />
      </div>
    </div>
  )
}
