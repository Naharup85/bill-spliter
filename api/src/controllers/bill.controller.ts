import type { Context } from 'hono'
import { createBillService } from '../services/bill.service'

async function createBill(c: Context<{ Bindings: Env }>) {
  const homeId = c.req.param('homeId')

  let body: unknown

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('title' in body) ||
    typeof body.title !== 'string' ||
    !body.title.trim() ||
    !('totalCents' in body) ||
    typeof body.totalCents !== 'number' ||
    !Number.isSafeInteger(body.totalCents) ||
    body.totalCents <= 0
  ) {
    return c.json({ error: 'Invalid bill details' }, 422)
  }
  if (!homeId) {
    return c.json({ error: 'Home ID is required' }, 400)
  }

  const result = await createBillService(c.env.DB, homeId, body.title.trim(), body.totalCents)

  if ('error' in result) {
    if (result.error === 'HOME_NOT_FOUND') {
      return c.json({ error: 'Home not found' }, 404)
    }

    if (result.error === 'NO_MEMBERS') {
      return c.json({ error: 'Home has no members' }, 422)
    }
  }

  return c.json(result, 201)
}

export { createBill }
