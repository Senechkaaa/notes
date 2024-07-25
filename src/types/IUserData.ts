interface IBoardsInfoItems {
    title: string
    id: string
}

export interface IBoardsInfo {
    title: string
    id: string
    items: IBoardsInfoItems[]
}

export interface IUserData {
    email: string
    uid: string
    username: string
    photoURL: string
    lastname?: string
    description?: string
    age?: number
    phone?: string
    boards: IBoardsInfo[] | null
}
