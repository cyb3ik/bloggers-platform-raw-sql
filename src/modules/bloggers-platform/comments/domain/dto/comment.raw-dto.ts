export class RawCommentData {
    id: string
    content: string
    userId: string
    userLogin: string
    postId: string
    createdAt: Date

    static createFromSqlRow(row: any) {
        const data = new this()

        data.id = row.id
        data.content = row.content
        data.userId = row.commentator_id
        data.userLogin = row.user_login
        data.postId = row.post_id
        data.createdAt = row.created_at

        return data
    }
}