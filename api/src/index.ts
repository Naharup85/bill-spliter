import { Hono } from 'hono'
import billRoutes from './routes/bill.routes'
import homeRoutes from './routes/home.routes.js'
import paymentRoutes from './routes/payment.routes'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))
app.route('/api/homes', homeRoutes)
app.route('/api', billRoutes)
app.route('/api', paymentRoutes)

export default app
