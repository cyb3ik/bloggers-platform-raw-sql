export class RawPostData {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date

    static createFromSqlRow(row: any) {
        const data = new this()

        data.id = row.id
        data.title = row.title
        data.shortDescription = row.short_description
        data.content = row.content
        data.blogId = row.blog_id
        data.blogName = row.blog_name
        data.createdAt = row.created_at

        return data
    }
}