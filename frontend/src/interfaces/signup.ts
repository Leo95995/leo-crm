export interface IUserData {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    role?: string
    contacts?: string[];
    opportunities?: string[]
    termsCondition?: boolean
}
