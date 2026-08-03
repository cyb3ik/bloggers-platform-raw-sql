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
}