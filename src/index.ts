import { Hono } from 'hono'
import { Bindings } from 'hono/dist/hono'
import { NotFoundError, OkResponse } from './responses'
import { Env } from './env'
import { getFilms, getFilm, NotionApiClient } from './notion'
const app = new Hono<{Bindings: Env}>()

app.get('/ping', (c) => (new OkResponse({pong: 'pong'})).asJsonResponse(c))
app.get('/films', getFilms)
app.get('/film/:id', getFilm)
app.all('*', (c) => (new NotFoundError().asJsonResponse(c)))
export default {
    fetcher: app.fetch,
    scheduled: async (event: ScheduledEvent, env: Env) => {
        let client = new NotionApiClient(env.NOTION_TOKEN)
        let data = await client.fetchDatabase(env.NOTION_DATABASE_ID)
        await env.KV.put("filmsDb", JSON.stringify(data))
    }
}