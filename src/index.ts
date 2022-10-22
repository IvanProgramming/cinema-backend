import { Hono } from 'hono'
import { NotFoundError, OkResponse } from './responses'
const app = new Hono()

app.get('/ping', (c) => (new OkResponse({pong: 'pong'})).asJsonResponse(c))
app.all('*', (c) => (new NotFoundError().asJsonResponse(c)))
export default app