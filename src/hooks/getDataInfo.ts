import { useState, useEffect } from 'react'
import { doc } from '@firebase/firestore'
import { db } from '../providers/firebase.ts'
import { DocumentSnapshot, getDoc } from 'firebase/firestore'
import { IUserData } from '../types/IUserData.ts'

interface useGetDataInfoProps {
    url: string
}

export const useGetDataInfo = ({
    url,
}: useGetDataInfoProps): [IUserData | null, boolean] => {
    const [userAvatar, setUserAvatar] = useState<IUserData | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const fetchData = async () => {
            const token: string | null = localStorage.getItem('token')!
            const docRef = doc(db, 'users', token)
            const docSnap: DocumentSnapshot = await getDoc(docRef)
            try {
                if (docSnap.exists()) {
                    setLoading(true)
                    const userData = docSnap.data() as IUserData
                    setUserAvatar(userData)
                    setLoading(false)
                } else {
                    console.log('No such document!')
                    setLoading(false)
                }
            } catch (e) {
                throw new Error(`Error: ${e}`)
            }
        }

        fetchData()
    }, [url])

    return [userAvatar, loading]
}
