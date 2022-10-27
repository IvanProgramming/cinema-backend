import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { NotFoundError, OkResponse } from './responses'
import { Env } from './env'
import { getFilms, getFilm, NotionApiClient } from './notion'
const app = new Hono<{Bindings: Env}>()

app.use("*", cors({
    origin: ['http://localhost:3000', 'https://cinema.ivanisplaying.xyz'],
    allowMethods: ["GET", "OPTIONS"]
}))

app.get('/ping', (c) => (new OkResponse({pong: 'pong'})).asJsonResponse(c))
app.get('/films', getFilms)
app.get('/film/:id', getFilm)
app.all('*', (c) => (new NotFoundError().asJsonResponse(c)))
export default {
    fetch: app.fetch,
    scheduled: async (event: ScheduledEvent, env: Env) => {
        let client = new NotionApiClient(env.NOTION_TOKEN)
        let data = await client.fetchDatabase(env.NOTION_DATABASE_ID)
        await env.KV.put("filmsDb", JSON.stringify(data))
    }
}