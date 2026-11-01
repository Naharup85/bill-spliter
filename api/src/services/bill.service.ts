async function createBillService(db: D1Database,homeId: string,title: string,totalCents: number) {
  const home = await db
    .prepare('SELECT id FROM homes WHERE id = ?')
    .bind(homeId)
    .first<{ id: string }>()

  if (!home) {
    return { error: 'HOME_NOT_FOUND' as const }
  }

  const members = await db
    .prepare(
      'SELECT id FROM members WHERE home_id = ? ORDER BY member_order ASC',
    )
    .bind(homeId)
    .all<{ id: string }>()

  if (members.results.length === 0) {
    return { error: 'NO_MEMBERS' as const }
  }

  const baseShare = Math.floor(totalCents / members.results.length)
  const remainder = totalCents % members.results.length

  const billId = crypto.randomUUID()

  const shares = members.results.map((member, index) => ({
  id: crypto.randomUUID(),
  memberId: member.id,
  amountCents: baseShare + (index < remainder ? 1 : 0),
  paidAt: null,
}))

  const statements = [
    db
      .prepare(
        'INSERT INTO bills (id, home_id, title, total_cents) VALUES (?, ?, ?, ?)',
      )
      .bind(billId, homeId, title, totalCents),
      ...shares.map(s => db.prepare(`INSERT INTO shares (id, bill_id, member_id, amount_cents) VALUES (?, ?, ?, ?)`)
      .bind(s.id, billId, s.memberId, s.amountCents))
  ]

  await db.batch(statements)
  return {
    id: billId,
    homeId,
    title,
    totalCents,
    shares
  }
}

export { 
    createBillService,
}
