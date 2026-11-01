import { Hono } from 'hono'
import { createBill } from '../controllers/bill.controller'

const billRoutes = new Hono<{ Bindings: Env }>()

billRoutes.post('/homes/:homeId/bills', createBill)

export default billRoutes
