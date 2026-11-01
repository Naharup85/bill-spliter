import { Hono } from 'hono'
import { getBalances, payShare } from '../controllers/payment.controller.js'

const paymentRoutes = new Hono()

paymentRoutes.post('/bills/:billId/shares/:shareId/pay', payShare)
paymentRoutes.get('/homes/:homeId/balances', getBalances)

export default paymentRoutes
