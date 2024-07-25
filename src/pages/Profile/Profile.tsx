import UploadAvatar from '../../components/UploadAvatar/UploadAvatar.tsx'
import style from './Profile.module.scss'
import { observer } from 'mobx-react-lite'
import { useGetDataInfo } from '../../hooks/getDataInfo.ts'
import { useEffect, useState } from 'react'
import { doc, updateDoc } from '@firebase/firestore'
import { db, imageDb } from '../../providers/firebase.ts'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import Container from '../../components/Container/Container.tsx'

const Profile = observer(() => {
    const token: string = localStorage.getItem('token')!
    const [image, setImage] = useState<File | null>(null)
    const [url, setURL] = useState<string>('')
    const userDocRef = doc(db, 'users', token)
    const navigate = useNavigate()

    const [getData, loading] = useGetDataInfo({ url })
    console.log('иум')
    useEffect(() => {
        if (image) {
            uploadImg()
        }
    }, [image])

    const uploadImg = () => {
        const imgRef = ref(imageDb, `avatars/${token}`)
        uploadBytes(imgRef, image!).then(() => {
            getDownloadURL(imgRef).then((url: string) => {
                updateDoc(userDocRef, { photoURL: url })
                setURL(url)
            })
        })
    }

    return (
        <Container>
            <div className={style.container_1}>
                <UploadAvatar
                    setImage={setImage}
                    loading={loading}
                    getData={getData}
                />
                <div className={style.container__text}>
                    <h2 className={style.username}>
                        {getData?.username} {getData?.lastname}
                    </h2>
                    <h3 className={style.email}>{getData?.email}</h3>
                    <h5 className={style.age}>Age: {getData?.age}</h5>
                </div>
                <button className={style.btn} onClick={() => navigate('/edit')}>
                    Edit profile
                </button>
            </div>
            <div className={style.container_2}>
                <div className={style.container_description}>
                    <h4 className={style.description_title}>Description:</h4>
                    <p className={style.description}>{getData?.description}</p>
                </div>
                <div className={style.container_phone}>
                    <h4 className={style.phone_title}>Phone:</h4>
                    <p className={style.phone}>{getData?.phone}</p>
                </div>
            </div>
        </Container>
    )
})

export default Profile
