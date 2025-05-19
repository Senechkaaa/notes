import { initializeApp } from 'firebase/app'
import { getFirestore } from '@firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

interface IFirebaseConfig {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
}

const firebaseConfig: IFirebaseConfig = {
    apiKey: 'AIzaSyDoJOhRLkf7alwXGSz-WqlHvTUJ4-dcf98',
    authDomain: 'notes-d9aa8.firebaseapp.com',
    projectId: 'notes-d9aa8',
    storageBucket: 'notes-d9aa8.appspot.com',
    messagingSenderId: '900743366693',
    appId: '1:900743366693:web:5afb062ca840dc3c6f57cc',
}
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const imageDb = getStorage(app)
