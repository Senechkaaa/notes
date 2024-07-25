import notesLogo from '../../../public/notes.svg'
import style from './Header.module.scss'
import NavBar from '../NavBar/NavBar.tsx'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className={style.wrapper}>
            <header className={style.header}>
                <div className={style.container}>
                    <img
                        src={notesLogo}
                        alt="notesLogo"
                        className={style.logo}
                    />
                    <NavBar />
                </div>
                <div className={style.container_btn}>
                    <Link
                        to="login"
                        className={`${style.login_link} ${style.btn}`}
                    >
                        Log in
                    </Link>

                    <Link
                        to="registration"
                        className={`${style.register_link} ${style.btn}`}
                    >
                        Get notes for free
                    </Link>
                </div>
            </header>
        </div>
    )
}

export default Header
