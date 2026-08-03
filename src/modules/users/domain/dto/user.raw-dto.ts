export class RawUserData {
    id: string
    login: string
    passwordSalt: string
    passwordHash: string
    email: string

    emailConfirmationCode?: string
    confirmationExpiresAt?: Date
    isConfirmed: boolean

    passwordRecoveryCode?: string
    recoveryExpiresAt?: Date

    createdAt: Date

    static createFromDocument(document: any) {
        const data = new this()

        data.id = document._id.toString()
        data.email = document.email
        data.passwordSalt = document.passwordSalt
        data.passwordHash = document.passwordHash
        data.login = document.login

        data.emailConfirmationCode = document.emailConfirmation.confirmationCode
        data.confirmationExpiresAt = document.emailConfirmation.expirationDate
        data.isConfirmed = document.emailConfirmation.isConfirmed

        if (document.passwordRecovery) {
            data.passwordRecoveryCode = document.passwordRecovery.recoveryCode
            data.recoveryExpiresAt = document.passwordRecovery.expirationDate
        }

        data.createdAt = document.createdAt

        return data
    }
}