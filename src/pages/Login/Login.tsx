import style from './Login.module.scss'
import { ChangeEvent, useState, MouseEvent, FC } from 'react'
import { useNavigate } from 'react-router-dom'
import userInfo from '../../store/userInfo.ts'
import cl from '../../index.module.scss'
import AuthApiStore from '../../store/authApi.ts'
import { observer } from 'mobx-react-lite'

const Login: FC = observer(() => {
    const [email, setEmail] = useState<string>(userInfo.email)
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    async function logIn(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try {
            await AuthApiStore.signInToAccount(email, password)
            if (AuthApiStore.status === 'success') {
                navigate('/notes')
            } else {
                setError('Error logging in. Please check your credentials.')
            }
        } catch (e) {
            console.error('Firebase Authentication Error:', e)
            setError('An unexpected error occurred. Please try again later.')
        }
    }

    return (
        <main className={style.main}>
            <div className={style.wrapper}>
                <form className={style.form}>
                    <input
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                        className={cl.input}
                    />
                    <input
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        className={cl.input}
                    />
                    {error && <span>{error}</span>}
                    <button className={cl.btn} onClick={logIn}>
                        Login
                    </button>
                </form>
            </div>
        </main>
    )
})

export default Login
