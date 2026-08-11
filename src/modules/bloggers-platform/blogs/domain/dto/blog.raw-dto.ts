export class RawBlogData {
    id: string
    name: string
    description: string
    websiteUrl: string
    isMembership: boolean
    createdAt: Date

    static createFromDocument(document: any) {
        const data = new this()

        data.id = document._id.toString()
        data.name = document.name
        data.description = document.description
        data.websiteUrl = document.websiteUrl
        data.isMembership = document.isMembership
        data.createdAt = document.createdAt

        return data
    }

    static createFromSqlRow(row: any) {
        const data = new this()

        data.id = row.id
        data.name = row.name
        data.description = row.description
        data.websiteUrl = row.website_url
        data.isMembership = row.is_membership
        data.createdAt = row.created_at

        return data
    }
}