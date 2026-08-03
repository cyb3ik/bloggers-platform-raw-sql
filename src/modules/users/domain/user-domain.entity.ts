import { add } from "date-fns/add"
import { RawUserData } from "./dto/user.raw-dto"

export class EmailConfirmationInfo {
    confirmationCode?: string
    expirationDate?: Date
    isConfirmed: boolean
}

export class PasswordRecoveryInfo {
    recoveryCode: string
    expirationDate: Date
}

export class User {
    public id: string
    private login: string
    private passwordSalt: string
    private passwordHash: string
    private email: string
    private emailConfirmation: EmailConfirmationInfo
    private passwordRecovery: PasswordRecoveryInfo | null = null
    private createdAt: Date
    private deletedAt: Date | null = null

    constructor(dto: RawUserData) {
        this.id = dto.id
        this.email = dto.email
        this.passwordSalt = dto.passwordSalt
        this.passwordHash = dto.passwordHash
        this.login = dto.login
        this.emailConfirmation = {
            confirmationCode: dto.emailConfirmationCode,
            expirationDate: dto.confirmationExpiresAt,
            isConfirmed: dto.isConfirmed
        }
        if (!dto.passwordRecoveryCode && !dto.recoveryExpiresAt) {
            this.passwordRecovery = null
        } else {
            this.passwordRecovery = {
                recoveryCode: dto.passwordRecoveryCode,
                expirationDate: dto.recoveryExpiresAt
            }
        }

        this.createdAt = dto.createdAt
    }

    getPersistenceData() {
        return {
            login: this.login,
            passwordSalt: this.passwordSalt,
            passwordHash: this.passwordHash,
            email: this.email,
            emailConfirmation: this.emailConfirmation,
            passwordRecovery: this.passwordRecovery,
            createdAt: this.createdAt,
            deletedAt: this.deletedAt
        }
    }

    softDeleteSelf() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted')
        }
        this.deletedAt = new Date()
    }

    updatePassword(newPasswordInfo: { passwordHash: string, passwordSalt: string }) {
        if (!this.passwordRecovery) {
            throw new Error("Password already recovered")
        }

        this.passwordHash = newPasswordInfo.passwordHash
        this.passwordSalt = newPasswordInfo.passwordSalt

        this.forbidPasswordRecovery()
    }

    forbidPasswordRecovery() {
        this.passwordRecovery = null
    }

    setPasswordRecoveryCode(code: string) {
        this.passwordRecovery = {
            recoveryCode: code,
            expirationDate: add(new Date(), {
                hours: 2
            })
        }
    }

    setEmailConfirmationCode(code: string) {
        this.emailConfirmation.confirmationCode = code
        this.emailConfirmation.expirationDate = add(new Date(), {
            hours: 2
        })
    }

    setEmailConfirmationStatus(flag: boolean) {
        this.emailConfirmation.isConfirmed = flag
    }
}