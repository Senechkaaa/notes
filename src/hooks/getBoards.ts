import { useState, useEffect } from 'react'
import { doc } from '@firebase/firestore'
import { db } from '../providers/firebase.ts'
import { DocumentSnapshot, getDoc } from 'firebase/firestore'
import { IBoardsInfo, IUserData } from '../types/IUserData.ts'

interface IGetBoardsProps {
    boards: IBoardsInfo[]
}

export const useGetBoards = ({
    boards,
}: IGetBoardsProps): [IUserData, boolean] => {
    const [userBoards, setUserBoards] = useState<IUserData | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            const token: string | null = localStorage.getItem('token')!
            const docRef = doc(db, 'users', token)
            const docSnap: DocumentSnapshot = await getDoc(docRef)
            try {
                if (docSnap.exists()) {
                    setLoading(true)
                    const userBoards = docSnap.data() as IUserData
                    setUserBoards(userBoards)
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
    }, [boards])

    return [userBoards, loading]
}
