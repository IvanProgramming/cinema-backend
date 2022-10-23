export class DatabaseQueryResponse {
    results!: DatabaseRecord[]

    static toFilms(rec: DatabaseQueryResponse): Film[] {
        let films: Film[] = []
        for (let record of rec.results) {
            let id = RichText.richToPlain(record.properties["Unique name"].rich_text!)
            let title
            if (record.properties["Name"].title !== undefined) {
                title = RichText.richToPlain(record.properties["Name"].title!)
            } else {
                title = "Film"
            }
            let thumbnail = record.properties["Preview"].url!
            let mpd = record.properties["MPD-manifest"].url!
            let tags: Tag[] = []
            for (let tag of record.properties["Tags"].multi_select!) {
                tags.push({
                    icon: "#️⃣",
                    text: tag.name
                })
            }
            if (record.properties["View Date"].date?.start !== undefined) {
                tags.push({
                    icon: "🗓️",
                    text: record.properties["View Date"].date?.start!
                })
            }
            films.push({
                id,
                title,
                mpd,
                tags,
                thumbnail
            })
        }
        return films
    }
}


class DatabaseRecord {
    properties!: { [index:string] : Property }
    url!: string
}

interface Property {
    id: string
    type: string
    multi_select: PropertyTag[] | undefined
    url: string | undefined
    date: Date | undefined
    rich_text: RichText[] | undefined
    title: RichText[] | undefined
}

interface PropertyTag {
    id: string
    name: string
    color: string
}

interface Date {
    start: string | null
    end: string | null
    time_zone: string | null
}

class RichText {
    plain_text!: string

    static richToPlain(richText: RichText[]): string {
        let text = ""
        for (let textPiece of richText) {
            text += textPiece.plain_text
        }
        return text
    }
}

export class Film {
    id!: string
    title!: string
    mpd!: string
    thumbnail!: string
    tags: Tag[] = []
}

class Tag {
    icon!: string
    text!: string
}