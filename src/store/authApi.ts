import { makeAutoObservable, runInAction } from 'mobx'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'

import { db, auth } from '../providers/firebase.ts'
import { doc, setDoc } from 'firebase/firestore'
import { IUser } from '../types/IUser.ts'

class AuthApiStore {
    constructor() {
        makeAutoObservable(this)
    }

    status?: string
    user?: IUser

    signUpToAccount = async (
        email: string,
        password: string,
        username: string,
    ) => {
        try {
            const imageUserDefault: string =
                'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg'
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            )
            console.log(user)
            localStorage.setItem('token', user.uid)
            await setDoc(doc(db, 'users', localStorage.getItem('token')!), {
                password,
                email,
                photoURL: imageUserDefault,
                uid: user.uid,
                username,
            })
            runInAction(() => {
                this.user = user
                this.status = 'success'
            })
        } catch (e) {
            this.status = 'error'
            throw new Error(`Error: ${e}`)
        }
    }

    signInToAccount = async (email: string, password: string) => {
        try {
            this.status = 'pending'
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            )
            localStorage.setItem('token', user.uid)
            runInAction(() => {
                this.user = user
                this.status = 'success'
            })
        } catch (e) {
            console.error('Firebase Authentication Error:', e)
            throw new Error(`Error: ${e}`)
        }
    }
}

export default new AuthApiStore()
