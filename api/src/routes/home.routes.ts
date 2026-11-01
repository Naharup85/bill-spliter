import { Hono } from 'hono'
import { addMember, createHome, getHome } from '../controllers/home.controller.js'

const homeRoutes = new Hono<{ Bindings: Env }>()

homeRoutes.post('/', createHome)
homeRoutes.get('/:homeId', getHome)
homeRoutes.post('/:homeId/members', addMember)

export default homeRoutes
