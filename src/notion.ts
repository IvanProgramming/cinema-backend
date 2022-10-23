import { Context } from "hono"
import { HonoContext } from "hono/dist/context"
import { OkResponse } from "./responses"
import {DatabaseQueryResponse} from "./structs"

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

export async function getFilms(c: Context | HonoContext): Promise<Response> {
    let databaseId = c.env.NOTION_DATABASE_ID
    let client = new NotionApiClient(c.env.NOTION_TOKEN)
    let data = await client.fetchDatabase(databaseId)
    return (new OkResponse({films: DatabaseQueryResponse.toFilms(data)})).asJsonResponse(c)
}