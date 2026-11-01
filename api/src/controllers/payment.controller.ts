import type { Context } from 'hono'
import { getBalancesService, payShareService } from '../services/payment.service.js'

async function payShare(c: Context<{ Bindings: Env }>) {
  const billId = c.req.param('billId')
  const shareId = c.req.param('shareId')
  const idempotencyKey = c.req.header('Idempotency-Key')

  if (!idempotencyKey?.trim()) {
    return c.json({ error: 'Idempotency-Key header is required' }, 400)
  }
  if (!billId?.trim()) {
    return c.json({ error: 'Bill ID is required' }, 400)
  }
  if (!shareId?.trim()) {
    return c.json({ error: 'Share ID is required' }, 400)
  }

  const result = await payShareService(c.env.DB, billId, shareId, idempotencyKey)

  if (result.status === 404) {
    return c.json({ error: 'Bill or share not found' }, 404)
  }

  if (result.status === 409) {
    return c.json({ error: 'Share has already been paid' }, 409)
  }

  return c.json(result.share, 200)
}

async function getBalances(c: Context<{ Bindings: Env }>) {
  const homeId = c.req.param('homeId')
  if (!homeId?.trim()) {
    return c.json({ error: 'Home ID is required' }, 400)
  }
  const result = await getBalancesService(c.env.DB, homeId)

  if (!result) {
    return c.json({ error: 'Home not found' }, 404)
  }

  return c.json({ balances: result }, 200)
}

export { getBalances, payShare }
