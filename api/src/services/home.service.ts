async function createHomeService(db: D1Database, name: string) {

  const home = await db.prepare('SELECT * FROM homes WHERE name = ?')
    .bind(name)
    .first()

  if (home) {
    return null
  }
  const id = crypto.randomUUID()

  await db.prepare('INSERT INTO homes (id, name) VALUES (?, ?)')
    .bind(id, name)
    .run()

  return { id, name }
}

async function addMemberService(db: D1Database, homeId: string, name: string) {
  const home = await db.prepare('SELECT id FROM homes WHERE id = ?')
    .bind(homeId)
    .first<{ id: string }>()

  if (!home) {
    return null
  }

  const id = crypto.randomUUID()
  try {
    await db.prepare(
      'INSERT INTO members (id, home_id, name) VALUES (?, ?, ?)',
    )
      .bind(id, homeId, name)
      .run()
  
    return { id, homeId, name }
  } catch (error) {
    if(error instanceof Error && error.message.includes("UNIQUE constraint failed")){
      throw new Error("Member already exists in this home")
    }
    throw error
  }
}

export {
    createHomeService,
    addMemberService
}