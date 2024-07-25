import { makeAutoObservable } from 'mobx'

class UserInfo {
    email: string = ''
    username: string | null = ''

    constructor() {
        makeAutoObservable(this)
    }

    addUserInfo(email: string, username: string | null) {
        this.email = email
        this.username = username
    }
}

export default new UserInfo()
