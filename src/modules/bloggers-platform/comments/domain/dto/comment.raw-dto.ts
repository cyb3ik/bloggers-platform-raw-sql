export class RawCommentData {
    id: string
    content: string
    userId: string
    userLogin: string
    postId: string
    createdAt: Date

    static createFromDocument(document: any) {
        const data = new this()

        data.id = document._id.toString()
        data.content = document.content
        data.userId = document.commentatorInfo.userId
        data.userLogin = document.commentatorInfo.userLogin
        data.postId = document.postId
        data.createdAt = document.createdAt

        return data
    }
}