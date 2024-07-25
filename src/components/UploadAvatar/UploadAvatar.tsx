import { ChangeEvent, FC } from 'react'
import style from './UploadAvatar.module.scss'

interface userData {
    email: string
    uid: string
    username: string
    photoURL: string
}

interface UploadAvatar {
    loading: boolean
    getData: userData | null
    setImage: (image: File | null) => void
}

const UploadAvatar: FC<UploadAvatar> = ({ setImage, loading, getData }) => {
    return (
        <div className={style.loader_img}>
            {loading ? (
                <div>Loading</div>
            ) : (
                <div className={style.avatar_container}>
                    <label
                        htmlFor="fileInput"
                        className={style.label_avatar}
                        style={{ width: '100%' }}
                    >
                        <img
                            className={style.avatar}
                            src={getData?.photoURL}
                            alt="avatar"
                        />
                    </label>
                </div>
            )}
            <input
                id="fileInput"
                accept=""
                className={style.input_file}
                type="file"
                multiple
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setImage(e.target.files?.[0] || null)
                }
            />
        </div>
    )
}

export default UploadAvatar
