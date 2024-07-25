import style from './HomePage.module.scss'
import { ChangeEvent, useState } from 'react'
import user from '../../store/userInfo.ts'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

const HomePage = observer(() => {
    const [email, setEmail] = useState<string>('')
    const navigate = useNavigate()

    const handleSwitchPage = () => {
        user.addUserInfo(email, null)
        navigate('/registration')
    }

    return (
        <main className={style.main}>
            <section className={style.text_block}>
                <p className={style.text}>
                    Blablablaa blaa blabla blaa blaa blablabla blablablabla blaa
                    blablabl blablablabla bla bla Blablabl bla Blablablaa!
                </p>
            </section>
            <section className={style.notes_registration}>
                <div className={style.wrapper}>
                    <div>
                        <div className={style.container_text}>
                            <h1 className={style.title}>
                                Notes brings all your tasks, teammates, and
                                tools together
                            </h1>
                            <p className={style.desc}>
                                Keep everything in the same place—even if your
                                team isn’t.
                            </p>
                        </div>
                        <form>
                            <input
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setEmail(e.target.value)
                                }
                                className={style.input_email}
                                placeholder="Email"
                            />
                            <button
                                onClick={handleSwitchPage}
                                className={style.form_btn}
                            >
                                Sign up- it's free!
                            </button>
                        </form>
                    </div>

                    <div className={style.container_img}>
                        <img
                            src="https://images.ctfassets.net/rz1oowkt5gyp/75rDABL8fyMtNLlUAtBxrg/c5e145977a86c41c47e17c69410c64f7/TrelloUICollage_4x.png?w=2280&fm=webp"
                            alt="photo"
                            className={style.img}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
})

export default HomePage
