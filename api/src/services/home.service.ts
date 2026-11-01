import type { HomeDetails } from '../types/home.type'

async function getHomeService(db: D1Database, homeId: string): Promise<HomeDetails | null> {
  const home = await db
    .prepare('SELECT id, name FROM homes WHERE id = ?')
    .bind(homeId)
    .first<{ id: string; name: string }>()

  if (!home) {
    return null
  }

  const members = await db
    .prepare(
      'SELECT id, home_id AS homeId, name FROM members WHERE home_id = ? ORDER BY member_order ASC',
    )
    .bind(homeId)
    .all<{ id: string; homeId: string; name: string }>()

  const bills = await db
    .prepare(
      'SELECT id, home_id AS homeId, title, total_cents AS totalCents FROM bills WHERE home_id = ?',
    )
    .bind(homeId)
    .all<{ id: string; homeId: string; title: string; totalCents: number }>()

  const billsWithShares = await Promise.all(
    bills.results.map(async (bill) => {
      const shares = await db
        .prepare(
          'SELECT id, member_id AS memberId, amount_cents AS amountCents, paid_at AS paidAt FROM shares WHERE bill_id = ?',
        )
        .bind(bill.id)
        .all<{ id: string; memberId: string; amountCents: number; paidAt: string | null }>()

      return {
        ...bill,
        shares: shares.results,
      }
    }),
  )

  return {
    id: home.id,
    name: home.name,
    members: members.results,
    bills: billsWithShares,
  }
}

async function createHomeService(db: D1Database, name: string) {
  const id = crypto.randomUUID()

  await db.prepare('INSERT INTO homes (id, name) VALUES (?, ?)').bind(id, name).run()

  return { id, name }
}

async function addMemberService(db: D1Database, homeId: string, name: string) {
  const home = await db
    .prepare('SELECT id FROM homes WHERE id = ?')
    .bind(homeId)
    .first<{ id: string }>()

  if (!home) {
    return null
  }

  const id = crypto.randomUUID()
  try {
    await db
      .prepare('INSERT INTO members (id, home_id, name) VALUES (?, ?, ?)')
      .bind(id, homeId, name)
      .run()

    return { id, homeId, name }
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Member already exists in this home')
    }
    throw error
  }
}

export { addMemberService, createHomeService, getHomeService }
