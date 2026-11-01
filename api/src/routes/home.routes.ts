import { Hono } from 'hono'
import { addMember, createHome } from '../controllers/home.controller.js'

const homeRoutes = new Hono<{ Bindings: Env }>()

homeRoutes.post('/', createHome)
homeRoutes.post('/:homeId/members', addMember)

export default homeRoutes
