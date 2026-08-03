export class RawPostData {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date

    static createFromDocument(document: any) {
        const data = new this()

        data.id = document._id.toString()
        data.title = document.title
        data.shortDescription = document.shortDescription
        data.content = document.content
        data.blogId = document.blogId
        data.blogName = document.blogName
        data.createdAt = document.createdAt

        return data
    }
}