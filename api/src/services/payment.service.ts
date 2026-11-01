import type { PaymentResult } from '../types/payment.type'

async function payShareService(
  db: D1Database,
  billId: string,
  shareId: string,
  idempotencyKey: string,
): Promise<PaymentResult> {
  // 1. Check whether the bill exists.
  const bill = await db
    .prepare('SELECT id FROM bills WHERE id = ?')
    .bind(billId)
    .first<{ id: string }>()

  if (!bill) {
    return { status: 404 }
  }

  // 2. Find this share under the requested bill.
  const share = await db
    .prepare(`
      SELECT id, member_id, amount_cents, paid_at, idempotency_key
      FROM shares
      WHERE id = ? AND bill_id = ?
    `)
    .bind(shareId, billId)
    .first<{
      id: string
      member_id: string
      amount_cents: number
      paid_at: string | null
      idempotency_key: string | null
    }>()

  if (!share) {
    return { status: 404 }
  }

  // 3. If already paid, check whether this is a retry.
  if (share.paid_at) {
    if (share.idempotency_key === idempotencyKey) {
      return {
        status: 200,
        share: {
          id: share.id,
          memberId: share.member_id,
          amountCents: share.amount_cents,
          paidAt: share.paid_at,
        },
      }
    }

    return { status: 409 }
  }

  // 4. Mark the share as paid only if it is still unpaid.
  const update = await db
    .prepare(`
      UPDATE shares
      SET paid_at = CURRENT_TIMESTAMP,
          idempotency_key = ?
      WHERE id = ?
        AND bill_id = ?
        AND paid_at IS NULL
    `)
    .bind(idempotencyKey, shareId, billId)
    .run()

  // Another request may have paid it first.
  if (update.meta.changes === 0) {
    const updatedShare = await db
      .prepare(`
        SELECT id, member_id, amount_cents, paid_at, idempotency_key
        FROM shares
        WHERE id = ? AND bill_id = ?
      `)
      .bind(shareId, billId)
      .first<{
        id: string
        member_id: string
        amount_cents: number
        paid_at: string | null
        idempotency_key: string | null
      }>()

    if (updatedShare?.paid_at && updatedShare.idempotency_key === idempotencyKey) {
      return {
        status: 200,
        share: {
          id: updatedShare.id,
          memberId: updatedShare.member_id,
          amountCents: updatedShare.amount_cents,
          paidAt: updatedShare.paid_at,
        },
      }
    }

    return { status: 409 }
  }

  // 5. Read the saved payment and return it.
  const paidShare = await db
    .prepare(`
      SELECT id, member_id, amount_cents, paid_at
      FROM shares
      WHERE id = ? AND bill_id = ?
    `)
    .bind(shareId, billId)
    .first<{
      id: string
      member_id: string
      amount_cents: number
      paid_at: string
    }>()

  if (!paidShare) {
    return { status: 404 }
  }

  return {
    status: 200,
    share: {
      id: paidShare.id,
      memberId: paidShare.member_id,
      amountCents: paidShare.amount_cents,
      paidAt: paidShare.paid_at,
    },
  }
}

async function getBalancesService(db: D1Database, homeId: string) {
  // Check whether the home exists.
  const home = await db
    .prepare('SELECT id FROM homes WHERE id = ?')
    .bind(homeId)
    .first<{ id: string }>()

  if (!home) {
    return null
  }

  // Calculate each member's unpaid shares.
  const result = await db
    .prepare(`
      SELECT
        m.id AS memberId,
        m.name,
        COALESCE((
          SELECT SUM(s.amount_cents)
          FROM shares s
          JOIN bills b ON b.id = s.bill_id
          WHERE s.member_id = m.id
            AND b.home_id = m.home_id
            AND s.paid_at IS NULL
        ), 0) AS outstandingCents
      FROM members m
      WHERE m.home_id = ?
      ORDER BY m.member_order
    `)
    .bind(homeId)
    .all<{
      memberId: string
      name: string
      outstandingCents: number
    }>()

  return result.results
}

export { getBalancesService, payShareService }
