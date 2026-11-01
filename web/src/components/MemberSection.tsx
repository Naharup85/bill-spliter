import type { Member } from '../lib/api'

type Props = {
  members: Member[]
  memberName: string
  loading: boolean
  onMemberNameChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function MemberSection({
  members,
  memberName,
  loading,
  onMemberNameChange,
  onSubmit,
}: Props) {
  return (
    <>
      <div className="member-section">
        <div className="member-heading">
          <div>
            <h3>People in your home</h3>
            <p>
              {members.length} {members.length === 1 ? 'member' : 'members'} added
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

      <form onSubmit={onSubmit} className="add-member-form">
        <label htmlFor="memberName">Add someone to your home</label>
        <div className="input-row">
          <input
            id="memberName"
            value={memberName}
            onChange={(event) => onMemberNameChange(event.target.value)}
            placeholder="Enter their name"
            required
            maxLength={80}
          />
          <button type="submit" disabled={loading || !memberName.trim()}>
            {loading ? 'Adding...' : 'Add member'}
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </form>
    </>
  )
}
