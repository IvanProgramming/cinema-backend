# Backend of Citinez Cinema

Simple API, that reads table from notion and returns value

## Created with

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Hono](https://honojs.dev)
- [Notion](https://notion.so/)

### Deployment

1. Create new Database in Notion from this [template](https://ivanprogramming.notion.site/bd7e7b088edb4daa9887c759107bd131?v=f1f02e21f3a144508fd01d8019caa2a2)
2. Create new Notion integration
3. Copy ID of database
4. Put token and DatabaseID to secrets
    ```bash
    echo "<DATABASE_ID>" | wrangler secret put NOTION_DATABASE_ID
    echo "<INTEGRATION_TOKEN>" | wrangler secret put NOTION_TOKEN
    ```
5. Add integration into notion page
6. Deploy with `wrangler publish`

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ivanprograming/cinema-backend)

### Working with API

Film structure by example
```json
{
  "id": "street",
  "title": "Волк с Уолл-Стрит",
  "mpd": "https://records.ivanisplaying.xyz/street/dash/manifest.mpd",
  "tags": [
    {
      "icon": "#️⃣",
      "text": "просмотр-фильма"
    },
    {
      "icon": "#️⃣",
      "text": "citinez"
    },
    {
      "icon": "🗓️",
      "text": "2022-10-10"
    }
  ],
  "thumbnail": "https://records.ivanisplaying.xyz/preview/cr-075743i4-prv.jpg"
}
```

#### /films
Returns list with all films 
```json
{
  "isError": false,
  "data": {
    "films": [
      {
        "id": "street",
        "title": "Волк с Уолл-Стрит",
        "mpd": "https://records.ivanisplaying.xyz/street/dash/manifest.mpd",
        "tags": [
          {
            "icon": "#️⃣",
            "text": "просмотр-фильма"
          },
          {
            "icon": "#️⃣",
            "text": "citinez"
          },
          {
            "icon": "🗓️",
            "text": "2022-10-10"
          }
        ],
        "thumbnail": "https://records.ivanisplaying.xyz/preview/cr-075743i4-prv.jpg"
      }
    ]
  }
}
```

#### /film/:id
Return film with specified ID
```json
{
  "isError": false,
  "data": {
    "id": "street",
    "title": "Волк с Уолл-Стрит",
    "mpd": "https://records.ivanisplaying.xyz/street/dash/manifest.mpd",
    "tags": [
      {
        "icon": "#️⃣",
        "text": "просмотр-фильма"
      },
      {
        "icon": "#️⃣",
        "text": "citinez"
      },
      {
        "icon": "🗓️",
        "text": "2022-10-10"
      }
    ],
    "thumbnail": "https://records.ivanisplaying.xyz/preview/cr-075743i4-prv.jpg"
  }
}
```
May return 404 on unkown ID
```json
{
  "isError": true,
  "data": {
    "errorCode": 2,
    "errorDetails": "Film with specified ID don't exists"
  }
}
```
