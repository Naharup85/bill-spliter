import { Hono } from 'hono'
import homeRoutes from './routes/home.routes.js'
import billRoutes from './routes/bill.routes'


const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))
app.route('/api/homes', homeRoutes)
app.route('/api', billRoutes)

export default app
