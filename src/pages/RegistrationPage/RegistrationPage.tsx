import style from './RegistrationPage.module.scss'
import userInfo from '../../store/userInfo.ts'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ValidationSchemaType } from '../../types/ValidationSchemaType.ts'
import notesLogo from '../../../public/notes.svg'
import AuthApiStore from '../../store/authApi.ts'
import { useNavigate } from 'react-router-dom'
import cl from '../../index.module.scss'

const RegistrationPage: FC = observer(() => {
    const navigate = useNavigate()
    const schema = z
        .object({
            email: z
                .string()
                .min(1, { message: 'Email must not be empty' })
                .email('Email is incorrect'),
            password: z
                .string()
                .min(6, { message: 'Password must be more than 6 characters' })
                .max(20, {
                    message: 'Password must be less than 20 characters',
                }),
            confirmPassword: z.string(),
            username: z
                .string()
                .min(5, { message: 'Username must be more than 5 characters' })
                .max(20, {
                    message: 'Username must be less than 20 characters',
                }),
        })
        .refine(
            (value: ValidationSchemaType): boolean => {
                return value.password === value.confirmPassword
            },
            {
                message: 'Passwords must match!',
                path: ['confirmPassword'],
            },
        )

    function registerAccount(
        email: string,
        password: string,
        username: string,
    ) {
        AuthApiStore.signUpToAccount(email, password, username)
        userInfo.addUserInfo(email, username)
        navigate('/login')
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ValidationSchemaType>({
        resolver: zodResolver(schema),
    })

    return (
        <main className={style.main}>
            <div className={style.wrapper}>
                <div className={style.logo_container}>
                    <img
                        className={style.logo}
                        src={notesLogo}
                        alt="notesLogo"
                    />
                </div>
                <form
                    className={style.form}
                    onSubmit={handleSubmit((data: ValidationSchemaType) => {
                        registerAccount(
                            data.email,
                            data.password,
                            data.username,
                        )
                    })}
                >
                    {errors.username && (
                        <span className={style.error}>
                            {errors.username.message}
                        </span>
                    )}
                    <input
                        {...register('username')}
                        className={cl.input}
                        placeholder="Enter your username"
                    />
                    {errors.email && (
                        <span className={style.error}>
                            {errors.email.message}
                        </span>
                    )}
                    <input
                        defaultValue={userInfo.email}
                        {...register('email')}
                        className={cl.input}
                        placeholder="Enter your email"
                    />
                    {errors.password && (
                        <span className={style.error}>
                            {errors.password.message}
                        </span>
                    )}
                    <input
                        {...register('password')}
                        className={cl.input}
                        placeholder="Enter your password"
                    />
                    {errors.confirmPassword && (
                        <span className={style.error}>
                            {errors.confirmPassword.message}
                        </span>
                    )}
                    <input
                        placeholder="Repeat your password"
                        className={cl.input}
                        {...register('confirmPassword')}
                    />
                    <button className={cl.btn}>Registration</button>
                </form>
            </div>
        </main>
    )
})

export default RegistrationPage
