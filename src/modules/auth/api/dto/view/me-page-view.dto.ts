import { User } from "../../../../users/domain/user-domain.entity"

export class MePageView {
    email: string
    login: string
    userId: string

    constructor(user: User) {
        const userData = user.getPersistenceData()
        this.userId = user.id
        this.login = userData.login
        this.email = userData.email
    }
}