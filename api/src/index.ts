import { Hono } from 'hono'
import homeRoutes from './routes/home.routes.js'


const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))
app.route('/api/homes', homeRoutes)


export default app
