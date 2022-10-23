import { Hono } from 'hono'
import { Bindings } from 'hono/dist/hono'
import { NotFoundError, OkResponse } from './responses'
import { Env } from './env'
import { getFilms } from './notion'
const app = new Hono<{Bindings: Env}>()

app.get('/ping', (c) => (new OkResponse({pong: 'pong'})).asJsonResponse(c))
app.get('/films', getFilms)
app.all('*', (c) => (new NotFoundError().asJsonResponse(c)))
export default app