import type { Context } from 'hono'
import { createHomeService, addMemberService } from '../services/home.service.js'

async function createHome(c: Context<{ Bindings: Env }>) {
  let body: unknown

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('name' in body) ||
    typeof body.name !== 'string' ||
    body.name.trim().length === 0
  ) {
    return c.json({ error: 'Valid home name is required' }, 400)
  }

  try {
    const home = await createHomeService(c.env.DB, body.name.trim())
    if(!home){
      return c.json({ error: 'Home already exists' }, 409)
    }
    return c.json(home, 201)
  } catch {
    return c.json({ error: 'Failed to create home' }, 500)
  }
}

async function addMember(c: Context<{ Bindings: Env }>) {
  let body: unknown

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('name' in body) ||
    typeof body.name !== 'string' ||
    body.name.trim().length === 0
  ) {
    return c.json({ error: 'Valid member name is required' }, 400)
  }

  const homeId = c.req.param('homeId')
  if (!homeId) {
    return c.json({ error: 'homeId is required' }, 400)
  }

  try {
    const member = await addMemberService(
      c.env.DB,
      homeId,
      body.name.trim(),
    )

    if (!member) {
      return c.json({ error: 'Home not found' }, 404)
    }

    return c.json(member, 201)
  } catch {
    return c.json({ error: 'Failed to add member' }, 500)
  }
}

export{
    createHome,
    addMember
}