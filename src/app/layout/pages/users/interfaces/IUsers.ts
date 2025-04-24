export interface Role {
    id: number
    rol: string
}

export interface User {
    id: number
    name: string
    document: string
    phone: string
    username: string
    password: string
    email?: string
    status: boolean
    Rol: Role
    role?: number
}