import style from './Edit.module.scss'
import Container from '../../components/Container/Container.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import logoNotes from '../../../public/notes.svg'
import { UserInfoSchemaType } from '../../types/UserInfoSchemaType.ts'
import userInfo from '../../store/userInfo.ts'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../providers/firebase.ts'
import { useNavigate } from 'react-router-dom'

const Edit = () => {
    const schema = z.object({
        lastname: z
            .string()
            .min(5, { message: 'Lastname must be more than 5 characters' })
            .max(20, {
                message: 'Lastname must be less than 20 characters',
            }),
        username: z
            .string()
            .min(5, { message: 'Username must be more than 5 characters' })
            .max(20, {
                message: 'Username must be less than 20 characters',
            }),
        age: z.number().max(100, { message: 'Maximum age 100' }),
        description: z.string(),
        phone: z
            .string()
            .min(3, { message: 'The number must be more than 3 characters' })
            .max(12, { message: 'The number must be less than 12 characters' }),
    })
    const { username } = userInfo
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const docRef = doc(db, 'users', token!)

    const updateData = async (data: UserInfoSchemaType) => {
        try {
            await updateDoc(docRef, {
                username: data.username,
                lastname: data.lastname,
                description: data.description,
                age: data.age,
                phone: data.phone,
            })
            navigate('/notes/profile')
        } catch (error) {
            console.error(error)
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserInfoSchemaType>({
        resolver: zodResolver(schema),
    })

    return (
        <Container>
            <div className={style.wrapper}>
                <div className={style.container__logo}>
                    <img
                        className={style.logo}
                        src={logoNotes}
                        alt="logoNotes"
                    />
                    <h4 className={style.text}>Notes edit</h4>
                </div>

                <form
                    className={style.form}
                    onSubmit={handleSubmit((data: UserInfoSchemaType) => {
                        updateData(data)
                    })}
                >
                    <div className={`${style.container} ${style.left}`}>
                        <input
                            defaultValue={username!}
                            autoComplete="off"
                            className={`${style.input}`}
                            {...register('username')}
                            placeholder="Change name"
                        />
                        {errors.username && (
                            <span>{errors.username.message}</span>
                        )}

                        <input
                            autoComplete="off"
                            className={`${style.input}`}
                            {...register('lastname')}
                            placeholder="Change lastname"
                        />
                        {errors.lastname && (
                            <span>{errors.lastname.message}</span>
                        )}
                        <textarea
                            {...register('description')}
                            placeholder="Add description"
                            maxLength={160}
                            className={style.textarea}
                        ></textarea>
                        {errors.description && (
                            <span>{errors.description.message}</span>
                        )}
                    </div>

                    <div className={style.container}>
                        <input
                            {...register('age', { valueAsNumber: true })}
                            type="number"
                            defaultValue={18}
                            autoComplete="off"
                            className={`${style.input}`}
                            placeholder="Add age"
                        />
                        {errors.age && <span>{errors.age.message}</span>}

                        <input
                            type="number"
                            autoComplete="off"
                            className={`${style.input}`}
                            {...register('phone')}
                            placeholder="Add phone"
                        />
                        {errors.phone && <span>{errors.phone.message}</span>}
                        <button className={style.btn}>Edit</button>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export default Edit
