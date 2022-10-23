import { Context } from "hono"
import { HonoContext } from "hono/dist/context"
import { OkResponse, FilmDontExists } from "./responses"
import { DatabaseQueryResponse, Film } from "./structs"

export class NotionApiClient {
    secretToken: string = ""
    baseUri = "https://api.notion.com/v1"
    version = "2022-02-22"

    constructor(notionToken: string) {
        this.secretToken = notionToken
    }

    async fetchDatabase(databaseId: string): Promise<DatabaseQueryResponse> {
        let data: DatabaseQueryResponse = await this.makeRequest<DatabaseQueryResponse>(`/databases/${databaseId}/query`, "POST", undefined, new DatabaseQueryResponse())
        return data
    }

    private async makeRequest<T>(url: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET", body: Object | undefined, responseObject: T): Promise<T> {
        console.log(url)
        let resp = await fetch(this.baseUri + url, {
            method,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers: {
                "Authorization": `Bearer ${this.secretToken}`,
                "Notion-Version": this.version
            }
        })
        return await resp.json() as T
    }
}

async function getAllFilms(databaseId: string, token: string): Promise<Film[]> {
    let client = new NotionApiClient(token)
    let data = await client.fetchDatabase(databaseId)
    return DatabaseQueryResponse.toFilms(data)
}

export async function getFilms(c: Context | HonoContext): Promise<Response> {
    return (new OkResponse({ films: getAllFilms(c.env.NOTION_DATABASE_ID, c.env.NOTION_TOKEN) })).asJsonResponse(c)
}

export async function getFilm(c: Context | HonoContext) {
    let uniqueName = c.req.param("id")
    let films = await getAllFilms(c.env.NOTION_DATABASE_ID, c.env.NOTION_TOKEN)
    let selectedFilms = films.filter((f) => f.id === uniqueName)
    if (selectedFilms.length === 0) {
        return (new FilmDontExists()).asJsonResponse(c)
    }
    return (new OkResponse(selectedFilms[0])).asJsonResponse(c)
}