import { Link } from 'react-router-dom'
import style from './NavBar.module.scss'
const NavBar = () => {
    return (
        <nav>
            <ul className={style.container}>
                <li className={style.item}>
                    <Link className={style.link} to="features">
                        Features
                    </Link>
                </li>
                <li className={style.item}>
                    <Link className={style.link} to="solutions">
                        Solutions
                    </Link>
                </li>

                <li className={style.item}>
                    <Link className={style.link} to="plans">
                        Plans
                    </Link>
                </li>

                <li className={style.item}>
                    <Link className={style.link} to="pricing">
                        Pricing
                    </Link>
                </li>

                <li className={style.item}>
                    <Link className={style.link} to="resource">
                        Resource
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar
